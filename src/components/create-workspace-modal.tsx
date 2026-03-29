'use client'

import { useState, useEffect } from 'react'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { WorkspaceService } from '@/services/api.service'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'
import { X, Loader2 } from 'lucide-react'

export default function CreateWorkspaceModal() {
    const { refreshWorkspaces } = useWorkspace()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const handleOpen = () => setIsOpen(true)
        window.addEventListener('open-create-workspace-modal', handleOpen)
        return () => window.removeEventListener('open-create-workspace-modal', handleOpen)
    }, [])

    // Auto-slugify
    useEffect(() => {
        setSlug(slugify(name))
    }, [name])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !slug || loading) return

        setLoading(true)
        try {
            await WorkspaceService.create(name, slug)

            toast.success('¡Workspace creado con éxito! 🚀')
            setIsOpen(false)
            setName('')
            setSlug('')

            // Refrescar los datos de la aplicación sin recargar la página entera
            await refreshWorkspaces()

        } catch (error: any) {
            console.error('Error creating workspace:', error)
            toast.error(error.message || 'Error al crear el workspace. El slug podría estar en uso.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--accent)]/10 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-[var(--background)] border border-[var(--accent)]/10 rounded-3xl shadow-[0_32px_64px_-12px_rgba(1,57,26,0.15)] overflow-hidden animate-in zoom-in duration-500">
                <div className="flex items-center justify-between p-8 border-b border-[var(--accent)]/5">
                    <h2 className="text-2xl font-bold text-[var(--accent)]">Nuevo Workspace</h2>
                    <button onClick={() => setIsOpen(false)} className="text-[var(--foreground)] opacity-40 hover:opacity-100 transition-all p-2 rounded-full hover:bg-[var(--accent)]/5">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="p-8 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-[var(--foreground)] opacity-40 uppercase tracking-[0.2em] mb-3 ml-1">
                                Nombre del Workspace
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full rounded-full border border-[var(--accent)]/10 bg-[var(--accent)]/5 px-6 py-4 text-sm text-[var(--accent)] placeholder-[var(--foreground)]/30 outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                                placeholder="Mi Empresa"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-[var(--foreground)] opacity-40 uppercase tracking-[0.2em] mb-3 ml-1">
                                URL del Workspace (Slug)
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-full border border-[var(--accent)]/10 bg-[var(--accent)]/5 px-6 py-4 text-sm text-[var(--accent)] placeholder-[var(--foreground)]/30 outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                                    placeholder="mi-empresa"
                                    value={slug}
                                    onChange={(e) => setSlug(slugify(e.target.value))}
                                />
                            </div>
                            <p className="mt-3 text-[10px] font-mono text-[var(--foreground)] opacity-40 ml-1">
                                Tu workspace será: <span className="text-[var(--accent)] font-bold">{slug || '...'}</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-[var(--background)] transition-all hover:opacity-90 disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-[var(--accent)]/20"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Workspace'}
                    </button>
                </form>
            </div>
        </div>
    )
}
