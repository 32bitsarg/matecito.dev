/**
 * api.service.ts
 * Capa de servicios — reemplaza pocketbase.service.ts
 *
 * Cada función mapea directamente a un endpoint de la nueva API.
 * Importar solo lo que se necesite en cada componente.
 */

import api, { setToken, setStoredUser, clearToken } from '@/lib/api'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface PlatformUser {
  id: string
  name: string
  username: string
  email: string
  avatar_seed: string
  avatar_url: string | null
  created_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  role: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  subdomain?: string | null
  url?: string | null
  schema_name: string
  workspace_id: string
  created_at: string
}

export interface ApiKey {
  id: string
  key: string
  type: 'anon' | 'service'
  created_at: string
}

export interface Collection {
  name: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const AuthService = {

  async login(email: string, password: string): Promise<PlatformUser> {
    const data = await api.public.post('/api/v1/platform/auth/login', { email, password })
    // El backend retorna access_token + refresh_token
    setToken(data.access_token ?? data.token)
    if (data.refresh_token) localStorage.setItem('matecito_refresh_token', data.refresh_token)
    setStoredUser(data.user)
    return data.user
  },

  async register(payload: {
    username: string
    name: string
    email: string
    password: string
    avatarSeed?: string
  }): Promise<{ user: PlatformUser; workspace: Workspace }> {
    const data = await api.public.post('/api/v1/platform/auth/register', payload)
    setToken(data.access_token ?? data.token)
    if (data.refresh_token) localStorage.setItem('matecito_refresh_token', data.refresh_token)
    setStoredUser(data.user)
    return { user: data.user, workspace: data.workspace }
  },

  async me(): Promise<{
    user: PlatformUser
    workspaces: Workspace[]
    projects: Project[]
  }> {
    const data = await api.get('/api/v1/platform/me')
    setStoredUser(data.user)
    return data
  },

  async updateProfile(payload: { name?: string; username?: string; avatarSeed?: string }): Promise<PlatformUser> {
    const data = await api.patch('/api/v1/platform/me', payload)
    setStoredUser(data.user ?? data)
    return data.user ?? data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/platform/auth/logout')
    } catch (err) {
      console.warn('Backend logout failed', err)
    } finally {
      clearToken()
      window.location.href = '/login'
    }
  },
}

// ─── Workspaces ───────────────────────────────────────────────────────────────

export const WorkspaceService = {

  async list(): Promise<Workspace[]> {
    const data = await api.get('/api/v1/platform/list-w')
    return data.workspaces ?? data
  },

  // Devuelve workspace + role + members + projects
  async info(workspaceId: string) {
    return api.get(`/api/v1/platform/info-w/${workspaceId}`)
  },

  // ⚠️ El backend requiere tanto `name` como `slug`
  async create(name: string, slug: string): Promise<Workspace> {
    const data = await api.post('/api/v1/platform/create-w', { name, slug })
    return data.workspace ?? data
  },

  async rename(workspaceId: string, name: string): Promise<Workspace> {
    const data = await api.patch(`/api/v1/platform/rename-w/${workspaceId}`, { name })
    return data.workspace ?? data
  },

  async delete(workspaceId: string): Promise<void> {
    return api.delete(`/api/v1/platform/delete-w/${workspaceId}`)
  },
}

// ─── Members ──────────────────────────────────────────────────────────────────

export const MemberService = {

  async list(workspaceId: string) {
    return api.get(`/api/v1/platform/workspaces/${workspaceId}/members`)
  },

  // Acepta userId o email — si el email no existe crea un invite automáticamente
  async add(workspaceId: string, payload: { userId?: string; email?: string; role: string }) {
    return api.post(`/api/v1/platform/workspaces/${workspaceId}/members`, payload)
  },

  // Roles válidos: owner | admin | developer | viewer
  async update(workspaceId: string, userId: string, role: string) {
    return api.patch(`/api/v1/platform/workspaces/${workspaceId}/members/${userId}`, { role })
  },

  async remove(workspaceId: string, userId: string) {
    return api.delete(`/api/v1/platform/workspaces/${workspaceId}/members/${userId}`)
  },
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const ProjectService = {

  async list(workspaceId: string): Promise<Project[]> {
    const data = await api.get(`/api/v1/platform/list-p?workspaceId=${workspaceId}`)
    return data.projects ?? data
  },

  async info(projectId: string): Promise<{ project: Project; api_keys: { anon?: string; service?: string; list: ApiKey[] } }> {
    const data = await api.get(`/api/v1/platform/info-p/${projectId}`)

    const keys = data.api_keys ?? []

    return {
      project: data.project,
      api_keys: {
        list: keys,
        anon: keys.find((k: ApiKey) => k.type === 'anon')?.key,
        service: keys.find((k: ApiKey) => k.type === 'service')?.key,
      },
    }
  },

  // El backend genera el subdomain automáticamente a partir del nombre
  // La respuesta incluye { project: { ...url, subdomain }, api_keys: { anon, service } }
  async create(
    workspaceId: string,
    name: string
  ): Promise<{ project: Project; api_keys: { anon: string } }> {
    const data = await api.post('/api/v1/platform/create-p', { workspaceId, name })

    return {
      project: data.project,
      api_keys: {
        anon: data.api_keys.anon,
        // ❌ NO EXPONER service
      },
    }
  },

  async rename(projectId: string, name: string): Promise<Project> {
    const data = await api.patch(`/api/v1/platform/rename-p/${projectId}`, { name })
    return data.project ?? data
  },

  async delete(projectId: string): Promise<void> {
    return api.delete(`/api/v1/platform/delete-p/${projectId}`)
  },

  async regenerateKeys(projectId: string): Promise<{ anon_key: string; service_key: string }> {
    return api.post(`/api/v1/project/${projectId}/regenerate-key`)
  },
}

// ─── Collections ──────────────────────────────────────────────────────────────

export const CollectionService = {

  async list(projectId: string): Promise<Collection[]> {
    const data = await api.get(`/api/v1/project/${projectId}/collections`)
    return data.collections ?? data
  },

  async create(projectId: string, name: string): Promise<Collection> {
    const data = await api.post(`/api/v1/project/${projectId}/collections`, { collection: name })
    return data.collection ?? data
  },

  async rename(projectId: string, collectionName: string, newName: string) {
    return api.patch(`/api/v1/project/${projectId}/collections/${collectionName}`, { name: newName })
  },

  async delete(projectId: string, collectionName: string): Promise<void> {
    return api.delete(`/api/v1/project/${projectId}/collections/${collectionName}`)
  },
}

// ─── Records ──────────────────────────────────────────────────────────────────

export const RecordService = {

  // filter soporta formato "key:value" → data->>'key' = 'value'
  async list(projectId: string, collection?: string, filter?: string) {
    const params: Record<string, string> = {}
    if (collection) params.collection = collection
    if (filter) params.filter = filter
    const data = await api.get(`/api/v1/project/${projectId}/records`, params)
    return data.records ?? data
  },

  async get(projectId: string, recordId: string) {
    return api.get(`/api/v1/project/${projectId}/records/${recordId}`)
  },

  async create(projectId: string, collection: string, record: any) {
    return api.post(`/api/v1/project/${projectId}/records`, { collection, data: record })
  },

  async update(projectId: string, recordId: string, record: any) {
    return api.patch(`/api/v1/project/${projectId}/records/${recordId}`, { data: record })
  },

  async delete(projectId: string, recordId: string): Promise<void> {
    return api.delete(`/api/v1/project/${projectId}/records/${recordId}`)
  },
}

// ─── Auth Users (project admin) ───────────────────────────────────────────────

export const AuthUserService = {
  async list(projectId: string): Promise<{ users: any[]; total: number }> {
    return api.get(`/api/v1/project/${projectId}/auth/users`)
  },

  async delete(projectId: string, userId: string): Promise<void> {
    return api.delete(`/api/v1/project/${projectId}/auth/users/${userId}`)
  },
}

// ─── Invites ──────────────────────────────────────────────────────────────────

export const InviteService = {

  async list(workspaceId: string) {
    return api.get(`/api/v1/platform/workspaces/${workspaceId}/invites`)
  },

  async create(workspaceId: string, email: string, role: string) {
    return api.post(`/api/v1/platform/workspaces/${workspaceId}/invites`, { email, role })
  },

  async delete(workspaceId: string, email: string) {
    // Según la lista: DELETE /workspaces/:workspaceId/invites
    return api.delete(`/api/v1/platform/workspaces/${workspaceId}/invites`, { email })
  },

  async cancelByToken(token: string) {
    // Según la lista: DELETE /invites/:token
    return api.delete(`/api/v1/platform/invites/${token}`)
  },

  async getInfo(token: string) {
    // Según la lista: GET /invites/:token
    return api.get(`/api/v1/platform/invites/${token}`)
  },

  async check(token: string) {
    // Según la lista: HEAD /invites/:token
    return api.head(`/api/v1/platform/invites/${token}`)
  },

  async accept(token: string) {
    return api.post(`/api/v1/platform/invites/${token}/accept`)
  },
}

// ─── Health ───────────────────────────────────────────────────────────────────

export const HealthService = {
  async check() {
    return api.get('/health')
  },
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

export const NewsletterService = {
  async subscribe(email: string) {
    return api.post('/api/v1/platform/newsletter', { email })
  },
}