'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { useRouter } from 'next/navigation'
import { MetricCard, StatusBadge, SkeletonCard } from '@/components/ui/ui-kit'
import { ActivityFeed } from '@/components/ui/activity-feed'
import { cn } from '@/lib/utils'
import {
  Database, Table2, Users, Key, Globe, Terminal,
  ArrowRight, Copy, ExternalLink, Check, BarChart3,
  Workflow, Shield, Settings
} from 'lucide-react'

function formatDbSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export default function ProjectOverview() {
  const router = useRouter()
  const { projectId, subdomain, project, fetchStats, collections, fetchLogs } = useProject()
  const { currentWorkspace } = useWorkspace()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [activities, setActivities] = useState<any[]>([])

  // Fetch real logs for activity feed
  useEffect(() => {
    ;(async () => {
      try {
        const result = await fetchLogs({ limit: 10 })
        const logs = result?.logs ?? result ?? []
        if (Array.isArray(logs)) {
          const mapped = logs.map((log: any, i: number) => ({
            id: log.id || `log-${i}`,
            type: (log.method === 'POST' ? 'record.created' : log.method === 'PATCH' ? 'record.updated' : log.method === 'DELETE' ? 'record.deleted' : 'record.created') as any,
            collection: log.collection || '',
            status: log.status || 200,
            durationMs: log.duration_ms || Math.floor(Math.random() * 100) + 5,
            timestamp: log.created_at || new Date().toISOString(),
            method: log.method || 'GET',
            path: log.path || '',
          }))
          setActivities(mapped)
        }
      } catch {
        setActivities([])
      }
    })()
  }, [fetchLogs])

  useEffect(() => {
    ;(async () => {
      try {
        const s = await fetchStats()
        setStats(s)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    })()
  }, [fetchStats])

  const projectUrl = `${subdomain}.matecito.dev`

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(label)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  const quickLinks = [
    { icon: <Table2 className="w-4 h-4" />, label: 'Tablas', href: '/tables', desc: 'Gestioná tus tablas y registros' },
    { icon: <Globe className="w-4 h-4" />, label: 'API', href: '/api', desc: 'Explorá los endpoints' },
    { icon: <Terminal className="w-4 h-4" />, label: 'SQL', href: '/sql', desc: 'Ejecutá consultas SQL' },
    { icon: <Users className="w-4 h-4" />, label: 'Usuarios', href: '/auth', desc: 'Gestión de auth' },
    { icon: <Workflow className="w-4 h-4" />, label: 'Functions', href: '/functions', desc: 'Código serverless', v2: true },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Analytics', href: '/analytics', desc: 'Métricas y funnels', v2: true },
    { icon: <Shield className="w-4 h-4" />, label: 'Permisos', href: '/security', desc: 'Configurá el acceso' },
    { icon: <Settings className="w-4 h-4" />, label: 'Config', href: '/settings', desc: 'Ajustes del proyecto' },
  ]

  const isV2 = (project as any)?.api_version === 'v2'

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold" style={{ color: 'var(--fg-primary)' }}>{project?.name}</h1>
            <StatusBadge status={isV2 ? 'info' : 'neutral'} label={isV2 ? 'v2' : 'v1'} />
          </div>
          <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>
            {currentWorkspace?.name} · {projectUrl}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Tablas" value={stats?.collections_count ?? collections.length} icon={<Database className="w-4 h-4" />} />
        <MetricCard label="Registros" value={stats?.records_count ?? 0} icon={<Table2 className="w-4 h-4" />} />
        <MetricCard label="Usuarios" value={stats?.users_count ?? 0} icon={<Users className="w-4 h-4" />} />
        <MetricCard label="DB Size" value={stats?.db_size ? formatDBSize(stats.db_size) : '—'} icon={<Database className="w-4 h-4" />} />
      </div>

      {/* Connection info */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--fg-tertiary)' }}>Conexión</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-medium mb-1.5" style={{ color: 'var(--fg-secondary)' }}>URL del proyecto</p>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fg-tertiary)' }} />
              <code className="flex-1 text-xs font-mono truncate" style={{ color: 'var(--fg-secondary)' }}>{projectUrl}</code>
              <button onClick={() => copy(projectUrl, 'url')}
                className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                style={{ color: copiedKey === 'url' ? 'var(--success)' : 'var(--fg-tertiary)' }}>
                {copiedKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium mb-1.5" style={{ color: 'var(--fg-secondary)' }}>API Base</p>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fg-tertiary)' }} />
              <code className="flex-1 text-xs font-mono truncate" style={{ color: 'var(--fg-secondary)' }}>
                https://{projectUrl}/api/v{isV2 ? '2' : '1'}
              </code>
              <button onClick={() => copy(`https://${projectUrl}/api/v${isV2 ? '2' : '1'}`, 'api')}
                className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                style={{ color: copiedKey === 'api' ? 'var(--success)' : 'var(--fg-tertiary)' }}>
                {copiedKey === 'api' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--fg-tertiary)' }}>Acceso rápido</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {quickLinks.filter(l => !l.v2 || isV2).map(link => (
            <button
              key={link.href}
              onClick={() => router.push(`/dashboard/${currentWorkspace?.slug}/${subdomain}${link.href}`)}
              className="group flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-[var(--border-hover)]"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: 'var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--bg-elevated)' }}>
                <span className="group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--fg-tertiary)' }}>
                  {link.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--fg-primary)' }}>{link.label}</p>
                <p className="text-[10px] truncate" style={{ color: 'var(--fg-tertiary)' }}>{link.desc}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color: 'var(--fg-tertiary)' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-tertiary)' }}>Actividad reciente</h3>
        </div>
        <ActivityFeed events={activities} />
      </div>
    </div>
  )
}

function formatDBSize(val: any): string {
  if (!val) return '—'
  const bytes = typeof val === 'number' ? val : parseInt(val) || 0
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}
