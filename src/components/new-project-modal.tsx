'use client'

import { useState, useEffect } from 'react'
import { ProjectService } from '@/services/api.service'
import { toast } from 'sonner'
import { X, Loader2, Globe } from 'lucide-react'

// ─── Utils ───────────────────────────────────────────────────────────────────

function previewSubdomain(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface NewProjectModalProps {
    currentWorkspaceId?: string
    onCreated: () => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function NewProjectModal({
    currentWorkspaceId,
    onCreated
}: NewProjectModalProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    // ── Open listener ──────────────────────────────────────────────────────────

    useEffect(() => {
        const handleOpen = () => setIsOpen(true)
        window.addEventListener('open-new-project-modal', handleOpen)
        return () => window.removeEventListener('open-new-project-modal', handleOpen)
    }, [])

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleClose = () => {
        if (loading) return // evita cerrar en medio de creación
        setIsOpen(false)
        setName('')
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()

        const trimmed = name.trim()

        // ── Validaciones ────────────────────────────────────────────────────────
        if (!trimmed) {
            toast.error('El nombre es requerido')
            return
        }

        if (trimmed.length < 3) {
            toast.error('Mínimo 3 caracteres')
            return
        }

        if (trimmed.length > 50) {
            toast.error('Máximo 50 caracteres')
            return
        }

        if (!currentWorkspaceId) {
            toast.error('Workspace inválido')
            return
        }

        if (loading) return // evita doble submit

        setLoading(true)

        try {
            const { project, api_keys } = await ProjectService.create(
                currentWorkspaceId,
                trimmed
            )

            toast.success('Proyecto creado 🚀')

            // 👉 opcional: mostrar keys (esto es oro)
            console.log('API KEYS:', api_keys)

            handleClose()
            onCreated()

            // 👉 opcional (pro level): redirigir directo
            // router.push(`/dashboard/${workspaceSlug}/${project.subdomain}`)

        } catch (error: any) {
            console.error(error)
            toast.error(error.message ?? 'Error al crear el proyecto')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const subdomain = previewSubdomain(name)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--accent)]/10 backdrop-blur-md animate-in fade-in duration-300">

            <div className="w-full max-w-md bg-[var(--background)] border border-[var(--accent)]/10 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--accent)]/5">
                    <h2 className="text-xl font-bold text-[var(--accent)]">
                        Nuevo Proyecto
                    </h2>

                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="opacity-40 hover:opacity-100 p-2 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="p-6 space-y-6">

                    <div>
                        <label className="block text-xs font-bold opacity-40 uppercase mb-2">
                            Nombre del Proyecto
                        </label>

                        <input
                            type="text"
                            required
                            autoFocus
                            maxLength={50}
                            className="w-full rounded-full border px-5 py-3 text-sm bg-[var(--accent)]/5 outline-none focus:ring-1"
                            placeholder="Mi App Increíble"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Preview */}
                    {name.trim() && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--accent)]/5 border">
                            <Globe className="w-4 h-4 opacity-40" />
                            <p className="text-xs font-mono opacity-60">
                                {subdomain}.matecito.dev
                            </p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-[var(--background)] disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creando...
                            </>
                        ) : (
                            'Crear Proyecto'
                        )}
                    </button>

                </form>
            </div>
        </div>
    )
}