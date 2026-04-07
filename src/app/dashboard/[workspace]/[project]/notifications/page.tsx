'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Bell, Send, Users, RefreshCw, AlertTriangle,
    CheckCircle2, Info, Flame, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type TargetMode = 'all' | 'specific'

// ─── Firebase Config Section ──────────────────────────────────────────────────

function FirebaseConfigSection() {
    const { fetchFirebaseConfig, saveFirebaseConfig, deleteFirebaseConfig } = useProject()
    const [configured,   setConfigured]   = useState(false)
    const [projectId,    setProjectId]    = useState<string | null>(null)
    const [updatedAt,    setUpdatedAt]    = useState<string | null>(null)
    const [loading,      setLoading]      = useState(true)
    const [saving,       setSaving]       = useState(false)
    const [deleting,     setDeleting]     = useState(false)
    const [expanded,     setExpanded]     = useState(false)
    const [jsonText,     setJsonText]     = useState('')

    useEffect(() => {
        fetchFirebaseConfig().then(res => {
            setConfigured(res.configured)
            setProjectId(res.project_id ?? null)
            setUpdatedAt(res.updated_at ?? null)
        }).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const handleSave = async () => {
        if (!jsonText.trim()) { toast.error('Pegá el JSON del service account'); return }
        let parsed: Record<string, any>
        try { parsed = JSON.parse(jsonText) } catch { toast.error('JSON inválido'); return }
        setSaving(true)
        try {
            const res = await saveFirebaseConfig(parsed)
            setConfigured(true)
            setProjectId(res.project_id)
            setUpdatedAt(new Date().toISOString())
            setJsonText('')
            setExpanded(false)
            toast.success(`Firebase configurado — proyecto: ${res.project_id}`)
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally { setSaving(false) }
    }

    const handleDelete = async () => {
        if (!confirm('¿Eliminar la configuración de Firebase?')) return
        setDeleting(true)
        try {
            await deleteFirebaseConfig()
            setConfigured(false)
            setProjectId(null)
            setUpdatedAt(null)
            toast.success('Configuración eliminada')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally { setDeleting(false) }
    }

    if (loading) return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />
        </div>
    )

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
                onClick={() => setExpanded(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        configured ? "bg-orange-100" : "bg-slate-100"
                    )}>
                        <Flame className={cn("w-4 h-4", configured ? "text-orange-500" : "text-slate-400")} />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">Firebase / FCM</p>
                        <p className="text-xs text-slate-400">
                            {configured
                                ? `Proyecto: ${projectId} · actualizado ${updatedAt ? new Date(updatedAt).toLocaleDateString('es-AR') : '—'}`
                                : 'Sin configurar — las notificaciones no funcionarán'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {configured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full">
                            Activo
                        </span>
                    )}
                    {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-slate-100 p-5 space-y-4">
                    {/* Instrucciones */}
                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-semibold">Cómo obtener el Service Account JSON</p>
                            <ol className="list-decimal list-inside space-y-0.5 text-blue-600">
                                <li>Entrá a <strong>console.firebase.google.com</strong></li>
                                <li>Seleccioná tu proyecto → Configuración → Cuentas de servicio</li>
                                <li>Hacé click en <strong>"Generar nueva clave privada"</strong></li>
                                <li>Descargá el JSON y pegalo acá abajo</li>
                            </ol>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">
                            Service Account JSON {configured && <span className="text-slate-400 font-normal">(pegá uno nuevo para reemplazar)</span>}
                        </label>
                        <textarea
                            value={jsonText}
                            onChange={e => setJsonText(e.target.value)}
                            rows={6}
                            placeholder={'{\n  "type": "service_account",\n  "project_id": "mi-proyecto",\n  "private_key": "-----BEGIN RSA PRIVATE KEY-----\\n..."\n}'}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={saving || !jsonText.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50">
                            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Flame className="w-3.5 h-3.5" />}
                            {saving ? 'Guardando...' : 'Guardar credenciales'}
                        </button>
                        {configured && (
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 transition-all disabled:opacity-50">
                                {deleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
        if (!title.trim() || !body.trim()) { toast.error('Título y mensaje son requeridos'); return }

        let parsedIds: string[] = []
        if (targetMode === 'specific') {
            parsedIds = userIds.split(/[\n,]+/).map(s => s.trim()).filter(Boolean)
            if (parsedIds.length === 0) { toast.error('Ingresá al menos un user ID'); return }
        }

        let parsedData: Record<string, string> | undefined
        if (extraData.trim()) {
            try { parsedData = JSON.parse(extraData) }
            catch { toast.error('El campo "data" debe ser JSON válido'); return }
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
            if (res.successCount > 0) toast.success(`${res.successCount} notificación${res.successCount !== 1 ? 'es' : ''} enviada${res.successCount !== 1 ? 's' : ''}`)
            else toast.warning('No se enviaron notificaciones')
        } catch (err: any) {
            toast.error('Error: ' + (err.message ?? 'Error desconocido'))
        } finally { setSending(false) }
    }

    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-extrabold text-slate-900">Notificaciones Push</h1>
                <p className="text-xs text-slate-400 mt-1">Enviá notificaciones a tus usuarios vía Firebase Cloud Messaging.</p>
            </div>

            {/* Firebase config */}
            <FirebaseConfigSection />

            {/* Send form */}
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
                                placeholder={"uuid-1\nuuid-2\nuuid-3"}
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
                        <input value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Ej: ¡Nueva función disponible!"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Cuerpo <span className="text-red-400">*</span></label>
                        <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
                            placeholder="Ej: Revisá las novedades en la app"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all resize-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-500">Data extra (JSON opcional)</label>
                        <textarea value={extraData} onChange={e => setExtraData(e.target.value)} rows={2}
                            placeholder='{"type": "promo", "url": "/ofertas"}'
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none focus:border-violet-400 focus:bg-white transition-all resize-none" />
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
                    <button onClick={handleSend} disabled={sending || !title.trim() || !body.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {sending ? 'Enviando...' : 'Enviar notificación'}
                    </button>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border animate-in slide-in-from-bottom-2 duration-300",
                    result.reason ? "bg-amber-50 border-amber-200"
                        : result.failureCount > 0 && result.successCount === 0 ? "bg-red-50 border-red-200"
                        : result.failureCount > 0 ? "bg-orange-50 border-orange-200"
                        : "bg-emerald-50 border-emerald-200"
                )}>
                    {result.reason || (result.failureCount > 0 && result.successCount === 0)
                        ? <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        : <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                    <div className="text-xs space-y-0.5">
                        {result.reason === 'no_tokens_registered' && <p className="font-semibold text-amber-700">No hay tokens FCM registrados todavía</p>}
                        {result.reason === 'no_tokens_found' && <p className="font-semibold text-amber-700">No se encontraron tokens para los usuarios indicados</p>}
                        {!result.reason && result.successCount === 0 && result.failureCount > 0 && (
                            <>
                                <p className="font-semibold text-red-700">Todas las notificaciones fallaron</p>
                                <p className="text-red-600">Verificá que el Service Account JSON sea del mismo proyecto Firebase que usás en tu app.</p>
                            </>
                        )}
                        {!result.reason && (result.successCount > 0 || result.failureCount === 0) && (
                            <>
                                <p className="font-semibold text-emerald-700">Enviado</p>
                                <p className="text-emerald-600">{result.successCount} exitosas · {result.failureCount} fallidas</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
