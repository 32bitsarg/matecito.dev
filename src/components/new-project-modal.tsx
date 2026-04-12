'use client'

import { useState, useEffect } from 'react'
import { ProjectService } from '@/services/api.service'
import { toast } from 'sonner'
import { X, Loader2, Globe, Sparkles, Check } from 'lucide-react'

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
    const [apiVersion, setApiVersion] = useState<'v1' | 'v2'>('v2')

    // ── Open listener ──────────────────────────────────────────────────────────

    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true)
            setApiVersion('v2')
        }
        window.addEventListener('open-new-project-modal', handleOpen)
        return () => window.removeEventListener('open-new-project-modal', handleOpen)
    }, [])

    // ── Handlers ───────────────────────────────────────────────────────────────

    const handleClose = () => {
        if (loading) return
        setIsOpen(false)
        setName('')
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()

        const trimmed = name.trim()

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

        if (loading) return

        setLoading(true)

        try {
            const { project, api_keys } = await ProjectService.create(
                currentWorkspaceId,
                trimmed,
                apiVersion
            )

            toast.success(`Proyecto creado 🚀${apiVersion === 'v2' ? ' (API v2)' : ''}`)
            console.log('API KEYS:', api_keys)

            handleClose()
            onCreated()

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            style={{ backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full max-w-md bg-[var(--bg-primary)] border rounded-2xl shadow-[var(--shadow-modal)] overflow-hidden animate-slide-up"
                style={{ borderColor: 'var(--border)' }}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
                        Nuevo Proyecto
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="opacity-40 hover:opacity-100 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" style={{ color: 'var(--fg-primary)' }} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="p-6 space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--fg-tertiary)' }}>
                            Nombre del Proyecto
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            maxLength={50}
                            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border)',
                                color: 'var(--fg-primary)',
                            }}
                            placeholder="Mi App Increíble"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Subdomain preview */}
                    {name.trim() && (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono text-xs"
                            style={{
                                backgroundColor: 'var(--bg-secondary)',
                                borderColor: 'var(--border)',
                                color: 'var(--fg-secondary)',
                            }}>
                            <Globe className="w-4 h-4 shrink-0" style={{ color: 'var(--fg-tertiary)' }} />
                            {subdomain}.matecito.dev
                        </div>
                    )}

                    {/* API Version selector */}
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'var(--fg-tertiary)' }}>
                            Versión de API
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {/* V2 option */}
                            <button
                                type="button"
                                onClick={() => setApiVersion('v2')}
                                className={`relative flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${
                                    apiVersion === 'v2'
                                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                    <span className="text-sm font-semibold" style={{ color: 'var(--fg-primary)' }}>v2</span>
                                    {apiVersion === 'v2' && (
                                        <div className="absolute top-2 right-2">
                                            <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] leading-tight" style={{ color: 'var(--fg-secondary)' }}>
                                    Functions, AI, Analytics, Remote Config y más
                                </p>
                                <span className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full mt-0.5">
                                    Recomendada
                                </span>
                            </button>

                            {/* V1 option */}
                            <button
                                type="button"
                                onClick={() => setApiVersion('v1')}
                                className={`relative flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${
                                    apiVersion === 'v1'
                                        ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                                        : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                                }`}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold" style={{ color: 'var(--fg-primary)' }}>v1</span>
                                    {apiVersion === 'v1' && (
                                        <div className="absolute top-2 right-2">
                                            <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] leading-tight" style={{ color: 'var(--fg-secondary)' }}>
                                    CRUD, Auth básico, Permisos
                                </p>
                                <span className="text-[9px] font-medium bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded-full mt-0.5"
                                    style={{ color: 'var(--fg-tertiary)' }}>
                                    Legacy
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-all"
                        style={{ backgroundColor: 'var(--accent)' }}
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
