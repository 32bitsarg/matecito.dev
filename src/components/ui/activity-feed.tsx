/**
 * ActivityFeed — Recent activity timeline
 */

import { Clock, Database, User, Trash2, Pencil, Key, Shield, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActivityEvent {
  id: string
  type: 'record.created' | 'record.updated' | 'record.deleted' | 'auth.signup' | 'schema.change' | 'key.generated'
  collection?: string
  recordId?: string
  userId?: string
  status: number
  durationMs: number
  timestamp: string
  method?: string
  path?: string
}

const iconMap: Record<ActivityEvent['type'], typeof Database> = {
  'record.created': Plus,
  'record.updated': Pencil,
  'record.deleted': Trash2,
  'auth.signup': User,
  'schema.change': Database,
  'key.generated': Key,
}

const colorMap: Record<ActivityEvent['type'], string> = {
  'record.created': 'text-emerald-500',
  'record.updated': 'text-blue-500',
  'record.deleted': 'text-red-500',
  'auth.signup': 'text-violet-500',
  'schema.change': 'text-amber-500',
  'key.generated': 'text-slate-500',
}

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <Clock className="w-8 h-8 text-[var(--fg-tertiary)] mb-2" />
        <p className="text-xs text-[var(--fg-tertiary)]">No hay actividad reciente</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-[var(--border)]">
      {events.map(event => {
        const Icon = iconMap[event.type] ?? Database
        const color = colorMap[event.type]
        return (
          <div key={event.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors">
            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-[var(--bg-secondary)]", color)}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--fg-secondary)] truncate">
                <span className="font-medium text-[var(--fg-primary)]">{event.type.split('.')[1] || event.type}</span>
                {event.collection && <span className="text-[var(--fg-tertiary)]"> → {event.collection}</span>}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-[var(--fg-tertiary)]">{timeAgo(event.timestamp)}</span>
                {event.method && (
                  <>
                    <span className="text-[10px] text-[var(--fg-tertiary)]">·</span>
                    <span className={cn("text-[10px] font-mono",
                      event.status < 300 ? 'text-emerald-500' : event.status < 400 ? 'text-amber-500' : 'text-red-500')}>
                      {event.method} {event.status}
                    </span>
                    <span className="text-[10px] text-[var(--fg-tertiary)]">·</span>
                    <span className="text-[10px] text-[var(--fg-tertiary)] font-mono">{event.durationMs}ms</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function generateMockActivities(): ActivityEvent[] {
  return [
    { id: '1', type: 'record.created', collection: 'users', status: 201, durationMs: 23, timestamp: new Date(Date.now() - 30000).toISOString(), method: 'POST', path: '/records' },
    { id: '2', type: 'record.updated', collection: 'posts', status: 200, durationMs: 45, timestamp: new Date(Date.now() - 120000).toISOString(), method: 'PATCH', path: '/records' },
    { id: '3', type: 'record.deleted', collection: 'categories', status: 200, durationMs: 12, timestamp: new Date(Date.now() - 300000).toISOString(), method: 'DELETE', path: '/records' },
    { id: '4', type: 'auth.signup', status: 201, durationMs: 120, timestamp: new Date(Date.now() - 600000).toISOString(), method: 'POST', path: '/auth/register' },
    { id: '5', type: 'schema.change', status: 200, durationMs: 8, timestamp: new Date(Date.now() - 900000).toISOString() },
    { id: '6', type: 'record.created', collection: 'posts', status: 201, durationMs: 34, timestamp: new Date(Date.now() - 1200000).toISOString(), method: 'POST', path: '/records' },
  ]
}
