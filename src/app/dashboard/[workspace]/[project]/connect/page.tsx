'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Copy, Eye, EyeOff, Globe, Key, ShieldCheck, AlertTriangle,
    Plus, Trash2, RefreshCw, CheckSquare,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const SCOPE_OPTIONS = [
    { value: 'read',  label: 'Read',  desc: 'Solo GET/LIST',      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { value: 'write', label: 'Write', desc: 'POST/PATCH/DELETE',   color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    { value: '*',     label: 'All',   desc: 'Acceso completo',     color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200' },
]

export default function ConnectPage() {
    const { project, fetchApiKeys, createApiKey, revokeApiKey } = useProject()
    const [revealAnon,    setRevealAnon]    = useState(false)
    const [revealService, setRevealService] = useState(false)
    const [activeTab,     setActiveTab]     = useState<'js' | 'rn' | 'flutter'>('js')

    // Custom API keys
    const [apiKeys,       setApiKeys]       = useState<any[]>([])
    const [loadingKeys,   setLoadingKeys]   = useState(true)
    const [creating,      setCreating]      = useState(false)
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['*'])
    const [newKeyValue,   setNewKeyValue]   = useState<string | null>(null)
    const [revoking,      setRevoking]      = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const keys = await fetchApiKeys()
                setApiKeys(keys)
            } catch { /* silencioso */ }
            finally { setLoadingKeys(false) }
        })()
    }, [])

    if (!project) return null

    const copy = (text: string, label = 'Copiado') => {
        navigator.clipboard.writeText(text)
        toast.success(label)
    }

    const projectUrl = `https://${project.subdomain}.matecito.dev`
    const envSnippet = `# .env.local\nNEXT_PUBLIC_MATEBASE_URL=${projectUrl}\nNEXT_PUBLIC_MATEBASE_ANON_KEY=${project.anon_key}\nMATEBASE_SERVICE_KEY=${project.service_key}`

    const toggleScope = (s: string) => {
        if (s === '*') { setSelectedScopes(['*']); return }
        setSelectedScopes(prev => {
            const without = prev.filter(x => x !== '*')
            return without.includes(s) ? without.filter(x => x !== s) : [...without, s]
        })
    }

    const handleCreate = async () => {
        setCreating(true)
        setNewKeyValue(null)
        try {
            const res = await createApiKey(selectedScopes)
            const key = res.key
            setNewKeyValue(key.key)
            setApiKeys(prev => [key, ...prev])
            toast.success('Key creada — copiala ahora, no la verás de nuevo')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setCreating(false)
        }
    }

    const handleRevoke = async (id: string) => {
        if (!confirm('¿Revocar esta key? Se invalida inmediatamente.')) return
        setRevoking(id)
        try {
            await revokeApiKey(id)
            setApiKeys(prev => prev.filter(k => k.id !== id))
            toast.success('Key revocada')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setRevoking(null)
        }
    }

    return (
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="pb-4 border-b border-slate-200">
                <h1 className="text-2xl font-extrabold text-slate-900">Conexión & API Keys</h1>
                <p className="text-xs text-slate-400 mt-1">Configurá tu app para conectarse a este proyecto.</p>
            </div>

            {/* Project URL + system keys */}
            <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-600">Project URL</span>
                    </div>
                    <div className="flex gap-2">
                        <input readOnly value={projectUrl}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 outline-none" />
                        <button onClick={() => copy(projectUrl, 'URL copiada')}
                            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Anon key */}
                <div className="bg-white rounded-2xl border border-l-4 border-emerald-300 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-semibold text-slate-600">Anon Key</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded">Client-safe</span>
                    </div>
                    <p className="text-xs text-slate-400">Segura para usar en el frontend — NO expone datos privados.</p>
                    <div className="flex gap-2">
                        <input readOnly type={revealAnon ? "text" : "password"} value={project.anon_key || ''}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-700 outline-none" />
                        <button onClick={() => setRevealAnon(v => !v)}
                            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                            {revealAnon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => copy(project.anon_key || '', 'Anon Key copiada')}
                            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Service key */}
                <div className="bg-white rounded-2xl border border-l-4 border-red-300 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-semibold text-slate-600">Service Key</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded">Server only</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs text-red-600 font-medium">Nunca uses esta key en el código del cliente.</span>
                    </div>
                    <div className="flex gap-2">
                        <input readOnly type={revealService ? "text" : "password"} value={project.service_key || ''}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-700 outline-none" />
                        <button onClick={() => setRevealService(v => !v)}
                            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                            {revealService ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => copy(project.service_key || '', 'Service Key copiada')}
                            className="p-2.5 border border-slate-200 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-all">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom API Keys */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">API Keys Personalizadas</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Creá keys con permisos limitados para casos de uso específicos</p>
                </div>

                {/* New key creator */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
                    <p className="text-xs font-semibold text-slate-600">Nueva key</p>
                    <div className="flex flex-wrap gap-2">
                        {SCOPE_OPTIONS.map(s => (
                            <button key={s.value} onClick={() => toggleScope(s.value)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                    selectedScopes.includes(s.value)
                                        ? `${s.bg} ${s.color} ${s.border}`
                                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                                )}>
                                <CheckSquare className="w-3 h-3" />
                                {s.label}
                                <span className="opacity-60">{s.desc}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={handleCreate} disabled={creating || selectedScopes.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Crear key
                    </button>
                </div>

                {/* New key reveal (one-time) */}
                {newKeyValue && (
                    <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-amber-700 mb-1">Copiá esta key ahora — no se mostrará de nuevo</p>
                            <code className="text-xs font-mono text-amber-800 break-all">{newKeyValue}</code>
                        </div>
                        <button onClick={() => copy(newKeyValue, 'Key copiada')}
                            className="p-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-600 hover:bg-amber-200 transition-all shrink-0">
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Keys list */}
                <div className="divide-y divide-slate-100">
                    {loadingKeys ? (
                        <div className="px-6 py-8 text-center text-xs text-slate-400">
                            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                            Cargando keys...
                        </div>
                    ) : apiKeys.filter(k => k.type === 'custom').length === 0 ? (
                        <div className="px-6 py-8 text-center text-xs text-slate-400">
                            No hay keys personalizadas
                        </div>
                    ) : (
                        apiKeys.filter(k => k.type === 'custom').map(k => (
                            <div key={k.id} className="flex items-center justify-between px-6 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-mono text-slate-600 truncate">{k.key?.slice(0, 20)}…</p>
                                        <p className="text-[10px] text-slate-400">
                                            {k.scopes ? k.scopes.join(', ') : 'all access'} · {new Date(k.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {(k.scopes ?? ['*']).map((s: string) => {
                                        const opt = SCOPE_OPTIONS.find(o => o.value === s)
                                        return opt ? (
                                            <span key={s} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase", opt.bg, opt.color, opt.border)}>
                                                {opt.label}
                                            </span>
                                        ) : null
                                    })}
                                    <button onClick={() => handleRevoke(k.id)} disabled={revoking === k.id}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                                        {revoking === k.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Env vars */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Variables de entorno</span>
                    <button onClick={() => copy(envSnippet, 'Variables copiadas')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                        <Copy className="w-3 h-3" /> Copiar todo
                    </button>
                </div>
                <div className="p-5 bg-slate-900">
                    <pre className="text-xs font-mono leading-relaxed overflow-x-auto">
                        <span className="text-slate-500"># .env.local</span>{'\n'}
                        <span className="text-violet-400">NEXT_PUBLIC_MATEBASE_URL</span><span className="text-slate-400">={projectUrl}</span>{'\n'}
                        <span className="text-violet-400">NEXT_PUBLIC_MATEBASE_ANON_KEY</span><span className="text-slate-400">={project.anon_key}</span>{'\n'}
                        <span className="text-red-400">MATEBASE_SERVICE_KEY</span><span className="text-slate-400">={project.service_key}</span>
                    </pre>
                </div>
            </div>

            {/* Quick start */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100">
                    <div className="flex gap-1">
                        {[{id:'js',label:'JavaScript'},{id:'rn',label:'React Native'},{id:'flutter',label:'Flutter'}].map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                                className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                    activeTab === t.id ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-100")}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-900 p-6">
                    {activeTab === 'js' && (
                        <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">{`import { createClient } from 'matecitodb'

const db = createClient(
  process.env.NEXT_PUBLIC_MATEBASE_URL,
  { anonKey: process.env.NEXT_PUBLIC_MATEBASE_ANON_KEY }
)

const { data } = await db.from('posts').get()`}</pre>
                    )}
                    {activeTab === 'rn' && (
                        <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">{`import { createClient } from 'matecitodb-rn'

const db = createClient('${projectUrl}', {
  anonKey: '${project.anon_key}'
})

await db.auth.initialize()
const { data } = await db.from('posts').get()`}</pre>
                    )}
                    {activeTab === 'flutter' && (
                        <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">{`import 'package:matecitodb_flutter/matecitodb.dart';

final db = MatecitoDB.createClient(
  '${projectUrl}',
  anonKey: '${project.anon_key}',
);

await db.auth.initialize();
final result = await db.from('posts').get();`}</pre>
                    )}
                </div>
            </div>
        </div>
    )
}
