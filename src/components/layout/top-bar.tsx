'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { ChevronDown, Plus, Command, Search, Sun, Moon, ChevronRight } from 'lucide-react'

export function TopBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentWorkspace, workspaces, projects } = useWorkspace()
  const { theme, toggleTheme } = useTheme()
  const [workspaceOpen, setWorkspaceOpen] = useState(false)

  // Build breadcrumbs
  const parts = pathname.split('/').filter(Boolean)
  // parts[0]=dashboard, parts[1]=workspace, parts[2]=project, parts[3+]=subpage
  const workspaceSlug = parts[1]
  const projectSlug   = parts[2]
  const inProject     = parts[0] === 'dashboard' && parts.length >= 3 &&
                        !['settings', 'members'].includes(parts[2])
  const currentProject = inProject ? projects.find(pr => pr.subdomain === projectSlug) : null

  return (
    <header className="h-11 flex items-center justify-between px-4 shrink-0 border-b"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      {/* Left: Logo + breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity shrink-0"
        >
          <img src="/logos/matecitologo.png" alt="Matecito" className="w-5 h-5 object-contain" />
          <span className="text-sm font-semibold hidden sm:inline" style={{ color: 'var(--fg-primary)' }}>matecitodb</span>
        </button>

        {currentWorkspace && (
          <>
            <ChevronRight className="w-3 h-3 shrink-0 opacity-30" />
            <button
              onClick={() => router.push(`/dashboard/${workspaceSlug}`)}
              className="text-xs transition-colors shrink-0 hidden sm:inline opacity-60 hover:opacity-100"
              style={{ color: 'var(--fg-primary)' }}
            >
              {currentWorkspace.name}
            </button>
          </>
        )}

        {currentProject && (
          <>
            <ChevronRight className="w-3 h-3 shrink-0 opacity-30" />
            <button
              onClick={() => router.push(`/dashboard/${workspaceSlug}/${projectSlug}`)}
              className="text-xs font-semibold truncate max-w-[140px] transition-colors hover:opacity-80"
              style={{ color: 'var(--fg-primary)' }}
            >
              {currentProject.name}
            </button>
          </>
        )}
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
