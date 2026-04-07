'use client'

import { useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Bell, Send, Users, RefreshCw, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type TargetMode = 'all' | 'specific'

export default function NotificationsPage() {
    const { sendNotification } = useProject()

    const [targetMode,  setTargetMode]  = useState<TargetMode>('all')
    const [userIds,     setUserIds]     = useState('')
    const [title,       setTitle]       = useState('')
    const [body,        setBody]        = useState('')
    const [extraData,   setExtraData]   = useState('')
    const [sending,     setSending]     = useState(false)
    const [result,      setResult]      = useState<{ successCount: number; failureCount: number; reason?: string } | null>(null)

    const handleSend = async () => {
        if (!title.trim() || !body.trim()) {
            toast.error('Título y mensaje son requeridos')
            return
        }

        let parsedIds: string[] = []
        if (targetMode === 'specific') {
            parsedIds = userIds.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
            if (parsedIds.length === 0) {
                toast.error('Ingresá al menos un user ID')
                return
            }
        }

        let parsedData: Record<string, string> | undefined
        if (extraData.trim()) {
            try {
                parsedData = JSON.parse(extraData)
            } catch {
                toast.error('El campo "data" debe ser JSON válido')
                return
            }
        }

        setSending(true)
        setResult(null)
        try {
            const res = await sendNotification({
                user_ids: targetMode === 'all' ? ['*'] : parsedIds,
                title: title.trim(),
                body: body.trim(),
                ...(parsedData ? { data: parsedData } : {}),
            })
            setResult(res)
            toast.success(`Notificación enviada — ${res.successCount} exitosas`)
        } catch (err: any) {
            toast.error('Error: ' + (err.message ?? 'Error desconocido'))
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-extrabold text-slate-900">Notificaciones Push</h1>
                <p className="text-xs text-slate-400 mt-1">Enviá notificaciones a tus usuarios a través de FCM.</p>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700 space-y-1">
                    <p className="font-semibold">Requisitos</p>
                    <ul className="list-disc list-inside space-y-0.5 text-blue-600">
                        <li>FCM configurado en el servidor (<code className="font-mono">FIREBASE_SERVICE_ACCOUNT_*</code>)</li>
                        <li>Los usuarios deben haber registrado su token con <code className="font-mono">notifications.registerToken()</code></li>
                    </ul>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                {/* Target */}
                <div className="p-5 space-y-3">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Destinatarios</p>
                    <div className="flex gap-2">
                        {([
                            { value: 'all',      label: 'Todos los usuarios', icon: Users },
                            { value: 'specific', label: 'Usuarios específicos', icon: Bell },
                        ] as const).map(opt => (
                            <button key={opt.value} onClick={() => setTargetMode(opt.value)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all",
                                    targetMode === opt.value
                                        ? "bg-violet-600 text-white border-violet-600"
                                        : "bg-white text-slate-500 border-slate-200 hover:border-violet-300"
                                )}>
                                <opt.icon className="w-3.5 h-3.5" />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    {targetMode === 'specific' && (
                        <div className="space-y-1">
                            <label className="text-xs text-slate-500">User IDs (uno por línea o separados por coma)</label>
                            <textarea
                                value={userIds}
                                onChange={e => setUserIds(e.target.value)}
                                rows={3}
                                placeholder="uuid-1&#10;uuid-2&#10;uuid-3"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all resize-none"
                            />
                        </div>
                    )}
                </div>

                {/* Message */}
                <div className="p-5 space-y-4">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mensaje</p>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Título <span className="text-red-400">*</span></label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ej: ¡Nueva función disponible!"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Cuerpo <span className="text-red-400">*</span></label>
                        <textarea
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            rows={3}
                            placeholder="Ej: Revisá las novedades en la app"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all resize-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Data extra (JSON opcional)</label>
                        <textarea
                            value={extraData}
                            onChange={e => setExtraData(e.target.value)}
                            rows={2}
                            placeholder='{"type": "promo", "url": "/ofertas"}'
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Preview */}
                {(title || body) && (
                    <div className="p-5 space-y-2">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Preview</p>
                        <div className="flex items-start gap-3 p-3 bg-slate-900 rounded-xl">
                            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
                                <Bell className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">{title || '—'}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{body || '—'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Send */}
                <div className="p-5">
                    <button
                        onClick={handleSend}
                        disabled={sending || !title.trim() || !body.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {sending
                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                            : <Send className="w-4 h-4" />}
                        {sending ? 'Enviando...' : 'Enviar notificación'}
                    </button>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border animate-in slide-in-from-bottom-2 duration-300",
                    result.reason === 'no_tokens_registered' || result.reason === 'no_tokens_found'
                        ? "bg-amber-50 border-amber-200"
                        : result.failureCount > 0
                            ? "bg-orange-50 border-orange-200"
                            : "bg-emerald-50 border-emerald-200"
                )}>
                    {result.reason ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    )}
                    <div className="text-xs space-y-0.5">
                        {result.reason === 'no_tokens_registered' && (
                            <p className="font-semibold text-amber-700">No hay tokens FCM registrados todavía</p>
                        )}
                        {result.reason === 'no_tokens_found' && (
                            <p className="font-semibold text-amber-700">No se encontraron tokens para los usuarios indicados</p>
                        )}
                        {!result.reason && (
                            <>
                                <p className="font-semibold text-emerald-700">Enviado correctamente</p>
                                <p className="text-emerald-600">{result.successCount} exitosas · {result.failureCount} fallidas</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
