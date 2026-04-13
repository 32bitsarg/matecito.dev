'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
    Settings, Save, RefreshCw, Copy, Eye, EyeOff, Check,
    Shield, HardDrive, Globe, KeyRound, AlertTriangle,
    Lock, Unlock, Users, Key, Filter, Plus, Trash2,
    Sparkles, ArrowRight, Database, Loader2, ChevronDown,
    Workflow, BarChart3, FileText, Zap, Bot, X,
} from 'lucide-react'

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'general',    label: 'General',    icon: Settings },
    { id: 'apikeys',    label: 'API Keys',   icon: KeyRound },
    { id: 'permisos',   label: 'Permisos',   icon: Shield },
    { id: 'conexion',   label: 'Conexión',   icon: Globe },
    { id: 'migracion',  label: 'Migrar a v2', icon: Sparkles },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border)]">
                <Icon className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-semibold text-[var(--fg-primary)]">{title}</h2>
            </div>
            <div className="p-5 flex flex-col gap-4">{children}</div>
        </div>
    )
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-8">
            <div>
                <p className="text-sm text-[var(--fg-secondary)] font-medium">{label}</p>
                {desc && <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">{desc}</p>}
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!checked)}
            style={{ width: 40, height: 22, borderRadius: 11 }}
            className={cn("relative transition-colors", checked ? "bg-[var(--accent)]" : "bg-white/10")}>
            <span className={cn("absolute top-[2px] left-[2px] rounded-full bg-white shadow transition-transform")}
                style={{ width: 18, height: 18, transform: checked ? 'translateX(18px)' : 'translateX(0)' }} />
        </button>
    )
}

function CopyBtn({ value, field, copiedField, onCopy }: { value: string; field: string; copiedField: string | null; onCopy: (v: string, f: string) => void }) {
    return (
        <button onClick={() => onCopy(value, field)} className="text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition">
            {copiedField === field ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    )
}

// ─── TAB: General ─────────────────────────────────────────────────────────────

function TabGeneral() {
    const { fetchProjectSettings, updateProjectSettings, project } = useProject()
    const [settings, setSettings] = useState<any>(null)
    const [loading,  setLoading]  = useState(true)
    const [saving,   setSaving]   = useState(false)
    const [sqlEnabled,  setSqlEnabled]  = useState(false)
    const [storageMb,   setStorageMb]   = useState('250')
    const [logDays,     setLogDays]     = useState('30')
    const [allowedOrigins, setAllowedOrigins] = useState('')
    const [llmsPublic,  setLlmsPublic]  = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        try {
            const res = await fetchProjectSettings()
            const s = res.settings ?? res
            setSettings(s)
            setSqlEnabled(s.sql_enabled ?? false)
            setStorageMb(String(s.storage_quota_mb ?? 250))
            setLogDays(String(s.log_retention_days ?? 30))
            setAllowedOrigins((s.allowed_origins ?? []).join('\n'))
            setLlmsPublic(s.llms_txt_public ?? false)
        } catch (err: any) { toast.error(err.message) }
        finally { setLoading(false) }
    }

    async function save() {
        setSaving(true)
        try {
            const origins = allowedOrigins.split('\n').map(o => o.trim()).filter(Boolean)
            await updateProjectSettings({
                sql_enabled: sqlEnabled,
                storage_quota_mb: parseInt(storageMb) || 250,
                log_retention_days: parseInt(logDays) || 30,
                allowed_origins: origins.length ? origins : null,
                llms_txt_public: llmsPublic,
            })
            toast.success('Settings guardados')
        } catch (err: any) { toast.error(err.message) }
        finally { setSaving(false) }
    }

    function copy(value: string, field: string) {
        navigator.clipboard.writeText(value)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    if (loading) return <div className="flex h-40 items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" /></div>

    const subdomain = settings?.subdomain ?? project?.subdomain ?? '—'
    const projectUrl = subdomain !== '—' ? `https://${subdomain}.matecito.dev` : '—'

    return (
        <div className="flex flex-col gap-5 max-w-xl">
            <Section title="Proyecto" icon={Globe}>
                <Row label="Nombre">
                    <span className="text-sm text-[var(--fg-tertiary)]">{settings?.name ?? '—'}</span>
                </Row>
                <Row label="URL">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-[var(--fg-tertiary)]">{projectUrl}</span>
                        {projectUrl !== '—' && <CopyBtn value={projectUrl} field="url" copiedField={copiedField} onCopy={copy} />}
                    </div>
                </Row>
                <Row label="Project ID">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--fg-tertiary)] truncate max-w-[180px]">{settings?.id ?? '—'}</span>
                        {settings?.id && <CopyBtn value={settings.id} field="id" copiedField={copiedField} onCopy={copy} />}
                    </div>
                </Row>
            </Section>

            <Section title="Features" icon={Zap}>
                <Row label="SQL Editor" desc="Permite ejecutar SQL crudo contra el schema del proyecto">
                    <Toggle checked={sqlEnabled} onChange={setSqlEnabled} />
                </Row>
                <Row label="llms.txt público" desc="Expone /llms.txt con la estructura del proyecto para LLMs">
                    <Toggle checked={llmsPublic} onChange={setLlmsPublic} />
                </Row>
            </Section>

            <Section title="Storage & Logs" icon={HardDrive}>
                <Row label="Storage quota" desc="Límite de almacenamiento de archivos">
                    <div className="flex items-center gap-2">
                        <input type="number" value={storageMb} onChange={e => setStorageMb(e.target.value)}
                            min={10} max={50000} placeholder="250"
                            className="w-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--fg-primary)] focus:outline-none focus:border-[var(--accent)] transition" />
                        <span className="text-xs text-[var(--fg-tertiary)]">MB</span>
                    </div>
                </Row>
                <Row label="Retención de logs" desc="Días que se guardan los logs">
                    <div className="flex items-center gap-2">
                        <input type="number" value={logDays} onChange={e => setLogDays(e.target.value)}
                            min={1} max={365} placeholder="30"
                            className="w-24 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--fg-primary)] focus:outline-none focus:border-[var(--accent)] transition" />
                        <span className="text-xs text-[var(--fg-tertiary)]">días</span>
                    </div>
                </Row>
            </Section>

            <Section title="CORS — Orígenes permitidos" icon={Shield}>
                <p className="text-xs text-[var(--fg-tertiary)] -mt-1">
                    Un origen por línea (ej: <span className="font-mono text-[var(--fg-secondary)]">https://miapp.com</span>).
                    Vacío = permite cualquier origen.
                </p>
                <textarea value={allowedOrigins} onChange={e => setAllowedOrigins(e.target.value)}
                    placeholder={'https://miapp.com\nhttps://staging.miapp.com'} rows={4}
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--fg-primary)] placeholder-[var(--fg-tertiary)] font-mono focus:outline-none focus:border-[var(--accent)] transition resize-none" />
            </Section>

            <div className="flex justify-end">
                <button onClick={save} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar cambios
                </button>
            </div>
        </div>
    )
}

// ─── TAB: API Keys ────────────────────────────────────────────────────────────

function TabApiKeys() {
    const { fetchProjectSettings, regenerateApiKey, fetchApiKeys, createApiKey, revokeApiKey, project } = useProject()
    const [settings,     setSettings]     = useState<any>(null)
    const [customKeys,   setCustomKeys]   = useState<any[]>([])
    const [loading,      setLoading]      = useState(true)
    const [showService,  setShowService]  = useState(false)
    const [regenerating, setRegenerating] = useState(false)
    const [creating,     setCreating]     = useState(false)
    const [copiedField,  setCopiedField]  = useState<string | null>(null)

    useEffect(() => { load() }, [])

    async function load() {
        setLoading(true)
        try {
            const [res, keys] = await Promise.all([fetchProjectSettings(), fetchApiKeys()])
            setSettings(res.settings ?? res)
            setCustomKeys(keys)
        } catch (err: any) { toast.error(err.message) }
        finally { setLoading(false) }
    }

    async function handleRegenerate() {
        if (!confirm('¿Regenerar las API keys? Las keys actuales dejarán de funcionar.')) return
        setRegenerating(true)
        try {
            await regenerateApiKey()
            toast.success('API keys regeneradas')
            load()
        } catch (err: any) { toast.error(err.message) }
        finally { setRegenerating(false) }
    }

    async function handleCreate() {
        setCreating(true)
        try {
            const res = await createApiKey()
            toast.success('API key creada')
            setCustomKeys(k => [...k, res.key ?? res])
        } catch (err: any) { toast.error(err.message) }
        finally { setCreating(false) }
    }

    async function handleRevoke(id: string) {
        if (!confirm('¿Revocar esta API key?')) return
        try {
            await revokeApiKey(id)
            setCustomKeys(k => k.filter(key => key.id !== id))
            toast.success('Key revocada')
        } catch (err: any) { toast.error(err.message) }
    }

    function copy(value: string, field: string) {
        navigator.clipboard.writeText(value)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    if (loading) return <div className="flex h-40 items-center justify-center"><div className="h-7 w-7 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" /></div>

    const anonKey    = project?.anon_key    ?? settings?.anon_key    ?? '—'
    const serviceKey = project?.service_key ?? settings?.service_key ?? '—'

    return (
        <div className="flex flex-col gap-5 max-w-xl">
            <Section title="Keys del proyecto" icon={KeyRound}>
                <Row label="Anon Key" desc="Para uso público en el cliente">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--fg-tertiary)] max-w-[200px] truncate">{anonKey}</span>
                        <CopyBtn value={anonKey} field="anon" copiedField={copiedField} onCopy={copy} />
                    </div>
                </Row>
                <Row label="Service Key" desc="Solo servidor — nunca la expongas en el cliente">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--fg-tertiary)] max-w-[200px] truncate">
                            {showService ? serviceKey : '•'.repeat(Math.min(28, serviceKey.length))}
                        </span>
                        <button onClick={() => setShowService(v => !v)} className="text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition">
                            {showService ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <CopyBtn value={serviceKey} field="service" copiedField={copiedField} onCopy={copy} />
                    </div>
                </Row>
                <div className="pt-1 border-t border-[var(--border)] flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--fg-secondary)]">Regenerar keys</p>
                        <p className="text-xs text-red-400/80 mt-0.5 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Las keys actuales dejarán de funcionar
                        </p>
                    </div>
                    <button onClick={handleRegenerate} disabled={regenerating}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/10 transition disabled:opacity-50">
                        <RefreshCw className={cn("w-3.5 h-3.5", regenerating && "animate-spin")} />
                        Regenerar
                    </button>
                </div>
            </Section>

            <Section title="Keys adicionales" icon={Key}>
                <p className="text-xs text-[var(--fg-tertiary)] -mt-1">Keys con scopes limitados para uso específico.</p>
                <div className="flex flex-col gap-2">
                    {customKeys.length === 0 && (
                        <p className="text-xs text-[var(--fg-tertiary)] py-2">No hay keys adicionales.</p>
                    )}
                    {customKeys.map(k => (
                        <div key={k.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-xs font-mono text-[var(--fg-secondary)] truncate max-w-[220px]">{k.key ?? k.id}</span>
                                {k.scopes && <span className="text-[10px] text-[var(--fg-tertiary)] shrink-0">{k.scopes.join(', ')}</span>}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <CopyBtn value={k.key ?? k.id} field={`custom-${k.id}`} copiedField={copiedField} onCopy={copy} />
                                <button onClick={() => handleRevoke(k.id)} className="text-red-400/60 hover:text-red-400 transition">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleCreate} disabled={creating}
                    className="flex items-center gap-2 self-start px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg-secondary)] text-xs font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition disabled:opacity-50">
                    {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    Nueva key
                </button>
            </Section>
        </div>
    )
}

// ─── TAB: Permisos ────────────────────────────────────────────────────────────

const OPERATIONS = [
    { key: 'list',   label: 'Listar',     desc: 'GET /records' },
    { key: 'get',    label: 'Leer uno',   desc: 'GET /records/:id' },
    { key: 'create', label: 'Crear',      desc: 'POST /records' },
    { key: 'update', label: 'Actualizar', desc: 'PATCH /records/:id' },
    { key: 'delete', label: 'Eliminar',   desc: 'DELETE /records/:id' },
]

const ACCESS_OPTIONS = [
    { value: 'public',  label: 'Público',    icon: Unlock, color: 'text-red-400',              bg: 'bg-red-950/20',              border: 'border-red-800/40',              desc: 'Sin auth' },
    { value: 'auth',    label: 'Auth',        icon: Users,  color: 'text-blue-400',             bg: 'bg-blue-950/20',             border: 'border-blue-800/40',             desc: 'Logueados' },
    { value: 'service', label: 'Service',     icon: Key,    color: 'text-amber-400',            bg: 'bg-amber-950/20',            border: 'border-amber-800/40',            desc: 'Server-side' },
    { value: 'nobody',  label: 'Bloqueado',   icon: Lock,   color: 'text-[var(--fg-tertiary)]', bg: 'bg-[var(--bg-secondary)]',   border: 'border-[var(--border)]',         desc: 'Deshabilitado' },
]

type OpPerm = { access: string; filter_rule: string | null }

function defaultPerms(): Record<string, OpPerm> {
    return Object.fromEntries(OPERATIONS.map(o => [o.key, { access: 'auth', filter_rule: null }]))
}

function TabPermisos() {
    const { collections, fetchPermissions, savePermissions } = useProject()
    const [perms,       setPerms]       = useState<Record<string, Record<string, OpPerm>>>({})
    const [selectedCol, setSelectedCol] = useState('')
    const [localPerms,  setLocalPerms]  = useState<Record<string, OpPerm>>(defaultPerms())
    const [loading,     setLoading]     = useState(false)
    const [saving,      setSaving]      = useState(false)

    useEffect(() => { if (collections.length > 0) load() }, [collections.length])

    async function load() {
        setLoading(true)
        try {
            const res = await fetchPermissions()
            const normalized: Record<string, Record<string, OpPerm>> = {}
            for (const [col, ops] of Object.entries(res.permissions ?? {})) {
                normalized[col] = {}
                for (const [op, val] of Object.entries(ops as any)) {
                    normalized[col][op] = typeof val === 'string'
                        ? { access: val, filter_rule: null }
                        : { access: (val as any).access ?? 'auth', filter_rule: (val as any).filter_rule ?? null }
                }
            }
            setPerms(normalized)
            if (!selectedCol && collections.length > 0) {
                const first = collections[0].name
                setSelectedCol(first)
                setLocalPerms(normalized[first] ?? defaultPerms())
            }
        } catch (err: any) { toast.error(err.message) }
        finally { setLoading(false) }
    }

    function selectCol(name: string) {
        setSelectedCol(name)
        setLocalPerms(perms[name] ?? defaultPerms())
    }

    async function handleSave() {
        if (!selectedCol) return
        setSaving(true)
        try {
            await savePermissions(selectedCol, localPerms)
            setPerms(p => ({ ...p, [selectedCol]: localPerms }))
            toast.success(`Permisos guardados para "${selectedCol}"`)
        } catch (err: any) { toast.error(err.message) }
        finally { setSaving(false) }
    }

    return (
        <div className="flex gap-5">
            {/* Collection list */}
            <div className="w-48 shrink-0">
                <p className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-widest px-1 mb-2">Colecciones</p>
                <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] p-1.5 space-y-0.5">
                    {loading ? (
                        <div className="p-4 text-center text-xs text-[var(--fg-tertiary)]">Cargando...</div>
                    ) : collections.length === 0 ? (
                        <div className="p-4 text-center text-xs text-[var(--fg-tertiary)]">Sin colecciones</div>
                    ) : collections.map(col => {
                        const hasPublic = Object.values(perms[col.name] ?? {}).some((p: any) => p.access === 'public')
                        return (
                            <button key={col.name} onClick={() => selectCol(col.name)}
                                className={cn("w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                    selectedCol === col.name
                                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                                        : "text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]")}>
                                <span className="truncate">{col.name}</span>
                                {hasPublic && <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 min-w-0">
                {!selectedCol ? (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]">
                        <p className="text-sm text-[var(--fg-tertiary)]">Seleccioná una colección</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-[var(--border)] flex items-center justify-between">
                            <p className="font-semibold text-sm text-[var(--fg-primary)]">
                                <span className="text-[var(--accent)] font-mono">{selectedCol}</span>
                            </p>
                            <button onClick={handleSave} disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50">
                                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Guardar
                            </button>
                        </div>
                        <div className="p-4 space-y-3">
                            {OPERATIONS.map(op => {
                                const current = localPerms[op.key] ?? { access: 'auth', filter_rule: null }
                                const meta = ACCESS_OPTIONS.find(o => o.value === current.access) ?? ACCESS_OPTIONS[1]
                                const MetaIcon = meta.icon
                                return (
                                    <div key={op.key} className="space-y-1.5">
                                        <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                                            <div className="flex items-center gap-2.5">
                                                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", meta.bg)}>
                                                    <MetaIcon className={cn("w-3.5 h-3.5", meta.color)} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--fg-primary)]">{op.label}</p>
                                                    <p className="text-[10px] font-mono text-[var(--fg-tertiary)]">{op.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {ACCESS_OPTIONS.map(opt => {
                                                    const OptIcon = opt.icon
                                                    return (
                                                        <button key={opt.value} onClick={() => setLocalPerms(p => ({ ...p, [op.key]: { ...p[op.key], access: opt.value, filter_rule: opt.value === 'auth' ? p[op.key]?.filter_rule ?? null : null } }))}
                                                            title={`${opt.label} — ${opt.desc}`}
                                                            className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border transition-all",
                                                                current.access === opt.value
                                                                    ? `${opt.bg} ${opt.color} ${opt.border}`
                                                                    : "bg-[var(--bg-primary)] text-[var(--fg-tertiary)] border-[var(--border)] hover:border-slate-600/50")}>
                                                            <OptIcon className="w-3 h-3" />
                                                            <span className="hidden lg:inline">{opt.label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        {current.access === 'auth' && (
                                            <div className="ml-3 flex items-center gap-2">
                                                <Filter className="w-3 h-3 text-blue-400 shrink-0" />
                                                <input type="text" value={current.filter_rule ?? ''}
                                                    onChange={e => setLocalPerms(p => ({ ...p, [op.key]: { ...p[op.key], filter_rule: e.target.value || null } }))}
                                                    placeholder="Filtro RLS opcional: ej. owner_id:{{auth.id}}"
                                                    className="flex-1 bg-blue-950/20 border border-blue-800/40 rounded-lg px-3 py-1.5 text-xs font-mono text-blue-300 placeholder:text-blue-900 focus:outline-none transition" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── TAB: Conexión ────────────────────────────────────────────────────────────

function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)
    function copy() {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
    return (
        <div className="relative rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] overflow-hidden">
            <button onClick={copy} className="absolute top-2 right-2 p-1.5 rounded text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition">
                {copied ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="p-4 text-xs font-mono text-[var(--fg-secondary)] overflow-x-auto whitespace-pre">{code}</pre>
        </div>
    )
}

function TabConexion() {
    const { project, fetchProjectSettings } = useProject()
    const [settings,  setSettings]  = useState<any>(null)
    const [lang,      setLang]      = useState<'js' | 'flutter'>('js')

    useEffect(() => {
        fetchProjectSettings().then(res => setSettings(res.settings ?? res)).catch(() => {})
    }, [])

    const subdomain  = settings?.subdomain ?? project?.subdomain ?? 'tu-proyecto'
    const anonKey    = project?.anon_key    ?? settings?.anon_key    ?? 'tu-anon-key'
    const serviceKey = project?.service_key ?? settings?.service_key ?? 'tu-service-key'
    const url        = `https://${subdomain}.matecito.dev`

    const snippets: Record<string, Record<'js' | 'flutter', string>> = {
        install: {
            js:      `npm install matecitodb`,
            flutter: `# pubspec.yaml\ndependencies:\n  matecitodb_flutter: ^4.0.1`,
        },
        init: {
            js:      `import { createClient } from 'matecitodb'\n\nconst db = createClient('${url}', {\n  apiKey: '${anonKey}',\n  apiVersion: 'v2',\n})\n\n// Admin (solo servidor)\nconst dbAdmin = createClient('${url}', {\n  apiKey: '${serviceKey}',\n  apiVersion: 'v2',\n})`,
            flutter: `import 'package:matecitodb_flutter/matecitodb.dart';\n\nfinal db = MatecitoDB.createClient(\n  '${url}',\n  config: const ClientConfig(\n    apiKey: '${anonKey}',\n    apiVersion: 'v2',\n  ),\n);\nawait db.auth.sessionReady;`,
        },
        data: {
            js:      `// Leer\nconst { data } = await db.from('posts').get()\n\n// Filtrar\nconst { data } = await db.from('posts')\n  .eq('published', true)\n  .orderBy('created_at', 'desc')\n  .limit(20)\n  .get()\n\n// Crear\nawait db.from('posts').insert({ title: 'Hola', published: true })\n\n// Actualizar\nawait db.from('posts').update(id, { title: 'Actualizado' })\n\n// Eliminar\nawait db.from('posts').delete().execute()`,
            flutter: `// Leer\nfinal res = await db.from('posts').get();\n\n// Crear\nawait db.from('posts').insert({'title': 'Hola'});\n\n// Actualizar\nawait db.from('posts').update(id, {'title': 'Actualizado'});\n\n// Eliminar\nawait db.from('posts').eq('id', id).delete().execute();`,
        },
        auth: {
            js:      `await db.auth.signUp('user@email.com', 'password')\nawait db.auth.signIn('user@email.com', 'password')\nconst { data: user } = await db.auth.getMe()\nawait db.auth.signOut()`,
            flutter: `await db.auth.signUp('user@email.com', 'password');\nawait db.auth.signIn('user@email.com', 'password');\ndb.auth.authStateStream.listen((user) => print(user?.email));\nawait db.auth.signOut();`,
        },
        realtime: {
            js:      `const unsub = db.realtime.subscribe('posts', (event) => {\n  console.log(event.type, event.record) // INSERT | UPDATE | DELETE\n})\n\nunsub() // desuscribirse`,
            flutter: `final sub = db.realtime.subscribe('posts', (event) {\n  print('\${event.type}: \${event.record}');\n});\nawait sub.cancel();`,
        },
        storage: {
            js:      `// Subir\nconst { data: file } = await db.storage.upload(imageFile)\n\n// Listar\nconst { data: files } = await db.storage.list()\n\n// URL firmada\nconst { data: url } = await db.storage.getSignedUrl(file.id)\n\n// Eliminar\nawait db.storage.delete(file.id)`,
            flutter: `final result = await db.storage.upload(file);\nfinal files  = await db.storage.list();\nfinal url    = await db.storage.getSignedUrl(result.data!.id);\nawait db.storage.delete(result.data!.id);`,
        },
    }

    const labels: Record<string, string> = {
        install:  'Instalación',
        init:     'Inicialización',
        data:     'Base de datos',
        auth:     'Auth',
        realtime: 'Realtime',
        storage:  'Storage',
    }

    return (
        <div className="flex flex-col gap-5 max-w-2xl">
            {/* Lang switch */}
            <div className="flex gap-1 self-start p-1 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)]">
                {(['js', 'flutter'] as const).map(l => (
                    <button key={l} onClick={() => setLang(l)}
                        className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition",
                            lang === l ? "bg-[var(--accent)] text-white" : "text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]")}>
                        {l === 'js' ? 'JavaScript / TS' : 'Flutter / Dart'}
                    </button>
                ))}
            </div>

            {Object.entries(snippets).map(([key, snip]) => (
                <div key={key}>
                    <p className="text-xs font-semibold text-[var(--fg-tertiary)] uppercase tracking-widest mb-2">{labels[key]}</p>
                    <CodeBlock code={snip[lang]} />
                </div>
            ))}
        </div>
    )
}

// ─── TAB: Migración ───────────────────────────────────────────────────────────

const V2_FEATURES = [
    { icon: <Workflow className="w-4 h-4" />, title: 'Functions',     desc: 'JS serverless con crons y triggers' },
    { icon: <BarChart3 className="w-4 h-4" />, title: 'Analytics',   desc: 'Eventos, funnels de conversión' },
    { icon: <Sparkles className="w-4 h-4" />, title: 'AI Gateway',   desc: 'Proxy a OpenAI, Anthropic, Groq' },
    { icon: <FileText className="w-4 h-4" />, title: 'Remote Config', desc: 'Feature flags dinámicos' },
    { icon: <Zap className="w-4 h-4" />,      title: 'Filtros v2',   desc: 'between, isNull, OR, full-text' },
    { icon: <Bot className="w-4 h-4" />,      title: 'MCP Agents',   desc: 'Claude Code y Cursor a tus datos' },
]

function TabMigracion() {
    const { project } = useProject()
    const { projects } = useWorkspace()
    const [confirmed,  setConfirmed]  = useState(false)
    const [migrating,  setMigrating]  = useState(false)
    const [showPaths,  setShowPaths]  = useState(false)

    const isV2 = (project as any)?.api_version === 'v2'

    async function handleMigrate() {
        if (!confirmed || !project) return
        setMigrating(true)
        try {
            await api.post(`/api/v1/platform/migrate-v2/${project.id}`, {})
            toast.success('Proyecto migrado a v2 🎉')
            window.location.reload()
        } catch (err: any) { toast.error(err.message) }
        finally { setMigrating(false) }
    }

    if (isV2) return (
        <div className="flex items-center gap-3 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] max-w-lg">
            <Check className="w-5 h-5 text-[var(--accent)] shrink-0" />
            <div>
                <p className="text-sm font-semibold text-[var(--fg-primary)]">Ya estás en API v2</p>
                <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">Este proyecto usa la última versión de la API.</p>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-5 max-w-xl">
            {/* Features grid */}
            <div className="grid grid-cols-2 gap-3">
                {V2_FEATURES.map(f => (
                    <div key={f.title} className="flex gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--accent-soft)] text-[var(--accent)]">
                            {f.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[var(--fg-primary)]">{f.title}</p>
                            <p className="text-xs text-[var(--fg-tertiary)]">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Warning */}
            <div className="flex gap-3 p-4 rounded-xl border border-amber-800/40 bg-amber-950/20">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-300 space-y-1">
                    <p className="font-semibold">Acción irreversible</p>
                    <p>Tus datos están seguros. Solo cambian la versión de API y los paths de los endpoints.</p>
                </div>
            </div>

            {/* Path changes */}
            <button onClick={() => setShowPaths(v => !v)}
                className="flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition">
                <span>Ver cambios de rutas y SDK</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", showPaths && "rotate-180")} />
            </button>
            {showPaths && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 space-y-2 -mt-3">
                    {[
                        { old: "import from 'matecito'", new: "import { createClient } from 'matecitodb'" },
                        { old: "db.collection('x').find()", new: "db.from('x').get()" },
                        { old: '/api/v1/PROJECT_ID/records', new: '/api/v2/project/ws' },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-xs">
                            <span className="text-red-400 line-through opacity-70 flex-1 truncate">{p.old}</span>
                            <ArrowRight className="w-3 h-3 text-[var(--fg-tertiary)] shrink-0" />
                            <span className="text-emerald-400 flex-1 truncate">{p.new}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirm + button */}
            <div className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                <input type="checkbox" id="confirm-migrate" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded" />
                <label htmlFor="confirm-migrate" className="text-sm text-[var(--fg-secondary)] cursor-pointer">
                    Entiendo que esta acción es <strong>irreversible</strong>.
                </label>
            </div>

            <button onClick={handleMigrate} disabled={!confirmed || migrating}
                className="flex items-center gap-2 self-start px-5 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-40">
                {migrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Migrar a API v2
            </button>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const { project } = useProject()
    const [activeTab, setActiveTab] = useState('general')

    const isV2 = (project as any)?.api_version === 'v2'
    const tabs = TABS.filter(t => t.id !== 'migracion' || !isV2)

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-xl font-bold text-[var(--fg-primary)]">Ajustes</h1>
                <p className="text-sm text-[var(--fg-tertiary)] mt-0.5">Configuración del proyecto</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[var(--border)]">
                {tabs.map(tab => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={cn("relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition whitespace-nowrap",
                                isActive ? "text-[var(--fg-primary)]" : "text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]")}>
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                            {isActive && <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full bg-[var(--accent)]" />}
                        </button>
                    )
                })}
            </div>

            {/* Tab content */}
            <div>
                {activeTab === 'general'   && <TabGeneral />}
                {activeTab === 'apikeys'   && <TabApiKeys />}
                {activeTab === 'permisos'  && <TabPermisos />}
                {activeTab === 'conexion'  && <TabConexion />}
                {activeTab === 'migracion' && <TabMigracion />}
            </div>
        </div>
    )
}
