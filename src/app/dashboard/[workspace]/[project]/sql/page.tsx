'use client'

import { useState, useCallback, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Play, Terminal, RefreshCw, Copy, Check, AlertCircle, Clock, Table2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import api from '@/lib/api'

const PLACEHOLDER = `-- Escribí tu consulta SQL aquí
-- El scope está limitado al schema de tu proyecto

SELECT * FROM _collections LIMIT 10;`

const QUICK_QUERIES = [
    { label: 'Colecciones', sql: 'SELECT * FROM _collections;' },
    { label: 'Campos', sql: 'SELECT * FROM _fields ORDER BY collection, name;' },
    { label: 'Usuarios', sql: 'SELECT id, email, username, created_at FROM _auth_users ORDER BY created_at DESC LIMIT 50;' },
    { label: 'Registros recientes', sql: 'SELECT id, collection, data, created_at FROM _records ORDER BY created_at DESC LIMIT 20;' },
    { label: 'Logs recientes', sql: 'SELECT method, path, status_code, duration_ms, created_at FROM _logs ORDER BY created_at DESC LIMIT 50;' },
]

export default function SqlEditorPage() {
    const { projectId } = useProject()
    const [sql, setSql] = useState(PLACEHOLDER)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const run = useCallback(async () => {
        const query = sql.trim()
        if (!query || loading) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const res = await api.post(`/api/v1/project/${projectId}/sql`, { sql: query })
            setResult(res)
        } catch (err: any) {
            setError(err.data?.error ?? err.message)
        } finally {
            setLoading(false)
        }
    }, [sql, projectId, loading])

    // Ctrl+Enter para ejecutar
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                run()
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [run])

    const copyResult = () => {
        if (!result) return
        navigator.clipboard.writeText(JSON.stringify(result.rows, null, 2))
        setCopied(true)
        toast.success('Copiado')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">SQL Editor</h1>
                        <p className="text-xs text-slate-400">Ejecutá consultas directas en el schema de tu proyecto</p>
                    </div>
                </div>
                <button
                    onClick={run}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 shadow-sm"
                >
                    {loading
                        ? <RefreshCw className="w-4 h-4 animate-spin" />
                        : <Play className="w-4 h-4" />
                    }
                    Ejecutar
                    <span className="text-[9px] font-mono bg-violet-500/60 px-1.5 py-0.5 rounded">⌘↵</span>
                </button>
            </div>

            {/* Quick queries */}
            <div className="flex gap-2 mb-3 shrink-0 flex-wrap">
                {QUICK_QUERIES.map(q => (
                    <button
                        key={q.label}
                        onClick={() => setSql(q.sql)}
                        className="px-3 py-1.5 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700 rounded-lg transition-all border border-slate-200 hover:border-violet-200"
                    >
                        {q.label}
                    </button>
                ))}
            </div>

            {/* Editor */}
            <div className="bg-slate-900 rounded-2xl overflow-hidden mb-4 shrink-0 border border-slate-800">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 ml-2">query.sql</span>
                </div>
                <textarea
                    value={sql}
                    onChange={e => setSql(e.target.value)}
                    spellCheck={false}
                    rows={8}
                    className="w-full bg-transparent text-sm font-mono text-violet-200 p-4 outline-none resize-none placeholder-slate-600 leading-relaxed"
                    placeholder={PLACEHOLDER}
                />
            </div>

            {/* Results */}
            <div className="flex-1 min-h-0 overflow-hidden">
                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-700 mb-1">Error en la consulta</p>
                            <pre className="text-xs font-mono text-red-600 whitespace-pre-wrap">{error}</pre>
                        </div>
                    </div>
                )}

                {result && !loading && (
                    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        {/* Result bar */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Table2 className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-700">
                                        {result.row_count ?? result.rows?.length ?? 0} fila{(result.row_count ?? result.rows?.length ?? 0) !== 1 ? 's' : ''}
                                    </span>
                                    {result.truncated && (
                                        <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                            truncado a 500 filas
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-mono">{result.duration_ms}ms</span>
                                </div>
                                {result.command && (
                                    <span className="text-[10px] font-bold font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                        {result.command}
                                    </span>
                                )}
                            </div>
                            <button onClick={copyResult}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors">
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                Copiar JSON
                            </button>
                        </div>

                        {/* Table */}
                        {['CREATE', 'DROP', 'ALTER', 'INSERT', 'UPDATE', 'DELETE'].includes(result.command) && result.rows?.length === 0 ? (
                            <div className="flex items-center justify-center flex-1 text-emerald-600 text-sm font-semibold gap-2">
                                <Check className="w-4 h-4" />
                                {result.command === 'CREATE' && 'Tabla creada correctamente'}
                                {result.command === 'DROP' && 'Tabla eliminada correctamente'}
                                {result.command === 'ALTER' && 'Tabla modificada correctamente'}
                                {result.command === 'INSERT' && `${result.row_count ?? 0} fila(s) insertada(s)`}
                                {result.command === 'UPDATE' && `${result.row_count ?? 0} fila(s) actualizada(s)`}
                                {result.command === 'DELETE' && `${result.row_count ?? 0} fila(s) eliminada(s)`}
                            </div>
                        ) : result.rows?.length > 0 ? (
                            <div className="overflow-auto flex-1">
                                <table className="w-full text-xs border-collapse">
                                    <thead className="sticky top-0 z-10">
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            {result.fields.map((col: string) => (
                                                <th key={col} className="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap border-r border-slate-100 last:border-r-0">
                                                    {col}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.rows.map((row: any, i: number) => (
                                            <tr key={i} className={cn("border-b border-slate-50 hover:bg-violet-50/40 transition-colors", i % 2 === 0 ? "bg-white" : "bg-slate-50/30")}>
                                                {result.fields.map((col: string) => {
                                                    const val = row[col]
                                                    const display = val === null ? 'NULL' : typeof val === 'object' ? JSON.stringify(val) : String(val)
                                                    return (
                                                        <td key={col} className="px-4 py-2 text-slate-700 font-mono max-w-xs border-r border-slate-50 last:border-r-0">
                                                            <span className={cn(
                                                                "truncate block max-w-xs",
                                                                val === null && "text-slate-300 italic"
                                                            )}>
                                                                {display}
                                                            </span>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center flex-1 text-slate-400 text-sm">
                                Sin resultados
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
