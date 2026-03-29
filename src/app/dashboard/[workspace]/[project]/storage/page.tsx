'use client'

import { useEffect, useState, useRef } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import api from '@/lib/api'
import {
    Folder, FileText, Trash2, Search, Eye, Download,
    RefreshCw, Upload, HardDrive, ImageIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const QUOTA_MB = 250

function formatBytes(bytes: number): string {
    if (bytes < 1024)           return `${bytes} B`
    if (bytes < 1024 * 1024)    return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function StorageBar({ usedMb, quotaMb }: { usedMb: number; quotaMb: number }) {
    const pct    = Math.min(100, quotaMb > 0 ? (usedMb / quotaMb) * 100 : 0)
    const isFull = pct >= 90

    // Capacidad estimada de imágenes: asumiendo ~400KB promedio optimizado a WebP
    const avgKb        = 400
    const remainingMb  = Math.max(0, quotaMb - usedMb)
    const estimatedImgs = Math.floor((remainingMb * 1024) / avgKb)

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-800">Almacenamiento</span>
                </div>
                <span className={cn("text-xs font-semibold", isFull ? "text-red-500" : "text-slate-500")}>
                    {usedMb.toFixed(1)} MB / {quotaMb} MB
                </span>
            </div>

            {/* Bar */}
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-700",
                        pct < 70  ? "bg-violet-500" :
                        pct < 90  ? "bg-amber-400"  :
                                    "bg-red-500"
                    )}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{pct.toFixed(1)}% usado</span>
                <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    ~{estimatedImgs.toLocaleString()} imágenes más disponibles
                    <span className="text-slate-300">(estimado a 400 KB/img optimizada)</span>
                </span>
            </div>

            {isFull && (
                <p className="text-xs text-red-500 font-medium">
                    ⚠ Más del 90% ocupado — eliminá archivos o contactá soporte para ampliar.
                </p>
            )}
        </div>
    )
}

export default function StoragePage() {
    const { projectId, fetchStats } = useProject()
    const [files,       setFiles]       = useState<any[]>([])
    const [loading,     setLoading]     = useState(false)
    const [uploading,   setUploading]   = useState(false)
    const [searchTerm,  setSearchTerm]  = useState('')
    const [usedMb,      setUsedMb]      = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const loadFiles = async () => {
        setLoading(true)
        try {
            const [filesRes, stats] = await Promise.all([
                api.get(`/api/v1/project/${projectId}/storage`),
                fetchStats(),
            ])
            setFiles(filesRes.files ?? [])
            setUsedMb((stats as any).storage?.used_mb ?? 0)
        } catch (err: any) {
            toast.error('Error al cargar: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadFiles() }, [projectId])

    const handleDelete = async (file: any) => {
        if (!confirm('¿Eliminar este archivo?')) return
        try {
            await api.delete(`/api/v1/project/${projectId}/storage/${file.id}`)
            toast.success('Eliminado')
            setFiles(prev => prev.filter(f => f.id !== file.id))
            // Recargar stats para actualizar la barra
            fetchStats().then((s: any) => setUsedMb(s.storage?.used_mb ?? 0)).catch(() => {})
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const form  = new FormData()
            form.append('file', file)
            const BASE  = process.env.NEXT_PUBLIC_API_URL ?? ''
            const token = localStorage.getItem('matecito_token')
            const res   = await fetch(`${BASE}/api/v1/project/${projectId}/storage/upload`, {
                method:  'POST',
                headers: { Authorization: `Bearer ${token}` },
                body:    form,
            })
            if (!res.ok) throw new Error((await res.json()).error || 'Upload failed')
            toast.success('Archivo subido')
            loadFiles()
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const filtered = files.filter(f => (f.url || '').toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                        <HardDrive className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Storage</h1>
                        <p className="text-xs text-slate-400">{files.length} archivo{files.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={loadFiles} disabled={loading}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Subir
                    </button>
                </div>
            </div>

            {/* Storage bar */}
            <StorageBar usedMb={usedMb} quotaMb={QUOTA_MB} />

            {/* Search */}
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Buscar archivos..." value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 transition-colors" />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <RefreshCw className="w-7 h-7 animate-spin text-violet-400" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                    <Folder className="w-10 h-10 text-slate-200 mb-3" />
                    <p className="text-sm text-slate-400 font-medium">Sin archivos</p>
                    <p className="text-xs text-slate-300 mt-1">Subí tu primer archivo con el botón de arriba</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filtered.map(file => {
                        const filename = file.url?.split('/').pop() || file.id
                        const isImg    = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename)
                        const sizeStr  = file.size ? formatBytes(file.size) : null
                        return (
                            <div key={file.id}
                                className="group relative bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden aspect-square hover:border-violet-300 hover:shadow-md transition-all">
                                {isImg ? (
                                    <img src={file.url} alt={filename}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                                        <FileText className="w-8 h-8 text-slate-300" />
                                        <span className="text-[9px] font-mono text-slate-400 text-center break-all leading-tight line-clamp-2">{filename}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a href={file.url} target="_blank"
                                        className="p-2 bg-white/20 rounded-xl hover:bg-white/30 text-white transition-all">
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <a href={file.url} download
                                        className="p-2 bg-white/20 rounded-xl hover:bg-white/30 text-white transition-all">
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button onClick={() => handleDelete(file)}
                                        className="p-2 bg-white/20 rounded-xl hover:bg-red-500 text-white transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                                    <p className="text-[9px] text-white/70 font-mono truncate">{filename}</p>
                                    {sizeStr && <p className="text-[9px] text-white/50 font-mono">{sizeStr}</p>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
