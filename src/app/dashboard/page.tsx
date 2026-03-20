'use client'

import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase'
import ProjectCard from '@/components/project-card'
import CreateWorkspaceModal from '@/components/create-workspace-modal'
import NewProjectModal from '@/components/new-project-modal'
import { Plus, LayoutGrid } from 'lucide-react'

import { useWorkspace } from '@/contexts/WorkspaceContext'

export default function DashboardPage() {
    const { workspaces, projects, currentWorkspace, loading, isInitialized, refreshProjects } = useWorkspace()

    // Lógica para abrir modal si no hay workspaces (UI specific)
    useEffect(() => {
        if (isInitialized && workspaces.length === 0) {
            window.dispatchEvent(new CustomEvent('open-create-workspace-modal'))
        }
    }, [isInitialized, workspaces.length])

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--accent)]">
                        {currentWorkspace?.name || 'Dashboard'}
                    </h1>
                    <p className="text-[var(--foreground)] opacity-60 text-sm font-mono uppercase tracking-widest">Gestioná tus proyectos de base de datos</p>
                </div>

                {currentWorkspace && (
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                        className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-[10px] font-bold text-[var(--background)] transition-all hover:opacity-90 uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Proyecto
                    </button>
                )}
            </div>

            {/* Grid de Proyectos */}
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            workspaceSlug={currentWorkspace?.slug || ''} 
                            onDelete={() => currentWorkspace && refreshProjects(currentWorkspace.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[var(--accent)]/10 bg-[var(--accent)]/5 p-16 text-center transition-all hover:border-[var(--accent)]/30">
                    <div className="rounded-full bg-[var(--background)] p-6 mb-6 border border-[var(--accent)]/10 shadow-sm">
                        <LayoutGrid className="w-10 h-10 text-[var(--accent)] opacity-40" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--accent)] mb-2">No tenés proyectos todavía</h3>
                    <p className="max-w-xs text-sm text-[var(--foreground)] opacity-60 mb-8 leading-relaxed">
                        Comenzá creando tu primer proyecto en este workspace para potenciar tu arquitectura.
                    </p>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-new-project-modal'))}
                        className="flex items-center gap-2 rounded-full bg-[var(--background)] px-8 py-4 text-sm font-bold text-[var(--accent)] border border-[var(--accent)]/20 transition-all hover:bg-[var(--accent)] hover:text-[var(--background)] uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Crear primer proyecto
                    </button>
                </div>
            )}

            {/* Modales */}
            <CreateWorkspaceModal />
            <NewProjectModal currentWorkspaceId={currentWorkspace?.id} onCreated={() => refreshProjects(currentWorkspace?.id)} />
        </div>
    )
}
