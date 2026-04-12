'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { ProjectService } from '@/services/api.service'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Plus, Search, ExternalLink, Trash2, Copy,
  Loader2, Clock, Database,
} from 'lucide-react'

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'justo ahora'
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`
  return `hace ${Math.floor(seconds / 86400)}d`
}

export default function DashboardPage() {
  const router = useRouter()
  const { currentWorkspace, projects, checkPermission, refreshProjects } = useWorkspace()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'v1' | 'v2'>('all')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    let list = projects
    if (filter === 'v1') list = list.filter(p => !p.api_version || p.api_version === 'v1')
    if (filter === 'v2') list = list.filter(p => p.api_version === 'v2')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.subdomain?.toLowerCase().includes(q))
    }
    return list
  }, [projects, filter, search])

  const handleDelete = async (id: string, name: string) => {
    if (deleting !== id) { setDeleting(id); setTimeout(() => setDeleting(null), 3000); return }
    try {
      await ProjectService.delete(id)
      toast.success(`"${name}" eliminado`)
      refreshProjects(currentWorkspace?.id || '')
    } catch (err: any) {
      toast.error(err.message || 'Error')
    } finally {
      setDeleting(null)
    }
  }

  const copyUrl = (subdomain: string) => {
    navigator.clipboard.writeText(`${subdomain}.matecito.dev`)
    toast.success('URL copiada')
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--fg-primary)' }}>Proyectos</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--fg-tertiary)' }}>
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} en {currentWorkspace?.name}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--fg-tertiary)' }} />
          <input
            type="text" placeholder="Buscar proyectos..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors focus:border-[var(--accent)]"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--fg-primary)',
            }}
          />
        </div>
        <div className="flex items-center gap-0.5 ml-auto">
          {(['all', 'v2', 'v1'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                filter === f
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "hover:bg-[var(--bg-secondary)]"
              )}
              style={filter !== f ? { color: 'var(--fg-tertiary)' } : {}}
            >
              {f === 'all' ? 'Todos' : f === 'v2' ? 'v2' : 'v1'}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 rounded-xl border animate-pulse" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg animate-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                <div className="flex-1">
                  <div className="h-4 w-24 rounded animate-pulse mb-1.5" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                  <div className="h-3 w-16 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-tertiary)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Database className="w-7 h-7" style={{ color: 'var(--fg-tertiary)' }} />
          </div>
          <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--fg-secondary)' }}>
            {search ? 'Sin resultados' : 'Sin proyectos aún'}
          </h3>
          <p className="text-xs mb-4 max-w-xs" style={{ color: 'var(--fg-tertiary)' }}>
            {search
              ? `No hay proyectos que coincidan con "${search}"`
              : 'Creá tu primer proyecto para empezar a trabajar'
            }
          </p>
          {!search && (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              Crear proyecto
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(project => (
            <div
              key={project.id}
              className="group p-4 rounded-xl border cursor-pointer transition-all hover:translate-y-[1px]"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border)',
              }}
              onClick={() => router.push(`/dashboard/${currentWorkspace?.slug}/${project.subdomain}`)}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold text-white select-none"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: 'var(--shadow-glow)' }}>
                  {project.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--fg-primary)' }}>{project.name}</h3>
                  </div>
                  <p className="text-[11px] font-mono truncate" style={{ color: 'var(--fg-tertiary)' }}>
                    {project.subdomain}.matecito.dev
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 mb-3">
                <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
                  project.api_version === 'v2'
                    ? "bg-violet-900/20 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400"
                    : "bg-slate-800/40 text-slate-300 dark:bg-slate-800/50 dark:text-slate-400"
                )}>
                  {project.api_version === 'v2' ? 'v2' : 'v1'}
                  {project.api_version === 'v2' && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--fg-tertiary)' }}>
                <Clock className="w-3 h-3" />
                {timeAgo(project.created_at)}
              </div>

              {/* Actions (hover) */}
              <div className="flex items-center gap-1 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderColor: 'var(--border)' }}
                onClick={e => e.stopPropagation()}>
                <button onClick={() => copyUrl(project.subdomain!)}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] transition-colors"
                  style={{ color: 'var(--fg-tertiary)' }} title="Copiar URL">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => router.push(`/dashboard/${currentWorkspace?.slug}/${project.subdomain}`)}
                  className="p-1.5 rounded-md hover:bg-[var(--bg-secondary)] transition-colors"
                  style={{ color: 'var(--fg-tertiary)' }} title="Abrir">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1" />
                {checkPermission('admin') && (
                  <button onClick={() => handleDelete(project.id, project.name)}
                    className={cn("p-1.5 rounded-md transition-colors",
                      deleting === project.id
                        ? "bg-red-950/20 text-red-400 dark:bg-red-950/20"
                        : "hover:bg-red-950/20 text-[var(--fg-tertiary)] hover:text-red-500"
                    )}
                    title={deleting === project.id ? 'Click para confirmar' : 'Eliminar'}>
                    {deleting === project.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
