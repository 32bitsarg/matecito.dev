'use client'

import { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import {
  Home, Table2, Globe, Terminal, Users, Shield, Bell,
  HardDrive, Mail, FileText, Webhook, Key, Settings,
  Workflow, BarChart3, Sparkles, FolderOpen, Zap, Lock,
  Database,
} from 'lucide-react'

interface SubItem {
  id: string
  label: string
  icon: React.ElementType
  suffix: string
  requiresV2?: boolean
}

interface Section {
  id: string
  label: string
  icon: React.ElementType
  items: SubItem[]
  // if only one item, clicking goes there directly
}

const SECTIONS: Section[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    items: [
      { id: 'resumen', label: 'Overview', icon: Home, suffix: '' },
    ],
  },
  {
    id: 'database',
    label: 'Base de datos',
    icon: Database,
    items: [
      { id: 'tables', label: 'Tablas', icon: Table2, suffix: '/tables' },
      { id: 'api', label: 'API Explorer', icon: Globe, suffix: '/api' },
      { id: 'sql', label: 'SQL Editor', icon: Terminal, suffix: '/sql' },
    ],
  },
  {
    id: 'auth',
    label: 'Auth',
    icon: Users,
    items: [
      { id: 'users', label: 'Usuarios', icon: Users, suffix: '/auth' },
      { id: 'oauth', label: 'OAuth', icon: Shield, suffix: '/auth/providers' },
      { id: 'notifications', label: 'Notificaciones', icon: Bell, suffix: '/notifications' },
    ],
  },
  {
    id: 'build',
    label: 'Build',
    icon: Workflow,
    items: [
      { id: 'functions', label: 'Functions', icon: Workflow, suffix: '/functions', requiresV2: true },
      { id: 'forms', label: 'Forms', icon: FolderOpen, suffix: '/forms', requiresV2: true },
      { id: 'storage', label: 'Storage', icon: HardDrive, suffix: '/storage' },
      { id: 'emails', label: 'Emails', icon: Mail, suffix: '/emails' },
      { id: 'webhooks', label: 'Webhooks', icon: Webhook, suffix: '/webhooks' },
      { id: 'config', label: 'Remote Config', icon: FileText, suffix: '/config', requiresV2: true },
    ],
  },
  {
    id: 'observe',
    label: 'Observabilidad',
    icon: BarChart3,
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, suffix: '/analytics', requiresV2: true },
      { id: 'logs', label: 'Logs', icon: FileText, suffix: '/logs' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    icon: Sparkles,
    items: [
      { id: 'ai-gateway', label: 'AI Gateway', icon: Sparkles, suffix: '/ai', requiresV2: true },
    ],
  },
  {
    id: 'settings',
    label: 'Ajustes',
    icon: Settings,
    items: [
      { id: 'connect', label: 'Conexión SDK', icon: Key, suffix: '/connect' },
      { id: 'security', label: 'Permisos', icon: Shield, suffix: '/security' },
      { id: 'settings-page', label: 'Configuración', icon: Settings, suffix: '/settings' },
      { id: 'migrate', label: 'Migrar a v2', icon: Zap, suffix: '/migrate' },
    ],
  },
]

export function ProjectNav() {
  const pathname = usePathname()
  const router   = useRouter()
  const { projects } = useWorkspace()

  const parts        = pathname.split('/').filter(Boolean)
  const workspaceSlug = parts[1]
  const projectSlug   = parts[2]
  const base          = `/dashboard/${workspaceSlug}/${projectSlug}`

  const project = useMemo(
    () => projects.find(p => p.subdomain === projectSlug) ?? null,
    [projects, projectSlug]
  )
  const isV2 = (project as any)?.api_version === 'v2'

  // Determine active section + active sub-item
  const { activeSection, activeSubId } = useMemo(() => {
    for (const section of SECTIONS) {
      for (const item of section.items) {
        const href = base + item.suffix
        const isActive = item.id === 'resumen'
          ? pathname === base
          : pathname === href || pathname.startsWith(href + '/')
        if (isActive) return { activeSection: section.id, activeSubId: item.id }
      }
    }
    return { activeSection: 'overview', activeSubId: 'resumen' }
  }, [pathname, base])

  const currentSection = SECTIONS.find(s => s.id === activeSection)!

  const navigateTo = (item: SubItem) => {
    const locked = item.requiresV2 && !isV2
    router.push(locked ? `${base}/migrate` : base + item.suffix)
  }

  const navigateToSection = (section: Section) => {
    // Go to the first non-locked item in the section
    const first = section.items.find(i => !i.requiresV2 || isV2) ?? section.items[0]
    navigateTo(first)
  }

  if (!project) return null

  const showSubNav = currentSection.items.length > 1

  return (
    <div className="sticky top-0 z-20 shrink-0" style={{ backgroundColor: 'var(--bg-secondary)' }}>

      {/* Primary nav row */}
      <div className="flex items-center gap-0 px-5 h-12 border-b" style={{ borderColor: 'var(--border)' }}>

        {/* Project identity */}
        <div className="flex items-center gap-2.5 mr-5 shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
            style={{ backgroundColor: 'var(--accent)', color: '#fff', boxShadow: 'var(--shadow-glow)' }}
          >
            {project.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold leading-none" style={{ color: 'var(--fg-primary)' }}>
              {project.name}
            </span>
            <span className="text-[10px] font-mono leading-none mt-0.5" style={{ color: 'var(--fg-tertiary)' }}>
              {project.subdomain}
            </span>
          </div>
          {isV2 ? (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}>
              v2
            </span>
          ) : (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full tracking-wide"
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--fg-tertiary)', border: '1px solid var(--border)' }}>
              v1
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 shrink-0 mr-5" style={{ backgroundColor: 'var(--border)' }} />

        {/* Primary sections */}
        <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SECTIONS.map(section => {
            const isActive  = section.id === activeSection
            const Icon      = section.icon
            const allLocked = section.items.every(i => i.requiresV2 && !isV2)

            return (
              <button
                key={section.id}
                onClick={() => navigateToSection(section)}
                title={allLocked ? 'Requiere v2' : undefined}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#fff' : allLocked ? 'var(--fg-tertiary)' : 'var(--fg-secondary)',
                  opacity: allLocked ? 0.45 : 1,
                  border: '1px solid transparent',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                }}
              >
                <Icon className="w-[14px] h-[14px] shrink-0" />
                {section.label}
                {allLocked && <Lock className="w-[10px] h-[10px] shrink-0 ml-0.5 opacity-70" />}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Sub-nav row — only when current section has multiple items */}
      {showSubNav && (
        <div
          className="flex items-center gap-0 px-5 overflow-x-auto border-b"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border)',
            scrollbarWidth: 'none',
            height: '36px',
          }}
        >
          {currentSection.items.map(item => {
            const isActive = item.id === activeSubId
            const locked   = item.requiresV2 && !isV2
            const Icon     = item.icon

            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item)}
                className="relative flex items-center gap-1.5 px-3 h-full text-[12px] transition-all whitespace-nowrap"
                style={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--fg-primary)' : locked ? 'var(--fg-tertiary)' : 'var(--fg-secondary)',
                  opacity: locked ? 0.5 : 1,
                }}
              >
                <Icon className="w-3 h-3 shrink-0" />
                {item.label}
                {locked && <Lock className="w-2.5 h-2.5 shrink-0 opacity-70" />}

                {isActive && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
