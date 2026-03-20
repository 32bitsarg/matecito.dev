'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/contexts/ProjectContext'
import { Plus, Database, RefreshCw } from 'lucide-react'
import RecordsTable from '@/components/project-admin/records-table'
import RecordModal from '@/components/project-admin/record-modal'

export default function CollectionRecordsPage() {
    const { collectionName } = useParams()
    const {
        records,
        loading,
        fetchRecords,
        getCollectionSchema
    } = useProject()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<any>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const collection = getCollectionSchema(collectionName as string)

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
                <Database className="w-20 h-16 text-[var(--accent)] opacity-10" />
                <h2 className="text-2xl font-bold text-[var(--accent)]">Colección no encontrada</h2>
                <p className="text-[var(--foreground)] opacity-60 font-mono text-sm uppercase tracking-widest">La colección <span className="text-[var(--accent)] font-bold">"{collectionName}"</span> no existe en esta arquitectura.</p>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold text-[var(--accent)] capitalize">{collectionName}</h1>
                    <p className="text-[10px] font-mono text-[var(--foreground)] opacity-40 uppercase tracking-[0.2em]">Gestionando registros y micro-servicios de datos</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={loadData}
                        disabled={loading || isRefreshing}
                        className="p-3.5 rounded-full bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-all disabled:opacity-30 shadow-sm"
                        title="Refrescar datos"
                    >
                        <RefreshCw className={cn("w-4 h-4", (loading || isRefreshing) && "animate-spin")} />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[var(--accent)] text-[var(--background)] text-sm font-bold hover:opacity-90 transition-all shadow-xl shadow-[var(--accent)]/20 uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Registro
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 min-h-0">
                {loading && !isRefreshing ? (
                    <div className="h-full bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-3xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-6">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
                            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent)] animate-pulse">Sincronizando Base de Datos...</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[var(--background)] border border-[var(--accent)]/10 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col">
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

// Pequeño helper para el icono de carga (cn no estaba importado en el snippet anterior)
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
