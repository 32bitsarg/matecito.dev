'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Folder, 
    Image as ImageIcon, 
    FileText, 
    Trash2, 
    Search, 
    MoreVertical, 
    Eye, 
    Download, 
    HardDrive,
    Database,
    ChevronRight,
    RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function StoragePage() {
    const { collections, getFileUrl, fetchRecords, fetchCollections } = useProject()
    const [selectedCollection, setSelectedCollection] = useState<any>(null)
    const [files, setFiles] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Filtrar solo colecciones que tienen campos de tipo 'file'
    const collectionsWithFiles = collections.filter(c => 
        c.fields.some((f: any) => f.type === 'file')
    )

    const loadCollectionFiles = async (col: any) => {
        setLoading(true)
        setSelectedCollection(col)
        try {
            const res = await fetchRecords(col.name, 1, 50)
            // Extraer archivos de los registros
            const allFiles: any[] = []
            res.items.forEach((record: any) => {
                col.fields.forEach((field: any) => {
                    if (field.type === 'file' && record[field.name]) {
                        const fileValue = record[field.name]
                        if (Array.isArray(fileValue)) {
                            fileValue.forEach(f => allFiles.push({ name: f, record, field, collection: col }))
                        } else {
                            allFiles.push({ name: fileValue, record, field, collection: col })
                        }
                    }
                })
            })
            setFiles(allFiles)
        } catch (err: any) {
            toast.error("Error al cargar archivos: " + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (collectionsWithFiles.length > 0 && !selectedCollection) {
            loadCollectionFiles(collectionsWithFiles[0])
        }
    }, [collectionsWithFiles])

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Folder className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Storage & Assets</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Biblioteca unificada de archivos y multimedia
                        </p>
                    </div>
                </div>
            </div>

            {/* Storage Layout */}
            <div className="flex-1 flex gap-8 min-h-0">
                
                {/* Sidebar: Collections */}
                <div className="w-64 flex flex-col space-y-4">
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted/40">Filter by Collection</div>
                    <div className="bg-card/20 border border-white/5 rounded-3xl p-2 space-y-1 overflow-y-auto overflow-hidden">
                        {collectionsWithFiles.map(col => (
                            <button
                                key={col.id}
                                onClick={() => loadCollectionFiles(col)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all group",
                                    selectedCollection?.id === col.id 
                                        ? "bg-accent/10 text-accent border border-accent/20" 
                                        : "text-muted hover:text-white hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Database className={cn("w-3.5 h-3.5 opacity-40 group-hover:opacity-100", selectedCollection?.id === col.id && "opacity-100")} />
                                    {col.name}
                                </div>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                        {collectionsWithFiles.length === 0 && (
                            <p className="p-4 text-[10px] italic text-muted/30">No file fields active</p>
                        )}
                    </div>

                    {/* Usage Card */}
                    <div className="bg-accent/5 border border-accent/10 rounded-3xl p-6 mt-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <HardDrive className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-black uppercase text-accent tracking-widest">Storage Status</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent animate-in slide-in-from-left duration-1000" style={{ width: '45%' }} />
                            </div>
                            <p className="text-[10px] text-muted font-mono uppercase">45% Capacity used</p>
                        </div>
                    </div>
                </div>

                {/* Main: Gallery */}
                <div className="flex-1 bg-card/30 border border-border/50 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm">
                    {/* Gallery Toolbar */}
                    <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between gap-4">
                         <div className="relative flex-1 max-w-sm group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
                            <input 
                                type="text"
                                placeholder="Filtrar por nombre de archivo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-accent/40 transition-all shadow-inner"
                            />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-muted/40 uppercase tracking-widest">
                            {filteredFiles.length} items found
                        </div>
                    </div>

                    {/* Files Grid */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <RefreshCw className="w-10 h-10 animate-spin text-accent opacity-20" />
                            </div>
                        ) : filteredFiles.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {filteredFiles.map((file, idx) => {
                                    const isImg = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)
                                    const url = getFileUrl(file.record, file.name)
                                    const thumbUrl = isImg ? getFileUrl(file.record, file.name, { thumb: '300x300' }) : undefined
                                    
                                    return (
                                        <div key={idx} className="group relative bg-black/40 border border-white/5 rounded-3xl overflow-hidden aspect-square hover:border-accent/40 transition-all hover:-translate-y-1 shadow-2xl">
                                            {/* Preview */}
                                            {isImg ? (
                                                <img src={thumbUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <FileText className="w-12 h-12 text-muted" />
                                                    <span className="text-[10px] font-mono text-center break-all">{file.name}</span>
                                                </div>
                                            )}

                                            {/* Hover Actions Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                 <div className="flex items-center gap-2">
                                                    <a href={url} target="_blank" className="p-2.5 bg-white/10 rounded-xl hover:bg-accent hover:text-background transition-all">
                                                        <Eye className="w-5 h-5" />
                                                    </a>
                                                    <a href={url} download className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                                                        <Download className="w-5 h-5" />
                                                    </a>
                                                 </div>
                                                 <button className="text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 mt-2 transition-colors">
                                                     Eliminar Definitivo
                                                 </button>
                                            </div>

                                            {/* Info Label */}
                                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all">
                                                 <p className="text-[10px] text-white/50 font-mono truncate">{file.name}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 opacity-20 text-center">
                                <ImageIcon className="w-16 h-16 mb-4" />
                                <p className="font-black uppercase tracking-widest text-xs">No assets detected in this sequence</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
