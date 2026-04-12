'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Settings, Lock, Save, RefreshCw, Eye, EyeOff, Copy,
    AlertTriangle, Globe, Clock, Terminal, Plus, X, Bot,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const {
        getSettings, updateSettings, regenerateApiKey, project,
        fetchProjectSettings, updateProjectSettings,
    } = useProject()

    // API keys state
    const [anonKey,    setAnonKey]    = useState('')
    const [serviceKey, setServiceKey] = useState('')
    const [showAnon,    setShowAnon]    = useState(false)
    const [showService, setShowService] = useState(false)
    const [regenerating, setRegenerating] = useState(false)

    // Project name
    const [projectName, setProjectName] = useState('')
    const [savingName,  setSavingName]  = useState(false)

    // Advanced settings
    const [logRetention,    setLogRetention]    = useState(30)
    const [sqlEnabled,      setSqlEnabled]      = useState(false)
    const [llmsTxtPublic,   setLlmsTxtPublic]   = useState(false)
    const [allowedOrigins,  setAllowedOrigins]  = useState<string[]>([])
    const [newOrigin,       setNewOrigin]       = useState('')
    const [savingSettings,  setSavingSettings]  = useState(false)
    const [loading,         setLoading]         = useState(true)

    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const [info, settings] = await Promise.all([
                    getSettings(),
                    fetchProjectSettings(),
                ])
                setProjectName(info?.project?.name || project?.name || '')
                const keys = info?.api_keys ?? []
                setAnonKey(keys.find((k: any) => k.type === 'anon')?.key || project?.anon_key || '')
                setServiceKey(keys.find((k: any) => k.type === 'service')?.key || project?.service_key || '')

                const s = settings?.settings ?? {}
                setLogRetention(s.log_retention_days ?? 30)
                setSqlEnabled(s.sql_enabled ?? false)
                setLlmsTxtPublic(s.llms_txt_public ?? false)
                setAllowedOrigins(s.allowed_origins ?? [])
            } catch { toast.error('Error al cargar configuración') }
            finally { setLoading(false) }
        })()
    }, [])

    const handleSaveName = async () => {
        if (!projectName.trim()) return toast.error('El nombre no puede estar vacío')
        setSavingName(true)
        try {
            await updateSettings({ name: projectName.trim() })
            toast.success('Nombre actualizado')
        } catch (err: any) { toast.error('Error: ' + err.message) }
        finally { setSavingName(false) }
    }

    const handleRegen = async () => {
        if (!confirm('¿Regenerar las API Keys? Las actuales dejarán de funcionar inmediatamente.')) return
        setRegenerating(true)
        try {
            const res = await regenerateApiKey()
            setAnonKey(res?.api_keys?.anon || '')
            setServiceKey(res?.api_keys?.service || '')
            toast.success('Keys regeneradas')
        } catch { toast.error('Error al regenerar') }
        finally { setRegenerating(false) }
    }

    const handleSaveSettings = async () => {
        if (logRetention < 1 || logRetention > 365)
            return toast.error('Log retention debe estar entre 1 y 365 días')
        setSavingSettings(true)
        try {
            await updateProjectSettings({
                log_retention_days: logRetention,
                sql_enabled:        sqlEnabled,
                llms_txt_public:    llmsTxtPublic,
                allowed_origins:    allowedOrigins.length > 0 ? allowedOrigins : null,
            })
            toast.success('Configuración guardada')
        } catch (err: any) { toast.error('Error: ' + err.message) }
        finally { setSavingSettings(false) }
    }

    const addOrigin = () => {
        const val = newOrigin.trim()
        if (!val) return
        if (allowedOrigins.includes(val)) return toast.error('Ya está en la lista')
        setAllowedOrigins(o => [...o, val])
        setNewOrigin('')
    }

    const removeOrigin = (o: string) => setAllowedOrigins(prev => prev.filter(x => x !== o))

    const addCurrentOrigin = () => {
        const origin = window.location.origin
        if (!allowedOrigins.includes(origin)) {
            setAllowedOrigins(o => [...o, origin])
            toast.success('Dominio actual añadido')
        }
    }

    const copy = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copiada`)
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)]" />
        </div>
    )

    return (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--fg-primary)]">Configuración</h1>
                    <p className="text-xs text-[var(--fg-tertiary)]">Ajustes del proyecto</p>
                </div>
            </div>

            {/* Project name */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6 space-y-4">
                <h3 className="font-bold text-[var(--fg-primary)]">Nombre del Proyecto</h3>
                <div className="flex gap-3">
                    <input
                        type="text" value={projectName} onChange={e => setProjectName(e.target.value)}
                        placeholder="Mi Proyecto"
                        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] outline-none transition-all"
                    />
                    <button onClick={handleSaveName} disabled={savingName}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {savingName ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Guardar
                    </button>
                </div>
            </div>

            {/* API Keys */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6 space-y-5">
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--fg-secondary)]" />
                    <h3 className="font-bold text-[var(--fg-primary)]">API Keys del Sistema</h3>
                </div>
                {[
                    { label: 'Anon Key', value: anonKey, show: showAnon, toggle: () => setShowAnon(v => !v), safe: true },
                    { label: 'Service Key', value: serviceKey, show: showService, toggle: () => setShowService(v => !v), safe: false },
                ].map(k => (
                    <div key={k.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-[var(--fg-secondary)]">{k.label}</label>
                            <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border",
                                k.safe ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200")}>
                                {k.safe ? 'Client-safe' : 'Server only'}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <input readOnly type={k.show ? 'text' : 'password'} value={k.value}
                                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--fg-secondary)] font-mono outline-none" />
                            <button onClick={k.toggle}
                                className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-all">
                                {k.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => copy(k.value, k.label)}
                                className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:border-[var(--border)] hover:bg-[var(--accent-soft)] transition-all">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
                    <div className="flex items-start gap-2 text-xs text-[var(--fg-tertiary)]">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        Regenerar invalida las keys actuales inmediatamente.
                    </div>
                    <button onClick={handleRegen} disabled={regenerating}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50 shrink-0">
                        <RefreshCw className={cn("w-3.5 h-3.5", regenerating && "animate-spin")} />
                        Regenerar
                    </button>
                </div>
            </div>

            {/* Advanced settings */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[var(--fg-primary)]">Configuración Avanzada</h3>
                    <button onClick={handleSaveSettings} disabled={savingSettings}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {savingSettings ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Guardar
                    </button>
                </div>

                {/* Log retention */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[var(--fg-tertiary)]" />
                        <label className="text-xs font-semibold text-[var(--fg-primary)]">Retención de Logs (días)</label>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="number" min={1} max={365} value={logRetention}
                            onChange={e => setLogRetention(Number(e.target.value))}
                            className="w-32 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--fg-primary)] focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] outline-none transition-all"
                        />
                        <span className="text-xs text-[var(--fg-tertiary)]">Los logs más antiguos se eliminan automáticamente</span>
                    </div>
                </div>

                {/* SQL enabled */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-[var(--fg-secondary)]" />
                        <div>
                            <p className="text-sm font-semibold text-[var(--fg-primary)]">SQL Editor</p>
                            <p className="text-xs text-[var(--fg-tertiary)]">Permite ejecutar consultas SQL directas desde el dashboard</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={sqlEnabled} onChange={e => setSqlEnabled(e.target.checked)} className="sr-only peer" />
                        <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]" />
                    </label>
                </div>

                {/* llms.txt public */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
                        <div className="flex items-center gap-3">
                            <Bot className="w-4 h-4 text-[var(--fg-secondary)]" />
                            <div>
                                <p className="text-sm font-semibold text-[var(--fg-primary)]">llms.txt público</p>
                                <p className="text-xs text-[var(--fg-tertiary)]">Permite que cualquier IA acceda al schema del proyecto sin API key</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={llmsTxtPublic} onChange={e => setLlmsTxtPublic(e.target.checked)} className="sr-only peer" />
                            <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--accent)]" />
                        </label>
                    </div>
                    {llmsTxtPublic && (
                        <div className="flex items-start gap-2 px-4 py-3 rounded-xl border"
                            style={{ backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning)' }}>
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                            <p className="text-xs" style={{ color: 'var(--warning)' }}>
                                Con esta opción activa, los nombres de tus colecciones y fields son visibles públicamente.
                                Activalo solo si el schema de tu proyecto no contiene información sensible del negocio.
                            </p>
                        </div>
                    )}
                </div>

                {/* CORS — Allowed Origins */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-[var(--fg-tertiary)]" />
                        <label className="text-xs font-semibold text-[var(--fg-primary)]">Orígenes permitidos (CORS)</label>
                    </div>
                    <p className="text-xs text-[var(--fg-tertiary)]">
                        Dejá vacío para permitir cualquier origen. Agregá dominios específicos para restringir el acceso.
                        Soporta wildcards: <code className="font-mono bg-slate-100 px-1 rounded">*.miapp.com</code>
                    </p>

                    {/* Origin list */}
                    {allowedOrigins.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {allowedOrigins.map(o => (
                                <span key={o} className="flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-soft)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--accent)]">
                                    {o}
                                    <button onClick={() => removeOrigin(o)} className="text-[var(--fg-tertiary)] hover:text-[var(--accent)] transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <input
                            type="text" value={newOrigin} onChange={e => setNewOrigin(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addOrigin()}
                            placeholder="https://miapp.com"
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs font-mono text-[var(--fg-primary)] focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] outline-none transition-all"
                        />
                        <button onClick={addCurrentOrigin}
                            title="Añadir dominio actual"
                            className="p-2.5 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)] rounded-xl hover:bg-[var(--accent-soft)] transition-all">
                            <Globe className="w-4 h-4" />
                        </button>
                        <button onClick={addOrigin}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 border border-[var(--border)] text-[var(--fg-secondary)] text-xs font-semibold rounded-xl hover:bg-slate-200 transition-all">
                            <Plus className="w-3.5 h-3.5" /> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
