'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { MemberService, InviteService } from '@/services/api.service'
import {
    Users, Plus, Trash2, Loader2, Crown, Shield,
    Code2, Eye, Mail, X, ChevronDown, Send
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import InviteMemberModal from '@/components/invite-member-modal'

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
    const { 
        currentWorkspace, 
        user, 
        members, 
        invites, 
        loading, 
        refreshMembers, 
        refreshInvites,
        checkPermission
    } = useWorkspace()

    const [showInvite, setShowInvite] = useState(false)
    const [removingId, setRemovingId] = useState<string | null>(null)
    const [cancelingEmail, setCancelingEmail] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const workspaceId = currentWorkspace?.id ?? ''
    const canManage = checkPermission('admin')



    const handleCancelInvite = async (email: string) => {
        if (cancelingEmail !== email) {
            setCancelingEmail(email)
            setTimeout(() => setCancelingEmail(e => e === email ? null : e), 3000)
            return
        }
        try {
            await InviteService.delete(workspaceId, email)
            toast.success('Invitación cancelada')
            refreshInvites(workspaceId)
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setCancelingEmail(null)
        }
    }

    const handleRoleChange = async (memberId: string, newRole: Role) => {
        setUpdatingId(memberId)
        try {
            await MemberService.update(workspaceId, memberId, newRole)
            refreshMembers(workspaceId)
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
            refreshMembers(workspaceId)
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

            {/* Invite modal */}
            <InviteMemberModal
                isOpen={showInvite}
                onClose={() => setShowInvite(false)}
                workspaceId={workspaceId}
                onInvited={() => refreshInvites(workspaceId)}
            />



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
                        {members.map((member: any) => {
                            const role = member.role as Role
                            const meta = ROLE_META[role] ?? ROLE_META.viewer
                            const Icon = meta.icon
                            const isMe = member.user_id === user?.id
                            const isOwner = role === 'owner'
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
                                                    value={role}
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

            {/* Pending Invites list */}
            {invites.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-slate-100 bg-amber-50/30 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Invitaciones Pendientes</p>
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">
                            {invites.length}
                        </span>
                    </div>

                    <ul className="divide-y divide-slate-50">
                        {invites.map((invite: any) => (
                            <li key={invite.email} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors opacity-80">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 truncate">{invite.email}</p>
                                    <p className="text-[10px] text-slate-400">Rol: {invite.role}</p>
                                </div>
                                {canManage && (
                                    <button 
                                        onClick={() => handleCancelInvite(invite.email)}
                                        className={cn(
                                            "px-2 py-1 rounded-lg text-[10px] font-bold transition-all",
                                            cancelingEmail === invite.email
                                                ? "bg-red-500 text-white"
                                                : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                                        )}
                                    >
                                        {cancelingEmail === invite.email ? 'Confirmar' : 'Cancelar'}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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
