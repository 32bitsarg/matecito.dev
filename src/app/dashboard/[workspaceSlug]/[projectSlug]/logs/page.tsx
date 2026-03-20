'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { 
    Server, 
    RefreshCw, 
    Search, 
    Activity, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    ExternalLink,
    Filter,
    Terminal,
    Bug,
    Info,
    XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { TableVirtuoso } from 'react-virtuoso'

export default function LogsPage() {
    const { getRecord } = useProject() // Usaremos fetch directo para logs ya que es un endpoint admin especial
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isAutoRefresh, setIsAutoRefresh] = useState(true)
    const [filter, setFilter] = useState('200,400,500')
    const timerRef = useRef<any>(null)

    const params = useParams()
    const { subdomain } = params

    const fetchLogs = async () => {
        try {
            // Logs API: GET /api/logs
            // Como el ProjectContext ya tiene el childPb con adminToken, 
            // pero no expusimos 'getLogs', lo haremos via un fetch manual o extenderemos el service.
            // Para rapidez en este prototipo avanzado, usaremos un mock realista si falla el fetch,
            // pero intentaré el fetch real.
            
            // Simulación de logs para diseño (puedes reemplazar con fetch real al service)
            const mockLogs = [
                { id: '1', method: 'GET', url: '/api/collections/posts/records', status: 200, remoteIp: '192.168.1.1', created: new Date().toISOString() },
                { id: '2', method: 'POST', url: '/api/collections/users/auth-with-password', status: 200, remoteIp: '45.12.33.2', created: new Date(Date.now() - 5000).toISOString() },
                { id: '3', method: 'PATCH', url: '/api/collections/settings/records/1', status: 403, remoteIp: '10.0.0.5', created: new Date(Date.now() - 15000).toISOString() },
                { id: '4', method: 'GET', url: '/api/files/products/93h/img.jpg', status: 200, remoteIp: '88.1.2.3', created: new Date(Date.now() - 30000).toISOString() },
                { id: '5', method: 'DELETE', url: '/api/collections/logs/records/abc', status: 500, remoteIp: '127.0.0.1', created: new Date(Date.now() - 60000).toISOString() },
            ]
            setLogs(mockLogs)
        } catch (err: any) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLogs()
        if (isAutoRefresh) {
            timerRef.current = setInterval(fetchLogs, 5000)
        }
        return () => clearInterval(timerRef.current)
    }, [isAutoRefresh])

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-accent/10 rounded-3xl text-accent border border-accent/20 shadow-lg shadow-accent/5">
                        <Terminal className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Live Request Logs</h1>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] mt-1">
                            Stream en tiempo real de tráfico y errores de API
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-2xl">
                        <div className={cn("w-2 h-2 rounded-full", isAutoRefresh ? "bg-accent animate-pulse" : "bg-muted")} />
                        <span className="text-[10px] font-black uppercase text-muted tracking-widest">Auto-Refresh</span>
                        <button 
                            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                            className={cn(
                                "ml-2 px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all",
                                isAutoRefresh ? "bg-accent/20 text-accent" : "bg-white/5 text-muted"
                            )}
                        >
                            {isAutoRefresh ? 'ON' : 'OFF'}
                        </button>
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-white transition-all"
                    >
                        <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <LogStat label="Requests (1h)" value="1.2k" icon={Activity} color="text-accent" />
                <LogStat label="Avg Latency" value="45ms" icon={Clock} color="text-blue-400" />
                <LogStat label="Errors" value="23" icon={Bug} color="text-red-400" />
                <LogStat label="Success Rate" value="98.2%" icon={CheckCircle2} color="text-green-400" />
            </div>

            {/* Logs Table */}
            <div className="flex-1 bg-card/30 border border-border/50 rounded-[2.5rem] flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl">
                
                {/* Toolbar */}
                <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                            <Filter className="w-3 h-3" /> Filter Status
                        </div>
                        <div className="flex gap-2">
                            {['200', '400', '500'].map(s => (
                                <button key={s} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black text-muted hover:text-white transition-all uppercase tracking-tighter">
                                    {s}xx
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted/40" />
                        <input 
                            type="text" 
                            placeholder="Buscar en logs..."
                            className="bg-black/40 border border-border rounded-xl pl-9 pr-4 py-2 text-[10px] text-white outline-none focus:border-accent/40 w-48 transition-all"
                        />
                    </div>
                </div>

                {/* Stream with Virtualization */}
                <div className="flex-1 overflow-hidden font-mono text-[11px]">
                     <TableVirtuoso
                        className="h-full custom-scrollbar"
                        data={logs}
                        fixedHeaderContent={() => (
                            <tr className="bg-[#0c0c0c] z-10 border-b border-white/5">
                                <th className="p-4 text-muted/40 font-black uppercase tracking-widest text-[9px] w-24">Status</th>
                                <th className="p-4 text-muted/40 font-black uppercase tracking-widest text-[9px] w-24">Method</th>
                                <th className="p-4 text-muted/40 font-black uppercase tracking-widest text-[9px]">Endpoint</th>
                                <th className="p-4 text-muted/40 font-black uppercase tracking-widest text-[9px] w-32">Ip Address</th>
                                <th className="p-4 text-muted/40 font-black uppercase tracking-widest text-[9px] text-right w-32">Time</th>
                            </tr>
                        )}
                        itemContent={(index, log) => (
                            <>
                                <td className="p-4 align-middle">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-md font-black",
                                        log.status >= 500 ? "bg-red-500/20 text-red-400" :
                                        log.status >= 400 ? "bg-yellow-500/20 text-yellow-400" :
                                        "bg-accent/20 text-accent"
                                    )}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="p-4 font-black align-middle">
                                    <span className={cn(
                                        log.method === 'POST' ? "text-green-400" :
                                        log.method === 'DELETE' ? "text-red-400" :
                                        log.method === 'PATCH' ? "text-blue-400" :
                                        "text-muted"
                                    )}>
                                        {log.method}
                                    </span>
                                </td>
                                <td className="p-4 text-white/70 group-hover:text-white transition-colors truncate max-w-sm align-middle">
                                    {log.url}
                                </td>
                                <td className="p-4 text-muted/30 align-middle">
                                    {log.remoteIp}
                                </td>
                                <td className="p-4 text-right text-muted/50 align-middle">
                                    {new Date(log.created).toLocaleTimeString()}
                                </td>
                            </>
                        )}
                        components={{
                            Table: (props) => <table {...props} className="w-full text-left border-collapse table-fixed" />,
                            TableRow: (props) => <tr {...props} className="group hover:bg-white/[0.01] transition-colors border-b border-white/[0.02]" />
                        }}
                     />
                </div>

            </div>
        </div>
    )
}

function LogStat({ label, value, icon: Icon, color }: any) {
    return (
        <div className="bg-card/20 border border-white/5 rounded-3xl p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
            <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-muted tracking-widest">{label}</p>
                <p className={cn("text-xl font-black", color)}>{value}</p>
            </div>
            <div className={cn("p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-all", color)}>
                <Icon className="w-4 h-4" />
            </div>
        </div>
    )
}
