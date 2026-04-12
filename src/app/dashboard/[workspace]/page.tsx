'use client'

import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import { ProjectService } from '@/services/api.service'
import {
  Plus, Database, Search, ExternalLink, Copy, Clock, Users, Settings, Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/ui-kit'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'justo ahora'
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`
  return `hace ${Math.floor(seconds / 86400)}d`
}

export default function WorkspacePage() {
  const router = useRouter()
  const params = useParams()
  const wsSlug = params?.workspace as string
  const { currentWorkspace, projects, checkPermission, refreshProjects } = useWorkspace()
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentWorkspace?.id) {
      refreshProjects(currentWorkspace.id).finally(() => setLoading(false))
    }
  }, [currentWorkspace?.id])

  const filtered = useMemo(() => {
    if (!search.trim()) return projects
    const q = search.toLowerCase()
    return projects.filter(p => p.name.toLowerCase().includes(q) || p.subdomain?.toLowerCase().includes(q))
  }, [projects, search])

  const copyUrl = (subdomain: string) => {
    navigator.clipboard.writeText(`${subdomain}.matecito.dev`)
    toast.success('URL copiada')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fg-primary)' }} /></div>

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--fg-primary)' }}>{currentWorkspace?.name}</h1>
          <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} · {checkPermission('admin') ? 'Admin' : 'Viewer'}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button onClick={() => router.push(`/dashboard/${wsSlug}/members`)}
          className="flex items-center gap-3 p-4 rounded-xl border hover:border-[var(--border-hover)] transition-colors text-left"
          style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <Users className="w-4 h-4" style={{ color: 'var(--fg-primary)' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--fg-primary)' }}>Equipo</p>
            <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>Gestionar miembros</p>
          </div>
        </button>
        <button onClick={() => router.push(`/dashboard/${wsSlug}/settings`)}
          className="flex items-center gap-3 p-4 rounded-xl border hover:border-[var(--border-hover)] transition-colors text-left"
          style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <Settings className="w-4 h-4" style={{ color: 'var(--fg-primary)' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--fg-primary)' }}>Configuración</p>
            <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>Ajustes del workspace</p>
          </div>
        </button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
          className="flex items-center gap-3 p-4 rounded-xl border hover:border-[var(--border-hover)] transition-colors text-left"
          style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <Plus className="w-4 h-4" style={{ color: 'var(--fg-primary)' }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--fg-primary)' }}>Nuevo proyecto</p>
            <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>Crear proyecto</p>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--fg-tertiary)' }} />
        <input
          type="text" placeholder="Buscar proyectos..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors focus:border-[var(--accent)]"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
        />
      </div>

      {/* Projects list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Database className="w-7 h-7" style={{ color: 'var(--fg-tertiary)' }} />
          </div>
          <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--fg-secondary)' }}>
            {search ? 'Sin resultados' : 'Sin proyectos aún'}
          </h3>
          <p className="text-xs mb-4 max-w-xs" style={{ color: 'var(--fg-tertiary)' }}>
            {search ? `No hay proyectos que coincidan con "${search}"` : 'Creá tu primer proyecto para empezar a trabajar'}
          </p>
          {!search && (
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: 'var(--accent)' }}>
              <Plus className="w-3.5 h-3.5" />
              Crear proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(project => (
            <div
              key={project.id}
              className="group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors hover:border-[var(--border-hover)]"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}
              onClick={() => router.push(`/dashboard/${wsSlug}/${project.subdomain}`)}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white select-none"
                style={{ backgroundColor: 'var(--accent)', boxShadow: 'var(--shadow-glow)' }}>
                {project.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--fg-primary)' }}>{project.name}</p>
                  <StatusBadge status={project.api_version === 'v2' ? 'info' : 'neutral'} label={project.api_version === 'v2' ? 'v2' : 'v1'} />
                </div>
                <p className="text-xs font-mono truncate" style={{ color: 'var(--fg-tertiary)' }}>{project.subdomain}.matecito.dev</p>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--fg-tertiary)' }}>
                <Clock className="w-3 h-3" />
                {timeAgo(project.created_at)}
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
                <button onClick={() => copyUrl(project.subdomain!)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--fg-tertiary)' }} title="Copiar URL">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => router.push(`/dashboard/${wsSlug}/${project.subdomain}`)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--fg-tertiary)' }} title="Abrir">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
