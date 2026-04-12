'use client'

import { useEffect, useState, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { cn } from '@/lib/utils'
import {
  LayoutGrid, Users, Settings, ChevronDown, ChevronRight,
  LogOut, UserCircle, Database, Home,
  Workflow, BarChart3, Sparkles, FileText, Terminal, Globe,
  Shield, Webhook, Key, HardDrive, Table2, FolderOpen,
  ChevronRight as ChevronRightIcon, Lock
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  section: string
  requiresV2?: boolean
}

function buildNavItems(workspaceSlug: string | undefined, projectSlug: string | undefined): NavItem[] {
  const base = workspaceSlug && projectSlug ? `/dashboard/${workspaceSlug}/${projectSlug}` : ''
  return [
    { id: 'resumen', label: 'Resumen', icon: <Home className="w-[18px] h-[18px]" />, href: base || '/dashboard', section: 'main' },
    { id: 'data-tables', label: 'Tablas', icon: <Table2 className="w-[18px] h-[18px]" />, href: `${base}/tables`, section: 'data' },
    { id: 'data-api', label: 'API', icon: <Globe className="w-[18px] h-[18px]" />, href: `${base}/api`, section: 'data' },
    { id: 'data-sql', label: 'SQL', icon: <Terminal className="w-[18px] h-[18px]" />, href: `${base}/sql`, section: 'data' },
    { id: 'users', label: 'Usuarios', icon: <Users className="w-[18px] h-[18px]" />, href: `${base}/auth`, section: 'users' },
    { id: 'providers', label: 'OAuth', icon: <Shield className="w-[18px] h-[18px]" />, href: `${base}/auth/providers`, section: 'users' },
    { id: 'notifications', label: 'Notificaciones', icon: <UserCircle className="w-[18px] h-[18px]" />, href: `${base}/notifications`, section: 'users' },
    { id: 'storage', label: 'Storage', icon: <HardDrive className="w-[18px] h-[18px]" />, href: `${base}/storage`, section: 'project' },
    { id: 'emails', label: 'Emails', icon: <Database className="w-[18px] h-[18px]" />, href: `${base}/emails`, section: 'project' },
    { id: 'logs', label: 'Logs', icon: <FolderOpen className="w-[18px] h-[18px]" />, href: `${base}/logs`, section: 'project' },
    { id: 'webhooks', label: 'Webhooks', icon: <Webhook className="w-[18px] h-[18px]" />, href: `${base}/webhooks`, section: 'project' },
    { id: 'connect', label: 'Conexión', icon: <Key className="w-[18px] h-[18px]" />, href: `${base}/connect`, section: 'project' },
    { id: 'security', label: 'Permisos', icon: <Shield className="w-[18px] h-[18px]" />, href: `${base}/security`, section: 'project' },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-[18px] h-[18px]" />, href: `${base}/settings`, section: 'project' },
    // v2 features — siempre visibles
    { id: 'v2-functions', label: 'Functions', icon: <Workflow className="w-[18px] h-[18px]" />, href: `${base}/functions`, section: 'v2', requiresV2: true },
    { id: 'v2-analytics', label: 'Analytics', icon: <BarChart3 className="w-[18px] h-[18px]" />, href: `${base}/analytics`, section: 'v2', requiresV2: true },
    { id: 'v2-ai', label: 'AI', icon: <Sparkles className="w-[18px] h-[18px]" />, href: `${base}/ai`, section: 'v2', requiresV2: true },
    { id: 'v2-config', label: 'Remote Config', icon: <FileText className="w-[18px] h-[18px]" />, href: `${base}/config`, section: 'v2', requiresV2: true },
    { id: 'v2-forms', label: 'Forms', icon: <FolderOpen className="w-[18px] h-[18px]" />, href: `${base}/forms`, section: 'v2', requiresV2: true },
    { id: 'migrate', label: 'Migrar a v2', icon: <Sparkles className="w-[18px] h-[18px]" />, href: `${base}/migrate`, section: 'v2', requiresV2: false },
  ]
}

export function ActivityBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentWorkspace, projects, user, logout, checkPermission } = useWorkspace()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ main: true, data: true, users: true, v2: true, project: true })

  const parts = pathname.split('/').filter(Boolean)
  // parts: ['dashboard', 'workspace', 'project-slug'] = 3 → project view
  // parts: ['dashboard', 'workspace', 'settings'] = 3 → workspace view
  // parts: ['dashboard'] = 1 → workspace view
  const isProjectView = useMemo(() => {
    if (parts.length < 3 || parts[0] !== 'dashboard') return false
    // Known workspace-level routes (NOT project routes)
    const workspaceOnlyRoutes = new Set(['settings', 'members'])
    if (parts.length === 2) return false  // just /dashboard/[ws]
    if (parts.length === 3 && workspaceOnlyRoutes.has(parts[2])) return false  // /dashboard/[ws]/settings
    if (parts.length === 3) return true  // /dashboard/[ws]/[project]
    if (parts.length >= 3) return true  // /dashboard/[ws]/[project]/...
    return false
  }, [pathname])

  const workspaceSlug = isProjectView ? parts[1] : (parts.length >= 2 ? parts[1] : undefined)
  const projectSlug = isProjectView ? parts[2] : undefined
  const currentProject = isProjectView ? projects.find(p => p.subdomain === projectSlug) : null
  const isV2 = (currentProject as any)?.api_version === 'v2'

  const allItems = useMemo(() => buildNavItems(workspaceSlug, projectSlug), [workspaceSlug, projectSlug])

  // v2 section siempre visible
  const sections = useMemo(() => {
    if (!isProjectView) return []
    return ['main', 'data', 'users', 'project', 'v2']
  }, [isProjectView])

  const sectionLabels: Record<string, string> = {
    main: '', data: 'Datos', users: 'Usuarios', project: 'Proyecto', v2: 'Fase 2'
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }))
  }

  const isActive = (item: NavItem) => {
    if (item.id === 'resumen') return pathname === `/dashboard/${workspaceSlug}/${projectSlug}`
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  // In project view the ProjectNav handles navigation — hide sidebar
  if (isProjectView) return null

  return (
    <aside
      className={cn(
        "flex flex-col h-full shrink-0 border-r",
        "w-56",
        "bg-[var(--bg-primary)] border-[var(--border)]"
      )}
    >
      {/* Logo */}
      <div className="h-11 flex items-center px-3 border-b border-[var(--border)] shrink-0">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/logos/matecitologo.png" alt="Matecito" className="w-7 h-7 object-contain shrink-0" />
          <span className="font-semibold text-sm truncate" style={{ color: 'var(--fg-primary)' }}>matecitodb</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {isProjectView ? (
          sections.map(sectionId => {
            const items = allItems.filter(i => i.section === sectionId)
            const label = sectionLabels[sectionId]
            if (items.length === 0) return null

            return (
              <div key={sectionId} className="mb-1">
                {label && (
                  <button
                    onClick={() => toggleSection(sectionId)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                      "text-[var(--fg-secondary)]"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {label}
                      {sectionId === 'v2' && !isV2 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--fg-tertiary)',
                        }}>
                          v1
                        </span>
                      )}
                    </span>
                    {expandedSections[sectionId] ? <ChevronDown className="w-3 h-3" /> : <ChevronRightIcon className="w-3 h-3" />}
                  </button>
                )}
                {(expandedSections[sectionId] || sectionId === 'main') && (
                  <div className={label ? "px-1.5" : ""}>
                    {items.map(item => {
                      const isLocked = item.requiresV2 && !isV2
                      const migrateHref = `/dashboard/${workspaceSlug}/${projectSlug}/migrate`
                      const itemHref = isLocked ? migrateHref : item.href

                      return (
                        <button
                          key={item.id}
                          onClick={() => router.push(itemHref)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-all",
                            isActive(item) ? "font-medium" : isLocked ? "opacity-50" : "hover:bg-[var(--bg-secondary)]"
                          )}
                          style={isActive(item) ? {
                            backgroundColor: 'var(--accent-soft)',
                            color: 'var(--accent)',
                          } : {
                            color: isLocked ? 'var(--fg-tertiary)' : 'var(--fg-secondary)',
                          }}
                          title={isLocked ? 'Requiere migrar a v2' : item.label}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                          {isLocked && <Lock className="w-3 h-3 shrink-0 ml-auto" style={{ color: 'var(--fg-tertiary)' }} />}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          // Workspace view
          <>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors mx-1 rounded-md hover:bg-[var(--bg-secondary)]"
              style={{ color: 'var(--fg-secondary)' }}
            >
              <LayoutGrid className="w-[18px] h-[18px]" />
              <span>Proyectos</span>
            </button>
            <button
              onClick={() => currentWorkspace?.slug && router.push(`/dashboard/${currentWorkspace.slug}/members`)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors mx-1 rounded-md hover:bg-[var(--bg-secondary)]"
              style={{ color: 'var(--fg-secondary)' }}
            >
              <Users className="w-[18px] h-[18px]" />
              <span>Equipo</span>
            </button>
            <button
              onClick={() => currentWorkspace?.slug && router.push(`/dashboard/${currentWorkspace.slug}/settings`)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors mx-1 rounded-md hover:bg-[var(--bg-secondary)]"
              style={{ color: 'var(--fg-secondary)' }}
            >
              <Settings className="w-[18px] h-[18px]" />
              <span>Configuración</span>
            </button>

            {/* Projects list */}
            <div className="mt-3 border-t pt-2 mx-1" style={{ borderColor: 'var(--border)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: 'var(--fg-tertiary)' }}>Proyectos</p>
              {projects.length === 0 ? (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                    className="w-full text-left px-2 py-1.5 text-xs transition-colors"
                    style={{ color: 'var(--accent)' }}
                  >
                    + Crear proyecto
                  </button>
                ) : (
                  projects.slice(0, 8).map(p => (
                    <button
                      key={p.id}
                      onClick={() => router.push(`/dashboard/${currentWorkspace?.slug}/${p.subdomain}`)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors"
                      style={{ color: 'var(--fg-secondary)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </button>
                  ))
                )}
              </div>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="border-t p-2 flex items-center gap-2 border-[var(--border)] shrink-0">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'var(--accent-soft)' }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium truncate" style={{ color: 'var(--fg-primary)' }}>{user?.name || 'User'}</p>
          <p className="text-[10px] truncate" style={{ color: 'var(--fg-tertiary)' }}>{user?.email}</p>
        </div>
        <div className="flex gap-0.5 shrink-0">
          <button onClick={() => router.push('/dashboard/profile')}
            className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] transition-colors"
            style={{ color: 'var(--fg-tertiary)' }}
            title="Perfil">
            <UserCircle className="w-4 h-4" />
          </button>
          <button onClick={logout}
            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            style={{ color: 'var(--fg-tertiary)' }}
            title="Cerrar sesión">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
