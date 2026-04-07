'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { useProject } from '@/contexts/ProjectContext'
import type { Field } from '@/contexts/ProjectContext'
import {
    Database, Plus, Trash2, Pencil, Loader2, RefreshCw,
    ChevronLeft, ChevronRight, X, Save, Search, ToggleLeft, ToggleRight,
    Download, RotateCcw, Skull, EyeOff, Eye,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getToken } from '@/lib/api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

interface RecordRow {
    id: string
    collection: string
    data: Record<string, any>
    created_at: string
    updated_at: string
    deleted_at?: string | null
}

// ─── Field input by type ──────────────────────────────────────────────────────

function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
    const base = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-violet-400 focus:bg-white transition-all"

    if (field.type === 'bool') {
        const checked = Boolean(value)
        return (
            <button type="button" onClick={() => onChange(!checked)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all hover:border-violet-300">
                {checked ? <ToggleRight className="w-5 h-5 text-violet-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                <span className={checked ? 'text-violet-700 font-semibold' : 'text-slate-500'}>{checked ? 'true' : 'false'}</span>
            </button>
        )
    }
    if (field.type === 'number') return <input type="number" className={base} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))} />
    if (field.type === 'email')  return <input type="email"  className={base} value={value ?? ''} onChange={e => onChange(e.target.value)} />
    if (field.type === 'date')   return <input type="date"   className={base} value={value ?? ''} onChange={e => onChange(e.target.value)} />

    if (field.type === 'select') {
        const opts: string[] = field.options?.values ?? []
        const maxSelect: number = field.options?.maxSelect ?? 1
        if (maxSelect > 1) {
            const selected: string[] = Array.isArray(value) ? value : []
            const toggle = (v: string) => {
                if (selected.includes(v)) onChange(selected.filter(s => s !== v))
                else if (selected.length < maxSelect) onChange([...selected, v])
            }
            return (
                <div className="flex flex-wrap gap-2">
                    {opts.map(opt => (
                        <button key={opt} type="button" onClick={() => toggle(opt)}
                            className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                selected.includes(opt) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300")}>
                            {opt}
                        </button>
                    ))}
                    <span className="text-[10px] text-slate-400 self-center">máx {maxSelect}</span>
                </div>
            )
        }
        return (
            <select className={base} value={value ?? ''} onChange={e => onChange(e.target.value)}>
                <option value="">— sin selección —</option>
                {opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        )
    }

    if (field.type === 'json') {
        const str = typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2)
        return (
            <textarea rows={4} className="w-full px-3 py-2 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl outline-none focus:ring-2 focus:ring-violet-500/30 resize-none"
                value={str}
                onChange={e => { try { onChange(JSON.parse(e.target.value)) } catch { onChange(e.target.value) } }} />
        )
    }
    if (field.type === 'relation') return <input type="text" placeholder="UUID del registro relacionado" className={cn(base, "font-mono text-xs")} value={value ?? ''} onChange={e => onChange(e.target.value)} />
    return <input type="text" className={base} value={value ?? ''} onChange={e => onChange(e.target.value)} />
}

// ─── Export dropdown ──────────────────────────────────────────────────────────

function ExportMenu({ projectId, collection }: { projectId: string; collection: string }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
        document.addEventListener('mousedown', close)
        return () => document.removeEventListener('mousedown', close)
    }, [])

    const download = async (format: 'json' | 'csv') => {
        setOpen(false)
        try {
            const token = getToken()
            const res = await fetch(
                `${API_BASE}/api/v1/project/${projectId}/records/export?collection=${encodeURIComponent(collection)}&format=${format}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (!res.ok) throw new Error((await res.json()).error || 'Export failed')
            const blob = await res.blob()
            const url  = URL.createObjectURL(blob)
            const a    = document.createElement('a')
            a.href     = url
            a.download = `${collection}.${format}`
            a.click()
            URL.revokeObjectURL(url)
        } catch (err: any) {
            toast.error('Error al exportar: ' + err.message)
        }
    }

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(v => !v)}
                className="flex items-center gap-1.5 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <Download className="w-4 h-4" />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-10 w-32">
                    <button onClick={() => download('json')}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                        Exportar JSON
                    </button>
                    <button onClick={() => download('csv')}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100">
                        Exportar CSV
                    </button>
                </div>
            )}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DataPage() {
    const { collections, projectId, fetchRecords, createRecord, updateRecord, deleteRecord, restoreRecord, hardDeleteRecord, loading: ctxLoading } = useProject()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const selectedCollection = searchParams.get('col') ?? collections[0]?.name ?? null

    const [records,        setRecords]        = useState<RecordRow[]>([])
    const [total,          setTotal]          = useState(0)
    const [page,           setPage]           = useState(1)
    const [loadingRecords, setLoadingRecords] = useState(false)
    const [search,         setSearch]         = useState('')
    const [showDeleted,    setShowDeleted]    = useState(false)

    const [modal,      setModal]      = useState<{ mode: 'create' | 'edit'; record?: RecordRow } | null>(null)
    const [formValues, setFormValues] = useState<Record<string, any>>({})
    const [extraJson,  setExtraJson]  = useState('{}')
    const [saving,     setSaving]     = useState(false)
    const [deleting,   setDeleting]   = useState<string | null>(null)

    const LIMIT = 50

    const currentCollection = collections.find(c => c.name === selectedCollection)
    const fields = currentCollection?.fields ?? []
    const SYSTEM_KEYS = new Set(['created_at', 'updated_at', 'created_by'])
    const definedColumns = fields.filter(f => !SYSTEM_KEYS.has(f.name)).slice(0, 6).map(f => f.name)
    const derivedColumns = definedColumns.length === 0 && records.length > 0
        ? Object.keys(records[0].data ?? {}).filter(k => !SYSTEM_KEYS.has(k)).slice(0, 6)
        : []
    const dataColumns = definedColumns.length > 0 ? definedColumns : derivedColumns

    const selectCollection = useCallback((name: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('col', name)
        router.replace(`${pathname}?${params.toString()}`)
        setPage(1)
        setSearch('')
    }, [pathname, router, searchParams])

    const loadRecords = useCallback(async () => {
        if (!selectedCollection) return
        setLoadingRecords(true)
        try {
            const res = await fetchRecords(selectedCollection, showDeleted ? { include_deleted: 'true' } : undefined)
            const rows: RecordRow[] = Array.isArray(res) ? res : (res.records ?? [])
            setRecords(rows)
            setTotal(res.pagination?.total ?? rows.length)
        } catch (err: any) {
            toast.error('Error al cargar registros: ' + err.message)
        } finally {
            setLoadingRecords(false)
        }
    }, [selectedCollection, fetchRecords, showDeleted])

    useEffect(() => { loadRecords() }, [loadRecords])

    const openCreate = () => {
        const defaults: Record<string, any> = {}
        fields.forEach(f => {
            if (f.type === 'bool') defaults[f.name] = false
            else if (f.type === 'number') defaults[f.name] = null
            else if (f.type === 'select' && (f.options?.maxSelect ?? 1) > 1) defaults[f.name] = []
            else defaults[f.name] = ''
        })
        setFormValues(defaults)
        setExtraJson('{}')
        setModal({ mode: 'create' })
    }

    const openEdit = (record: RecordRow) => {
        const values: Record<string, any> = {}
        fields.forEach(f => { values[f.name] = record.data?.[f.name] ?? '' })
        const knownKeys = new Set(fields.map(f => f.name))
        const extra: Record<string, any> = {}
        Object.entries(record.data ?? {}).forEach(([k, v]) => { if (!knownKeys.has(k)) extra[k] = v })
        setFormValues(values)
        setExtraJson(Object.keys(extra).length ? JSON.stringify(extra, null, 2) : '{}')
        setModal({ mode: 'edit', record })
    }

    const closeModal = () => setModal(null)

    const handleSave = async () => {
        let extra: Record<string, any> = {}
        try {
            const parsed = JSON.parse(extraJson)
            if (typeof parsed === 'object' && parsed !== null) extra = parsed
        } catch {
            toast.error('Los campos extra contienen JSON inválido')
            return
        }
        const data = { ...extra, ...formValues }
        Object.keys(data).forEach(k => { if (data[k] === '') data[k] = null })
        setSaving(true)
        try {
            if (modal?.mode === 'create') {
                await createRecord(selectedCollection!, data)
                toast.success('Registro creado')
            } else if (modal?.mode === 'edit' && modal.record) {
                await updateRecord(modal.record.id, data)
                toast.success('Registro actualizado')
            }
            closeModal()
            loadRecords()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (deleting !== id) {
            setDeleting(id)
            setTimeout(() => setDeleting(d => d === id ? null : d), 3000)
            return
        }
        try {
            await deleteRecord(id)
            toast.success('Registro eliminado')
            loadRecords()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setDeleting(null)
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreRecord(id)
            toast.success('Registro restaurado')
            loadRecords()
        } catch (err: any) {
            toast.error('Error al restaurar: ' + err.message)
        }
    }

    const handleHardDelete = async (id: string) => {
        if (!confirm('¿Eliminar definitivamente? Esta acción no se puede deshacer.')) return
        try {
            await hardDeleteRecord(id)
            toast.success('Eliminado definitivamente')
            loadRecords()
        } catch (err: any) {
            toast.error(err.message)
        }
    }

    const filtered = search.trim()
        ? records.filter(r => JSON.stringify(r.data).toLowerCase().includes(search.toLowerCase()))
        : records

    const totalPages = Math.ceil(total / LIMIT)

    if (ctxLoading && collections.length === 0) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
    }

    return (
        <>
            <div className="flex gap-6 h-[calc(100vh-8rem)]">
                {/* Collection list */}
                <aside className="w-52 shrink-0 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Colecciones</p>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                        {collections.length === 0 ? (
                            <p className="text-xs text-slate-400 text-center py-8 px-3 italic">Sin colecciones.<br />Crealas en Esquema.</p>
                        ) : (
                            collections.map(col => (
                                <button key={col.name} onClick={() => selectCollection(col.name)}
                                    className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all",
                                        selectedCollection === col.name ? "bg-violet-50 text-violet-700 font-semibold" : "text-slate-600 hover:bg-slate-50")}>
                                    <Database className={cn("w-3.5 h-3.5 shrink-0", selectedCollection === col.name ? "text-violet-500" : "text-slate-400")} />
                                    <span className="truncate font-mono text-xs">{col.name}</span>
                                </button>
                            ))
                        )}
                    </nav>
                </aside>

                {/* Records panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {!selectedCollection ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                            <Database className="w-10 h-10 text-slate-300" />
                            <p className="text-slate-500 font-medium">Seleccioná una colección</p>
                        </div>
                    ) : (
                        <>
                            {/* Toolbar */}
                            <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <h2 className="font-bold text-slate-900 font-mono">{selectedCollection}</h2>
                                    <span className="text-xs text-slate-400">({total} registros)</span>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <input type="text" placeholder="Filtrar..."
                                        value={search} onChange={e => setSearch(e.target.value)}
                                        className="w-44 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:border-violet-400 transition-all" />
                                </div>
                                {/* Toggle deleted */}
                                <button onClick={() => setShowDeleted(v => !v)}
                                    title={showDeleted ? 'Ocultar eliminados' : 'Mostrar eliminados'}
                                    className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                        showDeleted ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300")}>
                                    {showDeleted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    {showDeleted ? 'Con eliminados' : 'Eliminados'}
                                </button>
                                <ExportMenu projectId={projectId} collection={selectedCollection} />
                                <button onClick={loadRecords} title="Recargar"
                                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                    <RefreshCw className={cn("w-4 h-4", loadingRecords && "animate-spin")} />
                                </button>
                                <button onClick={openCreate}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Nuevo
                                </button>
                            </div>

                            {/* Table */}
                            <div className="flex-1 overflow-auto">
                                {loadingRecords ? (
                                    <div className="flex items-center justify-center h-40">
                                        <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
                                    </div>
                                ) : filtered.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 gap-2">
                                        <Database className="w-8 h-8 text-slate-300" />
                                        <p className="text-sm text-slate-400">{search ? 'Sin resultados para ese filtro' : 'Sin registros aún'}</p>
                                        {!search && (
                                            <button onClick={openCreate} className="text-xs text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                                                + Crear el primero
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                                            <tr>
                                                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24">ID</th>
                                                {dataColumns.map(col => (
                                                    <th key={col} className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{col}</th>
                                                ))}
                                                {dataColumns.length === 0 && (
                                                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">campos</th>
                                                )}
                                                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creado</th>
                                                <th className="w-24" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filtered.map(record => {
                                                const isDeleted = !!record.deleted_at
                                                return (
                                                    <tr key={record.id}
                                                        className={cn("transition-colors group",
                                                            isDeleted ? "bg-red-50/40 hover:bg-red-50" : "hover:bg-slate-50")}>
                                                        <td className="px-4 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <code className="text-[10px] text-slate-400 font-mono">{record.id.slice(0, 8)}…</code>
                                                                {isDeleted && (
                                                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-red-100 text-red-500 border border-red-200 rounded">
                                                                        Eliminado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        {dataColumns.length > 0
                                                            ? dataColumns.map(col => (
                                                                <td key={col} className="px-4 py-2.5">
                                                                    <span className="text-slate-700 font-mono truncate max-w-[160px] block">{formatCell(record.data?.[col])}</span>
                                                                </td>
                                                            ))
                                                            : (
                                                                <td className="px-4 py-2.5">
                                                                    <span className="text-slate-400 text-xs font-mono">
                                                                        {Object.entries(record.data ?? {})
                                                                            .filter(([k]) => !SYSTEM_KEYS.has(k))
                                                                            .slice(0, 3)
                                                                            .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}`)
                                                                            .join(' · ') || '—'}
                                                                    </span>
                                                                </td>
                                                            )
                                                        }
                                                        <td className="px-4 py-2.5 text-slate-400">
                                                            {new Date(record.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {isDeleted ? (
                                                                    <>
                                                                        <button onClick={() => handleRestore(record.id)}
                                                                            title="Restaurar"
                                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => handleHardDelete(record.id)}
                                                                            title="Eliminar definitivamente"
                                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                                                                            <Skull className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button onClick={() => openEdit(record)}
                                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all">
                                                                            <Pencil className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => handleDelete(record.id)}
                                                                            title={deleting === record.id ? 'Click para confirmar' : 'Eliminar'}
                                                                            className={cn("p-1.5 rounded-lg transition-all",
                                                                                deleting === record.id ? "bg-red-500 text-white" : "text-slate-400 hover:text-red-500 hover:bg-red-50")}>
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 text-xs text-slate-500">
                                    <span>{filtered.length} de {total} registros</span>
                                    <div className="flex items-center gap-2">
                                        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                                            className="p-1 rounded-lg disabled:opacity-30 hover:bg-slate-100 transition-colors">
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <span>Pág. {page} / {totalPages}</span>
                                        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                                            className="p-1 rounded-lg disabled:opacity-30 hover:bg-slate-100 transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {modal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
                    <div className="absolute inset-0" onClick={closeModal} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                {modal.mode === 'create' ? <Plus className="w-4 h-4 text-violet-600" /> : <Pencil className="w-4 h-4 text-violet-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900">
                                    {modal.mode === 'create' ? `Nuevo registro — ${selectedCollection}` : 'Editar registro'}
                                </h3>
                                {modal.record && <p className="text-[10px] text-slate-400 font-mono truncate">{modal.record.id}</p>}
                            </div>
                            <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                            {fields.length === 0 ? (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Data <span className="font-normal text-slate-400 normal-case">(JSON libre)</span>
                                    </label>
                                    <textarea rows={10} value={extraJson} onChange={e => setExtraJson(e.target.value)} spellCheck={false}
                                        className="w-full font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl p-4 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none leading-relaxed" />
                                </div>
                            ) : (
                                <>
                                    {fields.map(field => (
                                        <div key={field.id} className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                                {field.name}
                                                <span className="font-normal text-slate-400">{field.type}</span>
                                                {field.required && <span className="text-red-400">*</span>}
                                            </label>
                                            <FieldInput field={field} value={formValues[field.name]} onChange={v => setFormValues(prev => ({ ...prev, [field.name]: v }))} />
                                        </div>
                                    ))}
                                    <details className="group">
                                        <summary className="text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors select-none">
                                            + Campos adicionales (JSON)
                                        </summary>
                                        <div className="mt-2">
                                            <textarea rows={4} value={extraJson} onChange={e => setExtraJson(e.target.value)} spellCheck={false} placeholder='{}'
                                                className="w-full font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none leading-relaxed" />
                                        </div>
                                    </details>
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 shrink-0">
                            <button onClick={closeModal}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                Cancelar
                            </button>
                            <button onClick={handleSave} disabled={saving}
                                className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-50 transition-all">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {modal.mode === 'create' ? 'Crear registro' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

function formatCell(value: any): string {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'boolean') return value ? 'true' : 'false'
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value)
    const str = String(value)
    return str.length > 40 ? str.slice(0, 40) + '…' : str
}
