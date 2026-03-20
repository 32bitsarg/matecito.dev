'use client'

import { useEffect, useState, use } from 'react'
import pb from '@/lib/pocketbase'
import { ProjectProvider } from '@/contexts/ProjectContext'
import { notFound } from 'next/navigation'

interface Params {
    workspaceSlug: string
    projectSlug: string
}

export default function ProjectLayout({
    children,
    params
}: {
    children: React.ReactNode
    params: Promise<Params>
}) {
    const { workspaceSlug, projectSlug } = use(params)
    const [project, setProject] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                // Aquí usamos el pb del cliente que SÍ tiene el token en authStore
                const res = await pb.collection('projects').getFirstListItem(`subdomain = "${projectSlug}"`, {
                    expand: 'workspace',
                    requestKey: null
                })
                setProject(res)
            } catch (err) {
                console.error('Error fetching project:', err)
            } finally {
                setLoading(false)
            }
        }

        if (projectSlug) {
            setProject(null) // <-- Limpiar para no arrastrar tokens del anterior
            fetchProject()
        }
    }, [projectSlug])

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#3ECF8E] border-t-transparent" />
            </div>
        )
    }

    if (!project) return notFound()

    return (
        <ProjectProvider 
            subdomain={project.subdomain} 
            adminToken={project.admin_token}
            adminEmail={project.admin_email}
            adminPass={project.admin_pass}
            project={project}
        >
            <div className="animate-fade-in h-full">
                {children}
            </div>
        </ProjectProvider>
    )
}
