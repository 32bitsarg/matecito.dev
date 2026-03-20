'use client'

import { useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Code2,
    Play,
    Copy,
    Check,
    Database,
    ArrowRight,
    Terminal,
    RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ApiExplorerPage() {
    const { collections, loading } = useProject()
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null)
    const [responses, setResponses] = useState<any>({})

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        toast.success('Copiado al portapapeles')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const testEndpoint = async (collectionName: string, method: string) => {
        const id = `${collectionName}-${method}`
        setActiveEndpoint(id)

        try {
            // Simulamos la llamada o hacemos una real a un registro de prueba
            // Para el demo, mostramos un JSON de ejemplo basado en el esquema
            const exampleData: any = {
                id: "RECORD_ID",
                collectionId: "COLLECTION_ID",
                collectionName: collectionName,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            }

            const collection = collections.find(c => c.name === collectionName)
            collection?.fields?.forEach((f: any) => {
                exampleData[f.name] = f.type === 'bool' ? true : f.type === 'number' ? 123 : "Ejemplo"
            })

            setResponses({ ...responses, [id]: exampleData })
        } finally {
            setTimeout(() => setActiveEndpoint(null), 500)
        }
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3ECF8E] border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                    <Code2 className="text-[#3ECF8E]" /> Explorador de API
                </h1>
                <p className="text-[#a1a1aa]">Documentación interactiva de tus endpoints REST generada automáticamente</p>
            </div>

            {/* Endpoints List */}
            <div className="space-y-12">
                {collections.map((collection) => (
                    <section key={collection.id} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-[#222222] pb-4">
                            <Database className="w-5 h-5 text-white opacity-40" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">{collection.name}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* GET List */}
                            <EndpointRow
                                method="GET"
                                path={`/api/collections/${collection.name}/records`}
                                description={`Listar todos los registros de ${collection.name}`}
                                onCopy={(t: string) => handleCopy(t, `${collection.name}-get`)}
                                isCopied={copiedId === `${collection.name}-get`}
                                onTest={() => testEndpoint(collection.name, 'GET')}
                                isLoading={activeEndpoint === `${collection.name}-GET`}
                                response={responses[`${collection.name}-GET`]}
                            />

                            {/* POST Create */}
                            <EndpointRow
                                method="POST"
                                path={`/api/collections/${collection.name}/records`}
                                description={`Crear un nuevo registro en ${collection.name}`}
                                onCopy={(t: string) => handleCopy(t, `${collection.name}-post`)}
                                isCopied={copiedId === `${collection.name}-post`}
                                onTest={() => testEndpoint(collection.name, 'POST')}
                                isLoading={activeEndpoint === `${collection.name}-POST`}
                                response={responses[`${collection.name}-POST`]}
                            />
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}

function EndpointRow({ method, path, description, onCopy, isCopied, onTest, isLoading, response }: any) {
    const methodColors: any = {
        GET: "bg-blue-500/10 text-blue-500",
        POST: "bg-green-500/10 text-green-500",
        PATCH: "bg-yellow-500/10 text-yellow-500",
        DELETE: "bg-red-500/10 text-red-500"
    }

    return (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden group hover:border-[#3ECF8E]/30 transition-all">
            <div className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={cn("px-2.5 py-1 rounded text-[10px] font-bold min-w-[50px] text-center", methodColors[method])}>
                        {method}
                    </span>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 group/url">
                            <span className="text-xs font-mono text-[#a1a1aa] truncate">{path}</span>
                            <button
                                onClick={() => onCopy(`https://[SU_SUBDOMINIO].matecito.dev${path}`)}
                                className="opacity-0 group-hover/url:opacity-100 p-1 hover:text-white transition-all transition-opacity underline-none"
                            >
                                {isCopied ? <Check className="w-3 h-3 text-[#3ECF8E]" /> : <Copy className="w-3 h-3" />}
                            </button>
                        </div>
                        <p className="text-[10px] text-[#52525b] font-medium mt-0.5">{description}</p>
                    </div>
                </div>
                <button
                    onClick={onTest}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E] text-[10px] font-bold hover:bg-[#3ECF8E]/20 transition-all active:scale-95 disabled:opacity-50"
                >
                    {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                    PROBAR
                </button>
            </div>

            {/* Response Section */}
            {response && (
                <div className="border-t border-[#222222] bg-[#0c0c0c]/50 p-4 font-mono text-xs animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#52525b]">
                            <Terminal className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Respuesta JSON</span>
                        </div>
                        <button
                            onClick={() => onCopy(JSON.stringify(response, null, 2))}
                            className="text-[#52525b] hover:text-white transition-colors underline-none"
                        >
                            <Copy className="w-3 h-3" />
                        </button>
                    </div>
                    <pre className="text-blue-200 overflow-x-auto custom-scrollbar p-2 bg-[#0c0c0c] rounded-lg">
                        {JSON.stringify(response, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}
