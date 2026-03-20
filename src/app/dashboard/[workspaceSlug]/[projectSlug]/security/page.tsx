'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Lock, 
    Unlock, 
    ShieldCheck, 
    ShieldAlert, 
    Shield, 
    Save, 
    RefreshCw, 
    Info, 
    ChevronRight,
    GripVertical,
    CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const RULES_KEYS = [
    { key: 'listRule', label: 'Listar / Buscar', desc: 'Quién puede realizar búsquedas múltiples' },
    { key: 'viewRule', label: 'Ver / Obtener uno', desc: 'Quién puede leer un solo registro' },
    { key: 'createRule', label: 'Crear', desc: 'Quién puede insertar nuevos registros' },
    { key: 'updateRule', label: 'Actualizar', desc: 'Quién puede modificar registros existentes' },
    { key: 'deleteRule', label: 'Eliminar', desc: 'Quién puede borrar registros' }
]

const PRESETS = [
    { name: 'Público', value: '', icon: Unlock, desc: 'Cualquiera puede acceder (Peligroso)', color: 'text-red-400' },
    { name: 'Autenticado', value: '@request.auth.id != ""', icon: ShieldCheck, desc: 'Solo usuarios logueados', color: 'text-accent' },
    { name: 'Solo Propietario', value: '@request.auth.id = owner', icon: Shield, desc: 'Solo los creadores controlan sus datos', color: 'text-blue-400' },
    { name: 'Solo Admin', value: 'null', icon: Lock, desc: 'Bloqueado desde Web API', color: 'text-muted' }
]

export default function SecurityPage() {
    const { collections, updateCollection, fetchCollections } = useProject()
    const [selectedCol, setSelectedCol] = useState<any>(null)
    const [localRules, setLocalRules] = useState<any>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (collections.length > 0 && !selectedCol) {
            const first = collections[0]
            setSelectedCol(first)
            setLocalRules({
                listRule: first.listRule,
                viewRule: first.viewRule,
                createRule: first.createRule,
                updateRule: first.updateRule,
                deleteRule: first.deleteRule,
            })
        }
    }, [collections])

    const handleSelectCol = (col: any) => {
        setSelectedCol(col)
        setLocalRules({
            listRule: col.listRule,
            viewRule: col.viewRule,
            createRule: col.createRule,
            updateRule: col.updateRule,
            deleteRule: col.deleteRule,
        })
    }

    const applyPreset = (key: string, value: string) => {
        setLocalRules((prev: any) => ({ ...prev, [key]: value === 'null' ? null : value }))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            await updateCollection(selectedCol.id, localRules)
            toast.success(`Reglas actualizadas para ${selectedCol.name}`)
            await fetchCollections()
        } catch (err: any) {
            toast.error("Error al actualizar reglas: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    const getRuleStatus = (value: string | null) => {
        if (value === null) return { label: 'Solo Admin', color: 'text-muted', icon: Lock, bg: 'bg-white/5' }
        if (value === "") return { label: 'Público', color: 'text-red-400', icon: Unlock, bg: 'bg-red-400/10' }
        if (value === '@request.auth.id != ""') return { label: 'Requiere Auth', color: 'text-accent', icon: ShieldCheck, bg: 'bg-accent/10' }
        return { label: 'Regla Personalizada', color: 'text-blue-400', icon: Shield, bg: 'bg-blue-400/10' }
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-2xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tight">API Security</h1>
                        <p className="text-[9px] font-mono text-muted uppercase tracking-[0.2em]">
                            Controla el acceso y permisos de cada colección
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading || !selectedCol}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-background text-xs font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </button>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex gap-6 min-h-0">
                
                {/* Collection Sidebar */}
                <div className="w-64 flex flex-col space-y-4 shrink-0">
                    <div className="px-1 text-[9px] font-black uppercase tracking-widest text-muted/40 flex items-center justify-between">
                        Colecciones
                        <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[8px]">{collections.length}</span>
                    </div>
                    <div className="flex-1 bg-card/20 border border-white/5 rounded-2xl p-2 space-y-1 overflow-y-auto custom-scrollbar">
                        {collections.map(col => (
                            <button
                                key={col.id}
                                onClick={() => handleSelectCol(col)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all group",
                                    selectedCol?.id === col.id 
                                        ? "bg-accent/10 text-accent border border-accent/20" 
                                        : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <Shield className={cn("w-3.5 h-3.5 opacity-40 group-hover:opacity-100", selectedCol?.id === col.id && "opacity-100")} />
                                    <span className="truncate">{col.name}</span>
                                </div>
                                {(col.listRule === "" || col.viewRule === "") && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
                         <p className="text-[10px] text-blue-200/40 leading-relaxed italic">
                            Un valor vacío (<span className="text-red-400">""</span>) es acceso público.
                        </p>
                    </div>
                </div>

                {/* Rules Editor */}
                <div className="flex-1 bg-card/10 border border-white/5 rounded-[2rem] flex flex-col overflow-hidden backdrop-blur-sm">
                    {selectedCol ? (
                        <div className="flex-1 flex flex-col min-h-0 animate-in slide-in-from-right-4 duration-500">
                            {/* Editor Header */}
                            <div className="px-8 py-6 border-b border-white/5 bg-black/20 flex items-center justify-between shrink-0">
                                 <div>
                                    <h2 className="text-lg font-black text-white">Reglas: <span className="text-accent">{selectedCol.name}</span></h2>
                                    <p className="text-[9px] text-muted font-mono uppercase tracking-widest mt-0.5">Editando permisos de acceso remoto</p>
                                 </div>
                                 <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg text-[8px] font-black text-accent uppercase tracking-widest">
                                     <CheckCircle2 className="w-3 h-3" /> API Activa
                                 </div>
                            </div>

                            {/* Rules Grid */}
                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar grayscale-[0.2] hover:grayscale-0 transition-all">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    {RULES_KEYS.map((rule) => {
                                        const status = getRuleStatus(localRules[rule.key])
                                        const StatusIcon = status.icon
                                        
                                        return (
                                            <div key={rule.key} className={cn(
                                                "p-5 rounded-[1.5rem] border bg-black/20 transition-all group flex flex-col gap-4",
                                                localRules[rule.key] === "" ? "border-red-500/10" : "border-white/5 hover:border-accent/10"
                                            )}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-105", status.bg)}>
                                                            <StatusIcon className={cn("w-4 h-4", status.color)} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-white uppercase tracking-wider">{rule.label}</p>
                                                            <div className={cn("text-[8px] font-black uppercase tracking-tighter mt-0.5", status.color)}>
                                                                {status.label}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
                                                        {PRESETS.slice(0, 3).map((p) => (
                                                            <button
                                                                key={p.name}
                                                                onClick={() => applyPreset(rule.key, p.value)}
                                                                className={cn(
                                                                    "px-2 py-1 rounded-md text-[7px] font-black uppercase tracking-wider transition-all",
                                                                    (localRules[rule.key] === p.value || (p.value === 'null' && localRules[rule.key] === null))
                                                                        ? "bg-accent text-background" 
                                                                        : "text-muted/40 hover:text-muted"
                                                                )}
                                                                title={p.desc}
                                                            >
                                                                {p.name.split(' ')[0]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <textarea 
                                                    value={localRules[rule.key] === null ? "null" : localRules[rule.key]}
                                                    onChange={(e) => setLocalRules((prev: any) => ({ ...prev, [rule.key]: e.target.value === 'null' ? null : e.target.value }))}
                                                    rows={1}
                                                    className={cn(
                                                        "w-full bg-black/40 border rounded-xl px-4 py-3 text-[10px] font-mono outline-none transition-all resize-none shadow-inner",
                                                        localRules[rule.key] === "" 
                                                            ? "border-red-500/20 text-red-400 focus:border-red-500/40" 
                                                            : "border-white/5 text-accent/80 focus:border-accent/30"
                                                    )}
                                                    placeholder="Expresión de filtro..."
                                                />
                                            </div>
                                        )
                                    })}
                                    
                                    {/* Info Card to fill grid */}
                                    <div className="p-5 rounded-[1.5rem] border border-blue-500/10 bg-blue-500/[0.02] flex items-center gap-4">
                                         <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Info className="w-5 h-5 text-blue-400" />
                                         </div>
                                         <div>
                                             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Tip de Seguridad</p>
                                             <p className="text-[9px] text-blue-200/40 leading-tight mt-1 font-medium">
                                                 Usar <code className="text-accent">@request.auth.id</code> asegura que solo el propietario acceda.
                                             </p>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 opacity-20 text-center">
                            <Lock className="w-12 h-12 mb-4" />
                            <p className="font-black uppercase tracking-widest text-[10px]">Selecciona una colección</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
