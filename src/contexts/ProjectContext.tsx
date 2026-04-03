'use client'

import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    type ReactNode,
} from 'react'
import useSWR from 'swr'
import api, { getToken } from '@/lib/api'

// ─── Tipos ────────────────────────────────────────────────

export type FieldType = 'text' | 'number' | 'bool' | 'email' | 'date' | 'file' | 'json' | 'relation' | 'select'

export interface Field {
    id: string
    collection: string
    name: string
    type: FieldType
    required: boolean
    options: Record<string, any>
    created_at: string
}

export interface Collection {
    name: string
    fields: Field[]
    [key: string]: any
}

export interface RecordModel {
    id: string
    collection: string
    data: Record<string, any>
    createdAt: string
    updatedAt: string
}

interface ProjectContextType {
    collections: Collection[]
    records: RecordModel[]
    loading: boolean
    error: string | null

    project?: any
    subdomain: string
    projectId: string

    fetchCollections: () => Promise<any>
    createCollection: (data: string | { name: string; type?: string; fields?: any[] }) => Promise<any>
    updateCollection: (collectionName: string, newName: string) => Promise<any>
    deleteCollection: (collectionName: string) => Promise<void>
    getCollectionSchema: (collectionName: string) => Collection | undefined

    addField: (collectionName: string, field: { name: string; type: FieldType; required?: boolean; options?: Record<string, any> }) => Promise<Field>
    updateField: (collectionName: string, fieldId: string, data: Partial<Pick<Field, 'name' | 'type' | 'required' | 'options'>>) => Promise<Field>
    deleteField: (collectionName: string, fieldId: string) => Promise<void>

    fetchRecords: (collectionName: string, params?: Record<string, string>) => Promise<any>
    getRecord: (collectionName: string, id: string) => Promise<any>
    createRecord: (collectionName: string, data: any) => Promise<any>
    updateRecord: (id: string, data: any) => Promise<any>
    deleteRecord: (id: string) => Promise<void>

    subscribe: (collectionName: string, callback: (data: any) => void) => () => void

    getFileUrl: (record: any, filename: string) => string

    healthCheck: () => Promise<any>
    getSettings: () => Promise<any>
    updateSettings: (settings: any) => Promise<any>
    regenerateApiKey: () => Promise<any>

    fetchStats: () => Promise<{ users_count: number; collections_count: number; records_count: number; db_size: string }>
    fetchLogs: (params?: { page?: number; limit?: number; status?: string }) => Promise<{ logs: any[]; total: number }>
    fetchPermissions: () => Promise<{ permissions: Record<string, Record<string, any>> }>
    savePermissions: (collection: string, permissions: Record<string, any>) => Promise<void>

    // Project settings (CORS, storage quota, etc.)
    fetchProjectSettings: () => Promise<any>
    updateProjectSettings: (data: any) => Promise<any>

    // OAuth providers
    fetchOAuthProviders: () => Promise<any[]>
    saveOAuthProvider: (provider: string, clientId: string, clientSecret: string, enabled?: boolean) => Promise<any>
    deleteOAuthProvider: (provider: string) => Promise<void>

    // Custom API keys
    fetchApiKeys: () => Promise<any[]>
    createApiKey: (scopes?: string[]) => Promise<any>
    revokeApiKey: (id: string) => Promise<void>

    // Records — soft delete
    restoreRecord: (id: string) => Promise<void>
    hardDeleteRecord: (id: string) => Promise<void>

    // Webhooks
    fetchWebhooks: () => Promise<any[]>
    createWebhook: (data: any) => Promise<any>
    updateWebhook: (id: string, data: any) => Promise<any>
    deleteWebhook: (id: string) => Promise<void>

    // SMTP
    fetchSmtp: () => Promise<any>
    saveSmtp: (config: any) => Promise<any>
    deleteSmtp: () => Promise<void>
    testSmtp: (to: string) => Promise<any>

    // Email templates
    fetchEmailTemplates: () => Promise<any[]>
    getEmailTemplate: (id: string) => Promise<any>
    createEmailTemplate: (data: any) => Promise<any>
    updateEmailTemplate: (id: string, data: any) => Promise<any>
    deleteEmailTemplate: (id: string) => Promise<void>
    seedEmailTemplates: () => Promise<any>
}

// ─── Context ──────────────────────────────────────────────

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

// ─── Provider ─────────────────────────────────────────────

export function ProjectProvider({
    children,
    projectId,
    subdomain,
    project,
}: {
    children: ReactNode
    projectId: string
    subdomain: string
    project?: any
}) {

    // ── API ───────────────────────────────────────────────

    const pApi = useMemo(() => {
        const base = `/api/v1/project/${projectId}`
        return {
            get: (path: string, params?: Record<string, string>) =>
                api.get(`${base}${path}`, params),

            post: (path: string, body?: any) =>
                body instanceof FormData
                    ? fetch(`${process.env.NEXT_PUBLIC_API_URL}${base}${path}`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${getToken()}` },
                        body,
                    }).then(r => r.json())
                    : api.post(`${base}${path}`, body),

            patch: (path: string, body?: any) =>
                api.patch(`${base}${path}`, body),

            put: (path: string, body?: any) =>
                api.put(`${base}${path}`, body),

            delete: (path: string) =>
                api.delete(`${base}${path}`),
        }
    }, [projectId])

    const [records, setRecords] = useState<RecordModel[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const activeRef = useRef(projectId)

    useEffect(() => {
        activeRef.current = projectId
    }, [projectId])

    // ── Collections (SWR) ─────────────────────────────────

    const {
        data: collections = [],
        error: collectionsError,
        isLoading: loadingCollections,
        mutate: mutateCollections,
    } = useSWR<Collection[]>(
        projectId ? `project/${projectId}/collections` : null,
        () => pApi.get('/collections').then(d => d.collections ?? d),
    )

    // ── Collections ───────────────────────────────────────

    const fetchCollections = useCallback(() => mutateCollections(), [mutateCollections])

    const createCollection = useCallback(async (data: string | { name: string; type?: string; fields?: any[] }) => {
        setLoading(true)
        try {
            const body = typeof data === 'string' ? { collection: data } : data
            const res = await pApi.post('/collections', body)
            mutateCollections()
            return res
        } finally {
            setLoading(false)
        }
    }, [pApi, mutateCollections])

    const updateCollection = useCallback(async (collectionName: string, newName: string) => {
        setLoading(true)
        try {
            const res = await pApi.patch(`/collections/${collectionName}`, { name: newName })
            mutateCollections()
            return res
        } finally {
            setLoading(false)
        }
    }, [pApi, mutateCollections])

    const deleteCollection = useCallback(async (collectionName: string) => {
        setLoading(true)
        try {
            await pApi.delete(`/collections/${collectionName}`)
            mutateCollections()
        } finally {
            setLoading(false)
        }
    }, [pApi, mutateCollections])

    const getCollectionSchema = useCallback(
        (name: string) => collections.find(c => c.name === name),
        [collections]
    )

    const addField = useCallback(async (collectionName: string, field: { name: string; type: FieldType; required?: boolean; options?: Record<string, any> }) => {
        const res = await pApi.post(`/collections/${collectionName}/fields`, field)
        mutateCollections()
        return res.field as Field
    }, [pApi, mutateCollections])

    const updateField = useCallback(async (collectionName: string, fieldId: string, data: Partial<Pick<Field, 'name' | 'type' | 'required' | 'options'>>) => {
        const res = await pApi.patch(`/collections/${collectionName}/fields/${fieldId}`, data)
        mutateCollections()
        return res.field as Field
    }, [pApi, mutateCollections])

    const deleteField = useCallback(async (collectionName: string, fieldId: string) => {
        await pApi.delete(`/collections/${collectionName}/fields/${fieldId}`)
        mutateCollections()
    }, [pApi, mutateCollections])

    // ── Records ───────────────────────────────────────────

    const fetchRecords = useCallback(async (collectionName: string, extraParams?: Record<string, string>) => {
        setLoading(true)
        setError(null)

        try {
            const params: Record<string, string> = { collection: collectionName, ...extraParams }

            const res = await pApi.get('/records', params)

            if (activeRef.current === projectId) {
                setRecords(res.records ?? [])
            }

            return res
        } catch (err: any) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [pApi, projectId])

    const getRecord = useCallback(async (collectionName: string, id: string) => {
        return await pApi.get(`/records/${id}`, { collection: collectionName })
    }, [pApi])

    const createRecord = useCallback(async (collectionName: string, data: any) => {
        setLoading(true)
        try {
            return data instanceof FormData
                ? pApi.post('/records', data)
                : pApi.post('/records', { collection: collectionName, data })
        } finally {
            setLoading(false)
        }
    }, [pApi])

    const updateRecord = useCallback(async (id: string, data: any) => {
        setLoading(true)
        try {
            return await pApi.patch(`/records/${id}`, { data })
        } finally {
            setLoading(false)
        }
    }, [pApi])

    const deleteRecord = useCallback(async (id: string) => {
        setLoading(true)
        try {
            await pApi.delete(`/records/${id}`)
        } finally {
            setLoading(false)
        }
    }, [pApi])

    // ── WebSocket ─────────────────────────────────────────

    const subscribe = useCallback((collection: string, cb: (data: any) => void) => {
        const token = getToken()
        if (!token) return () => { }

        const BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace('https', 'wss')
        const ws = new WebSocket(`${BASE}/api/v1/project/${projectId}/ws?token=${token}`)

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'subscribe', collection }))
        }

        ws.onmessage = e => {
            try {
                const msg = JSON.parse(e.data)
                if (msg.collection === collection) cb(msg)
            } catch { }
        }

        return () => ws.close()
    }, [projectId])

    // ── Utils ─────────────────────────────────────────────

    const getFileUrl = useCallback((record: any, filename: string) => {
        const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
        return `${BASE}/api/v1/project/${projectId}/storage/${record?.id}/${filename}`
    }, [projectId])

    // ── Settings ──────────────────────────────────────────

    const getSettings = useCallback(async () => {
        return await api.get(`/api/v1/platform/info-p/${projectId}`)
    }, [projectId])

    const updateSettings = useCallback(async (data: any) => {
        if (!data?.name) {
            throw new Error('Name is required')
        }
        return await api.patch(`/api/v1/platform/rename-p/${projectId}`, { name: data.name })
    }, [projectId])

    const regenerateApiKey = useCallback(async () => {
        return await pApi.post('/regenerate-key')
    }, [pApi])

    const fetchStats = useCallback(async () => {
        return await pApi.get('/stats')
    }, [pApi])

    const fetchLogs = useCallback(async (params?: { page?: number; limit?: number; status?: string }) => {
        return await pApi.get('/logs', params as any)
    }, [pApi])

    const fetchPermissions = useCallback(async () => {
        return await pApi.get('/permissions')
    }, [pApi])

    const savePermissions = useCallback(async (collection: string, permissions: Record<string, any>) => {
        await pApi.patch(`/permissions/${collection}`, { permissions })
    }, [pApi])

    const fetchProjectSettings = useCallback(async () => {
        return await pApi.get('/settings')
    }, [pApi])

    const updateProjectSettings = useCallback(async (data: any) => {
        return await pApi.patch('/settings', data)
    }, [pApi])

    const fetchOAuthProviders = useCallback(async () => {
        const res = await pApi.get('/auth/oauth-providers')
        return res.providers ?? []
    }, [pApi])

    const saveOAuthProvider = useCallback(async (provider: string, clientId: string, clientSecret: string, enabled = true) => {
        return await pApi.post('/auth/oauth-providers', { provider, client_id: clientId, client_secret: clientSecret, enabled })
    }, [pApi])

    const deleteOAuthProvider = useCallback(async (provider: string) => {
        await pApi.delete(`/auth/oauth-providers/${provider}`)
    }, [pApi])

    const fetchApiKeys = useCallback(async () => {
        const res = await pApi.get('/api-keys')
        return res.keys ?? []
    }, [pApi])

    const createApiKey = useCallback(async (scopes?: string[]) => {
        return await pApi.post('/api-keys', { scopes: scopes?.length ? scopes : null })
    }, [pApi])

    const revokeApiKey = useCallback(async (id: string) => {
        await pApi.delete(`/api-keys/${id}`)
    }, [pApi])

    // ── Soft delete ───────────────────────────────────────
    const restoreRecord = useCallback(async (id: string) => {
        await pApi.post(`/records/${id}/restore`)
    }, [pApi])

    const hardDeleteRecord = useCallback(async (id: string) => {
        await pApi.delete(`/records/${id}/hard`)
    }, [pApi])

    // ── Webhooks ──────────────────────────────────────────
    const fetchWebhooks = useCallback(async () => {
        const res = await pApi.get('/webhooks')
        return res.webhooks ?? []
    }, [pApi])

    const createWebhook = useCallback(async (data: any) => {
        return await pApi.post('/webhooks', data)
    }, [pApi])

    const updateWebhook = useCallback(async (id: string, data: any) => {
        return await pApi.patch(`/webhooks/${id}`, data)
    }, [pApi])

    const deleteWebhook = useCallback(async (id: string) => {
        await pApi.delete(`/webhooks/${id}`)
    }, [pApi])

    // ── SMTP ─────────────────────────────────────────────
    const fetchSmtp = useCallback(async () => {
        return await pApi.get('/smtp')
    }, [pApi])

    const saveSmtp = useCallback(async (config: any) => {
        return await pApi.put('/smtp', config)
    }, [pApi])

    const deleteSmtp = useCallback(async () => {
        await pApi.delete('/smtp')
    }, [pApi])

    const testSmtp = useCallback(async (to: string) => {
        return await pApi.post('/smtp/test', { to })
    }, [pApi])

    // ── Email templates ───────────────────────────────────
    const fetchEmailTemplates = useCallback(async () => {
        const res = await pApi.get('/email-templates')
        return res.templates ?? []
    }, [pApi])

    const getEmailTemplate = useCallback(async (id: string) => {
        const res = await pApi.get(`/email-templates/${id}`)
        return res.template
    }, [pApi])

    const createEmailTemplate = useCallback(async (data: any) => {
        return await pApi.post('/email-templates', data)
    }, [pApi])

    const updateEmailTemplate = useCallback(async (id: string, data: any) => {
        return await pApi.patch(`/email-templates/${id}`, data)
    }, [pApi])

    const deleteEmailTemplate = useCallback(async (id: string) => {
        await pApi.delete(`/email-templates/${id}`)
    }, [pApi])

    const seedEmailTemplates = useCallback(async () => {
        return await pApi.post('/email-templates/seed')
    }, [pApi])

    const healthCheck = useCallback(async () => {
        return await api.get('/health')
    }, [])

    // ─────────────────────────────────────────────────────

    return (
        <ProjectContext.Provider
            value={{
                collections,
                records,
                loading: loading || loadingCollections,
                error: error ?? collectionsError?.message ?? null,

                project,
                subdomain,
                projectId,

                fetchCollections,
                createCollection,
                updateCollection,
                deleteCollection,
                getCollectionSchema,
                addField,
                updateField,
                deleteField,

                fetchRecords,
                getRecord,
                createRecord,
                updateRecord,
                deleteRecord,

                subscribe,
                getFileUrl,
                healthCheck,

                getSettings,
                updateSettings,
                regenerateApiKey,
                fetchStats,
                fetchLogs,
                fetchPermissions,
                savePermissions,
                fetchProjectSettings,
                updateProjectSettings,
                fetchOAuthProviders,
                saveOAuthProvider,
                deleteOAuthProvider,
                fetchApiKeys,
                createApiKey,
                revokeApiKey,
                restoreRecord,
                hardDeleteRecord,
                fetchWebhooks,
                createWebhook,
                updateWebhook,
                deleteWebhook,
                fetchSmtp,
                saveSmtp,
                deleteSmtp,
                testSmtp,
                fetchEmailTemplates,
                getEmailTemplate,
                createEmailTemplate,
                updateEmailTemplate,
                deleteEmailTemplate,
                seedEmailTemplates,
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}

// ─── Hook ────────────────────────────────────────────────

export function useProject(): ProjectContextType {
    const ctx = useContext(ProjectContext)
    if (!ctx) throw new Error('useProject debe usarse dentro de <ProjectProvider>')
    return ctx
}