'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Webhook, Plus, Trash2, RefreshCw, X, Save,
    CheckCircle2, AlertCircle, Eye, EyeOff, Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const EVENTS = [
    { value: '*',              label: 'Todos los eventos' },
    { value: 'record.created', label: 'record.created' },
    { value: 'record.updated', label: 'record.updated' },
    { value: 'record.deleted', label: 'record.deleted' },
]

const EVENT_COLORS: Record<string, string> = {
    '*':              'bg-violet-900/20 text-violet-700 border-violet-800/40',
    'record.created': 'bg-emerald-950/20 text-emerald-700 border-emerald-800/40',
    'record.updated': 'bg-amber-950/20 text-amber-700 border-amber-800/40',
    'record.deleted': 'bg-red-950/20 text-red-700 border-red-800/40',
}

type FormState = {
    url: string
    collection: string
    event: string
    secret: string
}

const EMPTY_FORM: FormState = { url: '', collection: '*', event: '*', secret: '' }

export default function WebhooksPage() {
    const { fetchWebhooks, createWebhook, updateWebhook, deleteWebhook, collections } = useProject()

    const [webhooks,  setWebhooks]  = useState<any[]>([])
    const [loading,   setLoading]   = useState(true)
    const [showForm,  setShowForm]  = useState(false)
    const [form,      setForm]      = useState<FormState>(EMPTY_FORM)
    const [saving,    setSaving]    = useState(false)
    const [newSecret, setNewSecret] = useState<string | null>(null)
    const [showSecret, setShowSecret] = useState(false)

    const load = async () => {
        setLoading(true)
        try { setWebhooks(await fetchWebhooks()) }
        catch { toast.error('Error al cargar webhooks') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }))

    const handleCreate = async () => {
        if (!form.url.trim()) return toast.error('La URL es obligatoria')
        try { new URL(form.url) } catch { return toast.error('URL inválida') }

        setSaving(true)
        try {
            const res = await createWebhook({
                url:        form.url.trim(),
                collection: form.collection || '*',
                event:      form.event      || '*',
                secret:     form.secret.trim() || undefined,
            })
            setWebhooks(ws => [...ws, res.webhook ?? res])
            if (form.secret.trim()) {
                setNewSecret(form.secret.trim())
            }
            setForm(EMPTY_FORM)
            setShowForm(false)
            toast.success('Webhook creado')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleToggle = async (wh: any) => {
        try {
            const res = await updateWebhook(wh.id, { enabled: !wh.enabled })
            setWebhooks(ws => ws.map(w => w.id === wh.id ? { ...w, enabled: !w.enabled } : w))
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        }
    }

    const handleDelete = async (wh: any) => {
        if (!confirm(`¿Eliminar el webhook para ${wh.url}?`)) return
        try {
            await deleteWebhook(wh.id)
            setWebhooks(ws => ws.filter(w => w.id !== wh.id))
            toast.success('Webhook eliminado')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        }
    }

    const copy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copiado')
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                        <Webhook className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[var(--fg-primary)]">Webhooks</h1>
                        <p className="text-xs text-[var(--fg-tertiary)]">Notificaciones HTTP en tiempo real cuando cambian tus datos</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={load} disabled={loading}
                        className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition-all">
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                    <button onClick={() => { setShowForm(true); setNewSecret(null) }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--bg-tertiary)] transition-all">
                        <Plus className="w-4 h-4" /> Nuevo webhook
                    </button>
                </div>
            </div>

            {/* Secret reveal banner (solo aparece una vez al crear) */}
            {newSecret && (
                <div className="flex items-start gap-3 p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amber-800">Guardá este secret ahora — no se volverá a mostrar</p>
                        <div className="flex items-center gap-2 mt-2">
                            <code className="flex-1 bg-[var(--bg-primary)] border border-amber-800/40 rounded-lg px-3 py-2 text-xs font-mono text-[var(--fg-primary)] truncate">
                                {showSecret ? newSecret : '•'.repeat(newSecret.length)}
                            </code>
                            <button onClick={() => setShowSecret(v => !v)}
                                className="p-2 border border-amber-800/40 bg-[var(--bg-tertiary)] rounded-lg text-amber-400 hover:bg-amber-950/20 transition-all">
                                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => copy(newSecret)}
                                className="p-2 border border-amber-800/40 bg-[var(--bg-tertiary)] rounded-lg text-amber-400 hover:bg-amber-950/20 transition-all">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <button onClick={() => setNewSecret(null)} className="text-amber-400 hover:text-amber-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Create form */}
            {showForm && (
                <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-[var(--fg-primary)]">Nuevo webhook</h3>
                        <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-[var(--bg-secondary)] rounded-lg transition-all">
                            <X className="w-4 h-4 text-[var(--fg-tertiary)]" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--fg-secondary)]">URL de destino <span className="text-red-400">*</span></label>
                            <input type="url" value={form.url} onChange={e => set('url', e.target.value)}
                                placeholder="https://miapp.com/webhooks/matebase"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--fg-primary)] focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--fg-secondary)]">Colección</label>
                            <select value={form.collection} onChange={e => set('collection', e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-[var(--accent)] outline-none transition-all">
                                <option value="*">* (todas)</option>
                                {collections.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--fg-secondary)]">Evento</label>
                            <select value={form.event} onChange={e => set('event', e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-[var(--accent)] outline-none transition-all">
                                {EVENTS.map(ev => <option key={ev.value} value={ev.value}>{ev.label}</option>)}
                            </select>
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--fg-secondary)]">
                                Secret <span className="font-normal text-[var(--fg-tertiary)]">(opcional — para verificar la firma HMAC-SHA256)</span>
                            </label>
                            <input type="text" value={form.secret} onChange={e => set('secret', e.target.value)}
                                placeholder="mi-secret-seguro"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--fg-primary)] focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] outline-none transition-all" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={() => setShowForm(false)}
                            className="px-4 py-2.5 border border-[var(--border)] text-[var(--fg-secondary)] text-sm font-semibold rounded-xl hover:bg-[var(--bg-secondary)] transition-all">
                            Cancelar
                        </button>
                        <button onClick={handleCreate} disabled={saving}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50">
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Crear webhook
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
                </div>
            ) : webhooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-[var(--bg-tertiary)] rounded-xl border border-dashed border-[var(--border)]">
                    <Webhook className="w-10 h-10 text-[var(--fg-tertiary)] mb-3" />
                    <p className="text-sm text-[var(--fg-tertiary)] font-medium">Sin webhooks configurados</p>
                    <p className="text-xs text-[var(--fg-tertiary)] mt-1">Creá uno para recibir notificaciones cuando cambian tus datos</p>
                </div>
            ) : (
                <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
                    {webhooks.map(wh => (
                        <div key={wh.id} className="group flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
                            {/* Toggle */}
                            <button onClick={() => handleToggle(wh)}
                                className={cn("w-2 h-2 rounded-full shrink-0 transition-colors",
                                    wh.enabled ? "bg-emerald-400" : "bg-slate-300")}
                                title={wh.enabled ? 'Activo — clic para desactivar' : 'Inactivo — clic para activar'}
                            />

                            {/* Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <p className="text-sm font-mono text-[var(--fg-primary)] truncate">{wh.url}</p>
                                <div className="flex items-center gap-2">
                                    <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border", EVENT_COLORS[wh.event] ?? EVENT_COLORS['*'])}>
                                        {wh.event}
                                    </span>
                                    <span className="text-[9px] font-mono text-[var(--fg-tertiary)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                                        {wh.collection === '*' ? 'todas las colecciones' : wh.collection}
                                    </span>
                                    {wh.secret && (
                                        <span className="text-[9px] text-[var(--fg-tertiary)] flex items-center gap-1">
                                            🔒 con secret
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Status + actions */}
                            <div className="flex items-center gap-3 shrink-0">
                                <span className={cn("text-[9px] font-bold uppercase px-2 py-1 rounded-lg border",
                                    wh.enabled
                                        ? "bg-emerald-950/20 text-emerald-400 border-emerald-800/40"
                                        : "bg-[var(--bg-secondary)] text-[var(--fg-tertiary)] border-[var(--border)]")}>
                                    {wh.enabled ? 'Activo' : 'Inactivo'}
                                </span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(wh)}
                                        className="p-2 rounded-xl hover:bg-red-950/20 text-[var(--fg-tertiary)] hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Docs hint */}
            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] text-xs text-[var(--fg-secondary)] space-y-2">
                <p className="font-semibold text-[var(--fg-secondary)]">Formato del payload enviado a tu endpoint:</p>
                <pre className="bg-[var(--bg-tertiary)] text-emerald-400 rounded-lg p-3 text-[10px] overflow-x-auto">{`{
  "event": "record.created",
  "collection": "posts",
  "record": { "id": "...", "data": { ... }, "created_at": "..." },
  "timestamp": "2024-01-01T00:00:00Z"
}`}</pre>
                <p>Si configuraste un secret, el header <code className="bg-[var(--bg-secondary)] px-1 rounded font-mono">X-Matecito-Signature</code> contiene <code className="bg-[var(--bg-secondary)] px-1 rounded font-mono">sha256=HMAC(secret, body)</code></p>
            </div>
        </div>
    )
}
