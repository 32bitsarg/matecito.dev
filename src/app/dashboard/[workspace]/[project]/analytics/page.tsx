'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { api } from '@/lib/api'
import { BarChart3, TrendingUp, Users, MousePointerClick, Loader2, Calendar, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AnalyticsPage() {
  const { projectId } = useProject()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [funnel, setFunnel] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90
      const [eventsRes, funnelRes] = await Promise.all([
        api.get<any>(`/api/v2/project/${projectId}/analytics/events?group_by=event&days=${days}`),
        api.get<any>(`/api/v2/project/${projectId}/analytics/funnel?steps=page_view,item_added,checkout_started,purchase_completed`),
      ])
      setEvents(eventsRes.results || [])
      setFunnel(funnelRes.funnel || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} /></div>

  const totalEvents = events.reduce((sum: number, e: any) => sum + (e.count || 0), 0)
  const totalUnique = events.reduce((sum: number, e: any) => sum + (e.unique_users || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <BarChart3 className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--fg-primary)' }}>Analytics</h1>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>Tracking de eventos y funnels de conversión</p>
          </div>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {(['7d', '30d', '90d'] as const).map(range => (
            <button key={range} onClick={() => setDateRange(range)}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                dateRange === range
                  ? "bg-[var(--bg-primary)] shadow-sm text-[var(--fg-primary)]"
                  : "text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]"
              )}>
              {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <MousePointerClick className="w-4 h-4" style={{ color: 'var(--fg-tertiary)' }} />
            <p className="text-[11px] font-medium text-[var(--fg-tertiary)]">Eventos totales</p>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--fg-primary)' }}>{totalEvents.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" style={{ color: 'var(--fg-tertiary)' }} />
            <p className="text-[11px] font-medium text-[var(--fg-tertiary)]">Usuarios únicos</p>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--fg-primary)' }}>{totalUnique.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--fg-tertiary)' }} />
            <p className="text-[11px] font-medium text-[var(--fg-tertiary)]">Tipos de evento</p>
          </div>
          <p className="text-2xl font-bold font-mono" style={{ color: 'var(--fg-primary)' }}>{events.length}</p>
        </div>
      </div>

      {/* Events chart (simple bar chart) */}
      {events.length > 0 && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold mb-4" style={{ color: 'var(--fg-secondary)' }}>Eventos por tipo</p>
          <div className="space-y-3">
            {events.map((e: any, i: number) => {
              const maxCount = Math.max(...events.map((ev: any) => ev.count || 0))
              const pct = maxCount > 0 ? Math.round(((e.count || 0) / maxCount) * 100) : 0
              const colors = ['bg-violet-900/200', 'bg-blue-950/200', 'bg-emerald-950/200', 'bg-amber-950/200', 'bg-pink-500', 'bg-cyan-500']
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: 'var(--fg-primary)' }}>{e.event || e.group_key}</span>
                    <span style={{ color: 'var(--fg-tertiary)' }}>{e.count?.toLocaleString()} eventos · {e.unique_users?.toLocaleString()} users</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className={cn("h-full rounded-full transition-all duration-500", colors[i % colors.length])} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Funnel */}
      {funnel.length > 0 && (
        <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <p className="text-xs font-semibold mb-4" style={{ color: 'var(--fg-secondary)' }}>Funnel de conversión</p>
          <div className="space-y-3">
            {funnel.map((step: any, i: number) => {
              const pct = funnel[0]?.users ? Math.round((step.users / funnel[0].users) * 100) : 0
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium" style={{ color: 'var(--fg-primary)' }}>{step.step}</span>
                    <span style={{ color: 'var(--fg-tertiary)' }}>{step.users} usuarios ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="h-full rounded-full bg-blue-950/200 transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {events.length === 0 && funnel.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--fg-tertiary)' }} />
          <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>No hay datos aún</p>
          <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>Envía eventos con <code className="px-1 py-0.5 rounded text-[11px] font-mono" style={{ backgroundColor: 'var(--bg-secondary)' }}>POST /analytics/track</code></p>
        </div>
      )}
    </div>
  )
}
