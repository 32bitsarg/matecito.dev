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
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Usuarios</h1>
                        <p className="text-xs text-slate-400">{users.length} registrados</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`${base}/auth/providers`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all">
                        <Puzzle className="w-4 h-4" />
                        Providers OAuth
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button onClick={loadUsers} disabled={loading}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total", value: users.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Con nombre", value: users.filter(u => u.name).length, icon: UserCheck, color: "text-violet-600", bg: "bg-violet-50" },
                    { label: "Hoy", value: users.filter(u => new Date(u.created_at).toDateString() === new Date().toDateString()).length, icon: Mail, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "OAuth", value: users.filter(u => u.oauth_provider).length, icon: Globe, color: "text-amber-600", bg: "bg-amber-50" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                            <p className={cn("text-2xl font-extrabold", s.color)}>{s.value}</p>
                        </div>
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                            <s.icon className={cn("w-4 h-4", s.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input type="text" placeholder="Buscar por email o username..."
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-violet-400 transition-colors" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Users className="w-10 h-10 text-slate-200 mb-3" />
                        <p className="text-sm text-slate-400">Sin usuarios registrados</p>
                    </div>
                ) : (
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Método</th>
                                <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verificado</th>
                                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creado</th>
                                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(user => (
                                <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center border border-violet-100 shrink-0">
                                                <span className="text-violet-600 font-bold text-sm uppercase">
                                                    {(user.email || user.username || '?')[0]}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">{user.email || 'Sin email'}</p>
                                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.username || '—'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            {user.oauth_provider === 'google' ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg">
                                                    <Globe className="w-2.5 h-2.5" /> Google
                                                </span>
                                            ) : user.oauth_provider === 'github' ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg">
                                                    <Github className="w-2.5 h-2.5" /> GitHub
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg">
                                                    <UserCheck className="w-2.5 h-2.5" /> Email
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex justify-center">
                                            {user.email_verified ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> Verificado
                                                </span>
                                            ) : user.oauth_provider ? (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg">
                                                    <ShieldCheck className="w-2.5 h-2.5" /> OAuth
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg">
                                                    <Clock className="w-2.5 h-2.5" /> Pendiente
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!user.email_verified && !user.oauth_provider && (
                                                <button onClick={() => handleResendVerification(user)}
                                                    disabled={resending === user.id}
                                                    className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition-all disabled:opacity-50"
                                                    title="Reenviar email de verificación">
                                                    {resending === user.id
                                                        ? <RefreshCw className="w-4 h-4 animate-spin" />
                                                        : <Send className="w-4 h-4" />}
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(user)}
                                                className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
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
