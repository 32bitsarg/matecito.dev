'use client'

import { useEffect, useState, useRef } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { RefreshCw, Search, Terminal, Activity, Clock, AlertCircle, CheckCircle2, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const METHOD_COLORS: Record<string, string> = {
    GET:    'bg-blue-50 text-blue-600 border-blue-200',
    POST:   'bg-emerald-50 text-emerald-600 border-emerald-200',
    PATCH:  'bg-amber-50 text-amber-600 border-amber-200',
    DELETE: 'bg-red-50 text-red-600 border-red-200',
}

function StatusBadge({ code }: { code: number }) {
    const color = code >= 500 ? 'bg-red-50 text-red-600 border-red-200'
        : code >= 400 ? 'bg-amber-50 text-amber-600 border-amber-200'
        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
    return (
        <span className={cn("inline-flex text-[10px] font-bold px-1.5 py-0.5 rounded border", color)}>
            {code}
        </span>
    )
}

export default function LogsPage() {
    const { fetchLogs } = useProject()
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [search, setSearch] = useState('')
    const [autoRefresh, setAutoRefresh] = useState(false)
    const timerRef = useRef<any>(null)

    const load = async () => {
        setLoading(true)
        try {
            const res = await fetchLogs({ limit: 100, status: statusFilter || undefined })
            setLogs(res.logs ?? [])
            setTotal(res.total ?? 0)
        } catch (err: any) {
            toast.error('Error al cargar logs: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [statusFilter])

    useEffect(() => {
        clearInterval(timerRef.current)
        if (autoRefresh) timerRef.current = setInterval(load, 5000)
        return () => clearInterval(timerRef.current)
    }, [autoRefresh, statusFilter])

    const filtered = logs.filter(l =>
        !search || l.path?.toLowerCase().includes(search.toLowerCase())
    )

    const errors   = logs.filter(l => l.status_code >= 400).length
    const avgMs    = logs.length ? Math.round(logs.reduce((a, l) => a + (l.duration_ms ?? 0), 0) / logs.length) : 0
    const success  = logs.length ? ((logs.filter(l => l.status_code < 400).length / logs.length) * 100).toFixed(1) : '—'

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[var(--fg-primary)]">Request Logs</h1>
                        <p className="text-xs text-[var(--fg-tertiary)]">{total} entradas totales</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAutoRefresh(v => !v)}
                        className={cn("flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                            autoRefresh
                                ? "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--border)]"
                                : "bg-[var(--bg-primary)] text-[var(--fg-secondary)] border-[var(--border)] hover:border-[var(--border)]"
                        )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", autoRefresh ? "bg-[var(--accent)] animate-pulse" : "bg-[var(--fg-tertiary)]")} />
                        Auto
                    </button>
                    <button onClick={load} disabled={loading}
                        className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--fg-secondary)] hover:text-[var(--accent)] hover:border-[var(--border)] transition-all">
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total (cargados)", value: logs.length, icon: Activity, color: "text-[var(--accent)]", bg: "bg-[var(--accent-soft)]" },
                    { label: "Latencia prom.", value: avgMs ? `${avgMs}ms` : "—", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Errores", value: errors, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
                    { label: "Tasa de éxito", value: `${success}%`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map(s => (
                    <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[var(--fg-tertiary)] font-medium mb-1">{s.label}</p>
                            <p className={cn("text-xl font-extrabold", s.color)}>{s.value}</p>
                        </div>
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", s.bg)}>
                            <s.icon className={cn("w-4 h-4", s.color)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] overflow-hidden">
                {/* Toolbar */}
                <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-3 flex-wrap">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--fg-tertiary)]" />
                        <input type="text" placeholder="Filtrar por path..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--accent)] transition-colors" />
                    </div>
                    <div className="flex items-center gap-1">
                        {[
                            { label: "Todos", value: "" },
                            { label: "2xx", value: "2xx" },
                            { label: "4xx", value: "4xx" },
                            { label: "5xx", value: "5xx" },
                        ].map(f => (
                            <button key={f.value} onClick={() => setStatusFilter(f.value)}
                                className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                    statusFilter === f.value
                                        ? "bg-[var(--accent)] text-white"
                                        : "bg-[var(--bg-secondary)] text-[var(--fg-secondary)] hover:bg-[var(--border)]"
                                )}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rows */}
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    {loading ? (
                        <div className="p-12 text-center text-[var(--fg-tertiary)] text-sm">Cargando logs...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <Terminal className="w-8 h-8 text-[var(--fg-tertiary)] mx-auto mb-3" />
                            <p className="text-sm text-[var(--fg-tertiary)]">Sin logs registrados aún</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]/60">
                                    <th className="px-5 py-3 text-left text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider w-16">Status</th>
                                    <th className="px-3 py-3 text-left text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider w-20">Método</th>
                                    <th className="px-3 py-3 text-left text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider">Path</th>
                                    <th className="px-3 py-3 text-left text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider w-24">Duración</th>
                                    <th className="px-5 py-3 text-right text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-wider w-36">Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filtered.map(log => (
                                    <tr key={log.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                        <td className="px-5 py-3">
                                            <StatusBadge code={log.status_code} />
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border",
                                                METHOD_COLORS[log.method] ?? "bg-[var(--bg-secondary)] text-[var(--fg-secondary)] border-[var(--border)]")}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 font-mono text-xs text-[var(--fg-secondary)] max-w-sm truncate">
                                            {log.path}
                                        </td>
                                        <td className="px-3 py-3 text-xs text-[var(--fg-tertiary)] font-mono">
                                            {log.duration_ms != null ? `${log.duration_ms}ms` : '—'}
                                        </td>
                                        <td className="px-5 py-3 text-right text-xs text-[var(--fg-tertiary)] font-mono">
                                            {new Date(log.created_at).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
