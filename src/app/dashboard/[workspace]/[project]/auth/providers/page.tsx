'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Key, RefreshCw, Save, Github, Globe, Lock, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const SUPPORTED_PROVIDERS = [
    {
        id: 'google',
        name: 'Google',
        icon: Globe,
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        docsUrl: 'https://console.cloud.google.com/apis/credentials',
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: Github,
        color: 'text-slate-800',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        docsUrl: 'https://github.com/settings/developers',
    },
]

type ProviderState = {
    enabled: boolean
    client_id: string
    client_secret: string
    saved: boolean   // true = ya existe en el backend
}

export default function ProvidersPage() {
    const { fetchOAuthProviders, saveOAuthProvider, deleteOAuthProvider, project } = useProject()
    const [providers, setProviders] = useState<Record<string, ProviderState>>({
        google: { enabled: false, client_id: '', client_secret: '', saved: false },
        github: { enabled: false, client_id: '', client_secret: '', saved: false },
    })
    const [saving, setSaving]   = useState<string | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [loading, setLoading]  = useState(true)

    useEffect(() => {
        (async () => {
            try {
                const list = await fetchOAuthProviders()
                setProviders(prev => {
                    const next = { ...prev }
                    for (const row of list) {
                        if (next[row.provider]) {
                            next[row.provider] = {
                                enabled:       row.enabled,
                                client_id:     row.client_id,
                                client_secret: '', // el backend nunca devuelve el secret
                                saved:         true,
                            }
                        }
                    }
                    return next
                })
            } catch (err: any) {
                toast.error('Error al cargar providers: ' + err.message)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const update = (id: string, patch: Partial<ProviderState>) =>
        setProviders(p => ({ ...p, [id]: { ...p[id], ...patch } }))

    const handleSave = async (id: string) => {
        const p = providers[id]
        if (!p.client_id.trim()) return toast.error('Client ID requerido')
        // Si ya estaba guardado y no se cambió el secret, podemos asumir que no cambia
        if (!p.saved && !p.client_secret.trim()) return toast.error('Client Secret requerido')
        setSaving(id)
        try {
            await saveOAuthProvider(id, p.client_id.trim(), p.client_secret.trim() || '***UNCHANGED***', p.enabled)
            update(id, { saved: true, client_secret: '' })
            toast.success(`${id} guardado`)
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setSaving(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm(`¿Eliminar la configuración de ${id}?`)) return
        setDeleting(id)
        try {
            await deleteOAuthProvider(id)
            update(id, { enabled: false, client_id: '', client_secret: '', saved: false })
            toast.success(`${id} eliminado`)
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setDeleting(null)
        }
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.matecito.dev'
    const callbackBase = `${apiBase}/api/v1/project/auth/oauth`

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-6 h-6 animate-spin text-violet-500" />
        </div>
    )

    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Key className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">OAuth Providers</h1>
                    <p className="text-xs text-slate-400">Login social para los usuarios de tu proyecto</p>
                </div>
            </div>

            {SUPPORTED_PROVIDERS.map(meta => {
                const p       = providers[meta.id]
                const Icon    = meta.icon
                const isSaving  = saving === meta.id
                const isDeleting = deleting === meta.id

                return (
                    <div key={meta.id}
                        className={cn(
                            "bg-white rounded-2xl border shadow-sm overflow-hidden transition-all",
                            p.enabled ? "border-violet-200" : "border-slate-200"
                        )}>
                        {/* Card header */}
                        <div className={cn("flex items-center justify-between px-6 py-4 border-b",
                            p.enabled ? "border-violet-100 bg-violet-50/40" : "border-slate-100 bg-slate-50/40")}>
                            <div className="flex items-center gap-3">
                                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", meta.bg, meta.border)}>
                                    <Icon className={cn("w-4 h-4", meta.color)} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{meta.name}</p>
                                    {p.saved && (
                                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                                            <CheckCircle2 className="w-3 h-3" /> Configurado
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {p.saved && (
                                    <button onClick={() => handleDelete(meta.id)} disabled={isDeleting}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                                        {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                )}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={p.enabled}
                                        onChange={e => update(meta.id, { enabled: e.target.checked })}
                                        className="sr-only peer" />
                                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600" />
                                </label>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client ID</label>
                                <input
                                    type="text" value={p.client_id}
                                    onChange={e => update(meta.id, { client_id: e.target.value })}
                                    placeholder={`Client ID de ${meta.name}`}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-800 focus:border-violet-400 focus:bg-white outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Client Secret {p.saved && <span className="normal-case text-slate-400">(dejar vacío para mantener el actual)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type="password" value={p.client_secret}
                                        onChange={e => update(meta.id, { client_secret: e.target.value })}
                                        placeholder={p.saved ? '••••••••••••••••' : `Client Secret de ${meta.name}`}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs text-slate-800 focus:border-violet-400 focus:bg-white outline-none transition-all"
                                    />
                                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                </div>
                            </div>

                            {/* Redirect URL */}
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-700 space-y-1">
                                    <p className="font-semibold">Callback URL para {meta.name}:</p>
                                    <code className="block font-mono text-[11px] break-all text-amber-800 bg-amber-100 px-2 py-1 rounded">
                                        {callbackBase}/{meta.id}/callback
                                    </code>
                                    <a href={meta.docsUrl} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-amber-600 underline hover:text-amber-800">
                                        Configurar en {meta.name} →
                                    </a>
                                </div>
                            </div>

                            <div className="flex justify-end pt-1">
                                <button onClick={() => handleSave(meta.id)} disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                                    {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    Guardar {meta.name}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Uso en el SDK */}
            <div className="bg-slate-900 rounded-2xl p-5 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Uso en el SDK</p>
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">{`// Iniciar OAuth (redirige al provider)
const url = db.auth.getOAuthUrl('google', 'https://miapp.com/callback')
window.location.href = url

// En la página /callback:
const { data } = await db.auth.handleOAuthCallback()`}</pre>
            </div>
        </div>
    )
}
