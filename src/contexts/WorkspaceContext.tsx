'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import pb from '@/lib/pocketbase'

interface WorkspaceContextType {
    workspaces: any[]
    currentWorkspace: any
    projects: any[]
    loading: boolean
    isInitialized: boolean
    refreshWorkspaces: () => Promise<void>
    refreshProjects: (workspaceId: string) => Promise<void>
    selectWorkspace: (ws: any) => void
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
    const [workspaces, setWorkspaces] = useState<any[]>([])
    const [currentWorkspace, setCurrentWorkspace] = useState<any>(null)
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isInitialized, setIsInitialized] = useState(false)
    
    const currentWSRef = useRef<any>(null)

    const fetchProjects = useCallback(async (workspaceId: string) => {
        try {
            const records = await pb.collection('projects').getList(1, 100, {
                filter: `workspace = "${workspaceId}"`,
                sort: '-created',
                requestKey: null
            })
            setProjects(records.items)
        } catch (error) {
            console.error('[WorkspaceContext] Error fetching projects:', error)
        }
    }, [])

    const fetchWorkspaces = useCallback(async () => {
        const user = pb.authStore.record
        if (!user?.id) {
            setLoading(false)
            setIsInitialized(true)
            return
        }
        
        setLoading(true)
        try {
            const records = await pb.collection('workspaces').getList(1, 50, {
                filter: `owner = "${user.id}"`,
                sort: '-created',
                requestKey: null
            })
            
            setWorkspaces(records.items)

            if (records.items.length > 0 && !currentWSRef.current) {
                const firstWS = records.items[0]
                currentWSRef.current = firstWS
                setCurrentWorkspace(firstWS)
                await fetchProjects(firstWS.id)
            }
        } catch (error) {
            console.error('[WorkspaceContext] Error fetching workspaces:', error)
        } finally {
            setLoading(false)
            setIsInitialized(true)
        }
    }, [fetchProjects])

    // Polling effect: Si hay proyectos creando, refrescar cada 5 segundos
    useEffect(() => {
        const hasCreatingProjects = projects.some(p => p.status === 'creating')
        
        let interval: NodeJS.Timeout
        
        if (hasCreatingProjects && currentWorkspace) {
            interval = setInterval(() => {
                fetchProjects(currentWorkspace.id)
            }, 5000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [projects, currentWorkspace, fetchProjects])

    useEffect(() => {
        fetchWorkspaces()
        
        const unsubscribe = pb.authStore.onChange((token, record) => {
            if (record) {
                fetchWorkspaces()
            } else {
                setWorkspaces([])
                setCurrentWorkspace(null)
                currentWSRef.current = null
                setLoading(false)
            }
        })
        
        return () => {
            unsubscribe();
        }
    }, [fetchWorkspaces])

    const selectWorkspace = useCallback(async (ws: any) => {
        currentWSRef.current = ws
        setCurrentWorkspace(ws)
        setLoading(true)
        await fetchProjects(ws.id)
        setLoading(false)
    }, [fetchProjects])

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            currentWorkspace,
            projects,
            loading,
            isInitialized,
            refreshWorkspaces: fetchWorkspaces,
            refreshProjects: fetchProjects,
            selectWorkspace
        }}>
            {children}
        </WorkspaceContext.Provider>
    )
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext)
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider')
    }
    return context
}
