'use client'

import { useProject } from '@/contexts/ProjectContext'
import { Plus, Database, Shield, Lock, Layers, Search, MoreVertical, Trash2, Edit3, ChevronRight, Activity } from 'lucide-react'
import { getFieldIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useState, useMemo } from 'react'
import CollectionEditor from '@/components/project-admin/collection-editor'
import DeleteCollectionModal from '@/components/project-admin/delete-collection-modal'

export default function SchemaEditorPage() {
    const { collections, loading, fetchCollections } = useProject()
    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [collectionToEdit, setCollectionToEdit] = useState<any>(null)
    const [collectionToDelete, setCollectionToDelete] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCollections = useMemo(() => {
        return collections.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [collections, searchQuery])

    const handleCreate = () => {
        setCollectionToEdit(null)
        setIsEditorOpen(true)
    }

    const handleEdit = (collection: any) => {
        setCollectionToEdit(collection)
        setIsEditorOpen(true)
    }

    if (loading && collections.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent shadow-[0_0_20px_rgba(55,255,208,0.2)]" />
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent animate-pulse">Sincronizando Esquema...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            {/* Elegant Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/30 p-6 rounded-3xl border border-border/50 backdrop-blur-sm">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">
                        <Activity className="w-3 h-3" />
                        Arquitectura del Proyecto
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Database Schema</h1>
                    <p className="text-sm text-muted">Diseña y gestiona el motor de datos de tu aplicación.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Buscar colección..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/40 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent/50 focus:bg-black/60 transition-all w-64"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-background text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/10 uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Colección
                    </button>
                </div>
            </div>

            {/* Compact Collections List */}
            <div className="space-y-3">
                {filteredCollections.length > 0 ? (
                    filteredCollections.map((collection) => (
                        <div 
                            key={collection.id} 
                            className="group relative bg-card/40 border border-border hover:border-accent/30 rounded-2xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row md:items-center p-2 pr-6 gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-accent/5"
                        >
                            {/* Visual Indicator */}
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Main Info */}
                            <div className="flex-1 flex items-center gap-5 p-2 px-4 min-w-0">
                                <div className={cn(
                                    "p-3 rounded-xl shadow-inner",
                                    collection.type === 'auth' ? "bg-blue-500/10 text-blue-400" : "bg-accent/10 text-accent"
                                )}>
                                    {collection.type === 'auth' ? <Shield className="w-6 h-6" /> : <Database className="w-6 h-6" />}
                                </div>
                                <div className="truncate">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-accent transition-colors">
                                            {collection.name}
                                        </h3>
                                        {collection.system && (
                                            <span className="bg-blue-500/10 text-blue-500 text-[8px] font-bold px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter">
                                                Sistema
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                        {collection.type} · <span className="text-muted/60 lowercase italic">{collection.id}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Fields Preview (Compact Tags) */}
                            <div className="hidden lg:flex items-center gap-2 max-w-sm overflow-hidden text-nowrap select-none opacity-40 group-hover:opacity-100 transition-opacity">
                                {collection.fields.filter((f: any) => !f.system && !['created', 'updated'].includes(f.name)).slice(0, 3).map((f: any) => (
                                    <div key={f.id || f.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-border text-[9px] font-medium text-white/50">
                                        {getFieldIcon(f.type)}
                                        <span className="truncate max-w-[60px]">{f.name}</span>
                                    </div>
                                ))}
                                {collection.fields.length > 3 && (
                                    <span className="text-[9px] text-muted font-bold ml-1">+{collection.fields.length - 3}</span>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-8 pl-6 border-l border-border/50">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-0.5">Campos</p>
                                    <p className="text-sm font-bold text-white">{collection.fields.length}</p>
                                </div>
                                <div className="text-center opacity-40">
                                    <p className="text-[10px] text-muted uppercase font-bold tracking-widest mb-0.5">Records</p>
                                    <p className="text-sm font-bold text-white">—</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-auto">
                                <button 
                                    onClick={() => handleEdit(collection)}
                                    className="p-2.5 rounded-xl hover:bg-accent/10 text-muted hover:text-accent transition-all group/btn"
                                    title="Configurar esquema"
                                >
                                    <Edit3 className="w-5 h-5 transition-transform group-active/btn:scale-90" />
                                </button>
                                {!collection.system && (
                                    <button 
                                        onClick={() => setCollectionToDelete(collection)}
                                        className="p-2.5 rounded-xl hover:bg-red-500/10 text-muted hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                        title="Eliminar colección"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                                <ChevronRight className="w-5 h-5 text-muted/20 mr-2 group-hover:text-accent/50 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 bg-card/20 border-2 border-dashed border-border rounded-3xl text-center space-y-4">
                        <div className="p-6 bg-white/5 rounded-full">
                            <Database className="w-12 h-12 text-muted/40" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">No se encontraron colecciones</p>
                            <p className="text-sm text-muted">Ajusta tu búsqueda o crea una nueva colección para empezar.</p>
                        </div>
                        <button 
                            onClick={handleCreate}
                            className="text-xs font-bold text-accent px-6 py-2 rounded-lg bg-accent/10 border border-accent/20 uppercase tracking-widest hover:bg-accent/20 transition-all"
                        >
                            Crear mi primera colección
                        </button>
                    </div>
                )}

                {/* Compact Add Button (Only if there are results) */}
                {filteredCollections.length > 0 && (
                    <button
                        onClick={handleCreate}
                        className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border hover:border-accent/40 hover:bg-accent/5 text-muted hover:text-accent transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Añadir otra colección</span>
                    </button>
                )}
            </div>

            {/* Bottom Info Ribbon */}
            <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-center gap-4">
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-[11px] text-blue-200/60 leading-relaxed italic">
                    <span className="font-bold text-blue-400">Tip de Ingeniería:</span> Las colecciones de tipo "Auth" ya incluyen campos de seguridad por defecto. Solo añade campos adicionales de perfil si es necesario.
                </p>
            </div>

            <CollectionEditor
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                onSuccess={fetchCollections}
                existingCollection={collectionToEdit}
            />
            
            <DeleteCollectionModal
                isOpen={!!collectionToDelete}
                onClose={() => setCollectionToDelete(null)}
                collection={collectionToDelete}
                onSuccess={fetchCollections}
            />
        </div>
    )
}

function Info(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}
