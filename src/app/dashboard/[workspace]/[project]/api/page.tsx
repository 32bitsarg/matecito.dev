'use client'

import { useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { Code2, Copy, Check, Database, Play, RefreshCw, Terminal, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const METHOD_STYLES: Record<string, string> = {
    GET:    'bg-blue-50 text-blue-600 border-blue-200',
    POST:   'bg-emerald-50 text-emerald-600 border-emerald-200',
    PATCH:  'bg-amber-50 text-amber-600 border-amber-200',
    DELETE: 'bg-red-50 text-red-600 border-red-200',
}

export default function ApiExplorerPage() {
    const { collections, loading, project, fetchRecords, projectId } = useProject()
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [responses, setResponses] = useState<Record<string, any>>({})
    const [testing, setTesting] = useState<string | null>(null)

    const copy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        toast.success('Copiado')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const testEndpoint = async (collection: any, method: string) => {
        const id = `${collection.name}-${method}`

        if (method === 'GET') {
            setTesting(id)
            try {
                const res = await fetchRecords(collection.name)
                setResponses(prev => ({ ...prev, [id]: res }))
            } catch (err: any) {
                toast.error('Error: ' + err.message)
            } finally {
                setTesting(null)
            }
        } else {
            // Para métodos mutables mostramos ejemplo de body sin ejecutar
            const example: Record<string, any> = { collection: collection.name, data: {} }
            collection.fields?.forEach((f: any) => {
                example.data[f.name] = f.type === 'bool' ? true : f.type === 'number' ? 0 : f.type === 'date' ? new Date().toISOString() : 'ejemplo'
            })
            if (method === 'PATCH' || method === 'DELETE') {
                setResponses(prev => ({ ...prev, [id]: { _note: `Reemplazá :id con el ID del registro`, ...example } }))
            } else {
                setResponses(prev => ({ ...prev, [id]: example }))
            }
        }
    }

    const baseUrl = project?.subdomain ? `https://${project.subdomain}.matecito.dev` : 'https://[proyecto].matecito.dev'

    if (loading) return (
        <div className="flex items-center justify-center h-48">
            <RefreshCw className="w-6 h-6 animate-spin text-violet-400" />
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">API Explorer</h1>
                    <p className="text-xs text-slate-400">Documentación interactiva generada automáticamente</p>
                </div>
            </div>

            {/* Base URL */}
            <div className="bg-slate-900 rounded-2xl px-5 py-3 flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider shrink-0">Base URL</span>
                <code className="text-sm font-mono text-violet-400 flex-1 truncate">{baseUrl}</code>
            </div>

            {collections.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
                    <Database className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">No hay colecciones. Creá una en el Esquema de Datos.</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {collections.map(col => (
                        <div key={col.name}>
                            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <Database className="w-3.5 h-3.5 text-violet-500" />
                                </div>
                                <h2 className="font-bold text-slate-800 font-mono">{col.name}</h2>
                                <span className="text-xs text-slate-300">{col.records_count ?? 0} registros</span>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { method: 'GET',    path: `/api/v1/project/:id/records?collection=${col.name}`, desc: `Listar registros de ${col.name}` },
                                    { method: 'POST',   path: `/api/v1/project/:id/records`,                        desc: `Crear registro en ${col.name}` },
                                    { method: 'PATCH',  path: `/api/v1/project/:id/records/:id`,                    desc: `Actualizar registro` },
                                    { method: 'DELETE', path: `/api/v1/project/:id/records/:id`,                    desc: `Eliminar registro` },
                                ].map(ep => {
                                    const id = `${col.name}-${ep.method}`
                                    const copied = copiedId === id
                                    const response = responses[id]
                                    const isLoading = testing === id
                                    const isGet = ep.method === 'GET'
                                    return (
                                        <div key={id}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-violet-200 transition-all shadow-sm">
                                            <div className="flex items-center justify-between gap-4 p-4">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded border w-16 text-center", METHOD_STYLES[ep.method])}>
                                                        {ep.method}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <code className="text-xs font-mono text-slate-500 truncate block">{ep.path}</code>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{ep.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => copy(`${baseUrl}${ep.path}`, id)}
                                                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        onClick={() => testEndpoint(col, ep.method)}
                                                        disabled={isLoading}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-bold rounded-lg hover:bg-violet-100 transition-all border border-violet-200 disabled:opacity-50">
                                                        {isLoading
                                                            ? <Loader2 className="w-3 h-3 animate-spin" />
                                                            : <Play className="w-3 h-3" />
                                                        }
                                                        {isGet ? 'Ejecutar' : 'Ejemplo'}
                                                    </button>
                                                </div>
                                            </div>
                                            {response && (
                                                <div className="border-t border-slate-100 bg-slate-900 p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                                                            {isGet ? 'Respuesta real' : 'Body de ejemplo'}
                                                        </span>
                                                        <button onClick={() => copy(JSON.stringify(response, null, 2), `copy-${id}`)}
                                                            className="ml-auto text-slate-600 hover:text-slate-400">
                                                            <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <pre className="text-xs font-mono text-violet-300 overflow-x-auto leading-relaxed">
                                                        {JSON.stringify(response, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
