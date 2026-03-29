'use client'

import { useState, useEffect } from 'react'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { User, Save, Loader2, RefreshCw, Calendar, Mail } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'

export default function ProfilePage() {
    const { user } = useWorkspace()

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setName(user.name ?? '')
            setUsername(user.username ?? '')
        }
    }, [user])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() && !username.trim()) return

        setLoading(true)
        try {
            await api.patch('/api/v1/platform/me', {
                name: name.trim() || undefined,
                username: username.trim() || undefined,
            })
            toast.success('Perfil actualizado')
        } catch (err: any) {
            toast.error(err.message || 'Error al actualizar')
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
            </div>
        )
    }

    const initials = (user.name || user.email || '?')[0].toUpperCase()
    const joinedDate = new Date(user.created_at).toLocaleDateString('es-AR', {
        day: 'numeric', month: 'long', year: 'numeric',
    })

    return (
        <div className="max-w-xl space-y-6 pb-16">

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <User className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Mi Perfil</h1>
                    <p className="text-xs text-slate-400">Tu cuenta de matecitodb</p>
                </div>
            </div>

            {/* Avatar + info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-2xl font-extrabold shrink-0 shadow-md">
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-bold text-slate-900 truncate">{user.name || 'Sin nombre'}</p>
                    <p className="text-sm text-slate-400 truncate flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3" />
                        Cuenta creada el {joinedDate}
                    </p>
                </div>
            </div>

            {/* Edit form */}
            <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <h3 className="font-bold text-slate-900">Editar información</h3>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Nombre completo</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-violet-400 focus:bg-white transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="tu_username"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-mono outline-none focus:border-violet-400 focus:bg-white transition-all"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Email</label>
                    <input
                        readOnly
                        value={user.email}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 cursor-not-allowed outline-none"
                    />
                    <p className="text-xs text-slate-400">El email no se puede cambiar por ahora.</p>
                </div>

                <button type="submit" disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors">
                    {loading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Save className="w-4 h-4" />
                    }
                    Guardar cambios
                </button>
            </form>
        </div>
    )
}
