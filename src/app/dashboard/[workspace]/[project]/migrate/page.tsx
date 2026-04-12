'use client'

import { useState } from 'react'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import {
  Sparkles, ShieldCheck, AlertTriangle, ArrowRight, Check, Loader2,
  Workflow, BarChart3, Settings, FileText, Zap, Database, X, ChevronDown,
  Bot, MapPin, RefreshCw, Lock, Unlock
} from 'lucide-react'

const V2_FEATURES = [
  { icon: <Workflow className="w-5 h-5" />, title: 'Functions', desc: 'Código JS serverless con sandbox, crons y triggers' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Analytics', desc: 'Tracking de eventos, funnels de conversión' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'AI Gateway', desc: 'Proxy a OpenAI, Anthropic, Groq con tracking' },
  { icon: <Settings className="w-5 h-5" />, title: 'Remote Config', desc: 'Feature flags y configuración dinámica' },
  { icon: <FileText className="w-5 h-5" />, title: 'Forms', desc: 'Formularios públicos sin autenticación' },
  { icon: <Zap className="w-5 h-5" />, title: 'Filtros avanzados', desc: 'between, isNull, has, OR, full-text search' },
  { icon: <Workflow className="w-5 h-5" />, title: 'Workflows', desc: 'State machines y automatizaciones event-driven' },
  { icon: <Bot className="w-5 h-5" />, title: 'MCP (AI Agents)', desc: 'Conectá Claude Code y Cursor a tus datos en vivo' },
]

const COMPARISON = [
  { feature: 'Collections & Records',        v1: true,  v2: true },
  { feature: 'Auth (email/OAuth/Magic Link)', v1: true,  v2: true },
  { feature: 'Storage de archivos',           v1: true,  v2: true },
  { feature: 'Realtime (WebSocket)',          v1: true,  v2: true },
  { feature: 'Webhooks',                      v1: true,  v2: true },
  { feature: 'Functions (JS serverless)',     v1: false, v2: true },
  { feature: 'Analytics & Funnels',          v1: false, v2: true },
  { feature: 'AI Gateway',                   v1: false, v2: true },
  { feature: 'Remote Config / Feature Flags',v1: false, v2: true },
  { feature: 'Forms (públicos, sin auth)',    v1: false, v2: true },
  { feature: 'Filtros avanzados',            v1: false, v2: true },
  { feature: 'Workflows / State Machines',   v1: false, v2: true },
  { feature: 'Geo (nearby, bounds)',         v1: false, v2: true },
  { feature: 'Sync (offline-first)',         v1: false, v2: true },
  { feature: 'MCP (AI agent integration)',   v1: false, v2: true },
  { feature: 'Batch atómico multi-op',       v1: false, v2: true },
]

const PATH_CHANGES = [
  { old: '/api/v1/PROJECT_ID/records',      new: '/api/v2/project/SUBDOMAIN/data' },
  { old: '/api/v1/PROJECT_ID/auth/login',   new: '/api/v2/project/SUBDOMAIN/auth/login' },
  { old: '/api/v1/PROJECT_ID/storage',      new: '/api/v2/project/SUBDOMAIN/storage' },
  { old: "db.collection('x').find()",       new: "db.from('x').get()" },
  { old: "import from 'matecito'",          new: "import { createClient } from 'matecitodb'" },
]

export default function MigratePage() {
  const { currentWorkspace, projects } = useWorkspace()
  const [migrating, setMigrating] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [showPaths, setShowPaths] = useState(false)

  const v1Projects = projects.filter(p => !p.api_version || p.api_version === 'v1')

  const handleMigrate = async (projectId: string, projectName: string) => {
    if (!confirmed) return
    setMigrating(projectId)

    try {
      await api.post(`/api/v1/platform/migrate-v2/${projectId}`, {})
      toast.success(`${projectName} migrado a API v2 🎉`)
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message || 'Error al migrar')
    } finally {
      setMigrating(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--fg-primary)' }}>Migrar a API v2</h1>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>Habilita funciones avanzadas para tus proyectos</p>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="flex gap-3 p-4 rounded-xl border" style={{ backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning)' }}>
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--warning)' }}>Acción irreversible</p>
          <p className="text-xs mt-1" style={{ color: 'var(--warning)' }}>
            Una vez migrado a v2, no es posible volver a v1.
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--warning)' }}>
            Tus datos están seguros — records, usuarios, archivos y credenciales se preservan. Solo cambian la versión de API y los paths.
          </p>
        </div>
      </div>

      {/* v1 vs v2 comparison table */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--fg-secondary)' }}>Comparativa v1 vs v2</h2>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: 'var(--fg-secondary)' }}>Funcionalidad</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold w-20" style={{ color: 'var(--fg-secondary)' }}>v1</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold w-20" style={{ color: 'var(--fg-secondary)' }}>v2</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {COMPARISON.map(row => (
                <tr key={row.feature} className="transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ backgroundColor: 'var(--bg-primary)' }}>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--fg-secondary)' }}>{row.feature}</td>
                  <td className="px-4 py-2.5 text-center">
                    {row.v1
                      ? <Check className="w-4 h-4 mx-auto text-emerald-500" />
                      : <X className="w-4 h-4 mx-auto" style={{ color: 'var(--fg-tertiary)' }} />}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    {row.v2
                      ? <Check className="w-4 h-4 mx-auto text-emerald-500" />
                      : <X className="w-4 h-4 mx-auto" style={{ color: 'var(--fg-tertiary)' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* v2 Features grid */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--fg-secondary)' }}>Qué incluye v2</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {V2_FEATURES.map(f => (
            <div key={f.title} className="flex gap-3 p-3 rounded-xl border"
              style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--fg-primary)' }}>{f.title}</p>
                <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API path changes collapsible */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setShowPaths(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)]"
          style={{ backgroundColor: 'var(--bg-primary)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--fg-secondary)' }}>
            ¿Qué cambia en v2? — Referencia de rutas y SDK
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showPaths ? 'rotate-180' : ''}`} style={{ color: 'var(--fg-tertiary)' }} />
        </button>
        {showPaths && (
          <div className="border-t px-4 py-4 space-y-2" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-tertiary)' }}>
            {PATH_CHANGES.map((p, i) => (
              <div key={i} className="flex items-center gap-3 font-mono text-xs">
                <span className="text-red-400 line-through opacity-75 min-w-0 truncate flex-1">{p.old}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--fg-tertiary)' }} />
                <span className="text-emerald-400 min-w-0 truncate flex-1">{p.new}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects list */}
      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--fg-secondary)' }}>Proyectos para migrar</h2>
        {v1Projects.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--success-soft)', borderColor: 'var(--success)' }}>
            <Check className="w-5 h-5 shrink-0" style={{ color: 'var(--success)' }} />
            <p className="text-sm" style={{ color: 'var(--success)' }}>Todos tus proyectos ya usan API v2 🎉</p>
          </div>
        ) : (
          <div className="space-y-2">
            {v1Projects.map(project => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5" style={{ color: 'var(--fg-tertiary)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--fg-primary)' }}>{project.name}</p>
                    <p className="text-xs font-mono" style={{ color: 'var(--fg-tertiary)' }}>{project.subdomain}.matecito.dev</p>
                  </div>
                </div>

                {migrating === project.id ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Migrando...
                  </div>
                ) : (
                  <button
                    onClick={() => handleMigrate(project.id, project.name)}
                    disabled={!confirmed}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Migrar
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation checkbox */}
      {v1Projects.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <input
            type="checkbox"
            id="confirm-migrate"
            checked={confirmed}
            onChange={e => setConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <label htmlFor="confirm-migrate" className="text-sm cursor-pointer" style={{ color: 'var(--fg-secondary)' }}>
            Entiendo que esta acción es <strong>irreversible</strong>.
          </label>
        </div>
      )}
    </div>
  )
}
