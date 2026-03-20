'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import pb from '@/lib/pocketbase'
import { ExternalLink, Copy, Calendar, MoreVertical, LayoutGrid, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface ProjectCardProps {
    project: any
    workspaceSlug: string
    onDelete?: () => void
}

export default function ProjectCard({ project, workspaceSlug, onDelete }: ProjectCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const dateStr = new Date(project.created).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })

    const fullUrl = `${project.subdomain}.matecito.dev`

    const copyUrl = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(fullUrl)
        toast.success('¡URL copiada al portapapeles!')
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!showConfirm) {
            setShowConfirm(true)
            return
        }

        setIsDeleting(true)
        try {
            const res = await fetch('/api/projects/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subdomain: project.subdomain,
                    projectId: project.id,
                    token: pb.authStore.token
                })
            })

            const data = await res.json()
            if (data.success) {
                toast.success('Proyecto eliminado correctamente 🗑️')
                onDelete?.()
            } else {
                throw new Error(data.error || 'Fallo al eliminar')
            }
        } catch (error: any) {
            console.error('Error deleting project:', error)
            toast.error(error.message || 'Error al eliminar el proyecto')
            setShowConfirm(false)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className={cn(
            "group relative flex flex-col rounded-2xl border bg-[var(--card)] p-8 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[var(--accent)]/5",
            project.status === 'failed' ? "border-red-500/30" : "border-[var(--accent)]/10 hover:border-[var(--accent)]/40",
            isDeleting && "opacity-50 grayscale pointer-events-none"
        )}>
            <div className="mb-6 flex items-start justify-between">
                <div className="space-y-1.5">
                    <h3 className="text-2xl font-bold text-white">
                        {project.name}
                    </h3>
                    <button
                        onClick={copyUrl}
                        className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40 transition-all hover:text-white hover:opacity-100"
                    >
                        {fullUrl}
                        <Copy className="w-3 h-3" />
                    </button>
                </div>

                <div className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]",
                    project.status === 'active' ? "bg-[var(--accent)]/10 text-[var(--accent)]" :
                        project.status === 'creating' ? "bg-yellow-500/10 text-yellow-600 animate-pulse border border-yellow-500/10" :
                            project.status === 'failed' ? "bg-red-500/10 text-red-600 border border-red-500/10" :
                                "bg-[var(--foreground)]/10 text-[var(--foreground)]/60"
                )}>
                    <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        project.status === 'active' ? "bg-[var(--accent)]" :
                            project.status === 'creating' ? "bg-yellow-500" :
                                project.status === 'failed' ? "bg-red-500" : "bg-[var(--foreground)]/60"
                    )} />
                    {project.status === 'active' ? 'En línea' :
                        project.status === 'creating' ? 'Desplegando' :
                            project.status === 'failed' ? 'Error' : 'Pausado'}
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[var(--accent)]/5 pt-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[var(--foreground)] opacity-40 text-[10px] font-mono uppercase tracking-widest leading-none">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dateStr}</span>
                    </div>
                    {showConfirm && (
                        <span className="text-[8px] font-bold text-red-400 uppercase tracking-widest animate-pulse">¿Confirmar?</span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        onMouseLeave={() => !isDeleting && setShowConfirm(false)}
                        className={cn(
                            "p-2.5 rounded-full transition-all duration-300",
                            showConfirm 
                                ? "bg-red-500 text-white animate-bounce shadow-lg shadow-red-500/40" 
                                : "bg-white/5 text-white/20 hover:bg-white/10 hover:text-red-400"
                        )}
                        title="Eliminar proyecto"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : showConfirm ? (
                            <AlertTriangle className="w-4 h-4" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </button>

                    <Link
                        href={`/dashboard/${workspaceSlug}/${project.subdomain}`}
                        className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-[10px] font-bold text-[var(--background)] transition-all hover:opacity-90 uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent)]/20"
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        Gestionar
                    </Link>
                </div>
            </div>
        </div>
    )
}
