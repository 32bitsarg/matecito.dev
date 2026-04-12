'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Users, FolderOpen, HardDrive, TrendingUp, Loader2, ShieldAlert, Mail } from 'lucide-react'

interface Stats {
  users: { total: number; last_24h: number; last_7d: number; last_30d: number }
  workspaces: number
  projects: { total: number; v1: number; v2: number }
  storage_mb: number
}

interface User {
  id: string; email: string; username: string; name: string
  is_admin: boolean; created_at: string; workspaces: number; projects: number
}

interface Project {
  id: string; name: string; subdomain: string; api_version: string
  created_at: string; workspace_name: string; owner_email: string
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string | number; sub?: string; icon: React.ElementType }) {
  return (
    <div className="p-5 rounded-2xl border flex flex-col gap-3"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--fg-tertiary)' }}>{label}</span>
        <Icon className="w-4 h-4" style={{ color: 'var(--fg-tertiary)' }} />
      </div>
      <p className="text-3xl font-extrabold" style={{ color: 'var(--fg-primary)' }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>{sub}</p>}
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats]       = useState<Stats | null>(null)
  const [users, setUsers]       = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [newsletter, setNewsletter] = useState<any[]>([])
  const [tab, setTab]           = useState<'users' | 'projects' | 'newsletter'>('users')
  const [loading, setLoading]   = useState(true)
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [s, u, p, n] = await Promise.all([
          api.get('/api/v2/platform/admin/stats'),
          api.get('/api/v2/platform/admin/users?limit=100'),
          api.get('/api/v2/platform/admin/projects?limit=100'),
          api.get('/api/v2/platform/admin/newsletter'),
        ])
        setStats(s)
        setUsers(u.users)
        setProjects(p.projects)
        setNewsletter(n.subscribers)
      } catch (err: any) {
        if (err?.status === 403 || err?.message?.includes('403') || err?.message?.includes('Forbidden')) {
          setForbidden(true)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--fg-tertiary)' }} />
    </div>
  )

  if (forbidden) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <ShieldAlert className="w-10 h-10" style={{ color: 'var(--accent)' }} />
      <p className="text-sm font-mono" style={{ color: 'var(--fg-tertiary)' }}>Acceso denegado.</p>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: 'var(--fg-tertiary)' }}>
          matecito.dev · admin
        </p>
        <h1 className="text-2xl font-extrabold" style={{ color: 'var(--fg-primary)' }}>Panel de administración</h1>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Usuarios"
            value={stats.users.total}
            sub={`+${stats.users.last_7d} esta semana`}
            icon={Users}
          />
          <StatCard
            label="Proyectos"
            value={stats.projects.total}
            sub={`v1: ${stats.projects.v1} · v2: ${stats.projects.v2}`}
            icon={FolderOpen}
          />
          <StatCard
            label="Workspaces"
            value={stats.workspaces}
            icon={TrendingUp}
          />
          <StatCard
            label="Storage"
            value={`${stats.storage_mb} MB`}
            icon={HardDrive}
          />
        </div>
      )}

      {/* Growth row */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Nuevos hoy',     value: stats.users.last_24h },
            { label: 'Últimos 7 días', value: stats.users.last_7d  },
            { label: 'Últimos 30 días',value: stats.users.last_30d },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl border text-center"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--fg-primary)' }}>{s.value}</p>
              <p className="text-xs font-mono" style={{ color: 'var(--fg-tertiary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div>
        <div className="flex gap-1 mb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {([
            { id: 'users',      label: `Usuarios (${users.length})` },
            { id: 'projects',   label: `Proyectos (${projects.length})` },
            { id: 'newsletter', label: `Newsletter (${newsletter.length})` },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 text-xs font-mono transition-colors -mb-px"
              style={{
                color: tab === t.id ? 'var(--fg-primary)' : 'var(--fg-tertiary)',
                borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Users table */}
        {tab === 'users' && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Username</th>
                  <th className="text-center px-4 py-3">Workspaces</th>
                  <th className="text-center px-4 py-3">Proyectos</th>
                  <th className="text-right px-4 py-3 hidden sm:table-cell">Registro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      borderTop: '1px solid var(--border)',
                    }}>
                    <td className="px-4 py-2.5" style={{ color: 'var(--fg-primary)' }}>
                      <span>{u.email}</span>
                      {u.is_admin && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold"
                          style={{ backgroundColor: 'rgba(109,0,26,0.25)', color: '#e0a0a0' }}>
                          admin
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell" style={{ color: 'var(--fg-secondary)' }}>
                      {u.username || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-center" style={{ color: 'var(--fg-secondary)' }}>{u.workspaces}</td>
                    <td className="px-4 py-2.5 text-center" style={{ color: 'var(--fg-secondary)' }}>{u.projects}</td>
                    <td className="px-4 py-2.5 text-right hidden sm:table-cell" style={{ color: 'var(--fg-tertiary)' }}>
                      {new Date(u.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Projects table */}
        {tab === 'projects' && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
                  <th className="text-left px-4 py-3">Proyecto</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Owner</th>
                  <th className="text-center px-4 py-3">API</th>
                  <th className="text-right px-4 py-3 hidden sm:table-cell">Creado</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      borderTop: '1px solid var(--border)',
                    }}>
                    <td className="px-4 py-2.5" style={{ color: 'var(--fg-primary)' }}>
                      <div>{p.name}</div>
                      <div style={{ color: 'var(--fg-tertiary)' }}>{p.subdomain}</div>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell" style={{ color: 'var(--fg-secondary)' }}>
                      {p.owner_email}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={p.api_version === 'v2'
                          ? { backgroundColor: 'rgba(109,0,26,0.25)', color: '#e0a0a0' }
                          : { backgroundColor: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                        {p.api_version || 'v1'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right hidden sm:table-cell" style={{ color: 'var(--fg-tertiary)' }}>
                      {new Date(p.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Newsletter */}
        {tab === 'newsletter' && (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full text-xs font-mono">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Fuente</th>
                  <th className="text-right px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {newsletter.map((n, i) => (
                  <tr key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                      borderTop: '1px solid var(--border)',
                    }}>
                    <td className="px-4 py-2.5" style={{ color: 'var(--fg-primary)' }}>{n.email}</td>
                    <td className="px-4 py-2.5" style={{ color: 'var(--fg-tertiary)' }}>{n.source || '—'}</td>
                    <td className="px-4 py-2.5 text-right" style={{ color: 'var(--fg-tertiary)' }}>
                      {new Date(n.created_at).toLocaleDateString('es-AR')}
                    </td>
                  </tr>
                ))}
                {newsletter.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center" style={{ color: 'var(--fg-tertiary)' }}>
                      Sin suscriptores aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
