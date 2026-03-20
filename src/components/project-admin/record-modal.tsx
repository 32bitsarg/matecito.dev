'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Save, FileBox, ShieldAlert } from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import { toast } from 'sonner'
import FieldInput from './ui/FieldInput'
import { cn } from '@/lib/utils'

interface RecordModalProps {
    isOpen: boolean
    onClose: () => void
    collection: any
    record?: any
    onSuccess: () => void
}

export default function RecordModal({
    isOpen,
    onClose,
    collection,
    record,
    onSuccess
}: RecordModalProps) {
    const { createRecord, updateRecord } = useProject()
    const [formData, setFormData] = useState<any>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (record) {
            setFormData(record)
        } else {
            const initialData: any = {}
            collection?.fields?.forEach((field: any) => {
                if (field.type === 'bool') initialData[field.name] = false
                if (field.type === 'number') initialData[field.name] = 0
            })
            setFormData(initialData)
        }
    }, [record, collection])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        try {
            // Logic to handle FormData if files are present
            let dataToSend: any = formData;
            const hasFiles = Object.values(formData).some(val => 
                val instanceof File || 
                val instanceof FileList || 
                (Array.isArray(val) && val.some(v => v instanceof File))
            );

            if (hasFiles) {
                const fd = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value instanceof FileList) {
                        Array.from(value as FileList).forEach(file => fd.append(key, file));
                    } else if (Array.isArray(value)) {
                        value.forEach(v => {
                            if (v instanceof File) fd.append(key, v);
                            else fd.append(key, v);
                        });
                    } else if (value instanceof File) {
                        fd.append(key, value);
                    } else if (value !== null && value !== undefined) {
                        // For JSON or objects, stringify them if they are sent via FormData
                        if (typeof value === 'object' && !(value instanceof File)) {
                            fd.append(key, JSON.stringify(value));
                        } else {
                            fd.append(key, value as any);
                        }
                    }
                });
                dataToSend = fd;
            }

            if (record) {
                await updateRecord(collection.name, record.id, dataToSend)
                toast.success('Cambios guardados correctamente')
            } else {
                await createRecord(collection.name, dataToSend)
                toast.success('Nuevo registro creado')
            }
            onSuccess()
            onClose()
        } catch (err: any) {
            console.error("Submission Error:", err);
            toast.error(`Error al guardar: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    if (!isOpen || !collection) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-3xl bg-[#0f0f0f] border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
                
                {/* Visual Header Decoration */}
                <div className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

                {/* Main Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-2xl text-accent border border-accent/20">
                            <FileBox className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                {record ? 'Editar Registro' : 'Nuevo Registro'}
                            </h2>
                            <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                                En: <span className="text-accent">{collection.name}</span> 
                                {record && <span className="text-white/20">| {record.id}</span>}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/5 rounded-full transition-all text-muted hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Body - Grid Layout for better space usage */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8">
                    
                    {collection.type === 'auth' && !record && (
                        <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl flex items-center gap-4">
                            <ShieldAlert className="w-5 h-5 text-blue-400" />
                            <p className="text-[11px] text-blue-200/50 leading-relaxed italic">
                                <span className="text-blue-400 font-bold uppercase tracking-widest">Nota:</span> Estás creando un usuario. Los campos obligatorios como username y password son gestionados automáticamente por el sistema de autenticación.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {collection?.fields?.map((field: any) => (
                            <div 
                                key={field.id} 
                                className={cn(
                                    "space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500",
                                    (field.type === 'json' || field.type === 'editor' || field.type === 'file') ? "md:col-span-2" : ""
                                )}
                            >
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-[0.1em]">
                                        {field.name}
                                    </label>
                                    {field.required && (
                                        <span className="text-[8px] font-bold text-red-500/50 uppercase tracking-tighter">Obligatorio</span>
                                    )}
                                </div>
                                <FieldInput 
                                    field={field} 
                                    value={formData[field.name]} 
                                    onChange={(val: any) => handleChange(field.name, val)} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Footer Spacer */}
                    <div className="h-4" />
                </form>

                {/* Actions Footer */}
                <div className="p-8 border-t border-white/5 bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-[10px] text-muted italic opacity-40">
                        * Los cambios se sincronizan en tiempo real con la instancia remota de PocketBase.
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold text-muted hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-accent text-background text-sm font-black hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-accent/10 uppercase tracking-widest"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {record ? 'Guardar Cambios' : 'Confirmar Creación'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
