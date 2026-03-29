'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { MemberService, InviteService } from '@/services/api.service'
import {
    Users, Plus, Trash2, Loader2, Crown, Shield,
    Code2, Eye, Mail, X, ChevronDown
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
    user_id: string
    name: string
    username: string
    email: string
    avatar_seed: string
    role: 'owner' | 'admin' | 'developer' | 'viewer'
    created_at: string
}

const ROLES = ['owner', 'admin', 'developer', 'viewer'] as const
type Role = typeof ROLES[number]

const ROLE_META: Record<Role, { label: string; icon: any; color: string }> = {
    owner:     { label: 'Owner',     icon: Crown,  color: 'text-amber-600 bg-amber-50 border-amber-200' },
    admin:     { label: 'Admin',     icon: Shield, color: 'text-violet-600 bg-violet-50 border-violet-200' },
    developer: { label: 'Developer', icon: Code2,  color: 'text-blue-600 bg-blue-50 border-blue-200' },
    viewer:    { label: 'Viewer',    icon: Eye,    color: 'text-slate-600 bg-slate-50 border-slate-200' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembersPage() {
    const { workspace: workspaceSlug } = useParams()
    const { currentWorkspace, user } = useWorkspace()

    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [showInvite, setShowInvite] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviteRole, setInviteRole] = useState<Role>('viewer')
    const [inviting, setInviting] = useState(false)
    const [removingId, setRemovingId] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const workspaceId = currentWorkspace?.id ?? ''
    const myRole = currentWorkspace?.role as Role
    const canManage = ['owner', 'admin'].includes(myRole)

    const loadMembers = useCallback(async () => {
        if (!workspaceId) return
        setLoading(true)
        try {
            const res = await MemberService.list(workspaceId)
            setMembers(res.members ?? [])
        } catch (err: any) {
            toast.error('Error al cargar miembros: ' + err.message)
        } finally {
            setLoading(false)
        }
    }, [workspaceId])

    useEffect(() => { loadMembers() }, [loadMembers])

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteEmail.trim()) return
        setInviting(true)
        try {
            await InviteService.create(workspaceId, inviteEmail.trim(), inviteRole)
            toast.success(`Invitación enviada a ${inviteEmail}`)
            setInviteEmail('')
            setShowInvite(false)
            loadMembers()
        } catch (err: any) {
            toast.error(err.message || 'Error al invitar')
        } finally {
            setInviting(false)
        }
    }

    const handleRoleChange = async (memberId: string, newRole: Role) => {
        setUpdatingId(memberId)
        try {
            await MemberService.update(workspaceId, memberId, newRole)
            setMembers(prev => prev.map(m => m.user_id === memberId ? { ...m, role: newRole } : m))
            toast.success('Rol actualizado')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setUpdatingId(null)
        }
    }

    const handleRemove = async (memberId: string) => {
        if (removingId !== memberId) {
            setRemovingId(memberId)
            setTimeout(() => setRemovingId(r => r === memberId ? null : r), 3000)
            return
        }
        try {
            await MemberService.remove(workspaceId, memberId)
            setMembers(prev => prev.filter(m => m.user_id !== memberId))
            toast.success('Miembro removido')
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setRemovingId(null)
        }
    }

    return (
        <div className="max-w-3xl space-y-6 pb-16">

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                        <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Equipo</h1>
                        <p className="text-xs text-slate-400">
                            {currentWorkspace?.name} · {members.length} miembro{members.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                {canManage && (
                    <button onClick={() => setShowInvite(v => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                        Invitar
                    </button>
                )}
            </div>

            {/* Invite form */}
            {showInvite && (
                <div className="bg-white border border-violet-200 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-violet-500" />
                            Invitar a un colaborador
                        </p>
                        <button onClick={() => setShowInvite(false)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <form onSubmit={handleInvite} className="flex gap-2">
                        <input
                            type="email"
                            required
                            placeholder="email@ejemplo.com"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-violet-400 focus:bg-white transition-all"
                        />
                        <select
                            value={inviteRole}
                            onChange={e => setInviteRole(e.target.value as Role)}
                            className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 transition-all"
                        >
                            {ROLES.filter(r => r !== 'owner').map(r => (
                                <option key={r} value={r}>{ROLE_META[r].label}</option>
                            ))}
                        </select>
                        <button type="submit" disabled={inviting}
                            className="px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center gap-2">
                            {inviting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Invitar
                        </button>
                    </form>
                    <p className="text-xs text-slate-400">
                        Si el usuario no existe todavía, se le enviará una invitación cuando se registre.
                    </p>
                </div>
            )}

            {/* Members list */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Miembros</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="py-12 text-center">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Sin miembros todavía</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {members.map(member => {
                            const meta = ROLE_META[member.role] ?? ROLE_META.viewer
                            const Icon = meta.icon
                            const isMe = member.user_id === user?.id
                            const isOwner = member.role === 'owner'
                            const canEdit = canManage && !isOwner && !isMe

                            return (
                                <li key={member.user_id}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">

                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0 text-sm font-bold text-violet-700">
                                        {(member.name || member.email || '?')[0].toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-800 truncate">
                                                {member.name || member.username || 'Sin nombre'}
                                            </p>
                                            {isMe && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold shrink-0">
                                                    Vos
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 truncate">{member.email}</p>
                                    </div>

                                    {/* Role selector or badge */}
                                    {canEdit ? (
                                        <div className="relative">
                                            {updatingId === member.user_id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                                            ) : (
                                                <select
                                                    value={member.role}
                                                    onChange={e => handleRoleChange(member.user_id, e.target.value as Role)}
                                                    className={cn(
                                                        "pl-2 pr-6 py-1 text-xs font-semibold rounded-lg border outline-none cursor-pointer transition-all appearance-none",
                                                        meta.color
                                                    )}
                                                >
                                                    {ROLES.filter(r => r !== 'owner').map(r => (
                                                        <option key={r} value={r}>{ROLE_META[r].label}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    ) : (
                                        <span className={cn("flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg border", meta.color)}>
                                            <Icon className="w-3 h-3" />
                                            {meta.label}
                                        </span>
                                    )}

                                    {/* Remove */}
                                    {canEdit && (
                                        <button onClick={() => handleRemove(member.user_id)}
                                            title={removingId === member.user_id ? 'Click para confirmar' : 'Remover'}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-all text-xs",
                                                removingId === member.user_id
                                                    ? "bg-red-500 text-white"
                                                    : "text-slate-300 hover:text-red-500 hover:bg-red-50"
                                            )}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {/* Roles explanation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Roles</p>
                <div className="grid grid-cols-2 gap-3">
                    {ROLES.map(role => {
                        const meta = ROLE_META[role]
                        const Icon = meta.icon
                        const descriptions: Record<Role, string> = {
                            owner: 'Control total. No puede ser removido.',
                            admin: 'Gestiona miembros y proyectos.',
                            developer: 'Acceso completo a los proyectos.',
                            viewer: 'Solo lectura.',
                        }
                        return (
                            <div key={role} className="flex items-start gap-2">
                                <span className={cn("flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md border shrink-0", meta.color)}>
                                    <Icon className="w-2.5 h-2.5" />
                                    {meta.label}
                                </span>
                                <p className="text-xs text-slate-400">{descriptions[role]}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
