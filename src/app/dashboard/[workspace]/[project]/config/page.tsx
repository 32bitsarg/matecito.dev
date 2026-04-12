'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Settings, Plus, Trash2, Edit2, Save, X, Loader2, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfigItem {
  key: string
  value: any
  description: string | null
  updated_at: string
}

export default function ConfigPage() {
  const { projectId } = useProject()
  const [configs, setConfigs] = useState<ConfigItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newDesc, setNewDesc] = useState('')

  const fetchConfigs = async () => {
    try {
      const res = await api.get<any>(`/api/v2/project/${projectId}/config`)
      const items = Object.entries(res.configs || {}).map(([key, val]: [string, any]) => ({
        key,
        value: val.value,
        description: val.description || null,
        updated_at: val.updated_at,
      }))
      setConfigs(items)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchConfigs() }, [])

  const handleSave = async (key: string) => {
    try {
      let parsed: any
      try { parsed = JSON.parse(editValue) } catch { parsed = editValue }
      await api.put(`/api/v2/project/${projectId}/config/${key}`, { value: parsed, description: editDesc || undefined })
      toast.success('Guardado')
      setEditing(null)
      fetchConfigs()
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  const handleCreate = async () => {
    if (!newKey) return
    try {
      let parsed: any
      try { parsed = JSON.parse(newValue) } catch { parsed = newValue }
      await api.put(`/api/v2/project/${projectId}/config/${newKey}`, { value: parsed, description: newDesc || undefined })
      toast.success('Creado')
      setShowCreate(false)
      setNewKey(''); setNewValue(''); setNewDesc('')
      fetchConfigs()
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  const handleDelete = async (key: string) => {
    try {
      await api.delete(`/api/v2/project/${projectId}/config/${key}`)
      toast.success('Eliminado')
      fetchConfigs()
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Settings className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--fg-primary)' }}>Remote Config</h1>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>Feature flags y configuración dinámica</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Plus className="w-4 h-4" />
          Nueva Key
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-3 gap-3">
            <input value={newKey} onChange={e => setNewKey(e.target.value)} placeholder="Key (e.g. maintenance_mode)"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
            <input value={newValue} onChange={e => setNewValue(e.target.value)} placeholder='Value (e.g. true, "hello", 42)'
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción (opcional)"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setShowCreate(false); setNewKey(''); setNewValue(''); setNewDesc('') }}
              className="px-4 py-2 rounded-lg border text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ borderColor: 'var(--border)' }}>Cancelar</button>
            <button onClick={handleCreate} disabled={!newKey}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}>Crear</button>
          </div>
        </div>
      )}

      {/* Config list */}
      {configs.length === 0 ? (
        <div className="text-center py-16">
          <Settings className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--fg-tertiary)' }} />
          <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>No hay configuraciones aún</p>
          <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>Creá feature flags, config de app, kill switches, etc.</p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <table className="w-full text-xs">
            <thead className="text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-tertiary)' }}>
              <tr>
                <th className="text-left px-4 py-2">Key</th>
                <th className="text-left px-4 py-2">Value</th>
                <th className="text-left px-4 py-2">Descripción</th>
                <th className="text-right px-4 py-2 w-20">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {configs.map(cfg => (
                <tr key={cfg.key} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-2">
                    <code className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-primary)' }}>{cfg.key}</code>
                  </td>
                  <td className="px-4 py-2">
                    {editing === cfg.key ? (
                      <div className="flex items-center gap-1">
                        <input value={editValue} onChange={e => setEditValue(e.target.value)}
                          className="flex-1 rounded border px-2 py-1 text-xs font-mono outline-none focus:ring-1"
                          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
                        <button onClick={() => handleSave(cfg.key)} className="p-1 text-emerald-500 hover:bg-emerald-950/20 dark:hover:bg-emerald-950/20 rounded">
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditing(null)} className="p-1 hover:bg-[var(--bg-secondary)] rounded" style={{ color: 'var(--fg-tertiary)' }}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <code className="text-xs font-mono" style={{ color: 'var(--fg-secondary)' }}>{JSON.stringify(cfg.value)}</code>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editing === cfg.key ? (
                      <input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Sin descripción"
                        className="w-full rounded border px-2 py-1 text-xs outline-none focus:ring-1"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-secondary)' }} />
                    ) : (
                      cfg.description ? (
                        <span className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>{cfg.description}</span>
                      ) : (
                        <button onClick={() => { setEditing(cfg.key); setEditValue(JSON.stringify(cfg.value)); setEditDesc(cfg.description || '') }}
                          className="text-[10px] text-[var(--accent)] hover:underline">+ agregar</button>
                      )
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      {editing !== cfg.key && (
                        <button onClick={() => { setEditing(cfg.key); setEditValue(JSON.stringify(cfg.value)); setEditDesc(cfg.description || '') }}
                          className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--fg-tertiary)' }}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(cfg.key)}
                        className="p-1 rounded hover:bg-red-950/20 dark:hover:bg-red-950/20 transition-colors" style={{ color: 'var(--fg-tertiary)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
