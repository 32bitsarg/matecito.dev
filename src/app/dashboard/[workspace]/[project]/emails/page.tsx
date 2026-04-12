'use client'

import { useEffect, useState, useRef } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Mail, Server, Save, RefreshCw, Trash2, Eye, EyeOff,
    Send, Plus, Code, Palette, AlertTriangle, CheckCircle2,
    FileText, ChevronRight, X, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Tab type ────────────────────────────────────────────────────────────────
type Tab = 'smtp' | 'templates'

// ─── Variables disponibles ────────────────────────────────────────────────────
const TEMPLATE_VARS = [
    { key: '{{user.email}}',   desc: 'Email del usuario' },
    { key: '{{user.name}}',    desc: 'Nombre del usuario (si existe)' },
    { key: '{{project.name}}', desc: 'Nombre del proyecto' },
    { key: '{{reset_link}}',   desc: 'Link de reset de contraseña' },
    { key: '{{login_url}}',    desc: 'URL de login' },
]

// ─── SMTP Section ─────────────────────────────────────────────────────────────
function SmtpSection() {
    const { fetchSmtp, saveSmtp, deleteSmtp, testSmtp, seedEmailTemplates } = useProject()

    const [configured, setConfigured] = useState(false)
    const [loading,    setLoading]    = useState(true)
    const [saving,     setSaving]     = useState(false)
    const [testing,    setTesting]    = useState(false)
    const [showPass,   setShowPass]   = useState(false)
    const [testEmail,  setTestEmail]  = useState('')

    const [form, setForm] = useState({
        host:          '',
        port:          587,
        secure:        false,
        smtp_user:     '',
        smtp_password: '',
        from_name:     '',
        from_email:    '',
    })

    useEffect(() => {
        fetchSmtp().then(res => {
            setConfigured(res.configured)
            if (res.smtp) {
                setForm(f => ({
                    ...f,
                    host:      res.smtp.host      ?? '',
                    port:      res.smtp.port      ?? 587,
                    secure:    res.smtp.secure    ?? false,
                    smtp_user: res.smtp.smtp_user ?? '',
                    smtp_password: res.smtp.smtp_password === '***' ? '' : (res.smtp.smtp_password ?? ''),
                    from_name:  res.smtp.from_name  ?? '',
                    from_email: res.smtp.from_email ?? '',
                }))
            }
        }).catch(() => {}).finally(() => setLoading(false))
    }, [])

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

    const handleSave = async () => {
        if (!form.host || !form.smtp_user || !form.from_email)
            return toast.error('Host, usuario y from email son obligatorios')
        setSaving(true)
        try {
            await saveSmtp({ ...form, smtp_password: form.smtp_password || '***' })
            setConfigured(true)
            // Sembrar templates por defecto la primera vez
            await seedEmailTemplates().catch(() => {})
            toast.success('Configuración SMTP guardada')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('¿Eliminar la configuración SMTP?')) return
        await deleteSmtp().catch(() => {})
        setConfigured(false)
        setForm({ host: '', port: 587, secure: false, smtp_user: '', smtp_password: '', from_name: '', from_email: '' })
        toast.success('Configuración eliminada')
    }

    const handleTest = async () => {
        if (!testEmail) return toast.error('Ingresá un email de destino')
        setTesting(true)
        try {
            const res = await testSmtp(testEmail)
            toast.success(res.message ?? 'Email enviado')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setTesting(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-40">
            <RefreshCw className="w-5 h-5 animate-spin text-violet-400" />
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Status banner */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium",
                configured
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"
            )}>
                {configured
                    ? <><CheckCircle2 className="w-4 h-4 shrink-0" /> SMTP configurado y activo</>
                    : <><AlertTriangle className="w-4 h-4 shrink-0" /> Sin SMTP — el envío de emails está desactivado</>
                }
            </div>

            {/* Form */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[var(--fg-tertiary)]" />
                    <h3 className="font-bold text-[var(--fg-primary)]">Servidor SMTP</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">Host</label>
                        <input value={form.host} onChange={e => set('host', e.target.value)}
                            placeholder="smtp.gmail.com"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] font-mono focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">Puerto</label>
                        <input type="number" value={form.port} onChange={e => set('port', Number(e.target.value))}
                            placeholder="587"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] font-mono focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">Usuario</label>
                        <input value={form.smtp_user} onChange={e => set('smtp_user', e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] font-mono focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">Contraseña</label>
                        <div className="flex gap-2">
                            <input type={showPass ? 'text' : 'password'} value={form.smtp_password}
                                onChange={e => set('smtp_password', e.target.value)}
                                placeholder={configured ? '(sin cambios)' : 'App password'}
                                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] font-mono focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                            <button onClick={() => setShowPass(v => !v)}
                                className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]">
                                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">From name</label>
                        <input value={form.from_name} onChange={e => set('from_name', e.target.value)}
                            placeholder="Mi App"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">From email</label>
                        <input type="email" value={form.from_email} onChange={e => set('from_email', e.target.value)}
                            placeholder="no-reply@miapp.com"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] font-mono focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                    </div>
                </div>

                {/* SSL toggle */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                    <div>
                        <p className="text-sm font-semibold text-[var(--fg-primary)]">SSL/TLS</p>
                        <p className="text-xs text-[var(--fg-tertiary)]">Activar para puerto 465. Desactivar para 587 con STARTTLS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={form.secure} onChange={e => set('secure', e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-5 bg-[var(--border)] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[var(--bg-primary)] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]" />
                    </label>
                </div>

                <div className="flex items-center justify-between pt-2">
                    {configured && (
                        <button onClick={handleDelete}
                            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5">
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar config
                        </button>
                    )}
                    <button onClick={handleSave} disabled={saving}
                        className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar
                    </button>
                </div>
            </div>

            {/* Test email */}
            {configured && (
                <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Send className="w-4 h-4 text-[var(--fg-tertiary)]" />
                        <h3 className="font-bold text-[var(--fg-primary)]">Probar conexión</h3>
                    </div>
                    <div className="flex gap-3">
                        <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)}
                            placeholder="destino@email.com"
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                        <button onClick={handleTest} disabled={testing}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-tertiary)] text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50">
                            {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Enviar prueba
                        </button>
                    </div>
                </div>
            )}

            {/* Common providers hint */}
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] p-4 text-xs text-[var(--fg-secondary)] space-y-2">
                <p className="font-semibold text-[var(--fg-secondary)]">Configuraciones comunes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        { name: 'Gmail',     host: 'smtp.gmail.com',      port: 587, note: 'Requiere App Password con 2FA' },
                        { name: 'Outlook',   host: 'smtp.office365.com',  port: 587, note: 'STARTTLS, SSL desactivado' },
                        { name: 'Mailgun',   host: 'smtp.mailgun.org',    port: 587, note: 'Usuario: postmaster@tu-dominio' },
                    ].map(p => (
                        <button key={p.name} onClick={() => setForm(f => ({ ...f, host: p.host, port: p.port, secure: false }))}
                            className="text-left p-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl hover:border-violet-300 hover:bg-[var(--accent-soft)] transition-all">
                            <p className="font-semibold text-[var(--fg-secondary)]">{p.name}</p>
                            <p className="font-mono text-[10px] text-[var(--fg-tertiary)] mt-0.5">{p.host}:{p.port}</p>
                            <p className="text-[10px] text-[var(--fg-tertiary)] mt-0.5">{p.note}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Template Editor ──────────────────────────────────────────────────────────
function TemplateEditor({ template, onSave, onClose }: {
    template: any
    onSave: (id: string, data: any) => void
    onClose: () => void
}) {
    const [subject,   setSubject]   = useState(template.subject   ?? '')
    const [htmlBody,  setHtmlBody]  = useState<string>(template.html_body ?? '')
    const [textBody,  setTextBody]  = useState<string>(template.text_body ?? '')
    const [editorTab, setEditorTab] = useState<'html' | 'text' | 'preview'>('html')
    const [saving,    setSaving]    = useState(false)
    const { updateEmailTemplate } = useProject()

    const handleSave = async () => {
        setSaving(true)
        try {
            await updateEmailTemplate(template.id, { subject, html_body: htmlBody, text_body: textBody })
            onSave(template.id, { subject, html_body: htmlBody, text_body: textBody })
            toast.success('Template guardado')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    const insertVar = (v: string) => {
        if (editorTab === 'html') setHtmlBody((b: string) => b + v)
        if (editorTab === 'text') setTextBody((b: string) => b + v)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-tertiary)]/60 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--accent)]" />
                        <h2 className="font-bold text-[var(--fg-primary)]">{template.name}</h2>
                        {template.is_system && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] rounded">
                                Sistema
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-all">
                        <X className="w-4 h-4 text-[var(--fg-tertiary)]" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 space-y-4">
                    {/* Subject */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--fg-secondary)]">Asunto</label>
                        <input value={subject} onChange={e => setSubject(e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all" />
                    </div>

                    {/* Variables */}
                    <div className="flex flex-wrap gap-1.5">
                        {TEMPLATE_VARS.map(v => (
                            <button key={v.key} onClick={() => insertVar(v.key)}
                                title={v.desc}
                                className="text-[10px] font-mono px-2 py-1 bg-[var(--accent-soft)] border border-[var(--border)] text-violet-700 rounded-lg hover:bg-violet-100 transition-all">
                                {v.key}
                            </button>
                        ))}
                        <span className="text-[10px] text-[var(--fg-tertiary)] self-center ml-1">← clic para insertar en el editor activo</span>
                    </div>

                    {/* Editor tabs */}
                    <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
                        {(['html', 'text', 'preview'] as const).map(t => (
                            <button key={t} onClick={() => setEditorTab(t)}
                                className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                                    editorTab === t ? "bg-[var(--bg-primary)] text-[var(--fg-primary)]" : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
                                )}>
                                {t === 'html' && <Code className="w-3 h-3 inline mr-1" />}
                                {t === 'text' && <FileText className="w-3 h-3 inline mr-1" />}
                                {t === 'preview' && <Eye className="w-3 h-3 inline mr-1" />}
                                {t === 'preview' ? 'Preview' : t.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {editorTab === 'html' && (
                        <textarea value={htmlBody} onChange={e => setHtmlBody(e.target.value)}
                            rows={16}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-xs font-mono text-[var(--fg-primary)] focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all resize-y" />
                    )}
                    {editorTab === 'text' && (
                        <textarea value={textBody} onChange={e => setTextBody(e.target.value)}
                            rows={12}
                            placeholder="Versión en texto plano (fallback para clientes sin HTML)"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-xs font-mono text-[var(--fg-primary)] focus:border-violet-400 focus:bg-[var(--bg-primary)] outline-none transition-all resize-y" />
                    )}
                    {editorTab === 'preview' && (
                        <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-primary)] h-80">
                            <iframe
                                srcDoc={htmlBody}
                                className="w-full h-full"
                                title="Email preview"
                                sandbox="allow-same-origin"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-[var(--fg-secondary)] hover:text-[var(--fg-primary)] transition-all">
                        Cancelar
                    </button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Templates Section ────────────────────────────────────────────────────────
function TemplatesSection() {
    const { fetchEmailTemplates, createEmailTemplate, deleteEmailTemplate, seedEmailTemplates } = useProject()
    const [templates, setTemplates] = useState<any[]>([])
    const [loading,   setLoading]   = useState(true)
    const [editing,   setEditing]   = useState<any | null>(null)
    const [creating,  setCreating]  = useState(false)
    const [newName,   setNewName]   = useState('')

    const load = async () => {
        setLoading(true)
        try {
            setTemplates(await fetchEmailTemplates())
        } catch { toast.error('Error al cargar templates') }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleCreate = async () => {
        if (!newName.trim()) return toast.error('El nombre no puede estar vacío')
        try {
            const res = await createEmailTemplate({
                name:      newName.trim(),
                subject:   `Asunto para ${newName.trim()}`,
                html_body: `<p>Hola {{user.email}},</p><p>Contenido del email.</p>`,
                text_body: `Hola {{user.email}},\n\nContenido del email.`,
            })
            setTemplates(ts => [...ts, res.template])
            setNewName('')
            setCreating(false)
            setEditing(res.template)
            toast.success('Template creado')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        }
    }

    const handleDelete = async (tpl: any) => {
        if (!confirm(`¿Eliminar el template "${tpl.name}"?`)) return
        try {
            await deleteEmailTemplate(tpl.id)
            setTemplates(ts => ts.filter(t => t.id !== tpl.id))
            toast.success('Eliminado')
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const handleSeed = async () => {
        await seedEmailTemplates()
        toast.success('Templates predeterminados agregados')
        load()
    }

    return (
        <>
            {editing && (
                <TemplateEditor
                    template={editing}
                    onSave={(id, data) => {
                        setTemplates(ts => ts.map(t => t.id === id ? { ...t, ...data } : t))
                        setEditing(null)
                    }}
                    onClose={() => setEditing(null)}
                />
            )}

            <div className="space-y-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--fg-secondary)]">{templates.length} template{templates.length !== 1 ? 's' : ''}</p>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSeed}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--fg-secondary)] text-xs font-semibold rounded-xl hover:bg-slate-200 transition-all">
                            <Sparkles className="w-3.5 h-3.5" /> Restaurar predeterminados
                        </button>
                        <button onClick={() => setCreating(true)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-all">
                            <Plus className="w-3.5 h-3.5" /> Nuevo template
                        </button>
                    </div>
                </div>

                {/* New template inline form */}
                {creating && (
                    <div className="flex gap-3 p-4 bg-[var(--accent-soft)] border border-[var(--border)] rounded-xl">
                        <input value={newName} onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleCreate()}
                            placeholder="nombre-del-template (ej: order-confirmation)"
                            className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--fg-primary)] focus:border-violet-400 outline-none transition-all" />
                        <button onClick={handleCreate}
                            className="px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all">
                            Crear
                        </button>
                        <button onClick={() => { setCreating(false); setNewName('') }}
                            className="p-2.5 border border-[var(--border)] bg-[var(--bg-primary)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* List */}
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <RefreshCw className="w-5 h-5 animate-spin text-violet-400" />
                    </div>
                ) : templates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-[var(--bg-primary)] rounded-2xl border border-dashed border-[var(--border)]">
                        <Mail className="w-10 h-10 text-[var(--fg-tertiary)] mb-3" />
                        <p className="text-sm text-[var(--fg-tertiary)] font-medium">Sin templates</p>
                        <p className="text-xs text-[var(--fg-tertiary)] mt-1">Configurá SMTP primero para generar los templates base</p>
                    </div>
                ) : (
                    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
                        {templates.map(tpl => (
                            <div key={tpl.id}
                                className="group flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
                                        tpl.is_system ? "bg-[var(--accent-soft)]" : "bg-[var(--bg-secondary)]")}>
                                        <FileText className={cn("w-4 h-4", tpl.is_system ? "text-[var(--accent)]" : "text-[var(--fg-tertiary)]")} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--fg-primary)] font-mono">{tpl.name}</p>
                                        <p className="text-xs text-[var(--fg-tertiary)] truncate max-w-sm">{tpl.subject}</p>
                                    </div>
                                    {tpl.is_system && (
                                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] rounded">
                                            Sistema
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditing(tpl)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--fg-secondary)] text-xs font-semibold rounded-lg hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all">
                                        <Code className="w-3.5 h-3.5" /> Editar
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                    {!tpl.is_system && (
                                        <button onClick={() => handleDelete(tpl)}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--fg-tertiary)] hover:text-red-500 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Variables reference */}
                <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] text-xs text-[var(--fg-secondary)] space-y-2">
                    <p className="font-semibold text-[var(--fg-secondary)]">Variables disponibles en templates:</p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {TEMPLATE_VARS.map(v => (
                            <div key={v.key} className="flex items-center gap-2">
                                <code className="font-mono bg-[var(--border)] px-1.5 py-0.5 rounded text-[10px] text-[var(--fg-primary)]">{v.key}</code>
                                <span className="text-[var(--fg-tertiary)]">{v.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmailsPage() {
    const [tab, setTab] = useState<Tab>('smtp')

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--fg-primary)]">Emails</h1>
                    <p className="text-xs text-[var(--fg-tertiary)]">Configurá tu SMTP y personalizá los templates de emails transaccionales</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-[var(--bg-secondary)] rounded-xl w-fit">
                {([
                    { id: 'smtp',      label: 'Servidor SMTP', icon: Server },
                    { id: 'templates', label: 'Templates',     icon: Palette },
                ] as const).map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            tab === t.id ? "bg-[var(--bg-primary)] text-[var(--fg-primary)]" : "text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]"
                        )}>
                        <t.icon className="w-4 h-4" />
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'smtp'      && <SmtpSection />}
            {tab === 'templates' && <TemplatesSection />}
        </div>
    )
}
