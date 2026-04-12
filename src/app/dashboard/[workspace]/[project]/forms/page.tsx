'use client'

import { useState, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { FileText, Plus, Trash2, Copy, Loader2, ExternalLink, Inbox, Download, Code2 } from 'lucide-react'

interface Form {
  id: string
  name: string
  collection: string
  is_active: boolean
  submit_count: number
  created_at: string
}

export default function FormsPage() {
  const { projectId, subdomain } = useProject()
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', collection: '' })
  const [creating, setCreating] = useState(false)
  const [viewingSubmissions, setViewingSubmissions] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [formTab, setFormTab] = useState<'submissions' | 'embed'>('submissions')

  const fetchForms = async () => {
    try {
      const res = await api.get<any>(`/api/v2/project/${projectId}/forms`)
      setForms(res.forms || [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  const fetchSubmissions = async (formName: string, limit = 50) => {
    try {
      const res = await api.get<any>(`/api/v2/project/${projectId}/forms/${formName}/submissions?limit=${limit}`)
      setSubmissions(res.submissions || [])
    } catch { /* ignore */ }
  }

  useEffect(() => { fetchForms() }, [])
  useEffect(() => {
    if (viewingSubmissions) {
      setFormTab('submissions')
      fetchSubmissions(viewingSubmissions)
    }
  }, [viewingSubmissions])

  const handleCreate = async () => {
    if (!newForm.name || !newForm.collection) return
    setCreating(true)
    try {
      await api.post(`/api/v2/project/${projectId}/forms`, { name: newForm.name, collection: newForm.collection, fields: [] })
      toast.success('Form creado')
      setShowCreate(false)
      setNewForm({ name: '', collection: '' })
      fetchForms()
    } catch (err: any) {
      toast.error(err.message || 'Error')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (name: string) => {
    try {
      await api.delete(`/api/v2/project/${projectId}/forms/${name}`)
      toast.success('Form eliminado')
      if (viewingSubmissions === name) setViewingSubmissions(null)
      fetchForms()
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  const getPublicUrl = (name: string) => `https://${subdomain}.matecito.dev/f/${name}`

  const copyText = (text: string, label = 'Copiado') => {
    navigator.clipboard.writeText(text)
    toast.success(label)
  }

  const exportCsv = async (formName: string) => {
    // fetch up to 1000 for export
    let rows = submissions
    if (rows.length < 50) {
      try {
        const res = await api.get<any>(`/api/v2/project/${projectId}/forms/${formName}/submissions?limit=1000`)
        rows = res.submissions || []
      } catch { /* use current */ }
    }
    if (!rows.length) { toast.error('No hay submissions para exportar'); return }
    const headers = Object.keys(rows[0]).filter(k => k !== 'id')
    const csvRows = rows.map((s: any) => headers.map(h => {
      const v = s[h]
      const str = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')
      return `"${str.replace(/"/g, '""')}"`
    }).join(','))
    const csv = [headers.join(','), ...csvRows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: `${formName}-submissions.csv` })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`Exportando ${rows.length} submissions`)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <FileText className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--fg-primary)' }}>Forms</h1>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>Formularios públicos sin autenticación</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--accent)' }}>
          <Plus className="w-4 h-4" />
          Nuevo Form
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-3">
            <input value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} placeholder="Nombre (e.g. contacto)"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
            <input value={newForm.collection} onChange={e => setNewForm(p => ({ ...p, collection: e.target.value }))} placeholder="Colección destino"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg border text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              style={{ borderColor: 'var(--border)' }}>Cancelar</button>
            <button onClick={handleCreate} disabled={creating || !newForm.name || !newForm.collection}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}>
              {creating ? 'Creando...' : 'Crear Form'}
            </button>
          </div>
        </div>
      )}

      {/* Submissions / Embed panel */}
      {viewingSubmissions && (
        <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2">
              <button onClick={() => setViewingSubmissions(null)} className="p-1 rounded hover:bg-[var(--bg-secondary)]" style={{ color: 'var(--fg-tertiary)' }}>
                <ExternalLink className="w-4 h-4 rotate-180" />
              </button>
              <p className="text-sm font-medium" style={{ color: 'var(--fg-primary)' }}>{viewingSubmissions}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>{submissions.length}</span>
            </div>
            {/* Tabs + actions */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {(['submissions', 'embed'] as const).map(tab => (
                  <button key={tab} onClick={() => setFormTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${formTab === tab ? 'text-white' : 'text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                    style={formTab === tab ? { backgroundColor: 'var(--accent)' } : {}}>
                    {tab === 'submissions' ? 'Submissions' : 'Embed & SDK'}
                  </button>
                ))}
              </div>
              {formTab === 'submissions' && (
                <button onClick={() => exportCsv(viewingSubmissions)}
                  title="Exportar CSV"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ color: 'var(--fg-tertiary)' }}>
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              )}
            </div>
          </div>

          {/* Tab content */}
          {formTab === 'submissions' ? (
            submissions.length === 0 ? (
              <div className="py-12 text-center">
                <Inbox className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--fg-tertiary)' }} />
                <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>Sin submissions aún</p>
                <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>
                  Probá con: <code className="font-mono">POST {getPublicUrl(viewingSubmissions)}</code>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-[10px] font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-tertiary)' }}>
                    <tr>
                      {submissions[0] && Object.keys(submissions[0]).filter(k => k !== 'id' && k !== 'created_at').slice(0, 6).map(k => (
                        <th key={k} className="text-left px-4 py-2">{k}</th>
                      ))}
                      <th className="text-left px-4 py-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {submissions.map((sub: any, i: number) => (
                      <tr key={i} className="hover:bg-[var(--bg-secondary)] transition-colors">
                        {Object.entries(sub).filter(([k]) => k !== 'id' && k !== 'created_at').slice(0, 6).map(([k, v]: [string, any]) => (
                          <td key={k} className="px-4 py-2 truncate max-w-[200px]" style={{ color: 'var(--fg-secondary)' }}>
                            {typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}
                          </td>
                        ))}
                        <td className="px-4 py-2 font-mono" style={{ color: 'var(--fg-tertiary)' }}>
                          {sub.created_at ? new Date(sub.created_at).toLocaleDateString('es-AR') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Embed & SDK tab */
            <div className="p-5 space-y-5">
              {/* Public URL */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: 'var(--fg-secondary)' }}>URL pública del form</p>
                <div className="flex gap-2">
                  <input readOnly value={getPublicUrl(viewingSubmissions)}
                    className="flex-1 rounded-lg border px-3 py-2 text-xs font-mono outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-secondary)' }} />
                  <button onClick={() => copyText(getPublicUrl(viewingSubmissions), 'URL copiada')}
                    className="p-2 rounded-lg border hover:bg-[var(--bg-secondary)] transition-colors"
                    style={{ borderColor: 'var(--border)', color: 'var(--fg-tertiary)' }}>
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* HTML embed */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold" style={{ color: 'var(--fg-secondary)' }}>Embed HTML (iframe)</p>
                  <button onClick={() => copyText(`<iframe\n  src="${getPublicUrl(viewingSubmissions)}"\n  width="100%" height="500"\n  frameborder="0"\n></iframe>`, 'HTML copiado')}
                    className="flex items-center gap-1 text-xs hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--fg-tertiary)' }}>
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
                <pre className="text-xs font-mono p-4 rounded-lg leading-relaxed overflow-x-auto"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
{`<iframe
  src="${getPublicUrl(viewingSubmissions)}"
  width="100%" height="500"
  frameborder="0"
></iframe>`}
                </pre>
              </div>

              {/* SDK snippet */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold" style={{ color: 'var(--fg-secondary)' }}>SDK JavaScript</p>
                  <button onClick={() => copyText(`import { createClient } from 'matecitodb'\n\nconst db = createClient('https://${subdomain}.matecito.dev', {\n  apiKey: 'YOUR_ANON_KEY',\n  apiVersion: 'v2',\n})\n\nawait db.forms.submitPublic('${viewingSubmissions}', {\n  // tus campos aquí\n  name: 'Juan',\n  email: 'juan@example.com',\n  message: 'Hola!',\n})`, 'Snippet copiado')}
                    className="flex items-center gap-1 text-xs hover:text-[var(--accent)] transition-colors"
                    style={{ color: 'var(--fg-tertiary)' }}>
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>
                <pre className="text-xs font-mono p-4 rounded-lg leading-relaxed overflow-x-auto"
                  style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
{`import { createClient } from 'matecitodb'

const db = createClient('https://${subdomain}.matecito.dev', {
  apiKey: 'YOUR_ANON_KEY',
  apiVersion: 'v2',
})

await db.forms.submitPublic('${viewingSubmissions}', {
  // tus campos aquí
  name: 'Juan',
  email: 'juan@example.com',
  message: 'Hola!',
})`}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Forms list */}
      {forms.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--fg-tertiary)' }} />
          <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>No hay forms aún</p>
          <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>Creá formularios públicos para recibir submissions sin auth</p>
        </div>
      ) : (
        <div className="space-y-2">
          {forms.map(form => (
            <div key={form.id} className="flex items-center justify-between p-4 rounded-xl border hover:border-[var(--border-hover)] transition-colors"
              style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--accent-soft)' }}>
                  <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--fg-primary)' }}>{form.name}</p>
                  <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>
                    {form.submit_count} submissions → {form.collection}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setViewingSubmissions(form.name)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-secondary)' }}>
                  <Inbox className="w-3.5 h-3.5" />
                  Ver ({form.submit_count})
                </button>
                <button onClick={() => copyText(getPublicUrl(form.name), 'URL copiada')}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" style={{ color: 'var(--fg-tertiary)' }} title="Copiar URL pública">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(form.name)}
                  className="p-1.5 rounded-lg hover:bg-red-950/20 dark:hover:bg-red-950/20 transition-colors" style={{ color: 'var(--fg-tertiary)' }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
