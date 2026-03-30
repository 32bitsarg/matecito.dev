'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'

import {
  AuthService,
  WorkspaceService,
  ProjectService,
  MemberService,
  InviteService,
  type PlatformUser,
  type Workspace,
  type Project,
} from '@/services/api.service'

import { getToken } from '@/lib/api'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface WorkspaceContextValue {
  user: PlatformUser | null
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  projects: Project[]
  loading: boolean
  isInitialized: boolean
  members: any[]
  invites: any[]
  error: string | null

  setCurrentWorkspace: (workspace: Workspace) => void
  refreshWorkspaces: () => Promise<void>
  refreshProjects: (workspaceId: string) => Promise<void>
  refreshMembers: (workspaceId: string) => Promise<void>
  refreshInvites: (workspaceId: string) => Promise<void>
  checkPermission: (requiredRole: 'owner' | 'admin' | 'developer' | 'viewer') => boolean
  logout: () => Promise<void>
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentWorkspaceRef = useRef<string | null>(null)

  const loading = !initialized

  // ── Reset seguro ────────────────────────────────────────────────────────────

  const resetState = useCallback(() => {
    setUser(null)
    setWorkspaces([])
    setCurrentWorkspace(null)
    setProjects([])
    setMembers([])
    setInvites([])
    setError(null)
  }, [])

  // ── Refresh Projects (race-safe) ────────────────────────────────────────────

  const refreshProjects = useCallback(async (workspaceId: string) => {
    currentWorkspaceRef.current = workspaceId

    try {
      const list = await ProjectService.list(workspaceId)

      if (currentWorkspaceRef.current === workspaceId) {
        setProjects(list)
      }
    } catch (err: any) {
      console.error('Error al cargar proyectos:', err.message)

      if (currentWorkspaceRef.current === workspaceId) {
        setProjects([])
      }
    }
  }, [])

  const refreshMembers = useCallback(async (workspaceId: string) => {
    try {
      const res = await MemberService.list(workspaceId)
      setMembers(res.members ?? res)
    } catch (err) {
      setMembers([])
    }
  }, [])

  const refreshInvites = useCallback(async (workspaceId: string) => {
    try {
      const res = await InviteService.list(workspaceId)
      setInvites(res.invites ?? res)
    } catch (err) {
      setInvites([])
    }
  }, [])

  // ── Refresh Workspaces ──────────────────────────────────────────────────────

  const refreshWorkspaces = useCallback(async () => {
    try {
      const list = await WorkspaceService.list()
      setWorkspaces(list)

      if (list.length === 0) {
        setCurrentWorkspace(null)
        setProjects([])
        setMembers([])
        setInvites([])
        return
      }

      const segments = window.location.pathname.split('/')
      const slugFromUrl = segments[1] === 'dashboard' ? segments[2] : null

      const workspaceBySlug = list.find(w => w.slug === slugFromUrl)
      const selected = workspaceBySlug || list[0]

      setCurrentWorkspace(selected)
      await Promise.all([
        refreshProjects(selected.id),
        refreshMembers(selected.id),
        refreshInvites(selected.id)
      ])

    } catch (err: any) {
      console.error('Error al cargar workspaces:', err.message)
      setError(err.message)
    }
  }, [refreshProjects, refreshMembers, refreshInvites])

  // ── Init ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true

    async function init() {
      setError(null)

      const token = getToken()
      if (!token) {
        if (mounted) setInitialized(true)
        return
      }

      try {
        const data = await AuthService.me()

        if (!mounted) return

        setUser(data.user)
        setWorkspaces(data.workspaces)

        if (data.workspaces.length > 0) {
          const segments = window.location.pathname.split('/')
          const slugFromUrl = segments[1] === 'dashboard' ? segments[2] : null

          const workspaceBySlug = data.workspaces.find(w => w.slug === slugFromUrl)
          const selected = workspaceBySlug || data.workspaces[0]

          setCurrentWorkspace(selected)

          const workspaceProjects = data.projects.filter(
            (p: Project) => p.workspace_id === selected.id
          )

          setProjects(workspaceProjects)
          refreshMembers(selected.id)
          refreshInvites(selected.id)
        }

      } catch (err: any) {
        console.error('Sesión inválida:', err.message)
        resetState()
      } finally {
        if (mounted) setInitialized(true)
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [resetState, refreshMembers, refreshInvites])

  // ── Logout global listener ──────────────────────────────────────────────────

  useEffect(() => {
    const handleLogout = () => {
      resetState()
    }

    window.addEventListener('auth:logout', handleLogout)

    return () => {
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [resetState])

  // ── Cambiar workspace ───────────────────────────────────────────────────────

  const handleSetCurrentWorkspace = useCallback((workspace: Workspace) => {
    setCurrentWorkspace(workspace)
    setProjects([])
    setMembers([])
    setInvites([])
    
    Promise.all([
      refreshProjects(workspace.id),
      refreshMembers(workspace.id),
      refreshInvites(workspace.id)
    ])
  }, [refreshProjects, refreshMembers, refreshInvites])

  // ── Permisos ────────────────────────────────────────────────────────────────

  const checkPermission = useCallback((requiredRole: 'owner' | 'admin' | 'developer' | 'viewer') => {
    if (!currentWorkspace) return false
    
    const roleWeight: Record<string, number> = {
      'owner': 4,
      'admin': 3,
      'developer': 2,
      'viewer': 1
    }
    
    const userRole = (currentWorkspace as any).role || 'viewer'
    return roleWeight[userRole] >= roleWeight[requiredRole]
  }, [currentWorkspace])

  // ── Logout manual ───────────────────────────────────────────────────────────

  const logout = useCallback(async () => {
    resetState()
    await AuthService.logout()
  }, [resetState])

  // ───────────────────────────────────────────────────────────────────────────

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        workspaces,
        currentWorkspace,
        projects,
        members,
        invites,
        loading,
        isInitialized: initialized,
        error,
        setCurrentWorkspace: handleSetCurrentWorkspace,
        refreshWorkspaces,
        refreshProjects,
        refreshMembers,
        refreshInvites,
        checkPermission,
        logout,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace debe usarse dentro de <WorkspaceProvider>')
  return ctx
}