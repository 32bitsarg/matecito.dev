'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import PocketBase, { BaseAuthStore } from 'pocketbase'
import { ProjectService } from '@/services/pocketbase.service'
import { Collection, RecordModel } from '@/lib/types'

interface ProjectContextType {
    collections: Collection[]
    records: RecordModel[]
    loading: boolean
    error: string | null
    fetchCollections: () => Promise<any>
    fetchRecords: (collectionName: string, page?: number, perPage?: number, filter?: string) => Promise<any>
    createRecord: (collectionName: string, data: any) => Promise<any>
    updateRecord: (collectionName: string, id: string, data: any) => Promise<any>
    deleteRecord: (collectionName: string, id: string) => Promise<void>
    getCollectionSchema: (collectionName: string) => Collection | undefined
    createCollection: (data: any) => Promise<any>
    updateCollection: (collectionId: string, data: { name?: string, fields?: any[] }) => Promise<any>
    deleteCollection: (collectionId: string) => Promise<void>
    getRecord: (collectionName: string, id: string, options?: any) => Promise<any>
    getFirstRecord: (collectionName: string, filter: string, options?: any) => Promise<any>
    healthCheck: () => Promise<any>
    getFileUrl: (record: any, filename: string, options?: any) => string
    subscribe: (collectionName: string, callback: (data: any) => void) => Promise<() => void>
    // New methods for BaaS Features
    getAuthMethods: () => Promise<any>
    getSettings: () => Promise<any>
    updateSettings: (settings: any) => Promise<any>
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({
    children,
    subdomain,
    adminToken,
    adminEmail,
    adminPass
}: {
    children: ReactNode,
    subdomain: string,
    adminToken: string,
    adminEmail?: string,
    adminPass?: string
}) {
    const childPb = useMemo(() => {
        const url = `https://${subdomain}.matecito.dev`
        
        // 🕵️‍♂️ Scouting Log
        console.log('=== ProjectProvider init ===')
        console.log('subdomain:', subdomain)
        try {
            const payload = adminToken?.split('.')[1] 
                ? JSON.parse(atob(adminToken.split('.')[1])) 
                : null
            console.log('adminToken ID (Decoded):', payload?.id || 'sin id')
        } catch (e) {
            console.log('Error decoding token:', e)
        }

        const pb = new PocketBase(url, new BaseAuthStore())
        pb.authStore.save(adminToken, null)
        pb.autoCancellation(false) 
        return pb
    }, [subdomain, adminToken])

    // SWR Fetchers
    const { data: collections = [], error: collectionsError, isLoading: loadingCollections, mutate: mutateCollections } = useSWR(
        subdomain && adminToken ? [`${subdomain}/collections`, adminToken] : null,
        () => ProjectService.getCollections(childPb),
        { revalidateOnFocus: true, dedupingInterval: 5000 }
    )

    const { data: settings, error: settingsError, isLoading: loadingSettings, mutate: mutateSettings } = useSWR(
        subdomain && adminToken ? [`${subdomain}/settings`, adminToken] : null,
        async () => {
            try {
                return await ProjectService.getSettings(childPb)
            } catch (err: any) {
                // Si es 401 en settings, lo ignoramos para no romper el dashboard
                // ya que puede que el token sea de usuario y no de admin todavía
                if (err?.status === 401) return { baas_enabled: false }
                throw err
            }
        },
        { revalidateOnFocus: false, shouldRetryOnError: false }
    )

    useEffect(() => {
        if (collectionsError) console.error(`[ProjectContext] Collections fetch error for ${subdomain}:`, collectionsError)
        if (settingsError) console.error(`[ProjectContext] Settings fetch error for ${subdomain}:`, settingsError)
    }, [collectionsError, settingsError, subdomain])

    const [records, setRecords] = useState<RecordModel[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCollections = useCallback(async () => {
        return mutateCollections()
    }, [mutateCollections])

    const fetchRecords = useCallback(async (collectionName: string, page = 1, perPage = 20, filter = '') => {
        setLoading(true)
        setError(null)
        try {
            const result = await ProjectService.getRecords(childPb, collectionName, page, perPage, { filter })
            setRecords(result.items)
            return result
        } catch (err: any) {
            console.error(`Error fetching records for ${collectionName}:`, err)
            setError(err.message)
            return null
        } finally {
            setLoading(false)
        }
    }, [childPb])

    const getRecord = useCallback(async (collectionName: string, id: string, options = {}) => {
        return await ProjectService.getRecord(childPb, collectionName, id, options)
    }, [childPb])

    const getFirstRecord = useCallback(async (collectionName: string, filter: string, options = {}) => {
        return await ProjectService.getFirstRecord(childPb, collectionName, filter, options)
    }, [childPb])

    const healthCheck = useCallback(async () => {
        return await ProjectService.healthCheck(childPb)
    }, [childPb])

    const getFileUrl = useCallback((record: any, filename: string, options = {}) => {
        return ProjectService.getFileUrl(childPb, record, filename, options)
    }, [childPb])

    const subscribe = useCallback(async (collectionName: string, callback: (data: any) => void) => {
        await childPb.collection(collectionName).subscribe('*', callback)
        return () => childPb.collection(collectionName).unsubscribe('*')
    }, [childPb])

    const getAuthMethods = useCallback(async () => {
        return await ProjectService.getAuthMethods(childPb)
    }, [childPb])

    const getSettings = useCallback(async () => {
        return settings || await ProjectService.getSettings(childPb)
    }, [childPb, settings])

    const updateSettings = useCallback(async (newSettings: any) => {
        setLoading(true)
        try {
            const res = await ProjectService.updateSettings(childPb, newSettings)
            mutateSettings(res, false)
            return res
        } finally {
            setLoading(false)
        }
    }, [childPb, mutateSettings])

    const createCollection = useCallback(async (data: any) => {
        setLoading(true)
        try {
            const result = await ProjectService.createCollection(childPb, data)
            mutateCollections()
            return result
        } catch (err: any) {
            console.error('Error creating collection:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [childPb, mutateCollections])

    const updateCollection = useCallback(async (
        collectionId: string,
        data: { name?: string, fields?: any[] }
    ) => {
        setLoading(true)
        try {
            const result = await ProjectService.updateCollection(childPb, collectionId, data)
            mutateCollections()
            return result
        } catch (err: any) {
            console.error('Error updating collection:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [childPb, mutateCollections])

    const deleteCollection = useCallback(async (collectionId: string) => {
        setLoading(true)
        try {
            await ProjectService.deleteCollection(childPb, collectionId)
            mutateCollections()
        } catch (err: any) {
            console.error('Error deleting collection:', err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [childPb, mutateCollections])

    const createRecord = useCallback(async (collectionName: string, data: any) => {
        setLoading(true)
        try {
            return await ProjectService.createRecord(childPb, collectionName, data)
        } catch (err: any) {
            console.error(`Error creating record in ${collectionName}:`, err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [childPb])

    const updateRecord = useCallback(async (collectionName: string, id: string, data: any) => {
        setLoading(true)
        try {
            return await ProjectService.updateRecord(childPb, collectionName, id, data)
        } catch (err: any) {
            console.error(`Error updating record ${id} in ${collectionName}:`, err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [childPb])

    const deleteRecord = useCallback(async (collectionName: string, id: string) => {
        setLoading(true)
        try {
            await ProjectService.deleteRecord(childPb, collectionName, id)
        } catch (err: any) {
            console.error(`Error deleting record ${id} in ${collectionName}:`, err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [childPb])

    const getCollectionSchema = useCallback((collectionName: string) => {
        return collections.find(c => c.name === collectionName)
    }, [collections])

    return (
        <ProjectContext.Provider value={{
            collections,
            records,
            loading: loading || loadingCollections || loadingSettings,
            error: error || (collectionsError?.message) || (settingsError?.message) || null,
            fetchCollections,
            fetchRecords,
            createRecord,
            updateRecord,
            deleteRecord,
            getCollectionSchema,
            createCollection,
            updateCollection,
            deleteCollection,
            getRecord,
            getFirstRecord,
            healthCheck,
            getFileUrl,
            subscribe,
            getAuthMethods,
            getSettings,
            updateSettings
        }}>
            {children}
        </ProjectContext.Provider>
    )
}

export function useProject() {
    const context = useContext(ProjectContext)
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider')
    }
    return context
}
