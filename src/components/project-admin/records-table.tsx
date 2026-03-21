'use client'

import { useState, useEffect } from 'react'
import {
    MoreHorizontal,
    Trash2,
    Edit2,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Database,
    Zap,
    ArrowUpDown,
    Plus
} from 'lucide-react'
import { TableVirtuoso } from 'react-virtuoso'
import { cn } from '@/lib/utils'
import { getFieldIcon } from '@/lib/icons'
import { useProject } from '@/contexts/ProjectContext'
import { toast } from 'sonner'
import FilterBuilder from './filter-builder'
import CellRenderer from './ui/CellRenderer'

interface RecordsTableProps {
    collection: any
    records: any[]
    onEdit: (record: any) => void
    onRefresh: () => void
    onFilterApply: (filter: string) => void
    currentFilter?: string
}

export default function RecordsTable({
    collection,
    records,
    onEdit,
    onRefresh,
    onFilterApply,
    currentFilter
}: RecordsTableProps) {
    const { deleteRecord, subscribe } = useProject()
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [isRealtimeActive, setIsRealtimeActive] = useState(false)

    // Realtime Subscription
    useEffect(() => {
        if (!collection?.name) return
        
        let unsub: (() => void) | undefined
        
        const initSubscription = async () => {
            try {
                unsub = await subscribe(collection.name, (data) => {
                    onRefresh()
                    toast(`Evento Realtime: ${data.action}`, {
                        description: `Colección ${collection.name} actualizada automáticamente.`,
                        icon: <Zap className="w-4 h-4 text-accent" />,
                        duration: 3000
                    })
                })
                setIsRealtimeActive(true)
            } catch (err) {
                console.error("Failed to subscribe:", err)
                setIsRealtimeActive(false)
            }
        }

        initSubscription()

        return () => {
            if (unsub) unsub()
            setIsRealtimeActive(false)
        }
    }, [collection?.name, onRefresh, subscribe])

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este registro?')) return
        try {
            await deleteRecord(collection.name, id)
            toast.success('Registro eliminado')
            onRefresh()
        } catch (err: any) {
            toast.error(`Error: ${err.message}`)
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === records.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(records.map(r => r.id))
        }
    }

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    if (!collection) return null

    return (
        <div className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden flex flex-col h-full backdrop-blur-sm animate-in fade-in duration-500">
            
            {/* Table Actions Header */}
            <div className="p-5 border-b border-border/50 bg-black/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="relative flex-1 max-w-sm group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
                        <input
                            type="text"
                            placeholder={`Buscar en ${collection.name}...`}
                            className="w-full bg-black/40 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-accent/50 focus:bg-black/60 transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Realtime Badge */}
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all",
                        isRealtimeActive 
                            ? "bg-accent/5 border-accent/20 text-accent shadow-[0_0_10px_rgba(55,255,208,0.05)]" 
                            : "bg-white/5 border-white/10 text-muted opacity-40 italic"
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", isRealtimeActive ? "bg-accent animate-pulse shadow-[0_0_8px_var(--accent)]" : "bg-muted")} />
                        {isRealtimeActive ? "Realtime Active" : "Polling Mode"}
                    </div>

                    <div className="h-6 w-px bg-border/50 mx-2" />

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all",
                            currentFilter || showFilters
                                ? "bg-accent/10 border-accent/50 text-accent"
                                : "bg-black/40 border-border text-muted hover:text-white hover:border-border-hover"
                        )}
                    >
                        <Filter className="w-3.5 h-3.5" />
                        Filtros {currentFilter && "(Activo)"}
                    </button>

                    {showFilters && (
                        <FilterBuilder
                            collection={collection}
                            onApply={onFilterApply}
                            onClose={() => setShowFilters(false)}
                        />
                    )}

                    {selectedIds.length > 0 && (
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-500 hover:bg-red-500/20 transition-all animate-in zoom-in-95 duration-200">
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar ({selectedIds.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Table Container with Virtualization */}
            <div className="flex-1 bg-black/10 overflow-hidden">
                <TableVirtuoso
                    className="h-full custom-scrollbar"
                    data={records}
                    fixedHeaderContent={() => (
                        <tr className="bg-[#0c0c0c] z-10 border-b border-border shadow-sm">
                            <th className="p-4 w-14 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === records.length && records.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-border bg-black/40 text-accent focus:ring-accent focus:ring-offset-0 transition-all"
                                />
                            </th>
                            <th className="p-4 w-32 content-center">
                                <div className="flex items-center gap-2 text-[10px] uppercase font-black text-muted tracking-widest">
                                    <Key className="w-3 h-3" /> ID
                                </div>
                            </th>
                            {collection.fields.map((field: any) => (
                                <th key={field.id} className="p-4 min-w-[150px] content-center">
                                    <div className="flex items-center gap-2 text-[10px] uppercase font-black text-muted tracking-widest group cursor-pointer hover:text-accent transition-colors">
                                        {getFieldIcon(field.type)}
                                        {field.name}
                                        <ArrowUpDown className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 w-40 content-center">
                                <div className="flex items-center gap-2 text-[10px] uppercase font-black text-muted tracking-widest">
                                    Creado
                                </div>
                            </th>
                            <th className="p-4 w-20"></th>
                        </tr>
                    )}
                    itemContent={(index, record) => (
                        <>
                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(record.id)}
                                    onChange={() => toggleSelect(record.id)}
                                    className="rounded border-border bg-black/40 text-accent focus:ring-accent focus:ring-offset-0 transition-all"
                                />
                            </td>
                            <td className="p-4 align-middle">
                                <span className="text-[10px] font-mono text-muted/60 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    {record.id}
                                </span>
                            </td>
                            {collection.fields.map((field: any) => (
                                <td key={field.id} className="p-4 text-sm align-middle">
                                    <CellRenderer 
                                        value={record[field.name]} 
                                        type={field.type} 
                                        fieldName={field.name}
                                        record={record}
                                    />
                                </td>
                            ))}
                            <td className="p-4 align-middle">
                                <div className="text-[10px] text-muted font-medium bg-white/5 w-fit px-2 py-1 rounded-lg border border-white/5">
                                    {new Date(record.created).toLocaleString()}
                                </div>
                            </td>
                            <td className="p-4 align-middle" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">
                                    <button
                                        onClick={() => onEdit(record)}
                                        className="p-2 rounded-lg hover:bg-accent/10 text-muted hover:text-accent transition-all"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-500 transition-all"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </>
                    )}
                    components={{
                        Table: ({ children, ...props }) => (
                            <table {...props} className="w-full text-left border-collapse table-fixed group/table">
                                {children}
                            </table>
                        ),
                        TableRow: ({ children, ...props }) => {
                            const index = (props as any)['data-index'];
                            const record = records[index];
                            return (
                                <tr 
                                    {...props} 
                                    className={cn(
                                        "group transition-all duration-200 border-b border-border/30 hover:bg-white/[0.02]",
                                        record && selectedIds.includes(record.id) && "bg-accent/[0.03]"
                                    )}
                                    onClick={() => record && onEdit(record)}
                                >
                                    {children}
                                </tr>
                            );
                        }
                    }}
                />
                
                {records.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center p-24 text-center bg-black/5">
                        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="p-6 bg-white/[0.02] rounded-full border border-white/5 relative">
                                <Database className="w-12 h-12 text-muted/20" />
                                <div className="absolute -right-2 -top-2 w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center animate-pulse">
                                    <Plus className="w-3 h-3 text-accent" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold text-white/50">Vacío Absoluto</p>
                                <p className="text-xs text-muted/40 font-mono uppercase tracking-widest">No hay registros detectados en {collection.name}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination & Footer Info */}
            <div className="p-5 border-t border-border/50 bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                        Total: <span className="text-white ml-1">{records.length} registros</span>
                    </span>
                    {selectedIds.length > 0 && (
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                            {selectedIds.length} seleccionados
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs text-muted hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
                        <ChevronLeft className="w-4 h-4" /> Anterior
                    </button>
                    <div className="flex items-center gap-1 px-4">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <div className="w-2 h-2 rounded-full bg-border" />
                        <div className="w-2 h-2 rounded-full bg-border" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-xs text-muted hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
                        Siguiente <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function Key(props: any) {
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
          <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.4Z"/>
          <path d="m3.9 13.9 8.6-8.6"/>
          <path d="m6.4 16.4 4.4-4.4"/>
          <path d="m15.8 4.7 5.5 5.5a2 2 0 0 1 0 2.8l-8.1 8.1a2 2 0 0 1-2.8 0l-5.5-5.5a2 2 0 0 1 0-2.8l8.1-8.1a2 2 0 0 1 2.8 0Z"/>
        </svg>
    )
}
