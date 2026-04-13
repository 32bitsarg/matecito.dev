'use client'

import { useState, useEffect, useCallback, useId } from 'react'
import { createPortal } from 'react-dom'
import { useProject } from '@/contexts/ProjectContext'
import type { Collection, Field, FieldType } from '@/contexts/ProjectContext'
import {
  Database, Plus, Trash2, Pencil, Loader2, RefreshCw, X, Save,
  Search, ToggleLeft, ToggleRight, EyeOff, Eye, Download, RotateCcw,
  Table2, Settings, ChevronDown, ChevronRight, Edit3, Type, Hash,
  Mail, Calendar, FileIcon, Braces, Link2, ListFilter, Skull, GripVertical,
  CheckCircle2, Circle, Star,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getToken } from '@/lib/api'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
const LIMIT = 50

// ─── Field types metadata ──────────────────────────────────────────────────────

const FIELD_TYPES: { value: FieldType; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { value: 'text',     label: 'Texto',    icon: Type,       color: 'text-blue-400',   bg: 'bg-blue-950/20 border-blue-800/40' },
  { value: 'number',   label: 'Número',   icon: Hash,       color: 'text-amber-400',  bg: 'bg-amber-950/20 border-amber-800/40' },
  { value: 'bool',     label: 'Bool',     icon: ToggleLeft, color: 'text-green-600',  bg: 'bg-green-50 border-green-200' },
  { value: 'email',    label: 'Email',    icon: Mail,       color: 'text-pink-600',   bg: 'bg-pink-50 border-pink-200' },
  { value: 'date',     label: 'Fecha',    icon: Calendar,   color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { value: 'file',     label: 'Archivo',  icon: FileIcon,   color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { value: 'json',     label: 'JSON',     icon: Braces,     color: 'text-cyan-600',    bg: 'bg-cyan-50 border-cyan-200' },
  { value: 'relation', label: 'Relación', icon: Link2,      color: 'text-[var(--accent)]',  bg: 'bg-[var(--accent-soft)] border-[var(--border)]' },
  { value: 'select',   label: 'Select',   icon: ListFilter, color: 'text-indigo-600',  bg: 'bg-indigo-50 border-indigo-200' },
]

function getFieldMeta(type: FieldType) {
  return FIELD_TYPES.find(t => t.value === type) ?? FIELD_TYPES[0]
}

const SYSTEM_KEYS = new Set(['created_at', 'updated_at', 'created_by'])

function formatCell(v: any): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'boolean') return v ? 'true' : 'false'
  if (typeof v === 'object') return JSON.stringify(v).slice(0, 60)
  return String(v).slice(0, 80)
}

// ─── Records Tab ──────────────────────────────────────────────────────────────

interface RecordRow {
  id: string
  collection: string
  data: Record<string, any>
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

function RecordsTab({ collection }: { collection: Collection }) {
  const { projectId, fetchRecords, createRecord, updateRecord, deleteRecord, restoreRecord, hardDeleteRecord } = useProject()
  const [records, setRecords] = useState<RecordRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; record?: RecordRow } | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [extraJson, setExtraJson] = useState('{}')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fields = collection.fields ?? []
  const dataColumns = fields.filter(f => !SYSTEM_KEYS.has(f.name)).slice(0, 8).map(f => f.name)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchRecords(collection.name, showDeleted ? { include_deleted: 'true' } : undefined)
      const rows: RecordRow[] = Array.isArray(res) ? res : (res.records ?? [])
      setRecords(rows)
      setTotal(res.pagination?.total ?? rows.length)
    } catch (err: any) {
      toast.error('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [collection.name, fetchRecords, showDeleted])

  useEffect(() => { load() }, [load])

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

  const handleSave = async () => {
    let extra: Record<string, any> = {}
    try {
      const parsed = JSON.parse(extraJson)
      if (typeof parsed === 'object' && parsed !== null) extra = parsed
    } catch {
      toast.error('JSON extra inválido')
      return
    }
    const data = { ...extra, ...formValues }
    Object.keys(data).forEach(k => { if (data[k] === '') data[k] = null })
    setSaving(true)
    try {
      if (modal?.mode === 'create') {
        await createRecord(collection.name, data)
        toast.success('Registro creado')
      } else if (modal?.mode === 'edit' && modal.record) {
        await updateRecord(modal.record.id, data)
        toast.success('Registro actualizado')
      }
      setModal(null)
      load()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (deleting !== id) { setDeleting(id); setTimeout(() => setDeleting(null), 3000); return }
    try { await deleteRecord(id); toast.success('Registro eliminado'); load() }
    catch (err: any) { toast.error(err.message) }
    finally { setDeleting(null) }
  }

  const handleRestore = async (id: string) => {
    try { await restoreRecord(id); toast.success('Restaurado'); load() }
    catch (err: any) { toast.error(err.message) }
  }

  const handleHardDelete = async (id: string) => {
    if (!confirm('¿Eliminar definitivamente? No se puede deshacer.')) return
    try { await hardDeleteRecord(id); toast.success('Eliminado definitivamente'); load() }
    catch (err: any) { toast.error(err.message) }
  }

  const filtered = search.trim()
    ? records.filter(r => JSON.stringify(r.data).toLowerCase().includes(search.toLowerCase()))
    : records

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs text-[var(--fg-tertiary)]">{total} registros</span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--fg-tertiary)]" />
          <input
            type="text" placeholder="Buscar..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-44 pl-7 pr-3 py-1.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--fg-primary)] outline-none focus:border-[var(--accent)] transition-all"
          />
        </div>
        <button onClick={() => setShowDeleted(v => !v)}
          className={cn("flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs border transition-all",
            showDeleted ? "bg-red-950/20 text-red-400 border-red-800/40" : "bg-[var(--bg-primary)] text-[var(--fg-tertiary)] border-[var(--border)]")}>
          {showDeleted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button onClick={load} className="p-1.5 text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] rounded-lg">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </button>
        <button onClick={openCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:opacity-90">
          <Plus className="w-3.5 h-3.5" /> Nuevo
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40"><Loader2 className="w-5 h-5 animate-spin text-[var(--accent)]" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <Database className="w-8 h-8 text-[var(--fg-tertiary)]" />
            <p className="text-sm text-[var(--fg-tertiary)]">{search ? 'Sin resultados' : 'Sin registros'}</p>
            {!search && <button onClick={openCreate} className="text-xs text-[var(--accent)] font-semibold">+ Crear el primero</button>}
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border)] sticky top-0">
              <tr>
                <th className="text-left px-4 py-2 font-bold text-[var(--fg-tertiary)] uppercase tracking-wider text-[10px]">ID</th>
                {dataColumns.map(col => (
                  <th key={col} className="text-left px-4 py-2 font-bold text-[var(--fg-tertiary)] uppercase tracking-wider text-[10px]">{col}</th>
                ))}
                {dataColumns.length === 0 && (
                  <th className="text-left px-4 py-2 font-bold text-[var(--fg-tertiary)] uppercase tracking-wider text-[10px]">Datos</th>
                )}
                <th className="text-left px-4 py-2 font-bold text-[var(--fg-tertiary)] uppercase tracking-wider text-[10px]">Creado</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bg-secondary)]">
              {filtered.map(record => {
                const isDeleted = !!record.deleted_at
                return (
                  <tr key={record.id} className={cn("transition-colors group", isDeleted ? "bg-red-950/20/40 hover:bg-red-950/20" : "hover:bg-[var(--bg-secondary)]")}>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] text-[var(--fg-tertiary)] font-mono">{record.id.slice(0, 8)}…</code>
                        {isDeleted && <span className="text-[9px] font-bold uppercase px-1 py-0.5 bg-red-900/30 text-red-500 border border-red-800/40 rounded">Eliminado</span>}
                      </div>
                    </td>
                    {dataColumns.length > 0
                      ? dataColumns.map(col => (
                          <td key={col} className="px-4 py-2">
                            <span className="text-[var(--fg-primary)] font-mono truncate max-w-[180px] block">{formatCell(record.data?.[col])}</span>
                          </td>
                        ))
                      : (
                          <td className="px-4 py-2">
                            <span className="text-[var(--fg-tertiary)] text-xs font-mono">
                              {Object.entries(record.data ?? {}).filter(([k]) => !SYSTEM_KEYS.has(k)).slice(0, 3).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}`).join(' · ') || '—'}
                            </span>
                          </td>
                        )
                    }
                    <td className="px-4 py-2 text-[var(--fg-tertiary)]">
                      {new Date(record.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isDeleted && (
                          <>
                            <button onClick={() => openEdit(record)} className="p-1 rounded hover:bg-[var(--accent-soft)] text-[var(--fg-tertiary)] hover:text-[var(--accent)]"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(record.id)} className={cn("p-1 rounded hover:bg-red-950/20 text-[var(--fg-tertiary)] transition-colors", deleting === record.id ? "text-red-400 bg-red-950/20" : "hover:text-red-500")}>
                              {deleting === record.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </>
                        )}
                        {isDeleted && (
                          <>
                            <button onClick={() => handleRestore(record.id)} className="p-1 rounded hover:bg-emerald-950/20 text-[var(--fg-tertiary)] hover:text-emerald-400"><RotateCcw className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleHardDelete(record.id)} className="p-1 rounded hover:bg-red-950/20 text-[var(--fg-tertiary)] hover:text-red-500"><Skull className="w-3.5 h-3.5" /></button>
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

      {/* Modal */}
      {modal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}>
          <div className="absolute inset-0" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-lg bg-[var(--bg-tertiary)] rounded-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-bold text-[var(--fg-primary)]">{modal.mode === 'create' ? 'Nuevo registro' : 'Editar registro'}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--fg-tertiary)]"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {fields.map(f => (
                <FieldInput key={f.id} field={f} value={formValues[f.name]} onChange={v => setFormValues(p => ({ ...p, [f.name]: v }))} />
              ))}
              <div>
                <label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block">Campos extra (JSON)</label>
                <textarea rows={3} className="w-full px-3 py-2 bg-[var(--bg-tertiary)] text-emerald-400 font-mono text-xs rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none"
                  value={extraJson} onChange={e => setExtraJson(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-[var(--border)]">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  )
}

// ─── FieldInput ───────────────────────────────────────────────────────────────

function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const base = "w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-sm text-[var(--fg-primary)] outline-none focus:border-[var(--accent)] focus:bg-[var(--bg-primary)] transition-all"
  const meta = getFieldMeta(field.type)
  const Icon = meta.icon

  if (field.type === 'bool') {
    const checked = Boolean(value)
    return (
      <div>
        <label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label>
        <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-sm transition-all hover:border-[var(--border)]">
          {checked ? <ToggleRight className="w-5 h-5 text-[var(--accent)]" /> : <ToggleLeft className="w-5 h-5 text-[var(--fg-tertiary)]" />}
          <span className={checked ? 'text-[var(--accent)] font-semibold' : 'text-[var(--fg-secondary)]'}>{checked ? 'true' : 'false'}</span>
        </button>
      </div>
    )
  }
  if (field.type === 'number') return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><input type="number" className={base} value={value ?? ''} onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))} /></div>
  if (field.type === 'email') return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><input type="email" className={base} value={value ?? ''} onChange={e => onChange(e.target.value)} /></div>
  if (field.type === 'date') return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><input type="date" className={base} value={value ?? ''} onChange={e => onChange(e.target.value)} /></div>

  if (field.type === 'select') {
    const opts: string[] = field.options?.values ?? []
    const maxSelect: number = field.options?.maxSelect ?? 1
    if (maxSelect > 1) {
      const selected: string[] = Array.isArray(value) ? value : []
      const toggle = (v: string) => { if (selected.includes(v)) onChange(selected.filter(s => s !== v)); else if (selected.length < maxSelect) onChange([...selected, v]) }
      return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><div className="flex flex-wrap gap-2">{opts.map(opt => (<button key={opt} type="button" onClick={() => toggle(opt)} className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold border", selected.includes(opt) ? "bg-indigo-600 text-white border-indigo-600" : "bg-[var(--bg-primary)] text-[var(--fg-secondary)] border-[var(--border)]")}>{opt}</button>))}</div></div>
    }
    return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><select className={base} value={value ?? ''} onChange={e => onChange(e.target.value)}><option value="">— seleccionar —</option>{opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
  }

  if (field.type === 'json') return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><textarea rows={3} className="w-full px-3 py-2 bg-[var(--bg-tertiary)] text-emerald-400 font-mono text-xs rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none" value={typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2)} onChange={e => { try { onChange(JSON.parse(e.target.value)) } catch { onChange(e.target.value) } }} /></div>
  if (field.type === 'relation') return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name} → {field.options?.target || '?'}{field.required && <span className="text-red-400">*</span>}</label><input type="text" placeholder="UUID" className={cn(base, "font-mono text-xs")} value={value ?? ''} onChange={e => onChange(e.target.value)} /></div>

  return <div><label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase mb-1 block flex items-center gap-1"><Icon className="w-3 h-3" />{field.name}{field.required && <span className="text-red-400">*</span>}</label><input type="text" className={base} value={value ?? ''} onChange={e => onChange(e.target.value)} /></div>
}

// ─── Structure Tab ────────────────────────────────────────────────────────────

function StructureTab({ collection, onRename, onDelete }: { collection: Collection; onRename: () => void; onDelete: () => void }) {
  const { addField, deleteField, collections: existingCollections } = useProject()
  const [showAdd, setShowAdd] = useState(false)
  const [newField, setNewField] = useState({ name: '', type: 'text' as FieldType, required: false, relationTarget: '', selectValues: '', maxSelect: 1 })
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const fieldName = newField.name.trim().toLowerCase().replace(/\s+/g, '_')
    if (!fieldName || adding) return
    setAdding(true)
    try {
      let options: Record<string, any> = {}
      if (newField.type === 'relation' && newField.relationTarget) options = { target: newField.relationTarget }
      if (newField.type === 'select') {
        const values = newField.selectValues.split(',').map(v => v.trim()).filter(Boolean)
        options = { values, maxSelect: newField.maxSelect }
      }
      await addField(collection.name, { name: fieldName, type: newField.type, required: newField.required, options })
      toast.success(`Campo "${fieldName}" agregado`)
      setNewField({ name: '', type: 'text', required: false, relationTarget: '', selectValues: '', maxSelect: 1 })
      setShowAdd(false)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteField = async (field: Field) => {
    if (!confirm(`¿Eliminar el campo "${field.name}"?`)) return
    try {
      await deleteField(collection.name, field.id)
      toast.success(`Campo "${field.name}" eliminado`)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="p-4 space-y-3">
      {/* Collection info */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center"><Database className="w-4 h-4 text-[var(--accent)]" /></div>
          <div>
            <p className="text-sm font-mono font-bold text-[var(--fg-primary)]">{collection.name}</p>
            <p className="text-[10px] text-[var(--fg-tertiary)]">{(collection.fields ?? []).length} campos</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={onRename} className="p-1.5 rounded-lg text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]"><Edit3 className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg text-[var(--fg-tertiary)] hover:text-red-500 hover:bg-red-950/20"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Fields list */}
      {(collection.fields ?? []).map(f => {
        const m = getFieldMeta(f.type); const Icon = m.icon
        return (
          <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] group hover:border-[var(--border)]">
            <div className={cn('p-1.5 rounded-lg border shrink-0', m.bg)}><Icon className={cn('w-3.5 h-3.5', m.color)} /></div>
            <span className="text-sm font-mono text-[var(--fg-primary)] flex-1">{f.name}</span>
            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', m.bg, m.color)}>{m.label}</span>
            {f.type === 'relation' && f.options?.target && <span className="text-[9px] font-mono text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded border border-[var(--border)]">→ {f.options.target}</span>}
            {f.type === 'select' && f.options?.values && <span className="text-[9px] text-[var(--fg-tertiary)]">{(f.options.values as string[]).join(', ')}</span>}
            {f.required && <span className="text-[9px] font-bold text-red-500 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-800/40">Req</span>}
            <button onClick={() => handleDeleteField(f)} className="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--fg-tertiary)] hover:text-red-500 hover:bg-red-950/20"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        )
      })}

      {/* Add field */}
      {showAdd ? (
        <form onSubmit={handleAdd} className="p-3 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <input type="text" placeholder="nombre_campo" value={newField.name} onChange={e => setNewField(p => ({ ...p, name: e.target.value }))} className="rounded-lg border px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 ring-[var(--accent)]" required />
            <select value={newField.type} onChange={e => setNewField(p => ({ ...p, type: e.target.value as FieldType }))} className="rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-1 ring-[var(--accent)]">
              {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <label className="flex items-center gap-2 text-xs text-[var(--fg-secondary)] cursor-pointer select-none">
              <input type="checkbox" checked={newField.required} onChange={e => setNewField(p => ({ ...p, required: e.target.checked }))} className="accent-[var(--accent)]" />
              Requerido
            </label>
          </div>
          {newField.type === 'relation' && (
            <select value={newField.relationTarget} onChange={e => setNewField(p => ({ ...p, relationTarget: e.target.value }))} className="w-full rounded-lg border px-3 py-1.5 text-xs outline-none focus:ring-1 ring-[var(--accent)]">
              <option value="">→ seleccionar colección destino</option>
              {existingCollections.filter(c => c.name !== collection.name).map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          )}
          {newField.type === 'select' && (
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="op1, op2, op3" value={newField.selectValues} onChange={e => setNewField(p => ({ ...p, selectValues: e.target.value }))} className="rounded-lg border px-3 py-1.5 text-xs outline-none focus:ring-1 ring-[var(--accent)]" />
              <input type="number" min={1} max={20} value={newField.maxSelect} onChange={e => setNewField(p => ({ ...p, maxSelect: Number(e.target.value) }))} title="Max selecciones" className="rounded-lg border px-3 py-1.5 text-xs outline-none focus:ring-1 ring-[var(--accent)]" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]">Cancelar</button>
            <button type="submit" disabled={adding || !newField.name.trim()} className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50">{adding ? 'Agregando...' : 'Agregar campo'}</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--border)] hover:bg-[var(--accent-soft)] text-[var(--fg-tertiary)] hover:text-[var(--accent)] text-xs font-semibold transition-all">
          <Plus className="w-4 h-4" /> Agregar campo
        </button>
      )}
    </div>
  )
}

// ─── Create Collection Modal ──────────────────────────────────────────────────

interface DraftField {
  id: string
  name: string
  type: FieldType
  required: boolean
  relationTarget: string
  selectValues: string
  maxSelect: number
}

function makeDraftField(): DraftField {
  return {
    id: Math.random().toString(36).slice(2),
    name: '',
    type: 'text',
    required: false,
    relationTarget: '',
    selectValues: '',
    maxSelect: 1,
  }
}

function SortableField({
  field,
  collections,
  onChange,
  onRemove,
}: {
  field: DraftField
  collections: Collection[]
  onChange: (f: DraftField) => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  const meta = getFieldMeta(field.type)
  const Icon = meta.icon

  return (
    <div ref={setNodeRef} style={style} className={cn(
      "group flex flex-col gap-2 p-3 rounded-xl border transition-all",
      isDragging ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/40"
    )}>
      {/* Row 1: drag + name + type + required + delete */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Name */}
        <input
          type="text"
          placeholder="nombre_campo"
          value={field.name}
          onChange={e => onChange({ ...field, name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
          className="flex-1 min-w-0 px-2.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs font-mono text-[var(--fg-primary)] outline-none focus:border-[var(--accent)] transition-all"
        />

        {/* Type selector */}
        <div className="relative">
          <select
            value={field.type}
            onChange={e => onChange({ ...field, type: e.target.value as FieldType })}
            className={cn(
              "appearance-none pl-7 pr-2 py-1.5 rounded-lg border text-xs font-medium outline-none focus:border-[var(--accent)] transition-all cursor-pointer",
              meta.bg, meta.color
            )}
          >
            {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <Icon className={cn("absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none", meta.color)} />
        </div>

        {/* Required toggle */}
        <button
          type="button"
          onClick={() => onChange({ ...field, required: !field.required })}
          title={field.required ? 'Requerido' : 'Opcional'}
          className={cn("shrink-0 transition-colors", field.required ? "text-red-400" : "text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]")}
        >
          {field.required ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
        </button>

        {/* Remove */}
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--fg-tertiary)] hover:text-red-500 hover:bg-red-950/20 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 2: type-specific extras */}
      {field.type === 'relation' && (
        <div className="ml-7 flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
          <select
            value={field.relationTarget}
            onChange={e => onChange({ ...field, relationTarget: e.target.value })}
            className="flex-1 px-2.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs outline-none focus:border-[var(--accent)] text-[var(--fg-primary)]"
          >
            <option value="">→ seleccioná la colección destino</option>
            {collections.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      )}

      {field.type === 'select' && (
        <div className="ml-7 flex gap-2">
          <input
            type="text"
            placeholder="opción1, opción2, opción3"
            value={field.selectValues}
            onChange={e => onChange({ ...field, selectValues: e.target.value })}
            className="flex-1 px-2.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs font-mono outline-none focus:border-[var(--accent)] text-[var(--fg-primary)]"
          />
          <input
            type="number"
            min={1}
            max={20}
            value={field.maxSelect}
            onChange={e => onChange({ ...field, maxSelect: Number(e.target.value) })}
            title="Máximo de selecciones"
            className="w-16 px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-xs text-center outline-none focus:border-[var(--accent)] text-[var(--fg-primary)]"
          />
        </div>
      )}
    </div>
  )
}

function CreateCollectionModal({
  collections,
  onClose,
  onCreate,
  creating,
}: {
  collections: Collection[]
  onClose: () => void
  onCreate: (name: string, fields: any[]) => Promise<void>
  creating: boolean
}) {
  const [name, setName] = useState('')
  const [fields, setFields] = useState<DraftField[]>([makeDraftField()])
  const [step, setStep] = useState<'name' | 'fields'>('name')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setFields(f => {
        const oldIndex = f.findIndex(x => x.id === active.id)
        const newIndex = f.findIndex(x => x.id === over.id)
        return arrayMove(f, oldIndex, newIndex)
      })
    }
  }

  const addField = () => setFields(f => [...f, makeDraftField()])

  const updateField = (id: string, updated: DraftField) =>
    setFields(f => f.map(x => x.id === id ? updated : x))

  const removeField = (id: string) =>
    setFields(f => f.filter(x => x.id !== id))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const colName = name.trim().toLowerCase().replace(/\s+/g, '_')
    if (!colName) return

    const payload = fields
      .filter(f => f.name.trim())
      .map(f => {
        const base: any = { name: f.name.trim(), type: f.type, required: f.required }
        if (f.type === 'relation' && f.relationTarget) base.options = { target: f.relationTarget }
        if (f.type === 'select') {
          const values = f.selectValues.split(',').map(v => v.trim()).filter(Boolean)
          base.options = { values, maxSelect: f.maxSelect }
        }
        return base
      })

    await onCreate(colName, payload)
  }

  const slugName = name.trim().toLowerCase().replace(/\s+/g, '_')
  const validName = /^[a-z][a-z0-9_]*$/.test(slugName) || slugName === ''

  // Quick-add common field sets
  const TEMPLATES = [
    {
      label: 'Blog post',
      icon: '📝',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'text', required: false },
        { name: 'published', type: 'bool', required: false },
        { name: 'author_id', type: 'relation', required: false },
      ],
    },
    {
      label: 'Producto',
      icon: '🛍️',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'stock', type: 'number', required: false },
        { name: 'category', type: 'select', required: false },
      ],
    },
    {
      label: 'Usuario',
      icon: '👤',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
        { name: 'role', type: 'select', required: false },
        { name: 'active', type: 'bool', required: false },
      ],
    },
    {
      label: 'Vacía',
      icon: '✨',
      fields: [],
    },
  ]

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setFields(
      tpl.fields.length > 0
        ? tpl.fields.map(f => ({ ...makeDraftField(), ...f } as DraftField))
        : [makeDraftField()]
    )
    setStep('fields')
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}>
      <div className="absolute inset-0" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl bg-[var(--bg-tertiary)] rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center">
              <Database className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div>
              <h3 className="font-bold text-[var(--fg-primary)] text-sm">Nueva colección</h3>
              {slugName && <p className="text-[10px] text-[var(--fg-tertiary)] font-mono mt-0.5">{slugName}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--fg-tertiary)]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex border-b border-[var(--border)]">
          <button
            type="button"
            onClick={() => setStep('name')}
            className={cn("flex-1 px-4 py-2.5 text-xs font-semibold transition-colors border-b-2",
              step === 'name' ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]"
            )}
          >
            1 · Nombre
          </button>
          <button
            type="button"
            onClick={() => slugName && validName && setStep('fields')}
            className={cn("flex-1 px-4 py-2.5 text-xs font-semibold transition-colors border-b-2",
              step === 'fields' ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]"
            )}
          >
            2 · Campos
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Name + template */}
          {step === 'name' && (
            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-widest mb-2 block">Nombre de la colección</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="ej: posts, productos, clientes"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={cn(
                    "w-full px-3.5 py-2.5 bg-[var(--bg-secondary)] border rounded-xl text-sm font-mono text-[var(--fg-primary)] outline-none transition-all",
                    !validName && name ? "border-red-500 focus:border-red-500" : "border-[var(--border)] focus:border-[var(--accent)]"
                  )}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (slugName && validName) setStep('fields') } }}
                />
                {!validName && name && (
                  <p className="text-[10px] text-red-400 mt-1">Solo minúsculas, números y guiones bajos. Debe comenzar con letra.</p>
                )}
                {validName && slugName && (
                  <p className="text-[10px] text-[var(--fg-tertiary)] mt-1">Se guardará como: <code className="text-[var(--accent)]">{slugName}</code></p>
                )}
              </div>

              <div>
                <p className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-widest mb-3">Empezar desde plantilla</p>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => {
                        if (!slugName || !validName) { toast.error('Ingresá el nombre primero'); return }
                        applyTemplate(tpl)
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] text-left transition-all group"
                    >
                      <span className="text-xl">{tpl.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-[var(--fg-primary)] group-hover:text-[var(--accent)]">{tpl.label}</p>
                        <p className="text-[10px] text-[var(--fg-tertiary)]">{tpl.fields.length > 0 ? `${tpl.fields.length} campos` : 'Sin campos'}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Fields */}
          {step === 'fields' && (
            <div className="px-6 py-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-widest">
                  Campos · <span className="text-[var(--accent)]">{fields.filter(f => f.name).length} definidos</span>
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--fg-tertiary)]">
                  <Circle className="w-3 h-3" /> <span>Opcional</span>
                  <CheckCircle2 className="w-3 h-3 text-red-400 ml-2" /> <span>Requerido</span>
                </div>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {fields.map(field => (
                      <SortableField
                        key={field.id}
                        field={field}
                        collections={collections}
                        onChange={updated => updateField(field.id, updated)}
                        onRemove={() => removeField(field.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <button
                type="button"
                onClick={addField}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-1 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] text-[var(--fg-tertiary)] hover:text-[var(--accent)] text-xs font-semibold transition-all"
              >
                <Plus className="w-4 h-4" /> Agregar campo
              </button>

              {/* Relation hint */}
              {fields.some(f => f.type === 'relation') && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-[var(--accent-soft)] border border-[var(--border)] mt-2">
                  <Link2 className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 shrink-0" />
                  <p className="text-[10px] text-[var(--fg-secondary)]">
                    Los campos de relación guardan el <code className="text-[var(--accent)]">id</code> del registro relacionado.
                    Podés seleccionar la colección destino en cada campo.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="text-[10px] text-[var(--fg-tertiary)]">
            {step === 'fields' && fields.filter(f => f.name.trim()).length === 0 && (
              <span className="text-amber-400">Podés crear la colección sin campos y agregarlos después.</span>
            )}
          </div>
          <div className="flex gap-2">
            {step === 'fields' && (
              <button type="button" onClick={() => setStep('name')} className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--fg-secondary)] hover:bg-[var(--bg-primary)]">
                Atrás
              </button>
            )}
            {step === 'name' ? (
              <button
                type="button"
                onClick={() => { if (slugName && validName) setStep('fields'); else toast.error('Ingresá un nombre válido') }}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
              >
                Siguiente →
              </button>
            ) : (
              <button
                type="submit"
                disabled={creating || !slugName || !validName}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {creating ? 'Creando...' : 'Crear colección'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

// ─── Main Unified Page ────────────────────────────────────────────────────────

export default function TablesPage() {
  const { collections, loading: ctxLoading, updateCollection, deleteCollection, createCollection } = useProject()
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [tab, setTab] = useState<'records' | 'structure'>('records')
  const [editingCollection, setEditingCollection] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newColName, setNewColName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newColName.trim().toLowerCase().replace(/\s+/g, '_')
    if (!name || creating) return
    setCreating(true)
    try {
      await createCollection(name)
      toast.success(`Colección "${name}" creada`)
      setSelectedCollection(name)
      setNewColName('')
      setShowCreateModal(false)
      setTab('structure')
    } catch (err: any) {
      toast.error(err.message || 'Error al crear colección')
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    if (!selectedCollection && collections.length > 0) {
      setSelectedCollection(collections[0].name)
    }
  }, [collections, selectedCollection])

  const current = collections.find(c => c.name === selectedCollection)

  const handleRename = async (oldName: string) => {
    const newName = editName.trim().toLowerCase().replace(/\s+/g, '_')
    if (!newName || newName === oldName) { setEditingCollection(null); return }
    try {
      await updateCollection(oldName, newName)
      toast.success(`Colección renombrada a "${newName}"`)
      setSelectedCollection(newName)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setEditingCollection(null)
    }
  }

  const handleDelete = async (col: Collection) => {
    if (!confirm(`¿Eliminar la colección "${col.name}" y todos sus registros?`)) return
    try {
      await deleteCollection(col.name)
      toast.success(`Colección "${col.name}" eliminada`)
      setSelectedCollection(collections.find(c => c.name !== col.name)?.name ?? null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (ctxLoading && collections.length === 0) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" /></div>
  }

  return (
    <div className="h-[calc(100vh-13rem)] flex gap-4">
      {/* Collections sidebar */}
      <aside className="w-52 shrink-0 flex flex-col bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <p className="text-[10px] font-bold text-[var(--fg-tertiary)] uppercase tracking-widest">Colecciones</p>
          <button
            onClick={() => { setNewColName(''); setShowCreateModal(true) }}
            className="p-1 rounded-lg text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
            title="Nueva colección"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {collections.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8">
              <p className="text-xs text-[var(--fg-tertiary)] text-center italic">Sin colecciones aún</p>
              <button onClick={() => { setNewColName(''); setShowCreateModal(true) }} className="text-xs text-[var(--accent)] font-semibold">+ Crear una</button>
            </div>
          ) : collections.map(col => (
            <button key={col.name} onClick={() => { setSelectedCollection(col.name); setTab('records') }}
              className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-left transition-all",
                selectedCollection === col.name ? "bg-[var(--accent-soft)] text-[var(--accent)] font-semibold" : "text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]")}>
              <Database className={cn("w-3.5 h-3.5 shrink-0", selectedCollection === col.name ? "text-[var(--accent)]" : "text-[var(--fg-tertiary)]")} />
              <span className="truncate font-mono text-xs">{col.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl overflow-hidden">
        {!selectedCollection || !current ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Database className="w-10 h-10 text-[var(--fg-tertiary)]" />
            <p className="text-[var(--fg-secondary)] font-medium">Seleccioná una colección</p>
            <button onClick={() => { setNewColName(''); setShowCreateModal(true) }} className="text-xs text-[var(--accent)] font-semibold">+ Nueva colección</button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex items-center border-b border-[var(--border)] px-4 shrink-0">
              <button onClick={() => setTab('records')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", tab === 'records' ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]")}>
                <span className="flex items-center gap-2"><Table2 className="w-4 h-4" />Registros</span>
              </button>
              <button onClick={() => setTab('structure')} className={cn("px-4 py-3 text-sm font-medium border-b-2 transition-colors", tab === 'structure' ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--fg-secondary)] hover:text-[var(--fg-primary)]")}>
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" />Estructura</span>
              </button>
              <span className="ml-auto text-[10px] text-[var(--fg-tertiary)] font-mono">{current.name}</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {tab === 'records' ? (
                <RecordsTab collection={current} />
              ) : (
                <StructureTab
                  collection={current}
                  onRename={() => { setEditingCollection(current.name); setEditName(current.name) }}
                  onDelete={() => handleDelete(current)}
                />
              )}
            </div>

            {/* Rename modal inline */}
            {editingCollection === current.name && (
              <div className="px-4 py-3 border-t border-[var(--border)] flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-mono outline-none focus:ring-1 ring-[var(--accent)]"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleRename(current.name)}
                />
                <button onClick={() => handleRename(current.name)} className="px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90">Renombrar</button>
                <button onClick={() => setEditingCollection(null)} className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]">Cancelar</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create collection modal */}
      {showCreateModal && createPortal(
        <CreateCollectionModal
          collections={collections}
          onClose={() => setShowCreateModal(false)}
          onCreate={async (name, fields) => {
            setCreating(true)
            try {
              await createCollection({ name, fields })
              toast.success(`Colección "${name}" creada`)
              setSelectedCollection(name)
              setShowCreateModal(false)
              setTab('structure')
            } catch (err: any) {
              toast.error(err.message || 'Error al crear colección')
              throw err
            } finally {
              setCreating(false)
            }
          }}
          creating={creating}
        />,
        document.body
      )}
    </div>
  )
}
