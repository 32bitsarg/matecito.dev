'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Database, Hash, Type, CheckSquare, Mail, Calendar, Link as LinkIcon, Paperclip } from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CollectionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const FIELD_TYPES = [
    { label: 'Texto', value: 'text', icon: <Type className="w-3 h-3" /> },
    { label: 'Número', value: 'number', icon: <Hash className="w-3 h-3" /> },
    { label: 'Boolean', value: 'bool', icon: <CheckSquare className="w-3 h-3" /> },
    { label: 'Email', value: 'email', icon: <Mail className="w-3 h-3" /> },
    { label: 'Fecha', value: 'date', icon: <Calendar className="w-3 h-3" /> },
    { label: 'Relación', value: 'relation', icon: <LinkIcon className="w-3 h-3" /> },
    { label: 'Archivo', value: 'file', icon: <Paperclip className="w-3 h-3" /> },
]

export default function CollectionModal({ isOpen, onClose, onSuccess }: CollectionModalProps) {
    const { createCollection } = useProject()
    const [name, setName] = useState('')
    const [fields, setFields] = useState<any[]>([
        { id: Math.random().toString(), name: 'title', type: 'text', required: true }
    ])
    const [loading, setLoading] = useState(false)

    const addField = () => {
        setFields([...fields, { id: Math.random().toString(), name: '', type: 'text', required: false }])
    }

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
    }

    const updateField = (id: string, updates: any) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || fields.length === 0 || loading) return

        const normalizedName = name.toLowerCase().trim().replace(/\s+/g, '_')

        setLoading(true)
        try {
            await createCollection({
                name: normalizedName,
                type: 'base',
                fields: fields.map(f => ({
                    name: f.name.toLowerCase().trim().replace(/\s+/g, '_'),
                    type: f.type,
                    required: f.required
                }))
            })
            toast.success('¡Colección creada con éxito! 🧉')
            onSuccess()
            onClose()
        } catch (err: any) {
            console.error('Error detallado de PB:', err.response)
            const errorMsg = err.response?.message || err.message || 'Error desconocido'
            const details = err.response?.data ? JSON.stringify(err.response.data) : ''
            toast.error(`Error: ${errorMsg}. ${details}`)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] animate-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#222222]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#3ECF8E]/10 rounded-xl text-[#3ECF8E]">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Nueva Colección</h2>
                            <p className="text-xs text-[#a1a1aa]">Define la estructura de tu nueva tabla</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                        <X className="w-5 h-5 text-[#a1a1aa]" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <div className="space-y-4">
                        <label className="block text-xs font-bold text-[#52525b] uppercase tracking-widest">
                            Nombre de la Colección
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: articulos, ventas, productos"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0c0c0c] border border-[#222222] rounded-xl px-4 py-3 text-sm text-white focus:border-[#3ECF8E] outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-[#52525b] uppercase tracking-widest">
                                Campos del Esquema
                            </label>
                            <button
                                type="button"
                                onClick={addField}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E] text-[10px] font-bold hover:bg-[#3ECF8E]/20 transition-all uppercase tracking-tight"
                            >
                                <Plus className="w-3 h-3" />
                                Añadir Campo
                            </button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field) => (
                                <div key={field.id} className="flex items-center gap-3 bg-[#0c0c0c]/50 p-4 rounded-2xl border border-[#222222] group hover:border-[#3ECF8E]/30 transition-all">
                                    <div className="flex-1 grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            required
                                            value={field.name}
                                            placeholder="Nombre del campo"
                                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                                            className="bg-transparent border-b border-[#222222] py-1 text-sm text-white focus:border-[#3ECF8E] outline-none transition-all"
                                        />
                                        <select
                                            value={field.type}
                                            onChange={(e) => updateField(field.id, { type: e.target.value })}
                                            className="bg-[#0c0c0c] border border-[#222222] rounded-lg px-2 py-1 text-xs text-[#a1a1aa] outline-none focus:border-[#3ECF8E]"
                                        >
                                            {FIELD_TYPES.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer group/check">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                className="w-3.5 h-3.5 rounded border-[#2a2a2a] bg-[#1a1a1a] text-[#3ECF8E] focus:ring-[#3ECF8E] focus:ring-offset-0"
                                            />
                                            <span className="text-[10px] text-[#52525b] uppercase font-bold group-hover/check:text-[#a1a1aa]">Requerido</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeField(field.id)}
                                            className="p-1.5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[#222222] bg-[#0c0c0c]/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-[#2a2a2a] text-sm font-bold text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name}
                        className="px-8 py-2.5 rounded-xl bg-[#3ECF8E] text-[#0f0f0f] text-sm font-bold hover:bg-[#34b27b] transition-all shadow-[0_4px_20px_rgba(62,207,142,0.2)]"
                    >
                        {loading ? 'Creando...' : 'Crear Colección'}
                    </button>
                </div>
            </div>
        </div>
    )
}
