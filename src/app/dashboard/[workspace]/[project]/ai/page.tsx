'use client'

import { useState, useRef, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Sparkles, Send, Loader2, Settings, MessageSquare, ExternalLink, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

const PROVIDERS = [
  {
    id: 'groq',
    name: 'Groq',
    free: true,
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    keyUrl: 'https://console.groq.com/keys',
    keyHint: 'Gratis sin tarjeta — hasta 6000 req/día',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    free: true,
    defaultModel: 'gemini-1.5-flash',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
    keyUrl: 'https://aistudio.google.com/app/apikey',
    keyHint: 'Gratis — 1500 req/día con gemini-1.5-flash',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    free: false,
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    keyUrl: 'https://platform.openai.com/api-keys',
    keyHint: 'Pago — requiere crédito en la cuenta',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    free: false,
    defaultModel: 'claude-3-haiku-20240307',
    models: ['claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022', 'claude-opus-4-5'],
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyHint: 'Pago — requiere crédito en la cuenta',
  },
]

const PLATFORM_FREE_LIMIT = 50
type Session = { id: string; name: string; updated_at: string; preview?: string }
type Message = { role: string; content: string }

function newSessionId() { return crypto.randomUUID() }

export default function AIPage() {
  const { projectId } = useProject()

  // Sessions
  const [sessions,        setSessions]        = useState<Session[]>([])
  const [currentSession,  setCurrentSession]  = useState<string>(() => newSessionId())
  const [editingSession,  setEditingSession]  = useState<string | null>(null)
  const [editName,        setEditName]        = useState('')

  // Chat
  const [messages,        setMessages]        = useState<Message[]>([])
  const [input,           setInput]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [loadingHistory,  setLoadingHistory]  = useState(false)

  // UI
  const [config,          setConfig]          = useState({ provider: '', model: '', api_key: '' })
  const [showConfig,      setShowConfig]      = useState(false)
  const [remainingToday,  setRemainingToday]  = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const selectedProvider = PROVIDERS.find(p => p.id === config.provider)

  const SUGGESTIONS = [
    '¿Cómo configuro auth en mi app?',
    '¿Cómo consulto registros con filtros?',
    'Escribime una server function',
    '¿Cómo subo archivos al storage?',
    '¿Cómo uso realtime?',
    '¿Qué es el batch atómico?',
  ]

  // Load sessions list
  const loadSessions = async () => {
    try {
      const res = await api.get<any>(`/api/v2/project/${projectId}/ai/sessions`)
      setSessions(res.sessions ?? [])
    } catch { /* silencioso */ }
  }

  useEffect(() => {
    if (!projectId) return
    loadSessions()
    // Also fetch remaining count
    api.get<any>(`/api/v2/project/${projectId}/ai/history`, { session_id: currentSession, limit: '0' })
      .then(r => { if (r.remaining_today !== null) setRemainingToday(r.remaining_today) })
      .catch(() => {})
  }, [projectId])

  // Load history when session changes
  useEffect(() => {
    if (!projectId) return
    setLoadingHistory(true)
    setMessages([])
    api.get<any>(`/api/v2/project/${projectId}/ai/history`, { session_id: currentSession })
      .then(r => {
        setMessages((r.messages ?? []).map((m: any) => ({ role: m.role, content: m.content })))
        if (r.remaining_today !== null) setRemainingToday(r.remaining_today)
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [projectId, currentSession])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const switchSession = (id: string) => { setCurrentSession(id); setShowConfig(false) }

  const newChat = () => {
    const id = newSessionId()
    setCurrentSession(id)
    setMessages([])
  }

  const deleteSession = async (id: string) => {
    await api.delete(`/api/v2/project/${projectId}/ai/sessions/${id}`).catch(() => {})
    setSessions(prev => prev.filter(s => s.id !== id))
    if (currentSession === id) newChat()
  }

  const renameSession = async (id: string, name: string) => {
    await api.patch(`/api/v2/project/${projectId}/ai/sessions/${id}`, { name }).catch(() => {})
    setSessions(prev => prev.map(s => s.id === id ? { ...s, name } : s))
    setEditingSession(null)
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await api.post<any>(`/api/v2/project/${projectId}/ai/chat`, {
        messages: newMessages,
        max_tokens: 800,
        session_id: currentSession,
      })
      const assistantContent = res.choices?.[0]?.message?.content || 'Sin respuesta'
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }])
      if (res.remaining_today !== undefined) setRemainingToday(res.remaining_today)
      // Update sessions list (new session appears or updated_at changes)
      loadSessions()
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar')
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!config.provider || !config.api_key) { toast.error('Provider y API key son requeridos'); return }
    try {
      await api.put(`/api/v2/project/${projectId}/project/ai-config`, config)
      toast.success('Configuración guardada')
      setShowConfig(false)
    } catch (err: any) { toast.error(err.message || 'Error') }
  }

  const currentSessionName = sessions.find(s => s.id === currentSession)?.name ?? 'Nuevo chat'

  const MsgRenderer = ({ content }: { content: string }) => (
    <div className="prose prose-sm max-w-none ai-markdown">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={{
        code({ className, children, ...props }: any) {
          const isBlock = className?.includes('language-')
          if (isBlock) return (
            <div className="relative group my-2">
              <button onClick={() => { navigator.clipboard.writeText(String(children).trimEnd()); toast.success('Copiado') }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-white/10 hover:bg-white/20">
                <Copy className="w-3 h-3 text-white" />
              </button>
              <code className={className} {...props}>{children}</code>
            </div>
          )
          return <code className="px-1 py-0.5 rounded text-[11px] font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)' }} {...props}>{children}</code>
        },
      }}>{content}</ReactMarkdown>
    </div>
  )

  return (
    <div className="animate-fade-in flex flex-col gap-4" style={{ height: 'calc(100vh - 13rem)' }}>

      {/* Header row */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--fg-primary)' }}>AI Gateway</h1>
            <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>Asistente de desarrollo · conoce tu schema</p>
          </div>
        </div>
        <button onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          <Settings className="w-4 h-4" />
          Config
        </button>
      </div>

      {/* Config panel */}
      {showConfig && (
        <div className="rounded-xl border overflow-hidden shrink-0" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--fg-primary)' }}>Elegí un provider</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--fg-tertiary)' }}>Groq y Gemini son gratuitos sin tarjeta de crédito</p>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
            {PROVIDERS.map(p => (
              <button key={p.id} onClick={() => setConfig(prev => ({ ...prev, provider: p.id, model: p.defaultModel }))}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all"
                style={config.provider === p.id ? { backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)' } : { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
                <span className="text-sm font-semibold" style={{ color: config.provider === p.id ? 'var(--accent)' : 'var(--fg-primary)' }}>{p.name}</span>
                {p.free ? <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-900/30 text-emerald-700">GRATIS</span>
                        : <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800/40 text-slate-500">PAGO</span>}
              </button>
            ))}
          </div>
          {selectedProvider && (
            <div className="p-4 space-y-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs px-3 py-2 rounded-xl" style={{ backgroundColor: selectedProvider.free ? 'rgb(240 253 244)' : 'var(--bg-secondary)', color: selectedProvider.free ? 'rgb(22 101 52)' : 'var(--fg-secondary)', border: '1px solid', borderColor: selectedProvider.free ? 'rgb(187 247 208)' : 'var(--border)' }}>
                {selectedProvider.keyHint} — <a href={selectedProvider.keyUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Obtener key <ExternalLink className="w-3 h-3" /></a>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <select value={config.model} onChange={e => setConfig(p => ({ ...p, model: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm outline-none" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}>
                  {selectedProvider.models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <input type="password" value={config.api_key} onChange={e => setConfig(p => ({ ...p, api_key: e.target.value }))} placeholder="API Key..." className="rounded-lg border px-3 py-2 text-sm outline-none" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
              </div>
            </div>
          )}
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-[10px]" style={{ color: 'var(--fg-tertiary)' }}>🔒 API key encriptada con AES-256.</p>
            <button onClick={handleSaveConfig} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--accent)' }}>Guardar</button>
          </div>
        </div>
      )}

      {/* Free tier bar */}
      {remainingToday !== null && (
        <div className="rounded-xl border px-4 py-2.5 shrink-0 space-y-1.5" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: 'var(--fg-secondary)' }}>Free tier · {remainingToday} / {PLATFORM_FREE_LIMIT} req restantes hoy</span>
            {remainingToday === 0 ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-900/30 text-red-400">Agotado</span>
              : remainingToday <= 10 ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-900/30 text-amber-400">Casi lleno</span>
              : <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/30 text-emerald-400">Disponible</span>}
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(remainingToday / PLATFORM_FREE_LIMIT) * 100}%`, backgroundColor: remainingToday === 0 ? 'rgb(239 68 68)' : remainingToday <= 10 ? 'rgb(245 158 11)' : 'var(--accent)' }} />
          </div>
          {remainingToday === 0 && <p className="text-[11px]" style={{ color: 'var(--fg-tertiary)' }}>Se resetea mañana · <button onClick={() => setShowConfig(true)} className="underline" style={{ color: 'var(--accent)' }}>Configurá tu propia key</button></p>}
        </div>
      )}

      {/* Main: sidebar + chat */}
      <div className="flex gap-3 flex-1 min-h-0 rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>

        {/* Sessions sidebar */}
        <div className="w-56 shrink-0 flex flex-col border-r" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--accent)' }}>
              <MessageSquare className="w-4 h-4" />
              Nuevo chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {sessions.length === 0 && (
              <p className="text-[11px] text-center py-4" style={{ color: 'var(--fg-tertiary)' }}>Sin chats guardados</p>
            )}
            {sessions.map(s => (
              <div key={s.id} className="group relative">
                {editingSession === s.id ? (
                  <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                    onBlur={() => renameSession(s.id, editName || s.name)}
                    onKeyDown={e => { if (e.key === 'Enter') renameSession(s.id, editName || s.name); if (e.key === 'Escape') setEditingSession(null) }}
                    className="w-full px-3 py-2 text-xs outline-none border-b"
                    style={{ backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--fg-primary)' }} />
                ) : (
                  <button onClick={() => switchSession(s.id)}
                    className="w-full text-left px-3 py-2.5 text-xs transition-colors"
                    style={{ backgroundColor: currentSession === s.id ? 'var(--accent-soft)' : 'transparent', color: currentSession === s.id ? 'var(--accent)' : 'var(--fg-secondary)' }}>
                    <p className="font-medium truncate">{s.name}</p>
                    <p className="text-[10px] mt-0.5 truncate opacity-60">{s.preview ?? '...'}</p>
                  </button>
                )}
                {editingSession !== s.id && (
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-0.5">
                    <button onClick={() => { setEditingSession(s.id); setEditName(s.name) }} className="p-1 rounded hover:bg-[var(--bg-tertiary)]" title="Renombrar">
                      <Settings className="w-3 h-3" style={{ color: 'var(--fg-tertiary)' }} />
                    </button>
                    <button onClick={() => deleteSession(s.id)} className="p-1 rounded hover:bg-red-900/30" title="Eliminar">
                      <span className="text-red-400 text-xs leading-none">✕</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Chat title */}
          <div className="px-4 py-2.5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
            <span className="text-sm font-semibold truncate" style={{ color: 'var(--fg-primary)' }}>{currentSessionName}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--fg-tertiary)' }} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--fg-tertiary)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--fg-secondary)' }}>Asistente de desarrollo</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>Conoce tu schema · <button onClick={() => setShowConfig(true)} className="underline">Tu propia key →</button></p>
                </div>
                <div className="w-full max-w-sm grid grid-cols-2 gap-1.5">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => setInput(s)} className="text-left text-[11px] px-3 py-2 rounded-xl border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--fg-secondary)', backgroundColor: 'var(--bg-secondary)' }}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                    style={msg.role === 'user' ? { backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' } : { backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-primary)' }}>
                    {msg.role === 'user' ? <p className="whitespace-pre-wrap">{msg.content}</p> : <MsgRenderer content={msg.content} />}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-tertiary)' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                Pensando...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 shrink-0" style={{ borderColor: 'var(--border)' }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--accent)' }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
