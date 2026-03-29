'use client'

import { useProject } from '@/contexts/ProjectContext'
import type { Collection, Field, FieldType } from '@/contexts/ProjectContext'
import {
    Plus, Database, Search, Trash2, Edit3, X,
    ChevronDown, ChevronRight, Type, Hash, ToggleLeft, Mail,
    Calendar, FileIcon, Braces, Link2, Loader2, RefreshCw, ListFilter
} from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import DeleteCollectionModal from '@/components/project-admin/delete-collection-modal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Field type metadata ──────────────────────────────────────────────────────

const FIELD_TYPES: { value: FieldType; label: string; icon: React.ElementType; color: string; bg: string }[] = [
    { value: 'text',     label: 'Texto',    icon: Type,       color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
    { value: 'number',   label: 'Número',   icon: Hash,       color: 'text-amber-600',  bg: 'bg-amber-50 border-amber-200' },
    { value: 'bool',     label: 'Bool',     icon: ToggleLeft, color: 'text-green-600',  bg: 'bg-green-50 border-green-200' },
    { value: 'email',    label: 'Email',    icon: Mail,       color: 'text-pink-600',   bg: 'bg-pink-50 border-pink-200' },
    { value: 'date',     label: 'Fecha',    icon: Calendar,   color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { value: 'file',     label: 'Archivo',  icon: FileIcon,   color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    { value: 'json',     label: 'JSON',     icon: Braces,     color: 'text-cyan-600',    bg: 'bg-cyan-50 border-cyan-200' },
    { value: 'relation', label: 'Relación', icon: Link2,      color: 'text-violet-600',  bg: 'bg-violet-50 border-violet-200' },
    { value: 'select',   label: 'Select',   icon: ListFilter, color: 'text-indigo-600',  bg: 'bg-indigo-50 border-indigo-200' },
]

function getFieldMeta(type: FieldType) {
    return FIELD_TYPES.find(t => t.value === type) ?? FIELD_TYPES[0]
}

// ─── Add Field inline (dentro de una colección expandida) ─────────────────────

function AddFieldInline({ collectionName, onDone }: { collectionName: string; onDone: () => void }) {
    const { addField, collections: existingCollections } = useProject()
    const [name, setName] = useState('')
    const [type, setType] = useState<FieldType>('text')
    const [required, setRequired] = useState(false)
    const [relationTarget, setRelationTarget] = useState('')
    const [selectValues, setSelectValues] = useState('')
    const [maxSelect, setMaxSelect] = useState(1)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const fieldName = name.trim().toLowerCase().replace(/\s+/g, '_')
        if (!fieldName) return
        setLoading(true)
        try {
            let options: Record<string, any> = {}
            if (type === 'relation' && relationTarget) options = { target: relationTarget }
            if (type === 'select') {
                const values = selectValues.split(',').map(v => v.trim()).filter(Boolean)
                options = { values, maxSelect }
            }
            await addField(collectionName, { name: fieldName, type, required, options })
            toast.success(`Campo "${fieldName}" agregado`)
            setName('')
            setType('text')
            setRequired(false)
            onDone()
        } catch (err: any) {
            toast.error(err.message || 'Error al crear campo')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}
            className="flex flex-wrap items-center gap-2 p-3 bg-violet-50 border border-violet-100 rounded-xl mt-1">
            <input
                type="text"
                required
                autoFocus
                placeholder="nombre_campo"
                value={name}
                onChange={e => setName(e.target.value)}
                className="flex-1 min-w-[140px] bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-violet-400 transition-all"
            />
            <select
                value={type}
                onChange={e => { setType(e.target.value as FieldType); setRelationTarget(''); setSelectValues(''); setMaxSelect(1) }}
                className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-violet-400 transition-all"
            >
                {FIELD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                ))}
            </select>
            {type === 'relation' && (
                <select
                    value={relationTarget}
                    onChange={e => setRelationTarget(e.target.value)}
                    className={cn(
                        'bg-white border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400 transition-all',
                        !relationTarget ? 'border-violet-300 text-violet-500' : 'border-slate-200 text-slate-700'
                    )}
                >
                    <option value="">→ colección</option>
                    {existingCollections.filter(c => c.name !== collectionName).map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                </select>
            )}
            {type === 'select' && (
                <>
                    <input
                        type="text"
                        placeholder="op1, op2, op3"
                        value={selectValues}
                        onChange={e => setSelectValues(e.target.value)}
                        className="w-32 bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 transition-all"
                    />
                    <input
                        type="number"
                        min={1}
                        max={20}
                        value={maxSelect}
                        onChange={e => setMaxSelect(Number(e.target.value))}
                        title="Max selecciones"
                        className="w-16 bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 transition-all"
                    />
                </>
            )}
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                <input type="checkbox" checked={required} onChange={e => setRequired(e.target.checked)}
                    className="accent-violet-600" />
                Requerido
            </label>
            <div className="flex gap-1.5">
                <button type="button" onClick={onDone}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 hover:bg-slate-100 transition-all">
                    Cancelar
                </button>
                <button type="submit" disabled={loading || !name.trim()}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 disabled:opacity-50 transition-all">
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Agregar
                </button>
            </div>
        </form>
    )
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({ field, collectionName }: { field: Field; collectionName: string }) {
    const { deleteField } = useProject()
    const [deleting, setDeleting] = useState(false)
    const meta = getFieldMeta(field.type)
    const Icon = meta.icon

    const handleDelete = async () => {
        if (!confirm(`¿Eliminar el campo "${field.name}"?`)) return
        setDeleting(true)
        try {
            await deleteField(collectionName, field.id)
            toast.success(`Campo "${field.name}" eliminado`)
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 group hover:bg-slate-50 rounded-xl transition-colors">
            <div className={cn('p-1.5 rounded-lg border', meta.bg)}>
                <Icon className={cn('w-3 h-3', meta.color)} />
            </div>
            <span className="text-sm font-mono text-slate-700 flex-1">{field.name}</span>
            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', meta.bg, meta.color)}>
                {meta.label}
            </span>
            {field.type === 'relation' && field.options?.target && (
                <span className="text-[9px] font-mono text-violet-500 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded flex items-center gap-1">
                    <Link2 className="w-2.5 h-2.5" />{field.options.target}
                </span>
            )}
            {field.type === 'select' && field.options?.values?.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                    {(field.options.values as string[]).slice(0, 4).map((v: string) => (
                        <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-600 font-mono">
                            {v}
                        </span>
                    ))}
                    {field.options.values.length > 4 && (
                        <span className="text-[9px] text-slate-400">+{field.options.values.length - 4}</span>
                    )}
                    {field.options.maxSelect > 1 && (
                        <span className="text-[9px] text-slate-400 ml-0.5">max {field.options.maxSelect}</span>
                    )}
                </div>
            )}
            {field.required && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-500 border border-red-200">
                    Req.
                </span>
            )}
            <button onClick={handleDelete} disabled={deleting}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all">
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
        </div>
    )
}

// ─── Collection Card ──────────────────────────────────────────────────────────

function CollectionCard({ collection, onEdit, onDelete }: {
    collection: Collection
    onEdit: (c: Collection) => void
    onDelete: (c: Collection) => void
}) {
    const [expanded, setExpanded] = useState(false)
    const [showAddField, setShowAddField] = useState(false)

    return (
        <div className={cn(
            'border rounded-2xl overflow-hidden bg-white transition-all shadow-sm',
            expanded ? 'border-violet-200' : 'border-slate-200 hover:border-violet-200'
        )}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 px-5 cursor-pointer select-none"
                onClick={() => setExpanded(v => !v)}>
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 font-mono tracking-tight">{collection.name}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                        {collection.fields?.length ?? 0} campo{(collection.fields?.length ?? 0) !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Field pills preview */}
                <div className="hidden sm:flex items-center gap-1 flex-wrap max-w-xs">
                    {(collection.fields ?? []).slice(0, 5).map(f => {
                        const m = getFieldMeta(f.type)
                        const FIcon = m.icon
                        return (
                            <span key={f.id} className={cn('flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border', m.bg, m.color)}>
                                <FIcon className="w-2.5 h-2.5" />{f.name}
                            </span>
                        )
                    })}
                    {(collection.fields?.length ?? 0) > 5 && (
                        <span className="text-[9px] text-slate-400">+{(collection.fields?.length ?? 0) - 5}</span>
                    )}
                </div>

                <div className="flex items-center gap-1 ml-2" onClick={e => e.stopPropagation()}>
                    <button onClick={() => onEdit(collection)} title="Renombrar"
                        className="p-2 rounded-xl hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-all">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(collection)} title="Eliminar"
                        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="text-slate-400">
                    {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
            </div>

            {/* Expanded: fields */}
            {expanded && (
                <div className="border-t border-slate-100 px-4 py-3 space-y-1">
                    {(collection.fields ?? []).length === 0 && !showAddField && (
                        <p className="text-xs text-slate-400 italic py-2">
                            Sin campos. Los registros aceptan cualquier dato JSONB.
                        </p>
                    )}
                    {(collection.fields ?? []).map(f => (
                        <FieldRow key={f.id} field={f} collectionName={collection.name} />
                    ))}

                    {showAddField ? (
                        <AddFieldInline
                            collectionName={collection.name}
                            onDone={() => setShowAddField(false)}
                        />
                    ) : (
                        <button onClick={() => setShowAddField(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-400 hover:text-violet-600 text-xs font-semibold transition-all mt-1">
                            <Plus className="w-3.5 h-3.5" />
                            Agregar campo
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── New Collection Modal (con campos) ───────────────────────────────────────

interface FieldDraft {
    id: string
    name: string
    type: FieldType
    required: boolean
    relationTarget?: string
    selectValues?: string   // comma-separated
    maxSelect?: number
}

function NewCollectionModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const { createCollection, addField, collections: existingCollections } = useProject()
    const [name, setName] = useState('')
    const [fields, setFields] = useState<FieldDraft[]>([])
    const [loading, setLoading] = useState(false)

    // Cerrar con Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const addNewField = () => {
        setFields(prev => [...prev, { id: crypto.randomUUID(), name: '', type: 'text', required: false }])
    }

    const updateField = (id: string, updates: Partial<FieldDraft>) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const removeField = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const collectionName = name.trim().toLowerCase().replace(/\s+/g, '_')
        if (!collectionName || loading) return

        setLoading(true)
        try {
            await createCollection(collectionName)

            // Agregar campos secuencialmente
            for (const f of fields) {
                const fieldName = f.name.trim().toLowerCase().replace(/\s+/g, '_')
                if (!fieldName) continue
                let options: Record<string, any> = {}
                if (f.type === 'relation' && f.relationTarget) options = { target: f.relationTarget }
                if (f.type === 'select') {
                    const values = (f.selectValues ?? '').split(',').map(v => v.trim()).filter(Boolean)
                    options = { values, maxSelect: f.maxSelect ?? 1 }
                }
                await addField(collectionName, { name: fieldName, type: f.type, required: f.required, options })
            }

            toast.success(`Colección "${collectionName}" creada`)
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(err.message || 'Error al crear colección')
        } finally {
            setLoading(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
            {/* Click fuera cierra */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                            <Database className="w-4.5 h-4.5 text-violet-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Nueva Colección</h2>
                            <p className="text-[10px] text-slate-400">Definí el nombre y los campos opcionales</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Nombre de la colección
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            placeholder="ej: articulos, productos, eventos"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus:bg-white outline-none transition-all font-mono"
                        />
                        {name.trim() && (
                            <p className="text-[10px] text-violet-500 font-mono ml-1">
                                → {name.trim().toLowerCase().replace(/\s+/g, '_')}
                            </p>
                        )}
                    </div>

                    {/* Campos */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Campos <span className="font-normal text-slate-400 normal-case">(opcional)</span>
                            </label>
                            <button type="button" onClick={addNewField}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold rounded-lg hover:bg-violet-100 transition-all">
                                <Plus className="w-3 h-3" />
                                Agregar campo
                            </button>
                        </div>

                        {fields.length === 0 ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                                <p className="text-xs text-slate-400">
                                    Sin campos — podés agregar los registros en formato libre (JSONB).
                                </p>
                                <button type="button" onClick={addNewField}
                                    className="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                                    + Agregar el primer campo
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {fields.map((field, idx) => {
                                    const meta = getFieldMeta(field.type)
                                    const Icon = meta.icon
                                    return (
                                        <div key={field.id}
                                            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-violet-200 transition-all group">
                                            {/* Icono tipo */}
                                            <div className={cn('p-1.5 rounded-lg border shrink-0', meta.bg)}>
                                                <Icon className={cn('w-3.5 h-3.5', meta.color)} />
                                            </div>

                                            {/* Nombre */}
                                            <input
                                                type="text"
                                                placeholder={`campo_${idx + 1}`}
                                                value={field.name}
                                                onChange={e => updateField(field.id, { name: e.target.value })}
                                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-mono outline-none focus:border-violet-400 transition-all"
                                            />

                                            {/* Tipo */}
                                            <select
                                                value={field.type}
                                                onChange={e => updateField(field.id, { type: e.target.value as FieldType, relationTarget: undefined, selectValues: undefined, maxSelect: 1 })}
                                                className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-violet-400 transition-all"
                                            >
                                                {FIELD_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>

                                            {/* Opciones para select */}
                                            {field.type === 'select' && (
                                                <div className="flex gap-1.5 items-center col-span-full w-full mt-1">
                                                    <input
                                                        type="text"
                                                        placeholder="opcion1, opcion2, opcion3"
                                                        value={field.selectValues ?? ''}
                                                        onChange={e => updateField(field.id, { selectValues: e.target.value })}
                                                        className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 transition-all"
                                                    />
                                                    <span className="text-xs text-slate-400 shrink-0">max</span>
                                                    <input
                                                        type="number"
                                                        min={1} max={20}
                                                        value={field.maxSelect ?? 1}
                                                        onChange={e => updateField(field.id, { maxSelect: Number(e.target.value) })}
                                                        className="w-14 bg-white border border-indigo-200 rounded-lg px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400 transition-all"
                                                    />
                                                </div>
                                            )}

                                            {/* Colección destino (solo para relation) */}
                                            {field.type === 'relation' && (
                                                <select
                                                    value={field.relationTarget ?? ''}
                                                    onChange={e => updateField(field.id, { relationTarget: e.target.value })}
                                                    className={cn(
                                                        'bg-white border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-violet-400 transition-all',
                                                        !field.relationTarget ? 'border-violet-300 text-violet-500' : 'border-slate-200 text-slate-700'
                                                    )}
                                                >
                                                    <option value="">→ colección</option>
                                                    {existingCollections.map(c => (
                                                        <option key={c.name} value={c.name}>{c.name}</option>
                                                    ))}
                                                    {existingCollections.length === 0 && (
                                                        <option disabled value="">Sin colecciones aún</option>
                                                    )}
                                                </select>
                                            )}

                                            {/* Requerido */}
                                            <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer select-none whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={e => updateField(field.id, { required: e.target.checked })}
                                                    className="accent-violet-600"
                                                />
                                                Req.
                                            </label>

                                            {/* Eliminar */}
                                            <button type="button" onClick={() => removeField(field.id)}
                                                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/60">
                    <button type="button" onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-50 transition-all shadow-sm shadow-violet-200"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {loading ? 'Creando...' : 'Crear Colección'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────

function RenameModal({ collection, onClose, onSuccess }: {
    collection: Collection
    onClose: () => void
    onSuccess: () => void
}) {
    const { updateCollection } = useProject()
    const [name, setName] = useState(collection.name)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newName = name.trim().toLowerCase().replace(/\s+/g, '_')
        if (!newName || newName === collection.name || loading) return
        setLoading(true)
        try {
            await updateCollection(collection.name, newName)
            toast.success('Colección renombrada')
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(err.message || 'Error al renombrar')
        } finally {
            setLoading(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h2 className="font-extrabold text-slate-900">Renombrar colección</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input
                        type="text"
                        required
                        autoFocus
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono focus:border-violet-400 outline-none transition-all"
                    />
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={onClose}
                            className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-all">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading || !name.trim() || name.trim().toLowerCase().replace(/\s+/g, '_') === collection.name}
                            className="px-6 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 disabled:opacity-50 transition-all">
                            {loading ? 'Guardando...' : 'Renombrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchemaEditorPage() {
    const { collections, loading, fetchCollections } = useProject()
    const [collectionToDelete, setCollectionToDelete] = useState<any>(null)
    const [collectionToRename, setCollectionToRename] = useState<Collection | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const filtered = useMemo(() =>
        collections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
        [collections, searchQuery]
    )

    if (loading && collections.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-7 h-7 animate-spin text-violet-400" />
                    <p className="text-xs text-slate-400 font-medium">Cargando esquema...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                        <Database className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900">Esquema de Datos</h1>
                        <p className="text-xs text-slate-400">{collections.length} colección{collections.length !== 1 ? 'es' : ''}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar colección..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-violet-400 transition-all w-56"
                        />
                    </div>
                    <button onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all shadow-sm">
                        <Plus className="w-4 h-4" />
                        Nueva Colección
                    </button>
                </div>
            </div>

            {/* Collections */}
            <div className="space-y-3">
                {filtered.length > 0 ? (
                    <>
                        {filtered.map(col => (
                            <CollectionCard
                                key={col.name}
                                collection={col}
                                onEdit={c => setCollectionToRename(c)}
                                onDelete={setCollectionToDelete}
                            />
                        ))}
                        <button onClick={() => setShowCreateModal(true)}
                            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 text-slate-400 hover:text-violet-600 text-xs font-bold uppercase tracking-wide transition-all group">
                            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                            Agregar otra colección
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <Database className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-base font-bold text-slate-700 mb-1">Sin colecciones</p>
                        <p className="text-sm text-slate-400 mb-5">Creá tu primera colección para empezar a guardar datos.</p>
                        <button onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-all">
                            <Plus className="w-4 h-4" />
                            Crear primera colección
                        </button>
                    </div>
                )}
            </div>

            {/* Modals — via portal, fuera del árbol de transforms */}
            {showCreateModal && (
                <NewCollectionModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={fetchCollections}
                />
            )}

            {collectionToRename && (
                <RenameModal
                    collection={collectionToRename}
                    onClose={() => setCollectionToRename(null)}
                    onSuccess={fetchCollections}
                />
            )}

            <DeleteCollectionModal
                isOpen={!!collectionToDelete}
                onClose={() => setCollectionToDelete(null)}
                collection={collectionToDelete}
                onSuccess={fetchCollections}
            />
        </div>
    )
}
