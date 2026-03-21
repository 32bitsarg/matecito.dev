'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { Plus, Database, RefreshCw, LayoutDashboard, ShieldCheck, Lock, Layers, Eye, ChevronRight, Settings2, Info, Activity } from 'lucide-react'
import RecordsTable from '@/components/project-admin/records-table'
import RecordModal from '@/components/project-admin/record-modal'
import { getFieldIcon } from '@/lib/icons'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CollectionRecordsPage() {
    const { collectionName, workspaceSlug, projectSlug } = useParams()
    const router = useRouter()
    const {
        records,
        loading,
        fetchRecords,
        getCollectionSchema
    } = useProject()

    const [activeTab, setActiveTab] = useState<'records' | 'schema'>('records')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<any>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const collection = getCollectionSchema(collectionName as string)
    const baseUrl = `/dashboard/${workspaceSlug}/${projectSlug}`

    const loadData = async () => {
        setIsRefreshing(true)
        await fetchRecords(collectionName as string)
        setIsRefreshing(false)
    }

    useEffect(() => {
        if (collectionName) {
            loadData()
        }
    }, [collectionName])

    const handleEdit = (record: any) => {
        setSelectedRecord(record)
        setIsModalOpen(true)
    }

    const handleCreate = () => {
        setSelectedRecord(null)
        setIsModalOpen(true)
    }

    if (!collection && !loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                <Database className="w-20 h-16 text-accent opacity-10" />
                <h2 className="text-2xl font-bold text-accent">Colección no encontrada</h2>
                <p className="text-foreground opacity-60 font-mono text-sm uppercase tracking-widest">La colección <span className="text-accent font-bold">"{collectionName}"</span> no existe en esta arquitectura.</p>
            </div>
        )
    }

    if (!collection) return null

    return (
        <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Context Navigation & Breadcrumbs */}
            <div className="flex items-center gap-3 text-muted text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">
                <Link href={`${baseUrl}/schema`} className="hover:text-accent flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Esquema
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/60">{collectionName}</span>
            </div>

            {/* Header & Controller */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card/20 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "p-3.5 rounded-2xl shadow-inner",
                            collection.type === 'auth' ? "bg-blue-500/10 text-blue-400" : "bg-accent/10 text-accent"
                        )}>
                            {collection.type === 'auth' ? <ShieldCheck className="w-8 h-8" /> : <Database className="w-8 h-8" />}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter capitalize flex items-center gap-3">
                                {collectionName}
                                {collection.system && (
                                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest">
                                        System
                                    </span>
                                )}
                            </h1>
                            <p className="text-[10px] font-mono text-muted/40 uppercase tracking-[0.3em] flex items-center gap-2 mt-1">
                                {collection.type} Sequence · <span className="lowercase italic">{collection.id}</span>
                            </p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-2xl w-fit">
                        <button 
                            onClick={() => setActiveTab('records')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'records' ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-muted hover:text-white"
                            )}
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Registros
                        </button>
                        <button 
                            onClick={() => setActiveTab('schema')}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'schema' ? "bg-accent text-background shadow-lg shadow-accent/20" : "text-muted hover:text-white"
                            )}
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                            Arquitectura
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {activeTab === 'records' ? (
                        <>
                            <button
                                onClick={loadData}
                                disabled={loading || isRefreshing}
                                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-accent hover:border-accent/20 transition-all disabled:opacity-30"
                                title="Refrescar datos"
                            >
                                <RefreshCw className={cn("w-5 h-5", (loading || isRefreshing) && "animate-spin")} />
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-accent text-[var(--background)] text-xs font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest"
                            >
                                <Plus className="w-5 h-5" />
                                Nuevo Registro
                            </button>
                        </>
                    ) : (
                        <Link
                            href={`${baseUrl}/schema`}
                            className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-accent text-xs font-black hover:bg-accent/10 transition-all uppercase tracking-widest"
                        >
                            <Settings2 className="w-5 h-5" />
                            Editar Esquema
                        </Link>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0">
                {activeTab === 'records' ? (
                    <div className="h-full">
                        {loading && !isRefreshing ? (
                            <div className="h-[40vh] flex flex-col items-center justify-center gap-6">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent shadow-[0_0_20px_rgba(55,255,208,0.1)]" />
                                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-accent animate-pulse">Sincronizando Registros...</p>
                            </div>
                        ) : (
                            <div className="h-full">
                                <RecordsTable
                                    collection={collection}
                                    records={records}
                                    onEdit={handleEdit}
                                    onRefresh={loadData}
                                    onFilterApply={(filter: string) => fetchRecords(collectionName as string, 1, 20, filter)}
                                    currentFilter={""}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                        {/* Composition Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Fields List */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted">Definición de Campos</h3>
                                    <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                                        {collection.fields.length} Atributos
                                    </span>
                                </div>
                                <div className="bg-card/20 border border-white/5 rounded-[2rem] overflow-hidden divide-y divide-white/[0.03]">
                                    {collection.fields.map((field: any) => (
                                        <div key={field.id || field.name} className="p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-muted group-hover:text-accent transition-all group-hover:scale-110">
                                                    {getFieldIcon(field.type)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white group-hover:text-accent transition-colors">
                                                        {field.name}
                                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                                    </p>
                                                    <p className="text-[10px] text-muted/40 font-mono uppercase tracking-widest mt-0.5">
                                                        {field.type} {field.system && "· System"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                {field.options && Object.keys(field.options).length > 0 && (
                                                    <div className="hidden md:flex flex-wrap gap-1 max-w-[200px] justify-end">
                                                        {Object.entries(field.options).map(([k, v]: [string, any]) => (
                                                            <span key={k} className="text-[8px] bg-white/5 text-muted/60 px-1.5 py-0.5 rounded border border-white/5">
                                                                {k}: {String(v)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Lock className="w-4 h-4 text-muted/20" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rules & Security */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-muted px-2">Reglas de Acceso (API)</h3>
                                <div className="bg-card/20 border border-white/5 rounded-[2rem] p-6 space-y-6">
                                    <RuleItem label="Listar" rule={collection.listRule} />
                                    <RuleItem label="Ver" rule={collection.viewRule} />
                                    <RuleItem label="Crear" rule={collection.createRule} />
                                    <RuleItem label="Actualizar" rule={collection.updateRule} />
                                    <RuleItem label="Eliminar" rule={collection.deleteRule} />
                                    
                                    <div className="pt-4 mt-6 border-t border-white/5">
                                         <div className="bg-accent/5 border border-accent/10 p-5 rounded-2xl flex gap-4">
                                            <Info className="w-5 h-5 text-accent shrink-0" />
                                            <div>
                                                <p className="text-[9px] uppercase font-black text-accent tracking-widest mb-1">Tip de Seguridad</p>
                                                <p className="text-[10px] text-muted/60 leading-relaxed italic">
                                                    Las reglas vacías deniegan el acceso por defecto. Usa <code className="text-accent/60">@request.auth.id != ""</code> para requerir autenticación.
                                                </p>
                                            </div>
                                         </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-black/20 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-muted/40 uppercase tracking-widest">Registros Totales</p>
                                        <p className="text-3xl font-black text-white">{records.length}</p>
                                    </div>
                                    <Activity className="w-10 h-10 text-accent/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Record Modal */}
            {isModalOpen && (
                <RecordModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    collection={collection}
                    record={selectedRecord}
                    onSuccess={loadData}
                />
            )}
        </div>
    )
}

function RuleItem({ label, rule }: { label: string, rule?: string | null }) {
    const isPublic = rule === ""
    const isLocked = rule === null
    const hasCustom = !isPublic && !isLocked

    return (
        <div className="flex items-center justify-between group">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">{label}</p>
                <code className={cn(
                    "text-[10px] font-mono block transition-colors",
                    isPublic ? "text-red-400/60" : isLocked ? "text-muted/20" : "text-accent/80"
                )}>
                    {isPublic ? "Public (Allow All)" : isLocked ? "Locked (Deny All)" : rule}
                </code>
            </div>
            <div className={cn(
                "p-2 rounded-lg border",
                isPublic ? "bg-red-500/5 border-red-500/10 text-red-500" : isLocked ? "bg-white/5 border-white/5 text-muted/20" : "bg-accent/5 border-accent/10 text-accent"
            )}>
                {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </div>
        </div>
    )
}
