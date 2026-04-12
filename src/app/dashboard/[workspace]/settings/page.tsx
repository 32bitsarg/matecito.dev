'use client'

import { useState, useEffect } from 'react'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { WorkspaceService } from '@/services/api.service'
import { Settings, Trash2, AlertTriangle, Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function WorkspaceSettingsPage() {
    const { currentWorkspace, checkPermission, refreshWorkspaces } = useWorkspace()
    const [name, setName] = useState(currentWorkspace?.name || '')
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState('')
    const router = useRouter()

    const canRename = checkPermission('admin')
    const canDelete = checkPermission('owner')

    useEffect(() => {
        if (currentWorkspace?.name) {
            setName(currentWorkspace.name)
        }
    }, [currentWorkspace])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentWorkspace || !name.trim() || isSaving) return

        setIsSaving(true)
        try {
            await WorkspaceService.rename(currentWorkspace.id, name.trim())
            toast.success('Workspace renombrado correctamente')
            await refreshWorkspaces()
        } catch (err: any) {
            toast.error(err.message || 'Error al renombrar')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!currentWorkspace || deleteConfirm !== currentWorkspace.slug) return
        
        setIsDeleting(true)
        try {
            await WorkspaceService.delete(currentWorkspace.id)
            toast.success('Workspace eliminado')
            await refreshWorkspaces()
            router.push('/dashboard')
        } catch (err: any) {
            toast.error(err.message || 'Error al eliminar')
            setIsDeleting(false)
        }
    }

    if (!currentWorkspace) return null

    return (
        <div className="max-w-2xl space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)]">
                <Link href="/dashboard" className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors text-[var(--fg-tertiary)]">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--fg-primary)] flex items-center gap-2">
                        <Settings className="w-6 h-6 text-[var(--accent)]" />
                        Ajustes del Workspace
                    </h1>
                    <p className="text-sm text-[var(--fg-tertiary)]">Gestiona la identidad y seguridad de este espacio.</p>
                </div>
            </div>

            {/* General Settings */}
            <section className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center">
                        <Save className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <h2 className="font-bold text-[var(--fg-primary)] text-lg">General</h2>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--fg-secondary)] ml-1 uppercase tracking-wider">Nombre del Workspace</label>
                        <input
                            type="text"
                            disabled={!canRename}
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Mi Gran Equipo"
                            className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-sm font-medium outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-400 focus:bg-[var(--bg-primary)] transition-all disabled:opacity-50"
                        />
                        {!canRename && (
                            <p className="text-[10px] text-amber-400 font-medium ml-1">
                                Solo administradores pueden cambiar el nombre.
                            </p>
                        )}
                    </div>

                    {canRename && (
                        <button
                            type="submit"
                            disabled={isSaving || name === currentWorkspace.name}
                            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white text-sm font-bold rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-all"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar Cambios
                        </button>
                    )}
                </form>
            </section>

            {/* Danger Zone */}
            {canDelete && (
                <section className="bg-red-950/20/30 border border-red-800/40 rounded-xl p-6 space-y-6">
                    <div className="flex items-center gap-3 text-red-400">
                        <div className="w-10 h-10 rounded-xl bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h2 className="font-bold text-lg text-red-900">Zona de Peligro</h2>
                    </div>

                    <div className="bg-[var(--bg-primary)] border border-red-800/40 rounded-xl p-5 space-y-4">
                        <div>
                            <h3 className="font-bold text-[var(--fg-primary)]">Eliminar este Workspace</h3>
                            <p className="text-sm text-[var(--fg-secondary)] leading-relaxed">
                                Esta acción es permanente. Se eliminarán todos los proyectos, bases de datos, registros y configuraciones asociadas a <span className="font-bold text-[var(--fg-primary)]">"{currentWorkspace.name}"</span>.
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <p className="text-xs text-[var(--fg-tertiary)]">Para confirmar, escribí el slug del workspace: <span className="font-mono font-bold text-red-400 select-all">{currentWorkspace.slug}</span></p>
                            <input
                                type="text"
                                value={deleteConfirm}
                                onChange={e => setDeleteConfirm(e.target.value)}
                                placeholder="Escribí el slug aquí..."
                                className="w-full px-4 py-3 border-2 border-red-800/40 rounded-xl text-sm font-mono outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/5 transition-all"
                            />

                            <button
                                onClick={handleDelete}
                                disabled={deleteConfirm !== currentWorkspace.slug || isDeleting}
                                className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:bg-[var(--border)] disabled:text-[var(--fg-tertiary)] transition-all active:scale-[0.98]"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 className="w-5 h-5" />
                                        ELIMINAR WORKSPACE DE FORMA PERMANENTE
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {!canDelete && (
                <div className="p-4 bg-[var(--bg-secondary)] rounded-xl flex items-center gap-3 text-[var(--fg-secondary)] opacity-60">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p className="text-xs font-medium">Solo el dueño (Owner) tiene permisos para eliminar o realizar ajustes críticos en el workspace.</p>
                </div>
            )}
        </div>
    )
}
