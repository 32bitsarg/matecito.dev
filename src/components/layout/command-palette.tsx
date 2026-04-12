'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { Search, Database, Settings, Users, HardDrive, Globe, Terminal, Shield, Webhook, Key, Bell, Sparkles, BarChart3, Workflow, FileText, X, Command, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  section?: string
}

export function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const { currentWorkspace, projects, user } = useWorkspace()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    const handleOpen = () => setIsOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette' as any, handleOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette' as any, handleOpen)
    }
  }, [])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      filteredCommands[selectedIndex].action()
      setIsOpen(false)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // Build commands
  const workspaceSlug = currentWorkspace?.slug

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-projects', label: 'Ir a Proyectos', icon: <Database className="w-4 h-4" />, action: () => router.push('/dashboard'), section: 'Navegación' },
    { id: 'nav-profile', label: 'Mi Perfil', icon: <Users className="w-4 h-4" />, action: () => router.push('/dashboard/profile'), section: 'Navegación' },
    { id: 'nav-team', label: 'Equipo', icon: <Users className="w-4 h-4" />, action: () => workspaceSlug && router.push(`/dashboard/${workspaceSlug}/members`), section: 'Navegación' },
    { id: 'nav-settings', label: 'Configuración del Workspace', icon: <Settings className="w-4 h-4" />, action: () => workspaceSlug && router.push(`/dashboard/${workspaceSlug}/settings`), section: 'Navegación' },
  ]

  // Add projects
  projects.forEach(p => {
    commands.push({
      id: `proj-${p.id}`,
      label: p.name,
      icon: <Database className="w-4 h-4" />,
      action: () => workspaceSlug && router.push(`/dashboard/${workspaceSlug}/${p.subdomain}`),
      section: 'Proyectos',
    })
  })

  // Project-level commands (when in project context)
  const isProject = pathname.includes('/dashboard/') && pathname.split('/').length > 3
  if (isProject) {
    const projectCommands = [
      { id: 'records', label: 'Registros', icon: <Database className="w-4 h-4" />, href: '' },
      { id: 'tables', label: 'Tablas / Schema', icon: <HardDrive className="w-4 h-4" />, href: '/schema' },
      { id: 'api', label: 'API Explorer', icon: <Globe className="w-4 h-4" />, href: '/api' },
      { id: 'sql', label: 'SQL Editor', icon: <Terminal className="w-4 h-4" />, href: '/sql' },
      { id: 'users', label: 'Usuarios', icon: <Users className="w-4 h-4" />, href: '/auth' },
      { id: 'storage', label: 'Storage', icon: <HardDrive className="w-4 h-4" />, href: '/storage' },
      { id: 'webhooks', label: 'Webhooks', icon: <Webhook className="w-4 h-4" />, href: '/webhooks' },
      { id: 'permissions', label: 'Permisos', icon: <Shield className="w-4 h-4" />, href: '/security' },
      { id: 'apikeys', label: 'API Keys', icon: <Key className="w-4 h-4" />, href: '/connect' },
      { id: 'settings', label: 'Configuración', icon: <Settings className="w-4 h-4" />, href: '/settings' },
    ]

    projectCommands.forEach(pc => {
      commands.push({
        id: `pcmd-${pc.id}`,
        label: pc.label,
        icon: pc.icon,
        action: () => {
          const parts = pathname.split('/')
          const base = parts.slice(0, 4).join('/')
          router.push(`${base}${pc.href}`)
        },
        section: 'Proyecto',
      })
    })

    // V2 commands
    const pp = pathname.split('/').filter(Boolean)
    const ws = pp.length >= 2 ? pp[1] : ''
    const proj = pp.length >= 3 ? pp[2] : ''
    const v2base = ws && proj ? `/dashboard/${ws}/${proj}` : ''
    commands.push(
      { id: 'v2-fn', label: 'Functions', icon: <Workflow className="w-4 h-4" />, action: () => v2base && router.push(`${v2base}/functions`), section: 'Fase 2' },
      { id: 'v2-analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" />, action: () => v2base && router.push(`${v2base}/analytics`), section: 'Fase 2' },
      { id: 'v2-ai', label: 'AI Gateway', icon: <Sparkles className="w-4 h-4" />, action: () => v2base && router.push(`${v2base}/ai`), section: 'Fase 2' },
      { id: 'v2-config', label: 'Remote Config', icon: <Settings className="w-4 h-4" />, action: () => v2base && router.push(`${v2base}/config`), section: 'Fase 2' },
      { id: 'v2-forms', label: 'Forms', icon: <FileText className="w-4 h-4" />, action: () => v2base && router.push(`${v2base}/forms`), section: 'Fase 2' },
    )
  }

  const filteredCommands = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="fixed inset-0" style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }} onClick={() => setIsOpen(false)} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-[var(--bg-primary)] rounded-xl shadow-[var(--shadow-modal)] border overflow-hidden animate-slide-up"
        style={{ borderColor: 'var(--border)' }}>
        {/* Search input */}
        <div className="flex items-center gap-2 px-4 h-12 border-b" style={{ borderColor: 'var(--border)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--fg-tertiary)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar comandos, proyectos, tablas..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--fg-tertiary)]"
            style={{ color: 'var(--fg-primary)' }}
          />
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-tertiary)]"
            style={{ color: 'var(--fg-tertiary)' }}>
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-1.5">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>No se encontraron resultados para "{query}"</p>
            </div>
          ) : (
            <>
              {filteredCommands.map((cmd, i) => {
                const showSection = i === 0 || filteredCommands[i - 1].section !== cmd.section
                return (
                  <div key={cmd.id}>
                    {showSection && cmd.section && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider px-2 pt-2 pb-1" style={{ color: 'var(--fg-tertiary)' }}>{cmd.section}</p>
                    )}
                    <button
                      onClick={() => { cmd.action(); setIsOpen(false) }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors",
                        i === selectedIndex
                          ? "font-medium"
                          : "hover:bg-[var(--bg-secondary)]"
                      )}
                      style={i === selectedIndex ? {
                        backgroundColor: 'var(--accent-soft)',
                        color: 'var(--accent)',
                      } : { color: 'var(--fg-secondary)' }}
                    >
                      <span className="shrink-0" style={{ color: i === selectedIndex ? 'var(--accent)' : 'var(--fg-tertiary)' }}>
                        {cmd.icon}
                      </span>
                      <span className="truncate">{cmd.label}</span>
                      {i === selectedIndex && (
                        <kbd className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-tertiary)] shrink-0"
                          style={{ color: 'var(--fg-tertiary)' }}>
                          ↵
                        </kbd>
                      )}
                    </button>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2 flex items-center justify-between text-[10px]"
          style={{ borderColor: 'var(--border)', color: 'var(--fg-tertiary)' }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-tertiary)]">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-tertiary)]">↵</kbd>
              ejecutar
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />K para cerrar
          </span>
        </div>
      </div>
    </div>
  )
}
