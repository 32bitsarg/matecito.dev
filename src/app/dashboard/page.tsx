'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import ProjectCard from '@/components/project-card'
import CreateWorkspaceModal from '@/components/create-workspace-modal'
import NewProjectModal from '@/components/new-project-modal'
import { Plus, Search, X, FolderOpen, LayoutGrid } from 'lucide-react'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { type Project } from '@/services/api.service'

type ProjectWithStatus = Project & {
    status?: 'active' | 'archived' | 'creating' | 'failed'
}

export default function DashboardPage() {
    const {
        workspaces,
        projects,
        currentWorkspace,
        loading,
        isInitialized,
        refreshProjects
    } = useWorkspace()

    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all')

    const handleRefreshProjects = useCallback(() => {
        if (!currentWorkspace?.id) return
        refreshProjects(currentWorkspace.id)
    }, [currentWorkspace?.id, refreshProjects])

    const handleOpenNewProject = useCallback(() => {
        window.dispatchEvent(new CustomEvent('open-new-project-modal'))
    }, [])

    const handleClearSearch = useCallback(() => setSearchQuery(''), [])

    const filteredProjects = useMemo(() => {
        if (!projects?.length) return []
        const query = searchQuery.toLowerCase().trim()
        return (projects as ProjectWithStatus[]).filter(project => {
            const name = project.name ?? ''
            const matchesSearch = !query || name.toLowerCase().includes(query)
            const status = project.status ?? 'active'
            const matchesStatus = statusFilter === 'all' || status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [projects, searchQuery, statusFilter])

    useEffect(() => {
        if (!isInitialized) return
        if (workspaces.length > 0) return
        window.dispatchEvent(new CustomEvent('open-create-workspace-modal'))
    }, [isInitialized, workspaces.length])

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {currentWorkspace?.name || 'Dashboard'}
                    </h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {projects.length === 0
                            ? 'Sin proyectos todavía'
                            : `${projects.length} proyecto${projects.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-56 pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={handleClearSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* New Project */}
                    {currentWorkspace && (
                        <button
                            onClick={handleOpenNewProject}
                            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Nuevo proyecto
                        </button>
                    )}
                </div>
            </div>

            {/* Status filters */}
            {projects.length > 0 && (
                <div className="flex items-center gap-2">
                    {(['all', 'active', 'archived'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                statusFilter === status
                                    ? 'bg-violet-100 text-violet-700'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            {status === 'all' ? 'Todos' : status === 'active' ? 'Activos' : 'Archivados'}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            {projects.length > 0 ? (
                filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                workspaceSlug={currentWorkspace?.slug || ''}
                                onDelete={handleRefreshProjects}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptySearchState query={searchQuery} onClear={handleClearSearch} />
                )
            ) : (
                <EmptyProjectsState onCreate={handleOpenNewProject} />
            )}

            <CreateWorkspaceModal />
            <NewProjectModal
                currentWorkspaceId={currentWorkspace?.id}
                onCreated={handleRefreshProjects}
            />
        </div>
    )
}

function EmptySearchState({ query, onClear }: { query: string; onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FolderOpen className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">Sin resultados</p>
            <p className="text-sm text-slate-400 mb-4">
                No encontramos proyectos para &ldquo;{query}&rdquo;
            </p>
            <button
                onClick={onClear}
                className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
                Limpiar búsqueda
            </button>
        </div>
    )
}

function EmptyProjectsState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4">
                <LayoutGrid className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-700 font-semibold mb-1">No tenés proyectos</p>
            <p className="text-sm text-slate-400 mb-6">
                Creá tu primer proyecto para empezar.
            </p>
            <button
                onClick={onCreate}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
            >
                <Plus className="w-4 h-4" />
                Crear proyecto
            </button>
        </div>
    )
}
