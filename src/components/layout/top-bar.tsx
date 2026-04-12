'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ChevronDown, Plus, Command, Search, Sun, Moon } from 'lucide-react'

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentWorkspace, workspaces, projects } = useWorkspace()
  const { theme, toggleTheme } = useTheme()
  const [workspaceOpen, setWorkspaceOpen] = useState(false)

  // Build breadcrumbs
  const parts = pathname.split('/').filter(Boolean)
  const breadcrumbs = parts.map(p => {
    if (p === 'dashboard') return { label: 'Dashboard', href: '/dashboard' }
    if (p === 'profile') return { label: 'Perfil', href: '/dashboard/profile' }
    if (p === 'members') return { label: 'Equipo', href: '' }
    if (p === 'settings') return { label: 'Configuración', href: '' }
    const project = projects.find(pr => pr.subdomain === p)
    if (project) return { label: project.name, href: '' }
    if (workspaces.find(w => w.slug === p)) return { label: p, href: `/dashboard/${p}` }
    return { label: p.charAt(0).toUpperCase() + p.slice(1), href: '' }
  })

  return (
    <header className="h-11 flex items-center justify-between px-3 shrink-0 border-b"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-0.5">
        {breadcrumbs.map((crumb, i) => (
          <div key={i} className="flex items-center gap-0.5">
            {i > 0 && <span className="text-[var(--fg-tertiary)] text-xs">/</span>}
            {crumb.href ? (
              <button onClick={() => router.push(crumb.href)}
                className="text-xs px-1 py-0.5 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                style={{ color: 'var(--fg-secondary)' }}>
                {crumb.label}
              </button>
            ) : (
              <span className="text-xs font-medium" style={{ color: 'var(--fg-primary)' }}>{crumb.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Workspace switcher */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ color: 'var(--fg-secondary)' }}
          >
            <span className="truncate max-w-[100px]">{currentWorkspace?.name || 'Workspace'}</span>
            <ChevronDown className="w-3 h-3" style={{ color: 'var(--fg-tertiary)' }} />
          </button>

          {workspaceOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setWorkspaceOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-[var(--bg-primary)] border rounded-lg shadow-lg z-50 overflow-hidden animate-slide-up"
                style={{ borderColor: 'var(--border)' }}>
                <div className="p-1">
                  {workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => { router.push(`/dashboard/${ws.slug}`); setWorkspaceOpen(false) }}
                      className={cn(
                        "w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors",
                        ws.id === currentWorkspace?.id
                          ? "font-medium"
                          : "hover:bg-[var(--bg-secondary)]"
                      )}
                      style={ws.id === currentWorkspace?.id ? {
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent)',
                      } : { color: 'var(--fg-secondary)' }}
                    >
                      {ws.name}
                    </button>
                  ))}
                </div>
                <div className="border-t p-1" style={{ borderColor: 'var(--border)' }}>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-create-workspace-modal'))
                      setWorkspaceOpen(false)
                    }}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-colors hover:bg-[var(--bg-secondary)]"
                    style={{ color: 'var(--fg-secondary)' }}
                  >
                    <Plus className="w-3 h-3" />
                    Nuevo workspace
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* New project */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-3 h-3" />
          Proyecto
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ color: 'var(--fg-tertiary)', border: `1px solid var(--border)` }}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Command palette */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ color: 'var(--fg-tertiary)', border: `1px solid var(--border)` }}
        >
          <Search className="w-3 h-3" />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden sm:inline-flex items-center px-1 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-tertiary)]"
            style={{ color: 'var(--fg-tertiary)' }}>
            <Command className="w-2.5 h-2.5 mr-0.5" />K
          </kbd>
        </button>
      </div>
    </header>
  )
}
