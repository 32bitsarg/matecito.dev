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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-md bg-[var(--bg-primary)] border rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden animate-slide-up"
                style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>Nuevo Workspace</h2>
                    <button onClick={() => setIsOpen(false)} className="opacity-40 hover:opacity-100 transition-all p-2 rounded-full hover:bg-[var(--bg-secondary)]">
                        <X className="w-5 h-5" style={{ color: 'var(--fg-primary)' }} />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-tertiary)' }}>
                            Nombre
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all focus:border-[var(--accent)]"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border)',
                                color: 'var(--fg-primary)',
                            }}
                            placeholder="Mi Empresa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--fg-tertiary)' }}>
                            Slug
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-lg border px-4 py-2.5 text-sm font-mono outline-none transition-all focus:border-[var(--accent)]"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border)',
                                color: 'var(--accent)',
                            }}
                            placeholder="mi-empresa"
                            value={slug}
                            onChange={(e) => setSlug(slugify(e.target.value))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name}
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent)' }}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Workspace'}
                    </button>
                </form>
            </div>
        </div>
    )
}
