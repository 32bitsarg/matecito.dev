'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    History, 
    Database, 
    Download, 
    Trash2, 
    RotateCcw, 
    Plus, 
    RefreshCw, 
    Calendar, 
    HardDrive,
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function BackupsPage() {
    const { healthCheck } = useProject()
    const [backups, setBackups] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)

    const fetchBackups = async () => {
        setLoading(true)
        try {
            // Mock de backups para diseño (PB API: GET /api/backups)
            const mockBackups = [
                { key: 'pb_backup_20240319.zip', size: 12500000, modified: new Date().toISOString() },
                { key: 'pb_backup_weekly_30.zip', size: 45000000, modified: new Date(Date.now() - 604800000).toISOString() },
                { key: 'auto_sys_backup.zip', size: 500000, modified: new Date(Date.now() - 3600000).toISOString() },
            ]
            setBackups(mockBackups)
        } catch (err: any) {
            toast.error("Error al cargar backups")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBackups()
    }, [])

    const handleCreateBackup = async () => {
        setCreating(true)
        try {
            // POST /api/backups
            await new Promise(r => setTimeout(r, 2000))
            toast.success("Backup creado correctamente")
            fetchBackups()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setCreating(false)
        }
    }

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <History className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Database Backups</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Puntos de restauración y exportación de toda tu base de datos
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleCreateBackup}
                    disabled={creating}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-accent text-background text-sm font-black hover:opacity-90 transition-all shadow-xl shadow-accent/10 uppercase tracking-widest disabled:opacity-50"
                >
                    {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Crear Backup Ahora
                </button>
            </div>

            {/* Info Alerts */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-3xl flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-yellow-500/60 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-xs font-black text-yellow-500/80 uppercase tracking-widest">Atención: Restauración Crítica</h4>
                    <p className="text-[10px] text-yellow-300/40 leading-relaxed max-w-2xl">
                        Restaurar un backup reemplazará todos los datos actuales y desconectará a los usuarios activos durante el proceso. Asegúrate de tener una copia reciente antes de proceder.
                    </p>
                </div>
            </div>

            {/* Backups List */}
            <div className="flex-1 bg-card/30 border border-border/50 rounded-[2.5rem] overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-muted tracking-widest">Archivos Disponibles</span>
                    <button onClick={fetchBackups} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                        <RefreshCw className={cn("w-4 h-4 text-muted", loading && "animate-spin")} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                         <div className="h-full flex items-center justify-center opacity-20">
                            <Database className="w-12 h-12 text-accent animate-pulse" />
                        </div>
                    ) : backups.length > 0 ? (
                        <div className="space-y-3">
                            {backups.map((backup) => (
                                <div key={backup.key} className="group flex items-center justify-between p-6 bg-black/40 border border-white/5 rounded-3xl hover:border-accent/20 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                                            <Database className="w-5 h-5 text-muted group-hover:text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white mb-1">{backup.key}</p>
                                            <div className="flex items-center gap-4 text-[10px] font-mono text-muted/40 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(backup.modified).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1.5"><HardDrive className="w-3 h-3" /> {formatSize(backup.size)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase text-muted hover:text-white transition-all">
                                            <Download className="w-3.5 h-3.5 text-accent" /> Download
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-[9px] font-black uppercase text-accent hover:bg-accent hover:text-background transition-all">
                                            <RotateCcw className="w-3.5 h-3.5" /> Restore
                                        </button>
                                        <button className="p-2 rounded-xl hover:bg-red-500/10 text-muted hover:text-red-500 transition-all border border-transparent hover:border-red-500/20">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-20">
                            <History className="w-16 h-16 mb-4" />
                            <p className="font-black uppercase tracking-widest text-xs">No backups found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
