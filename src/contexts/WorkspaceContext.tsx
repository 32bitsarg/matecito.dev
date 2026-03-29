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
  error: string | null

  setCurrentWorkspace: (workspace: Workspace) => void
  refreshWorkspaces: () => Promise<void>
  refreshProjects: (workspaceId: string) => Promise<void>
  logout: () => void
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PlatformUser | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
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

  // ── Refresh Workspaces ──────────────────────────────────────────────────────

  const refreshWorkspaces = useCallback(async () => {
    try {
      const list = await WorkspaceService.list()
      setWorkspaces(list)

      if (list.length === 0) {
        setCurrentWorkspace(null)
        setProjects([])
        return
      }

      const segments = window.location.pathname.split('/')
      const slugFromUrl = segments[1] === 'dashboard' ? segments[2] : null

      const workspaceBySlug = list.find(w => w.slug === slugFromUrl)
      const selected = workspaceBySlug || list[0]

      setCurrentWorkspace(selected)
      await refreshProjects(selected.id)

    } catch (err: any) {
      console.error('Error al cargar workspaces:', err.message)
      setError(err.message)
    }
  }, [refreshProjects])

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
  }, [resetState])

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
    refreshProjects(workspace.id)
  }, [refreshProjects])

  // ── Logout manual ───────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    resetState()
    AuthService.logout()
  }, [resetState])

  // ───────────────────────────────────────────────────────────────────────────

  return (
    <WorkspaceContext.Provider
      value={{
        user,
        workspaces,
        currentWorkspace,
        projects,
        loading,
        isInitialized: initialized, // ✅ FIX CLAVE
        error,
        setCurrentWorkspace: handleSetCurrentWorkspace,
        refreshWorkspaces,
        refreshProjects,
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