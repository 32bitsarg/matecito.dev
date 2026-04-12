'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Workflow, Plus, Play, Trash2, Clock, Code2, Eye, Loader2, Settings, BookOpen, ExternalLink, Edit2, History, Calendar, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FunctionExec {
  id: string
  function_name: string
  status: string
  duration_ms: number
  created_at: string
  error?: string
}

export default function FunctionsPage() {
  const { projectId, subdomain } = useProject()
  const [functions, setFunctions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newFn, setNewFn] = useState({ name: '', code: 'const { args } = context;\nreturn { hello: "world" };', timeout_ms: 5000, description: '', is_public: false })
  const [creating, setCreating] = useState(false)
  const [executions, setExecutions] = useState<FunctionExec[]>([])
  const [tab, setTab] = useState<'functions' | 'history'>('functions')
  const [editingFn, setEditingFn] = useState<any | null>(null)
  const [editCode, setEditCode] = useState('')
  const [editName, setEditName] = useState('')
  const [editTimeout, setEditTimeout] = useState(5000)
  const [executing, setExecuting] = useState<string | null>(null)

  const fetchFunctions = async () => {
    try {
      const res = await api.get<any>(`/api/v2/project/${projectId}/functions`)
      setFunctions(res.functions || [])
    } catch { /* ignore */ } finally { setLoading(false) }
  }

  const fetchHistory = async () => {
    try {
      const res = await api.get<any>(`/api/v2/project/${projectId}/functions/history`)
      setExecutions(res.executions || [])
    } catch { /* ignore */ }
  }

  useEffect(() => { fetchFunctions() }, [])
  useEffect(() => { if (tab === 'history') fetchHistory() }, [tab])

  const handleCreate = async () => {
    if (!newFn.name || !newFn.code) return
    setCreating(true)
    try {
      await api.post(`/api/v2/project/${projectId}/functions`, newFn)
      toast.success('Function creada')
      setShowCreate(false)
      setNewFn({ name: '', code: 'const { args } = context;\nreturn { hello: "world" };', timeout_ms: 5000, description: '', is_public: false })
      fetchFunctions()
    } catch (err: any) {
      toast.error(err.message || 'Error al crear')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async (oldName: string) => {
    if (!editName || !editCode) return
    setCreating(true)
    try {
      await api.patch(`/api/v2/project/${projectId}/functions/${oldName}`, { name: editName, code: editCode, timeout_ms: editTimeout })
      toast.success('Function actualizada')
      setShowCreate(false)
      setEditingFn(null)
      fetchFunctions()
    } catch (err: any) {
      toast.error(err.message || 'Error')
    } finally {
      setCreating(false)
    }
  }

  const handleInvoke = async (fnName: string) => {
    setExecuting(fnName)
    try {
      const res = await api.post<any>(`/api/v2/project/${projectId}/functions/${fnName}/invoke`, {})
      toast.success(`Ejecutada en ${res.duration_ms}ms`)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    } finally {
      setExecuting(null)
    }
  }

  const handleDelete = async (fnName: string) => {
    try {
      await api.delete(`/api/v2/project/${projectId}/functions/${fnName}`)
      toast.success('Function eliminada')
      fetchFunctions()
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
            <Workflow className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--fg-primary)' }}>Functions</h1>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>Código JavaScript serverless con sandbox</p>
          </div>
        </div>
        <button
          onClick={() => { setEditingFn(null); setEditCode(''); setEditName(''); setEditTimeout(5000); setShowCreate(!showCreate) }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Plus className="w-4 h-4" />
          Nueva Function
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => setTab('functions')}
          className={cn("px-4 py-2.5 text-xs font-medium border-b-[2px] -mb-px transition-colors",
            tab === 'functions' ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]")}
        >
          <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4" />Functions</span>
        </button>
        <button onClick={() => setTab('history')}
          className={cn("px-4 py-2.5 text-xs font-medium border-b-[2px] -mb-px transition-colors",
            tab === 'history' ? "border-[var(--accent)] text-[var(--accent)]" : "border-transparent text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)]")}
        >
          <span className="flex items-center gap-1.5"><History className="w-4 h-4" />Historial</span>
        </button>
      </div>

      {tab === 'history' ? (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          {executions.length === 0 ? (
            <div className="py-16 text-center">
              <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--fg-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>Sin ejecuciones aún</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-tertiary)' }}>
                <tr><th className="text-left px-4 py-2">Función</th><th className="text-left px-4 py-2">Status</th><th className="text-right px-4 py-2">Duración</th><th className="text-left px-4 py-2">Fecha</th></tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {executions.map(ex => (
                  <tr key={ex.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-2 font-mono" style={{ color: 'var(--fg-primary)' }}>{ex.function_name}</td>
                    <td className="px-4 py-2">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full",
                        ex.status === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400')}>
                        {ex.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono" style={{ color: 'var(--fg-secondary)' }}>{ex.duration_ms}ms</td>
                    <td className="px-4 py-2 font-mono" style={{ color: 'var(--fg-tertiary)' }}>{new Date(ex.created_at).toLocaleString('es-AR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <>
          {/* Create form */}
          {showCreate && (
            <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={editName || newFn.name}
                  onChange={e => { if (editingFn) setEditName(e.target.value); else setNewFn(p => ({ ...p, name: e.target.value })) }}
                  placeholder="nombre-de-la-function"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
                />
                <input
                  type="number"
                  value={editTimeout || newFn.timeout_ms}
                  onChange={e => { if (editingFn) setEditTimeout(parseInt(e.target.value) || 5000); else setNewFn(p => ({ ...p, timeout_ms: parseInt(e.target.value) || 5000 })) }}
                  placeholder="Timeout (ms)"
                  className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
                />
              </div>
              <textarea
                value={editCode || newFn.code}
                onChange={e => { if (editingFn) setEditCode(e.target.value); else setNewFn(p => ({ ...p, code: e.target.value })) }}
                rows={8}
                className="w-full rounded-lg border px-3 py-2 text-sm font-mono outline-none resize-none"
                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setShowCreate(false); setEditingFn(null) }}
                  className="px-4 py-2 rounded-lg border text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  style={{ borderColor: 'var(--border)' }}>
                  Cancelar
                </button>
                <button
                  onClick={editingFn ? () => handleUpdate(editingFn.name) : handleCreate}
                  disabled={creating || !(editingFn ? editName && editCode : newFn.name && newFn.code)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {creating ? 'Guardando...' : editingFn ? 'Actualizar' : 'Crear Function'}
                </button>
              </div>
            </div>
          )}

          {/* Functions list */}
          {functions.length === 0 ? (
            <div className="text-center py-16">
              <Code2 className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--fg-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>No hay functions aún</p>
              <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>Creá tu primera function para ejecutar código serverless</p>
            </div>
          ) : (
            <div className="space-y-2">
              {functions.map(fn => (
                <div key={fn.id} className="flex items-center justify-between p-4 rounded-xl border hover:border-[var(--border-hover)] transition-colors"
                  style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }}>
                      <Code2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--fg-primary)' }}>{fn.name}</p>
                      <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>
                        {fn.timeout_ms}ms {fn.is_public ? '• Público' : '• Privado'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleInvoke(fn.name)}
                      disabled={executing === fn.name}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 transition-colors"
                      style={{ backgroundColor: 'var(--success-soft)', color: 'var(--success)' }}
                    >
                      {executing === fn.name ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                      Ejecutar
                    </button>
                    <button
                      onClick={() => { setEditingFn(fn); setEditCode(fn.code); setEditName(fn.name); setEditTimeout(fn.timeout_ms); setShowCreate(true) }}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                      style={{ color: 'var(--fg-tertiary)' }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(fn.name)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      style={{ color: 'var(--fg-tertiary)' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
