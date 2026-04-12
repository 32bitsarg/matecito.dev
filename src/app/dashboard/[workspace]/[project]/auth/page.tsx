'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { AuthUserService } from '@/services/api.service'
import { Users, RefreshCw, Search, Trash2, UserCheck, Mail, ChevronRight, Puzzle, Globe, Github, Send, ShieldCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function UsersPage() {
    const { projectId } = useProject()
    const { workspace, project: projectSlug } = useParams()
    const base = `/dashboard/${workspace}/${projectSlug}`
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [resending, setResending] = useState<string | null>(null)

    const loadUsers = async () => {
        setLoading(true)
        try {
            const res = await AuthUserService.list(projectId)
            setUsers(res.users ?? [])
        } catch (err: any) {
            toast.error('Error al cargar usuarios: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadUsers() }, [projectId])

    const handleResendVerification = async (user: any) => {
        setResending(user.id)
        try {
            await AuthUserService.resendVerification(projectId, user.id)
            toast.success(`Email de verificación enviado a ${user.email}`)
        } catch (err: any) {
            toast.error(err.message || 'Error al reenviar el email')
        } finally {
            setResending(null)
        }
    }

    const handleDelete = async (user: any) => {
        if (!confirm(`¿Eliminar al usuario ${user.email}?`)) return
        try {
            await AuthUserService.delete(projectId, user.id)
            toast.success('Usuario eliminado')
            setUsers(prev => prev.filter(u => u.id !== user.id))
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const filtered = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-950/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[var(--fg-primary)]">Usuarios</h1>
                        <p className="text-xs text-[var(--fg-tertiary)]">{users.length} registrados</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`${base}/auth/providers`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-sm font-semibold text-[var(--fg-secondary)] hover:border-[var(--border)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all">
                        <Puzzle className="w-4 h-4" />
                        Providers OAuth
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={loadUsers} disabled={loading}
                        className="p-2.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition-all">
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total", value: users.length, icon: Users, color: "text-blue-400", bg: "bg-blue-950/20" },
                    { label: "Con nombre", value: users.filter(u => u.name).length, icon: UserCheck, color: "text-[var(--accent)]", bg: "bg-[var(--accent-soft)]" },
                    { label: "Hoy", value: users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length, icon: Mail, color: "text-emerald-400", bg: "bg-emerald-950/20" },
                    { label: "OAuth", value: users.filter(u => u.oauth_provider).length, icon: Globe, color: "text-amber-400", bg: "bg-amber-950/20" },
                ].map(s => (
                    <div key={s.label} className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--fg-tertiary)] font-medium mb-1">{s.label}</p>
                            <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
                        </div>
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                            <s.icon className={cn("w-4 h-4", s.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--fg-tertiary)]" />
                        <input type="text" placeholder="Buscar por email o username..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] transition-colors" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Users className="w-10 h-10 text-[var(--fg-tertiary)] mb-3" />
                        <p className="text-sm text-[var(--fg-tertiary)]">Sin usuarios registrados</p>
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/60">
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider">Usuario</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider">Método</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider">Verificado</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider">Creado</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filtered.map(user => (
                                <tr key={user.id} className="group hover:bg-[var(--bg-secondary)] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-900/20 to-violet-900/10 flex items-center justify-center border border-violet-800/40 shrink-0">
                                                <span className="text-[var(--accent)] font-bold text-sm uppercase">
                                                    {(user.email || user.username || '?')[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[var(--fg-primary)] text-sm">{user.email || 'Sin email'}</p>
                                                <p className="text-[10px] text-[var(--fg-tertiary)] font-mono mt-0.5">{user.username || '—'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            {user.oauth_provider === 'google' ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-red-950/20 text-red-400 border border-red-800/40 rounded-lg">
                                                    <Globe className="w-2.5 h-2.5" /> Google
                                                </span>
                                            ) : user.oauth_provider === 'github' ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-[var(--bg-secondary)] text-[var(--fg-primary)] border border-slate-600/50 rounded-lg">
                                                    <Github className="w-2.5 h-2.5" /> GitHub
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-800/40 rounded-lg">
                                                    <UserCheck className="w-2.5 h-2.5" /> Email
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            {user.email_verified ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-emerald-950/20 text-emerald-400 border border-emerald-800/40 rounded-lg">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> Verificado
                                                </span>
                                            ) : user.oauth_provider ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-blue-950/20 text-blue-400 border border-blue-800/40 rounded-lg">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> OAuth
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-amber-950/20 text-amber-400 border border-amber-800/40 rounded-lg">
                                                    <Clock className="w-2.5 h-2.5" /> Pendiente
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[10px] text-[var(--fg-tertiary)] font-mono bg-[var(--bg-secondary)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!user.email_verified && !user.oauth_provider && (
                                                <button onClick={() => handleResendVerification(user)}
                                                    disabled={resending === user.id}
                                                    className="p-2 rounded-xl hover:bg-blue-950/20 text-[var(--fg-tertiary)] hover:text-blue-500 transition-all disabled:opacity-50"
                                                    title="Reenviar email de verificación">
                                                    {resending === user.id
                                                        ? <RefreshCw className="w-4 h-4 animate-spin" />
                                                        : <Send className="w-4 h-4" />}
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(user)}
                                                className="p-2 rounded-xl hover:bg-red-950/20 text-[var(--fg-tertiary)] hover:text-red-500 transition-all"
                                                title="Eliminar usuario">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
