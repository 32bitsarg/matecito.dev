'use client'

import { useState } from 'react'
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
    onSuccess 
}: DeleteCollectionModalProps) {
    const { deleteCollection } = useProject()
    const [confirmName, setConfirmName] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen || !collection) return null

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault()
        if (confirmName !== collection.name) return

        setLoading(true)
        try {
            await deleteCollection(collection.id)
            toast.success(`Colección "${collection.name}" eliminada correctamente`)
            onSuccess()
            onClose()
        } catch (err: any) {
            toast.error(`Error al eliminar: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-[#0f0f0f] border border-red-500/20 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-[#222222] bg-red-500/5 flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">¿Estás seguro?</h2>
                        <p className="text-xs text-[#a1a1aa] mt-1 text-pretty">Esta acción es irreversible y borrará todos los datos asociados.</p>
                    </div>
                </div>

                {/* Content */}
                <form onSubmit={handleDelete} className="p-6 space-y-6">
                    <div className="space-y-3">
                        <p className="text-sm text-[#a1a1aa]">
                            Para confirmar, por favor escribe <span className="text-white font-mono font-bold">{collection.name}</span> a continuación:
                        </p>
                        <input
                            type="text"
                            placeholder="Escribe el nombre de la colección"
                            className="w-full bg-[#0c0c0c] border border-[#222222] rounded-xl px-4 py-3 text-sm text-white focus:border-red-500 outline-none transition-all font-mono"
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-[#2a2a2a] text-sm font-bold text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={confirmName !== collection.name || loading}
                            className="flex-[2] flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(239,68,68,0.2)]"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Eliminar Colección
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
