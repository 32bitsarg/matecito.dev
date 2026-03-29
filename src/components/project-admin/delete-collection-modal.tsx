'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { useProject } from '@/contexts/ProjectContext'
import { toast } from 'sonner'

interface DeleteCollectionModalProps {
    isOpen: boolean
    onClose: () => void
    collection: any
    onSuccess: () => void
}

export default function DeleteCollectionModal({
    isOpen,
    onClose,
    collection,
    onSuccess,
}: DeleteCollectionModalProps) {
    const { deleteCollection } = useProject()
    const [confirmName, setConfirmName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isOpen) setConfirmName('')
    }, [isOpen])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    if (!isOpen || !collection) return null

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        if (confirmName !== collection.name) return
        setLoading(true)
        try {
            await deleteCollection(collection.name)
            toast.success(`Colección "${collection.name}" eliminada`)
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(`Error al eliminar: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-4 p-5 border-b border-red-100 bg-red-50">
                    <div className="p-2.5 bg-red-100 rounded-xl text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h2 className="font-extrabold text-slate-900">Eliminar colección</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Esta acción es irreversible y borrará todos los datos.</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-red-100 rounded-lg text-slate-400 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleDelete} className="p-5 space-y-4">
                    <p className="text-sm text-slate-600">
                        Escribí <span className="font-mono font-bold text-slate-900">{collection.name}</span> para confirmar:
                    </p>
                    <input
                        type="text"
                        placeholder={collection.name}
                        autoFocus
                        value={confirmName}
                        onChange={e => setConfirmName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-mono focus:border-red-400 outline-none transition-all"
                    />
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                            Cancelar
                        </button>
                        <button type="submit"
                            disabled={confirmName !== collection.name || loading}
                            className="flex-[2] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Eliminar
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}
