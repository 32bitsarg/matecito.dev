import api from '@/lib/api'

export interface Project {
    id: string
    subdomain: string
    name: string
    anon_key: string
    service_key: string
    version: string
    status: 'deployed' | 'deploying' | 'failed' | 'deleted'
    last_login: string
    created_at: string
    updated_at: string
}

export const ProjectService = {
    async listProjects(workspaceId?: string): Promise<Project[]> {
        const data = await api.get('/projects', workspaceId ? { workspace_id: workspaceId } : {})
        return Array.isArray(data) ? data : data.items || []
    },

    async getProjectBySubdomain(subdomain: string): Promise<Project | null> {
        const data = await api.get('/projects', { subdomain })
        const items = Array.isArray(data) ? data : data.items || []
        return items.length > 0 ? items[0] : null
    },

    async createProject(params: { subdomain: string; name: string; workspace_id?: string }): Promise<Project> {
        return api.post('/projects', params)
    },

    async deleteProject(projectId: string): Promise<void> {
        return api.delete(`/projects/${projectId}`)
    },

    async regenerateKeys(projectId: string): Promise<{ anon_key: string; service_key: string }> {
        return api.post(`/projects/${projectId}/regenerate-keys`)
    },

    async getStatus(projectId: string): Promise<{ status: string; url?: string }> {
        return api.get(`/projects/${projectId}/status`)
    }
}
