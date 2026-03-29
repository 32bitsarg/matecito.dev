'use client'

import { use } from 'react'
import { useWorkspace } from '@/contexts/WorkspaceContext'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { notFound } from 'next/navigation'

interface Params {
    workspace: string
    project: string
}

export default function ProjectLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<Params>
}) {
    const { project: projectSlug } = use(params)
    const { projects, loading } = useWorkspace()

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3ECF8E] border-t-transparent" />
            </div>
        )
    }

    const project = projects.find(p => p.subdomain === projectSlug) ?? null

    if (!project) return notFound()

    return (
        <ProjectProvider 
            projectId={project.id}
            subdomain={project.subdomain} 
            project={project}
        >
            <div className="animate-fade-in h-full">
                {children}
            </div>
        </ProjectProvider>
    )
}
