'use client'

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { 
    X, Plus, Trash2, Database, Hash, Type, CheckSquare, 
    Mail, Calendar, Link as LinkIcon, Paperclip, 
    Save, Code, FileText, 
    Lock, Globe, Layout, Info, AlertTriangle, ChevronUp, ChevronDown
} from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getFieldIcon } from '@/lib/icons'

// --- Types ---
type FieldType = 'text' | 'number' | 'bool' | 'email' | 'url' | 'date' | 
                 'select' | 'relation' | 'file' | 'json' | 'editor' | 'password'

type FieldState = 'existing' | 'new' | 'modified' | 'deleted'

interface Field {
    id: string
    name: string
    type: FieldType
    required: boolean
    system?: boolean
    _state: FieldState
    options?: {
        values: string[]
        maxSelect?: number
    }
    collectionId?: string
    collectionName?: string
    cascadeDelete?: boolean
    maxSelect?: number | null
    maxSize?: number
    mimeTypes?: string[]
    min?: number | string
    max?: number | string
    pattern?: string
    noDecimal?: boolean
}

interface CollectionEditorProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
    existingCollection?: {
        id: string
        name: string
        type: string
        fields: any[]
    }
}

const FIELD_TYPES = [
    { value: 'text',     label: 'Texto',        icon: <Type className="w-4 h-4"/>,       description: 'Cadena de texto simple' },
    { value: 'number',   label: 'Número',       icon: <Hash className="w-4 h-4"/>,       description: 'Entero o decimal' },
    { value: 'bool',     label: 'Booleano',     icon: <CheckSquare className="w-4 h-4"/>,description: 'Verdadero o falso' },
    { value: 'email',    label: 'Email',        icon: <Mail className="w-4 h-4"/>,       description: 'Dirección de email válida' },
    { value: 'url',      label: 'URL',          icon: <Globe className="w-4 h-4"/>,      description: 'Dirección web válida' },
    { value: 'date',     label: 'Fecha',        icon: <Calendar className="w-4 h-4"/>,   description: 'Fecha y hora' },
    { value: 'select',   label: 'Selección',    icon: <Layout className="w-4 h-4"/>,     description: 'Una o más opciones predefinidas' },
    { value: 'relation', label: 'Relación',     icon: <LinkIcon className="w-4 h-4"/>,   description: 'Referencia a otra colección' },
    { value: 'file',     label: 'Archivo',      icon: <Paperclip className="w-4 h-4"/>,  description: 'Imágenes, PDFs u otros archivos' },
    { value: 'json',     label: 'JSON',         icon: <Code className="w-4 h-4"/>,       description: 'Cualquier dato JSON válido' },
    { value: 'editor',   label: 'Texto Enriquecido', icon: <FileText className="w-4 h-4"/>,   description: 'Editor de texto con formato HTML' },
    { value: 'password', label: 'Contraseña',   icon: <Lock className="w-4 h-4"/>,       description: 'Texto encriptado (password)' },
]

export default function CollectionEditor({ open, onClose, onSuccess, existingCollection }: CollectionEditorProps) {
    const { createCollection, updateCollection, collections } = useProject()
    const [collectionName, setCollectionName] = useState('')
    const [fields, setFields] = useState<Field[]>([])
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Errors state for inline validation
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Confirm Modals states
    const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false)
    const [isDeleteFieldConfirmId, setIsDeleteFieldConfirmId] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const isEditing = !!existingCollection

// Campos del sistema de PocketBase que no deben ser editables (en minúsculas)
const POCKETBASE_SYSTEM_FIELDS = [
    'id', 'username', 'tokenkey', 'password', 'email', 
    'emailvisibility', 'verified', 'created', 'updated'
];

    useEffect(() => {
        if (open) {
            if (existingCollection) {
                setCollectionName(existingCollection.name)
                const editableFields = existingCollection.fields
                    .map(f => {
                        const nameLower = f.name.toLowerCase();
                        return {
                            id: f.id || Math.random().toString(),
                            name: f.name,
                            type: f.type as FieldType,
                            required: f.required || false,
                            // Marcamos como sistema si la API lo dice o si está en nuestra lista negra
                            system: f.system || POCKETBASE_SYSTEM_FIELDS.includes(nameLower),
                            _state: 'existing' as FieldState,
                            options: f.type === 'select' ? { values: f.values || [], maxSelect: f.maxSelect } : undefined,
                            collectionId: f.collectionId,
                            cascadeDelete: f.cascadeDelete,
                            maxSelect: f.maxSelect,
                            maxSize: f.maxSize ? f.maxSize / (1024 * 1024) : undefined,
                            mimeTypes: f.mimeTypes,
                            min: f.min,
                            max: f.max,
                            pattern: f.pattern,
                            noDecimal: f.noDecimal
                        }
                    })

                setFields(editableFields)
                if (editableFields.length > 0) setSelectedFieldId(editableFields[0].id)
            } else {
                setCollectionName('')
                const initialField: Field = { 
                    id: Math.random().toString(), 
                    name: 'titulo', 
                    type: 'text', 
                    required: true,
                    _state: 'new'
                }
                setFields([initialField])
                setSelectedFieldId(initialField.id)
            }
            setHasUnsavedChanges(false)
            setErrors({})
        }
    }, [open, existingCollection])

    const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    const collectionSlug = useMemo(() => slugify(collectionName), [collectionName])

    const handleAddField = (type: FieldType) => {
        const id = Math.random().toString()
        const newField: Field = { id, name: '', type, required: false, _state: 'new' }
        setFields(prev => [...prev, newField])
        setSelectedFieldId(id)
        setHasUnsavedChanges(true)
    }

    const removeField = (id: string) => {
        const field = fields.find(f => f.id === id)
        if (!field) return
        if (field._state === 'existing' || field._state === 'modified') {
            setIsDeleteFieldConfirmId(id)
        } else {
            setFields(prev => prev.filter(f => f.id !== id))
            if (selectedFieldId === id) setSelectedFieldId(null)
        }
        setHasUnsavedChanges(true)
    }

    const confirmDeleteField = () => {
        if (isDeleteFieldConfirmId) {
            setFields(prev => prev.map(f => f.id === isDeleteFieldConfirmId ? { ...f, _state: 'deleted' } : f))
            setIsDeleteFieldConfirmId(null)
        }
    }

    const moveField = (index: number, direction: 'up' | 'down') => {
        const newFields = [...fields]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= newFields.length) return
        
        [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]]
        setFields(newFields)
        setHasUnsavedChanges(true)
    }

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(prev => prev.map(f => {
            if (f.id === id) {
                const newState = f._state === 'new' ? 'new' : 'modified'
                return { ...f, ...updates, _state: newState as FieldState }
            }
            return f
        }))
        setHasUnsavedChanges(true)
        
        // Clear specific error when editing
        if (errors[id]) {
            const newErrors = { ...errors }
            delete newErrors[id]
            setErrors(newErrors)
        }
    }

    const selectedField = fields.find(f => f.id === selectedFieldId)

    const handleSave = async () => {
        const newErrors: Record<string, string> = {}
        
        // Collection Name Validations
        if (!collectionName) {
            newErrors.collectionName = 'El nombre de la colección es obligatorio'
        } else if (!collectionSlug.match(/^[a-z][a-z0-9_]*$/)) {
            newErrors.collectionName = 'El nombre debe ser un slug válido (minúsculas, sin espacios)'
        }

        const activeFields = fields.filter(f => f._state !== 'deleted')
        
        if (activeFields.length === 0) {
            toast.error('Debes agregar al menos un campo')
            return
        }

        // Field Specific Validations
        activeFields.forEach(f => {
            if (!f.name) newErrors[f.id] = 'El nombre del campo es obligatorio'
            
            if (f.type === 'select' && (!f.options?.values || f.options.values.length === 0)) {
                newErrors[`${f.id}_options`] = 'Debes agregar al menos una opción'
            }
            
            if (f.type === 'relation' && !f.collectionId) {
                newErrors[`${f.id}_relation`] = 'Debes seleccionar una colección'
            }
        });

        // Duplicate names check
        const names = activeFields.map(f => slugify(f.name)).filter(n => n !== '')
        if (new Set(names).size !== names.length) {
            toast.error('No puede haber campos con nombres duplicados')
            return
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error('Por favor, revisa los errores en el formulario')
            return
        }
        
        setLoading(true)
        try {
            const fieldsPayload = activeFields.map(f => ({
                name: slugify(f.name),
                type: f.type,
                required: f.required,
                ...(f.type === 'select' && { values: f.options?.values || [], maxSelect: f.options?.maxSelect || 1 }),
                ...(f.type === 'relation' && { collectionId: f.collectionId, cascadeDelete: f.cascadeDelete || false, maxSelect: f.maxSelect || null }),
                ...(f.type === 'file' && { maxSelect: f.maxSelect || 1, maxSize: (Number(f.maxSize) || 5) * 1024 * 1024, mimeTypes: f.mimeTypes || [] }),
                ...(f.type === 'text' && { min: f.min, max: f.max, pattern: f.pattern }),
                ...(f.type === 'number' && { min: Number(f.min) || undefined, max: Number(f.max) || undefined, noDecimal: f.noDecimal }),
                ...(f.type === 'date' && { min: f.min, max: f.max }),
            }))

            if (isEditing) {
                await updateCollection(existingCollection!.id, { name: collectionSlug, fields: fieldsPayload })
                toast.success('Colección actualizada correctamente')
            } else {
                await createCollection({ name: collectionSlug, type: 'base', fields: fieldsPayload })
                toast.success('Colección creada correctamente')
            }
            onSuccess(); onClose()
        } catch (err: any) {
            toast.error(err.response?.message || err.message || 'Error al guardar la colección')
        } finally {
            setLoading(false)
        }
    }

    const handleCloseAttempt = () => {
        if (hasUnsavedChanges) {
            setIsDiscardConfirmOpen(true)
        } else {
            onClose()
        }
    }

    const confirmDiscard = () => {
        setIsDiscardConfirmOpen(false)
        onClose()
    }

    if (!mounted) return null

    return createPortal(
        <>
            <div className={cn(
                "fixed inset-0 z-[1000] flex justify-end overflow-hidden",
                !open && "pointer-events-none"
            )}>
                <div 
                    className={cn(
                        "absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500",
                        open ? "opacity-100" : "opacity-0"
                    )}
                    onClick={handleCloseAttempt}
                />

                {/* Sidebar Panel */}
                <aside 
                    className={cn(
                        "relative w-full max-w-3xl bg-[#0f0f0f] border-l border-border h-[calc(100vh-4rem)] shadow-2xl flex flex-col transition-transform duration-500 ease-out overflow-hidden mt-16",
                        open ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border bg-black/20">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-white">
                                        {isEditing ? `Editar Colección · ${existingCollection?.name}` : 'Nueva Colección'}
                                    </h2>
                                    {hasUnsavedChanges && (
                                        <span className="flex items-center gap-1.5 text-[10px] text-orange-400 font-bold uppercase tracking-widest bg-orange-400/10 px-2 py-0.5 rounded">
                                            ● Cambios pendientes
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted">Configura la estructura y campos de tu base de datos</p>
                            </div>
                        </div>
                        <button onClick={handleCloseAttempt} className="p-2 hover:bg-white/5 rounded-full transition-all">
                            <X className="w-6 h-6 text-muted" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex overflow-hidden">
                        
                        {/* LEFT: Fields list */}
                        <div className="w-1/3 border-r border-border flex flex-col bg-black/10">
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                                
                                {/* Collection Name Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest flex justify-between">
                                        Nombre de la Colección
                                        {isEditing && <span className="text-orange-400/60 lowercase italic">No editable</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={collectionName}
                                        onChange={(e) => {
                                            setCollectionName(e.target.value)
                                            if (errors.collectionName) {
                                                const ne = {...errors}; delete ne.collectionName; setErrors(ne)
                                            }
                                        }}
                                        disabled={isEditing}
                                        placeholder="Ej: articulos"
                                        className={cn(
                                            "w-full bg-black/40 border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent transition-all",
                                            errors.collectionName ? "border-red-500/50" : "border-border",
                                            isEditing && "opacity-50 cursor-not-allowed"
                                        )}
                                    />
                                    {errors.collectionName && <p className="text-[10px] text-red-500">{errors.collectionName}</p>}
                                    <p className="text-[10px] text-muted font-mono">
                                        Tu colección será: <span className="text-accent">{collectionSlug || '...'}</span>
                                    </p>
                                </div>

                                {/* Fields List */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-4">
                                        Campos ({fields.filter(f => f._state !== 'deleted').length})
                                    </label>
                                    
                                    <div className="space-y-2">
                                        {fields.map((field, index) => (
                                            <div 
                                                key={field.id}
                                                onClick={() => field._state !== 'deleted' && setSelectedFieldId(field.id)}
                                                className={cn(
                                                    "relative group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                                    selectedFieldId === field.id 
                                                        ? "bg-accent/10 border-accent/40 shadow-[0_0_15px_rgba(55,255,208,0.05)]" 
                                                        : "bg-black/20 border-border hover:border-border-hover",
                                                    errors[field.id] && "border-red-500/30",
                                                    field._state === 'deleted' && "opacity-40 grayscale pointer-events-none"
                                                )}
                                            >
                                                {/* Reorder Buttons (Hover Only) - Disabled for system fields to avoid confusion */}
                                                {!field.system && (
                                                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-md shadow-xl z-20 overflow-hidden">
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); moveField(index, 'up') }}
                                                            disabled={index === 0}
                                                            className="p-1 hover:bg-white/5 disabled:opacity-30"
                                                        >
                                                            <ChevronUp className="w-3 h-3" />
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => { e.stopPropagation(); moveField(index, 'down') }}
                                                            disabled={index === fields.length - 1}
                                                            className="p-1 hover:bg-white/5 border-t border-border disabled:opacity-30"
                                                        >
                                                            <ChevronDown className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}


                                                <div className={cn(
                                                    "p-2 rounded-lg",
                                                    selectedFieldId === field.id ? "bg-accent/20 text-accent" : "bg-white/5 text-muted"
                                                )}>
                                                    {getFieldIcon(field.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-xs font-bold truncate",
                                                            field._state === 'deleted' && "line-through"
                                                        )}>
                                                            {field.name || <span className="text-muted italic">Sin nombre</span>}
                                                        </span>
                                                        {field.system && <span className="text-[7px] bg-blue-500/10 text-blue-400 px-1 rounded font-bold uppercase tracking-tighter border border-blue-500/20">Sistema</span>}
                                                        {field._state === 'new' && <span className="text-[7px] bg-green-500/10 text-green-500 px-1 rounded font-bold uppercase">Nuevo</span>}
                                                        {errors[field.id] && <AlertTriangle className="w-3 h-3 text-red-500" />}
                                                    </div>
                                                    <span className="text-[9px] text-muted uppercase tracking-wider">{field.type}</span>
                                                </div>
                                                {!field.system ? (
                                                    <button onClick={(e) => { e.stopPropagation(); removeField(field.id) }} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-red-500 rounded transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                                ) : (
                                                    <Lock className="w-3.5 h-3.5 text-muted/20" />
                                                )}

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border bg-black/20 relative group/add">
                                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent text-background font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-accent/20">
                                    <Plus className="w-4 h-4" /> Agregar Campo
                                </button>
                                <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1a1a1a] border border-border rounded-2xl p-2 shadow-2xl opacity-0 invisible group-hover/add:opacity-100 group-hover/add:visible transition-all grid grid-cols-2 gap-1 z-10">
                                    {FIELD_TYPES.map(type => (
                                        <button key={type.value} onClick={() => handleAddField(type.value as FieldType)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-all text-left group/item">
                                            <div className="shrink-0 p-1.5 bg-white/5 group-hover/item:bg-accent/10 rounded">{type.icon}</div>
                                            <div className="text-[10px] font-bold uppercase leading-none">{type.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Field configuration */}
                        <div className="w-2/3 flex flex-col bg-black/5">
                            {selectedFieldId && selectedField ? (
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-fade-in">
                                    <form className="max-w-xl mx-auto space-y-10" onSubmit={(e) => e.preventDefault()}>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-4 bg-accent/10 rounded-2xl text-accent">{getFieldIcon(selectedField.type)}</div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white capitalize">Configuración de {selectedField.type}</h3>
                                                <p className="text-sm text-muted">Define cómo se comporta el campo <span className="text-accent font-mono">"{selectedField.name || '...'}"</span></p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Name Input */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Nombre del Campo</label>
                                                <input 
                                                    type="text" 
                                                    value={selectedField.name} 
                                                    onChange={(e) => updateField(selectedField.id, { name: slugify(e.target.value) })} 
                                                    disabled={selectedField.system}
                                                    placeholder="mi_campo"
                                                    className={cn(
                                                        "w-full bg-black/40 border rounded-xl px-4 py-3 text-sm text-white focus:border-accent outline-none transition-all",
                                                        errors[selectedField.id] ? "border-red-500/50" : "border-border",
                                                        selectedField.system && "opacity-50 cursor-not-allowed"
                                                    )}
                                                />
                                                {selectedField.system && <p className="text-[9px] text-blue-400 italic">Este es un campo del sistema requerido por la plataforma.</p>}
                                                {errors[selectedField.id] && <p className="text-[10px] text-red-500 underline decoration-red-500/20">{errors[selectedField.id]}</p>}
                                                <p className="text-[9px] text-muted font-mono italic">Slug: {slugify(selectedField.name || '...')}</p>
                                            </div>

                                            {/* Required Toggle */}
                                            <label className={cn(
                                                "flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-border transition-all group",
                                                selectedField.system ? "opacity-50 cursor-not-allowed" : "hover:border-accent/40 cursor-pointer"
                                            )}>
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("p-2 rounded-lg transition-colors", selectedField.required ? "bg-accent/10 text-accent" : "bg-white/5 text-muted")}><Lock className="w-4 h-4" /></div>
                                                    <div><div className="text-sm font-bold text-white">Requerido</div><div className="text-[10px] text-muted">Este campo no puede quedar vacío</div></div>
                                                </div>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedField.required} 
                                                    onChange={(e) => !selectedField.system && updateField(selectedField.id, { required: e.target.checked })} 
                                                    disabled={selectedField.system}
                                                    className="w-5 h-5 rounded border-border bg-black/40 text-accent focus:ring-accent" 
                                                />
                                            </label>

                                        </div>

                                        <div className="h-px bg-border my-4" />

                                        {/* Type Specific Sections */}
                                        <div className="space-y-10">
                                            {/* TEXT */}
                                            {selectedField.type === 'text' && (
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Longitud Mín</label><input type="number" value={selectedField.min} onChange={(e) => updateField(selectedField.id, { min: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Longitud Máx</label><input type="number" value={selectedField.max} onChange={(e) => updateField(selectedField.id, { max: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <div className="col-span-2 space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Patrón (Regex)</label><input type="text" placeholder="^[a-z]+$" value={selectedField.pattern} onChange={(e) => updateField(selectedField.id, { pattern: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                </div>
                                            )}

                                            {/* NUMBER */}
                                            {selectedField.type === 'number' && (
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Valor Mín</label><input type="number" value={selectedField.min} onChange={(e) => updateField(selectedField.id, { min: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Valor Máx</label><input type="number" value={selectedField.max} onChange={(e) => updateField(selectedField.id, { max: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <label className="col-span-2 flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={selectedField.noDecimal} onChange={(e) => updateField(selectedField.id, { noDecimal: e.target.checked })} className="w-4 h-4 rounded text-accent" /><span className="text-sm">Solo enteros (sin decimales)</span></label>
                                                </div>
                                            )}

                                            {/* SELECT */}
                                            {selectedField.type === 'select' && (
                                                <div className="space-y-6">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] text-muted uppercase font-bold">Opciones</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {(selectedField.options?.values || []).map((val, idx) => (
                                                                <div key={idx} className="bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full flex items-center gap-2 group/tag animate-in zoom-in-50 duration-200">
                                                                    <span className="text-xs font-bold text-accent">{val}</span>
                                                                    <button type="button" onClick={() => {
                                                                        const newVals = [...(selectedField.options?.values || [])]; newVals.splice(idx, 1);
                                                                        updateField(selectedField.id, { options: { ...selectedField.options!, values: newVals } })
                                                                    }} className="hover:text-red-500"><X className="w-3 h-3"/></button>
                                                                </div>
                                                            ))}
                                                            <button 
                                                                type="button"
                                                                onClick={() => { const val = prompt('Nueva opción:'); if(val) updateField(selectedField.id, { options: { ...selectedField.options!, values: [...(selectedField.options?.values || []), val] } }) }}
                                                                className="px-3 py-1.5 rounded-full border border-dashed border-border text-muted hover:text-accent hover:border-accent text-[10px] uppercase font-bold transition-all"
                                                            >
                                                                + Agregar opción
                                                            </button>
                                                        </div>
                                                        {errors[`${selectedField.id}_options`] && <p className="text-[10px] text-red-500">{errors[`${selectedField.id}_options`]}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-muted uppercase font-bold">Máx Selecciones (0=ilimitado, 1=single)</label>
                                                        <input type="number" min="0" value={selectedField.options?.maxSelect || 1} onChange={(e) => updateField(selectedField.id, { options: { ...selectedField.options!, maxSelect: parseInt(e.target.value) } }) } className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* RELATION */}
                                            {selectedField.type === 'relation' && (
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-muted uppercase font-bold">Colección Relacionada</label>
                                                        {collections.length > 0 ? (
                                                            <select 
                                                                value={selectedField.collectionId || ''} 
                                                                onChange={(e) => updateField(selectedField.id, { collectionId: e.target.value })}
                                                                className={cn(
                                                                    "w-full bg-black/40 border rounded-lg p-2 text-sm text-white",
                                                                    errors[`${selectedField.id}_relation`] ? "border-red-500/50" : "border-border"
                                                                )}
                                                            >
                                                                <option value="">Selecciona una colección...</option>
                                                                {collections.map(c => (
                                                                    <option key={c.id} value={c.id}>📦 {c.name}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
                                                                <Info className="w-5 h-5 text-orange-500 shrink-0" />
                                                                <p className="text-xs text-orange-200">No tenés otras colecciones aún. Creá otra colección primero.</p>
                                                            </div>
                                                        )}
                                                        {errors[`${selectedField.id}_relation`] && <p className="text-[10px] text-red-500">{errors[`${selectedField.id}_relation`]}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-muted uppercase font-bold">Máx Relaciones (1=single, vacío=ilimitado)</label>
                                                        <input type="number" placeholder="Multi" value={selectedField.maxSelect || ''} onChange={(e) => updateField(selectedField.id, { maxSelect: e.target.value ? parseInt(e.target.value) : null })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" />
                                                    </div>
                                                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={selectedField.cascadeDelete} onChange={(e) => updateField(selectedField.id, { cascadeDelete: e.target.checked })} className="w-4 h-4 rounded text-accent" /><span className="text-sm italic">Cascada al borrar (Borrar registros relacionados)</span></label>
                                                </div>
                                            )}

                                            {/* FILE */}
                                            {selectedField.type === 'file' && (
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Máx Archivos</label><input type="number" min="1" value={selectedField.maxSelect || 1} onChange={(e) => updateField(selectedField.id, { maxSelect: parseInt(e.target.value) })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Tam. Máx (MB)</label><input type="number" min="1" value={selectedField.maxSize || 5} onChange={(e) => updateField(selectedField.id, { maxSize: parseInt(e.target.value) })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <div className="col-span-2 space-y-4">
                                                        <label className="text-[10px] text-muted uppercase font-bold">Tipos MIME Permitidos</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {[
                                                                { label: 'Imágenes', val: 'image/*' },
                                                                { label: 'Videos', val: 'video/*' },
                                                                { label: 'Audio', val: 'audio/*' },
                                                                { label: 'PDFs', val: 'application/pdf' },
                                                            ].map(type => (
                                                                <label key={type.val} className="flex items-center gap-3 p-3 bg-white/5 border border-border rounded-lg hover:border-accent/40 cursor-pointer transition-colors">
                                                                    <input type="checkbox" checked={(selectedField.mimeTypes || []).includes(type.val)} onChange={(e) => {
                                                                        const cur = selectedField.mimeTypes || []; const next = e.target.checked ? [...cur, type.val] : cur.filter(v => v !== type.val);
                                                                        updateField(selectedField.id, { mimeTypes: next })
                                                                    }} className="w-4 h-4 rounded text-accent" />
                                                                    <span className="text-xs">{type.label}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            {(selectedField.mimeTypes || []).map(m => <span key={m} className="text-[8px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-md border border-accent/20 font-bold uppercase tracking-tight">{m}</span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* INFO FOR SIMPLE TYPES */}
                                            {['json', 'editor', 'password', 'bool', 'email', 'url', 'date'].includes(selectedField.type) && (
                                                <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl flex items-start gap-4">
                                                    <Info className="w-5 h-5 text-accent mt-1 shrink-0" />
                                                    <div>
                                                        <h4 className="font-bold text-accent text-sm uppercase tracking-wider">Acerca de {selectedField.type}</h4>
                                                        <p className="text-xs text-muted leading-relaxed mt-1">
                                                            {selectedField.type === 'json' && 'Este campo valida que el contenido sea una estructura JSON pura.'}
                                                            {selectedField.type === 'editor' && 'Habilita un editor de texto enriquecido (HTML) en el dashboard de registros.'}
                                                            {selectedField.type === 'password' && 'El contenido se encripta inmediatamente y solo es visible para administradores.'}
                                                            {selectedField.type === 'email' && 'Valida el formato estricto de email RFC.'}
                                                            {selectedField.type === 'bool' && 'Interruptor simple de verdadero/falso.'}
                                                            {selectedField.type === 'url' && 'Valida direcciones web correctamente formateadas (https/http).'}
                                                            {selectedField.type === 'date' && 'Almacena valores de fecha y hora. Puedes especificar un rango mín/máx.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {selectedField.type === 'date' && (
                                                <div className="grid grid-cols-2 gap-6 pt-4">
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Fecha Mínima</label><input type="datetime-local" value={selectedField.min || ''} onChange={(e) => updateField(selectedField.id, { min: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                    <div className="space-y-2"><label className="text-[10px] text-muted uppercase font-bold">Fecha Máxima</label><input type="datetime-local" value={selectedField.max || ''} onChange={(e) => updateField(selectedField.id, { max: e.target.value })} className="w-full bg-black/40 border border-border rounded-lg p-2 text-sm" /></div>
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                                    <div className="p-10 border-2 border-dashed border-border rounded-full mb-6">
                                        <Layout className="w-20 h-20" />
                                    </div>
                                    <h3 className="text-2xl font-bold">Seleccioná un campo</h3>
                                    <p className="text-sm max-w-xs mt-2 text-muted">Ajustá la configuración del campo seleccionado o agregá uno nuevo desde la izquierda.</p>
                                </div>
                            )}
                            
                            {/* Footer Actions */}
                            <div className="p-6 border-t border-border bg-black/20 flex justify-end gap-4">
                                <button onClick={handleCloseAttempt} className="px-6 py-2.5 rounded-xl border border-border text-xs font-bold text-white uppercase tracking-widest hover:bg-white/5">Cancelar</button>
                                <button onClick={handleSave} disabled={loading} className="px-10 py-2.5 rounded-xl bg-accent text-background text-xs font-bold uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                                    {loading && <div className="h-3 w-3 animate-spin rounded-full border-2 border-background border-t-transparent" />}
                                    <Save className="w-4 h-4" /> {isEditing ? 'Guardar Esquema' : 'Crear Colección'}
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Confirmation Modals (Discard & Delete) */}
            {isDiscardConfirmOpen && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-[#121212] border border-border rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-orange-500/10 text-orange-500 rounded-full"><AlertTriangle className="w-8 h-8" /></div>
                            <div className="space-y-2"><h3 className="text-xl font-bold text-white">¿Descartar cambios?</h3><p className="text-sm text-muted">Tenés cambios sin guardar que se perderán definitivamente.</p></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={confirmDiscard} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-sm uppercase hover:bg-red-600">Sí, descartar cambios</button>
                            <button onClick={() => setIsDiscardConfirmOpen(false)} className="w-full py-3 rounded-xl border border-border text-white font-bold text-sm uppercase hover:bg-white/5">No, seguir editando</button>
                        </div>
                    </div>
                </div>, document.body
            )}

            {isDeleteFieldConfirmId && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-sm bg-[#121212] border border-border rounded-3xl p-8 shadow-2xl animate-in zoom-in duration-300 space-y-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-red-500/10 text-red-500 rounded-full"><Trash2 className="w-8 h-8" /></div>
                            <div className="space-y-2"><h3 className="text-xl font-bold text-white">¿Borrar campo?</h3><p className="text-sm text-muted italic">⚠️ Esta acción eliminará permanentemente todos los datos guardados en este campo.</p></div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={confirmDeleteField} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold text-sm uppercase">Confirmar Borrado</button>
                            <button onClick={() => setIsDeleteFieldConfirmId(null)} className="w-full py-3 rounded-xl border border-border text-white font-bold text-sm uppercase">Cancelar</button>
                        </div>
                    </div>
                </div>, document.body
            )}
        </>,
        document.body
    )
}
