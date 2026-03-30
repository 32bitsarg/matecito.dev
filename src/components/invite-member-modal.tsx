'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Shield, Code2, Eye, Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { InviteService } from '@/services/api.service'
import { toast } from 'sonner'

interface InviteMemberModalProps {
    isOpen: boolean
    onClose: () => void
    workspaceId: string
    onInvited: () => void
}

const ROLES = [
    { value: 'admin',     label: 'Admin',     icon: Shield, desc: 'Gestiona miembros y proyectos' },
    { value: 'developer', label: 'Developer', icon: Code2,  desc: 'Acceso total a los proyectos' },
    { value: 'viewer',    label: 'Viewer',    icon: Eye,    desc: 'Solo lectura de datos' },
] as const

export default function InviteMemberModal({ isOpen, onClose, workspaceId, onInvited }: InviteMemberModalProps) {
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<'admin' | 'developer' | 'viewer'>('viewer')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setEmail('')
            setRole('viewer')
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !workspaceId) return

        setLoading(true)
        try {
            await InviteService.create(workspaceId, email.trim(), role)
            toast.success(`Invitación enviada a ${email}`)
            onInvited()
            onClose()
        } catch (err: any) {
            toast.error(err.message || 'Error al enviar invitación')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                            <Send className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Invitar Colega</h3>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Nuevo Colaborador</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Email del Invitado</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            <input
                                autoFocus
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="matecito@ejemplo.dev"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 focus:bg-white transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 ml-1">Rol en el Workspace</label>
                        <div className="grid gap-2">
                            {ROLES.map((r) => {
                                const Icon = r.icon
                                const isSelected = role === r.value
                                return (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRole(r.value)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-2xl border text-left transition-all group",
                                            isSelected 
                                                ? "bg-violet-50 border-violet-200 ring-1 ring-violet-200" 
                                                : "border-slate-100 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                            isSelected ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                                        )}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={cn("text-sm font-bold", isSelected ? "text-violet-900" : "text-slate-700")}>
                                                {r.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 leading-tight">
                                                {r.desc}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-violet-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Enviar Invitación
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
