'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Shield, Save, RefreshCw, Lock, Unlock, Users, Key, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const OPERATIONS = [
    { key: 'list',   label: 'Listar',     desc: 'GET /records' },
    { key: 'get',    label: 'Leer uno',   desc: 'GET /records/:id' },
    { key: 'create', label: 'Crear',      desc: 'POST /records' },
    { key: 'update', label: 'Actualizar', desc: 'PATCH /records/:id' },
    { key: 'delete', label: 'Eliminar',   desc: 'DELETE /records/:id' },
]

const ACCESS_OPTIONS = [
    { value: 'public',  label: 'Público',     icon: Unlock, color: 'text-red-600',   bg: 'bg-red-50',   border: 'border-red-200',   desc: 'Sin autenticación' },
    { value: 'auth',    label: 'Autenticado',  icon: Users,  color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200',  desc: 'Usuarios logueados' },
    { value: 'service', label: 'Service Key',  icon: Key,    color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', desc: 'Solo server-side' },
    { value: 'nobody',  label: 'Bloqueado',    icon: Lock,   color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', desc: 'Deshabilitado' },
]

// localPerms: Record<opKey, { access, filter_rule }>
type OpPerm = { access: string; filter_rule: string | null }

function getAccessMeta(v: string) {
    return ACCESS_OPTIONS.find(o => o.value === v) ?? ACCESS_OPTIONS[1]
}

function defaultPerms(): Record<string, OpPerm> {
    return Object.fromEntries(OPERATIONS.map(o => [o.key, { access: 'auth', filter_rule: null }]))
}

export default function SecurityPage() {
    const { collections, fetchPermissions, savePermissions } = useProject()
    const [perms,       setPerms]       = useState<Record<string, Record<string, OpPerm>>>({})
    const [selectedCol, setSelectedCol] = useState<string>('')
    const [localPerms,  setLocalPerms]  = useState<Record<string, OpPerm>>(defaultPerms())
    const [loading,     setLoading]     = useState(false)
    const [saving,      setSaving]      = useState(false)

    const load = async () => {
        setLoading(true)
        try {
            const res = await fetchPermissions()
            // Backend returns either { access, filter_rule } or plain string (legacy)
            const normalized: Record<string, Record<string, OpPerm>> = {}
            for (const [col, ops] of Object.entries(res.permissions ?? {})) {
                normalized[col] = {}
                for (const [op, val] of Object.entries(ops as any)) {
                    if (typeof val === 'string') {
                        normalized[col][op] = { access: val, filter_rule: null }
                    } else {
                        normalized[col][op] = { access: (val as any).access ?? 'auth', filter_rule: (val as any).filter_rule ?? null }
                    }
                }
            }
            setPerms(normalized)
            if (!selectedCol && collections.length > 0) {
                const first = collections[0].name
                setSelectedCol(first)
                setLocalPerms(normalized[first] ?? defaultPerms())
            }
        } catch (err: any) {
            toast.error('Error al cargar permisos: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { if (collections.length > 0) load() }, [collections.length])

    const selectCollection = (name: string) => {
        setSelectedCol(name)
        setLocalPerms(perms[name] ?? defaultPerms())
    }

    const setAccess = (op: string, access: string) =>
        setLocalPerms(p => ({ ...p, [op]: { ...p[op], access, filter_rule: access === 'auth' ? p[op]?.filter_rule ?? null : null } }))

    const setFilterRule = (op: string, rule: string) =>
        setLocalPerms(p => ({ ...p, [op]: { ...p[op], filter_rule: rule || null } }))

    const handleSave = async () => {
        if (!selectedCol) return
        setSaving(true)
        try {
            // Send as { op: { access, filter_rule } }
            await savePermissions(selectedCol, localPerms)
            setPerms(p => ({ ...p, [selectedCol]: localPerms }))
            toast.success(`Permisos guardados para "${selectedCol}"`)
        } catch (err: any) {
            toast.error('Error al guardar: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    const hasPublic = Object.values(localPerms).some(p => p.access === 'public')

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Permisos de API</h1>
                        <p className="text-xs text-slate-400">Controla quién puede acceder a cada colección y aplica filtros por usuario</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={saving || !selectedCol}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 shadow-sm shadow-violet-200">
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar
                </button>
            </div>

            <div className="flex gap-6">
                {/* Collection list */}
                <div className="w-56 shrink-0 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Colecciones</p>
                    <div className="bg-white rounded-2xl border border-slate-200 p-2 space-y-0.5">
                        {loading ? (
                            <div className="p-4 text-center text-xs text-slate-400">Cargando...</div>
                        ) : collections.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400">Sin colecciones</div>
                        ) : (
                            collections.map(col => {
                                const colPerms = perms[col.name] ?? defaultPerms()
                                const hasWarning = Object.values(colPerms).some(p => p.access === 'public')
                                return (
                                    <button key={col.name} onClick={() => selectCollection(col.name)}
                                        className={cn("w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                            selectedCol === col.name
                                                ? "bg-violet-50 text-violet-700 font-semibold"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
                                        <span className="truncate">{col.name}</span>
                                        {hasWarning && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 ml-2" />}
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Permissions editor */}
                <div className="flex-1 min-w-0">
                    {!selectedCol ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
                            <Shield className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <p className="text-sm text-slate-400">Seleccioná una colección</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="font-bold text-slate-900">
                                        Permisos: <span className="text-violet-600 font-mono">{selectedCol}</span>
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Define acceso y filtros RLS por operación</p>
                                </div>
                                {hasPublic && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
                                        <Unlock className="w-3.5 h-3.5" /> Tiene acceso público
                                    </div>
                                )}
                            </div>

                            <div className="p-5 space-y-4">
                                {OPERATIONS.map(op => {
                                    const current = localPerms[op.key] ?? { access: 'auth', filter_rule: null }
                                    const meta    = getAccessMeta(current.access)
                                    const MetaIcon = meta.icon
                                    return (
                                        <div key={op.key} className="space-y-2">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", meta.bg)}>
                                                        <MetaIcon className={cn("w-4 h-4", meta.color)} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{op.label}</p>
                                                        <p className="text-[10px] font-mono text-slate-400">{op.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {ACCESS_OPTIONS.map(opt => {
                                                        const OptIcon = opt.icon
                                                        return (
                                                            <button key={opt.value}
                                                                onClick={() => setAccess(op.key, opt.value)}
                                                                title={`${opt.label} — ${opt.desc}`}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                                                    current.access === opt.value
                                                                        ? `${opt.bg} ${opt.color} ${opt.border}`
                                                                        : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                                                )}>
                                                                <OptIcon className="w-3 h-3" />
                                                                <span className="hidden sm:inline">{opt.label}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {/* Filter rule — only for auth level */}
                                            {current.access === 'auth' && (
                                                <div className="ml-4 flex items-center gap-2 animate-in slide-in-from-top-1 duration-200">
                                                    <Filter className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={current.filter_rule ?? ''}
                                                        onChange={e => setFilterRule(op.key, e.target.value)}
                                                        placeholder="Filtro RLS opcional: ej. owner_id:{{auth.id}}"
                                                        className="flex-1 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs font-mono text-blue-800 placeholder:text-blue-300 focus:border-blue-300 focus:bg-white outline-none transition-all"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}

                                {/* RLS docs hint */}
                                <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-1">
                                    <p className="font-semibold text-slate-600">Variables disponibles en filtros RLS:</p>
                                    <p><code className="font-mono bg-slate-200 px-1 rounded">{'{{auth.id}}'}</code> — ID del usuario logueado</p>
                                    <p><code className="font-mono bg-slate-200 px-1 rounded">{'{{auth.email}}'}</code> — Email del usuario</p>
                                    <p><code className="font-mono bg-slate-200 px-1 rounded">{'{{auth.username}}'}</code> — Username del usuario</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
