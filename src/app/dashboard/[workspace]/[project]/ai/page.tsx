'use client'

import { useState, useRef, useEffect } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Sparkles, Send, Loader2, Settings, MessageSquare } from 'lucide-react'

export default function AIPage() {
  const { projectId } = useProject()
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [config, setConfig] = useState({ provider: '', model: '', api_key: '' })
  const [showConfig, setShowConfig] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await api.post<any>(`/api/v2/project/${projectId}/ai/chat`, {
        messages: [...messages, { role: 'user', content: userMsg }],
        max_tokens: 500,
      })
      const assistantContent = res.choices?.[0]?.message?.content || 'Sin respuesta'
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }])
    } catch (err: any) {
      toast.error(err.message || 'Error al enviar')
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!config.provider || !config.api_key) {
      toast.error('Provider y API key son requeridos')
      return
    }
    try {
      await api.put(`/api/v2/project/${projectId}/project/ai-config`, config)
      toast.success('Configuración guardada')
      setShowConfig(false)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-soft)' }}>
            <Sparkles className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--fg-primary)' }}>AI Gateway</h1>
            <p className="text-sm" style={{ color: 'var(--fg-tertiary)' }}>Chat con LLMs vía OpenAI, Anthropic o Groq</p>
          </div>
        </div>
        <button onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
          style={{ borderColor: 'var(--border)' }}>
          <Settings className="w-4 h-4" />
          Config
        </button>
      </div>

      {/* Config panel */}
      {showConfig && (
        <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-2 gap-3">
            <select value={config.provider} onChange={e => setConfig(p => ({ ...p, provider: e.target.value }))}
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}>
              <option value="">Provider...</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="groq">Groq</option>
            </select>
            <input value={config.model} onChange={e => setConfig(p => ({ ...p, model: e.target.value }))}
              placeholder="Model (e.g. gpt-4o-mini)"
              className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
          </div>
          <div className="flex gap-2">
            <input type="password" value={config.api_key} onChange={e => setConfig(p => ({ ...p, api_key: e.target.value }))}
              placeholder="API Key"
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }} />
            <button onClick={handleSaveConfig}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--accent)' }}>
              Guardar
            </button>
          </div>
          <p className="text-[10px]" style={{ color: 'var(--fg-tertiary)' }}>La API key se encripta con AES-256 antes de guardarse.</p>
        </div>
      )}

      {/* Chat */}
      <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border)' }}>
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="w-12 h-12 mb-3" style={{ color: 'var(--fg-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>Envía un mensaje para chatear con la IA</p>
              <p className="text-xs mt-1" style={{ color: 'var(--fg-tertiary)' }}>Configurá tu provider primero en ⚙️ Config</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                style={msg.role === 'user'
                  ? { backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' }
                  : { backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-primary)' }
                }>
                <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--fg-tertiary)' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              Pensando...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2" style={{ borderColor: 'var(--border)' }}>
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
  )
}
