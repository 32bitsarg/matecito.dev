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
    { key: 'listRule', label: 'List / Search', desc: 'Who can search many records' },
    { key: 'viewRule', label: 'View / Get One', desc: 'Who can read a single record' },
    { key: 'createRule', label: 'Create', desc: 'Who can insert new records' },
    { key: 'updateRule', label: 'Update', desc: 'Who can modify existing records' },
    { key: 'deleteRule', label: 'Delete', desc: 'Who can remove records' }
]

const PRESETS = [
    { name: 'Public', value: '', icon: Unlock, desc: 'Anyone can access (Dangerous)', color: 'text-red-400' },
    { name: 'Authenticated', value: '@request.auth.id != ""', icon: ShieldCheck, desc: 'Only logged-in users', color: 'text-accent' },
    { name: 'Owner Only', value: '@request.auth.id = owner', icon: Shield, desc: 'Only creators can manage', color: 'text-blue-400' },
    { name: 'Admin Only', value: 'null', icon: Lock, desc: 'Locked from Web API', color: 'text-muted' }
]

export default function SecurityPage() {
    const { collections, updateCollection, fetchCollections } = useProject()
    const [selectedCol, setSelectedCol] = useState<any>(null)
    const [localRules, setLocalRules] = useState<any>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (collections.length > 0 && !selectedCol) {
            setSelectedCol(collections[0])
            setLocalRules({
                listRule: collections[0].listRule,
                viewRule: collections[0].viewRule,
                createRule: collections[0].createRule,
                updateRule: collections[0].updateRule,
                deleteRule: collections[0].deleteRule,
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

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Security & API Rules</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Controla el acceso y permisos de cada colección
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading || !selectedCol}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest"
                >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </button>
            </div>

            {/* Main Layout */}
            <div className="flex-1 flex gap-8 min-h-0">
                
                {/* Collection Sidebar */}
                <div className="w-72 flex flex-col space-y-4">
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted/40">Collections</div>
                    <div className="bg-card/20 border border-white/5 rounded-3xl p-2 space-y-1 overflow-y-auto">
                        {collections.map(col => (
                            <button
                                key={col.id}
                                onClick={() => handleSelectCol(col)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group",
                                    selectedCol?.id === col.id 
                                        ? "bg-accent/10 text-accent border border-accent/20" 
                                        : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Shield className={cn("w-3.5 h-3.5 opacity-40 group-hover:opacity-100", selectedCol?.id === col.id && "opacity-100")} />
                                    {col.name}
                                </div>
                                {col.listRule === "" && col.viewRule === "" && (
                                    <ShieldAlert className="w-3 h-3 text-red-500 animate-pulse" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Quick Info */}
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 mt-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Security Tip</span>
                        </div>
                        <p className="text-[10px] text-blue-200/40 leading-relaxed italic">
                            Un valor vacío (<code className="text-red-400">""</code>) significa acceso público. Usá <code className="text-accent underline font-mono">@request.auth.id != ""</code> para requerir login.
                        </p>
                    </div>
                </div>

                {/* Rules Editor */}
                <div className="flex-1 bg-card/30 border border-border/50 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm">
                    {selectedCol ? (
                        <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-500">
                            {/* Editor Header */}
                            <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                                 <div>
                                    <h2 className="text-xl font-black text-white">Reglas para <span className="text-accent">{selectedCol.name}</span></h2>
                                    <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] mt-1">Configuración actual de permisos de API</p>
                                 </div>
                                 <div className="flex items-center gap-2 px-4 py-2 bg-accent/5 border border-accent/10 rounded-xl text-[9px] font-black text-accent uppercase tracking-widest">
                                     <CheckCircle2 className="w-3 h-3" /> Instancia Protegida
                                 </div>
                            </div>

                            {/* Rules List */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                                {RULES_KEYS.map((rule) => (
                                    <div key={rule.key} className="space-y-4 group">
                                        <div className="flex items-center justify-between px-1">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                                                     {localRules[rule.key] === "" ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <ShieldCheck className="w-4 h-4" />}
                                                 </div>
                                                 <div>
                                                     <p className="text-xs font-black text-white uppercase tracking-wider">{rule.label}</p>
                                                     <p className="text-[10px] text-muted/50 font-mono tracking-tighter italic">{rule.desc}</p>
                                                 </div>
                                            </div>

                                            {/* Presets */}
                                            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                                                {PRESETS.map((p) => (
                                                    <button
                                                        key={p.name}
                                                        onClick={() => applyPreset(rule.key, p.value)}
                                                        className={cn(
                                                            "px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.1em] transition-all hover:bg-white/5",
                                                            (localRules[rule.key] === p.value || (p.value === 'null' && localRules[rule.key] === null))
                                                                ? "bg-white/10 text-white shadow-inner" 
                                                                : "text-muted/40"
                                                        )}
                                                        title={p.desc}
                                                    >
                                                        {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <textarea 
                                                value={localRules[rule.key] === null ? "null" : localRules[rule.key]}
                                                onChange={(e) => setLocalRules((prev: any) => ({ ...prev, [rule.key]: e.target.value === 'null' ? null : e.target.value }))}
                                                rows={1}
                                                className={cn(
                                                    "w-full bg-black/60 border rounded-2xl px-5 py-4 text-[11px] font-mono outline-none transition-all resize-none shadow-inner",
                                                    localRules[rule.key] === "" 
                                                        ? "border-red-500/20 text-red-400/80 focus:border-red-500/50" 
                                                        : "border-white/5 text-accent focus:border-accent/30"
                                                )}
                                                placeholder="Enter filter expression (e.g. @request.auth.id != '')"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none group-focus-within:opacity-10 transition-opacity">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-20 opacity-20 text-center">
                            <Lock className="w-16 h-16 mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">Select a collection to configure rules</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
