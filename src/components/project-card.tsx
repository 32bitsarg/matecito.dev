'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { Copy, Calendar, ArrowRight, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { ProjectService, type Project } from '@/services/api.service'

interface ProjectCardProps {
    project: Project
    workspaceSlug: string
    onDelete?: () => void
}

export default function ProjectCard({ project, workspaceSlug, onDelete }: ProjectCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const { checkPermission } = useWorkspace()

    const projectSlug = project.subdomain

    if (!project.subdomain) {
        console.error('Proyecto sin subdomain', project)
        return null
    }

    const dateStr = new Date(project.created_at).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })

    const fullUrl = `${project.subdomain}.matecito.dev`

    const copyUrl = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        navigator.clipboard.writeText(fullUrl)
        toast.success('URL copiada')
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!showConfirm) {
            setShowConfirm(true)
            setTimeout(() => setShowConfirm(false), 3000)
            return
        }

        setIsDeleting(true)
        try {
            await ProjectService.delete(project.id)
            toast.success('Proyecto eliminado')
            onDelete?.()
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar')
            setShowConfirm(false)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className={cn(
            "group relative flex flex-col bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-2xl p-5 transition-all hover:shadow-md hover:border-[var(--accent)]",
            isDeleting && "opacity-50 pointer-events-none"
        )}>
            {/* Icon + name */}
            <div className="flex items-start gap-3 mb-4">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold text-white select-none"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: 'var(--shadow-glow)' }}
                >
                    {project.name?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[var(--fg-primary)] truncate">{project.name}</h3>
                    <button
                        onClick={copyUrl}
                        className="flex items-center gap-1 text-xs text-[var(--fg-tertiary)] hover:text-[var(--accent)] transition-colors mt-0.5 group/url"
                    >
                        <span className="truncate">{fullUrl}</span>
                        <Copy className="w-3 h-3 shrink-0 opacity-0 group-hover/url:opacity-100 transition-opacity" />
                    </button>
                </div>

                {/* Live badge */}
                <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-950/30 text-emerald-400 border border-emerald-800/40 rounded-full shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)] mt-auto">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--fg-tertiary)]">
                        <Calendar className="w-3.5 h-3.5" />
                        {dateStr}
                    </div>
                    {showConfirm && (
                        <span className="text-[10px] text-red-500 font-semibold animate-pulse">
                            Click para confirmar
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {checkPermission('admin') && (
                        <button
                            onClick={handleDelete}
                            title="Eliminar proyecto"
                            className={cn(
                                "p-2 rounded-lg border text-sm transition-all",
                                showConfirm
                                    ? "bg-red-500 border-red-500 text-white"
                                    : "border-[var(--border)] text-[var(--fg-tertiary)] hover:border-red-700 hover:text-red-500 hover:bg-red-950/20"
                            )}
                        >
                            {isDeleting ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : showConfirm ? (
                                <AlertTriangle className="w-3.5 h-3.5" />
                            ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                            )}
                        </button>
                    )}

                    <Link
                        href={`/dashboard/${workspaceSlug}/${projectSlug}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        Gestionar
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
