'use client'

import { useEffect, useState } from 'react'
import { useProject } from '@/contexts/ProjectContext'
import {
    Copy, Eye, EyeOff, Globe, Key, ShieldCheck, AlertTriangle,
    Plus, Trash2, RefreshCw, CheckSquare,
    Bot, Users, Radio, Smartphone, Sparkles, FileText, ShoppingCart, WifiOff,
    ExternalLink, ChevronDown, Database, HardDrive, Bell, Zap, BarChart2,
    MapPin, RefreshCcw, Layers, Webhook, Terminal, Package,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Scope options ────────────────────────────────────────────────────────────
const SCOPE_OPTIONS = [
    { value: 'read',  label: 'Read',  desc: 'Solo GET/LIST',      color: 'text-emerald-400', bg: 'bg-emerald-950/20', border: 'border-emerald-800/40' },
    { value: 'write', label: 'Write', desc: 'POST/PATCH/DELETE',   color: 'text-blue-400',    bg: 'bg-blue-950/20',    border: 'border-blue-800/40' },
    { value: '*',     label: 'All',   desc: 'Acceso completo',     color: 'text-[var(--accent)]',  bg: 'bg-[var(--accent-soft)]',  border: 'border-[var(--border)]' },
]

// ─── Module quickstart definitions ───────────────────────────────────────────

interface Module {
    id: string
    label: string
    icon: React.ReactNode
    v2only?: boolean
    snippet: { js?: string; flutter?: string }
}

const INSTALL_JS      = `npm install matecitodb`
const INSTALL_FLUTTER = `# pubspec.yaml\ndependencies:\n  matecitodb_flutter: ^4.0.0`
const INIT_JS         = `import { createClient } from 'matecitodb'\n\nconst db = createClient(process.env.NEXT_PUBLIC_MATECITO_URL, {\n  apiKey: process.env.NEXT_PUBLIC_MATECITO_ANON_KEY,\n  apiVersion: 'v2',\n})`
const INIT_FLUTTER    = `import 'package:matecitodb_flutter/matecitodb.dart';\n\nfinal db = MatecitoDB.createClient(\n  'PROJECT_URL',\n  config: const ClientConfig(\n    apiKey: 'YOUR_ANON_KEY',\n    apiVersion: 'v2',\n  ),\n);\nawait db.auth.sessionReady;`

const MODULES: Module[] = [
    {
        id: 'auth',
        label: 'Auth',
        icon: <Users className="w-4 h-4" />,
        snippet: {
            js: `await db.auth.signUp('user@email.com', 'password')\nawait db.auth.signIn('user@email.com', 'password')\nconst { data: user } = await db.auth.getMe()\nawait db.auth.signOut()`,
            flutter: `await db.auth.signUp('user@email.com', 'password');\nawait db.auth.signIn('user@email.com', 'password');\ndb.auth.authStateStream.listen((user) => print(user?.email));\nawait db.auth.signOut();`,
        },
    },
    {
        id: 'data',
        label: 'Base de datos',
        icon: <Database className="w-4 h-4" />,
        snippet: {
            js: `// Leer\nconst { data } = await db.from('posts')\n  .where('published', '=', true)\n  .orderBy('created_at', 'desc')\n  .limit(20)\n  .get()\n\n// Escribir\nawait db.from('posts').create({ title: 'Hola mundo', published: true })\nawait db.from('posts').update(id, { title: 'Actualizado' })\nawait db.from('posts').delete(id)`,
            flutter: `// Leer\nfinal result = await db.from('posts')\n  .where('published', '=', true)\n  .orderBy('created_at', 'desc')\n  .limit(20)\n  .get();\n\n// Escribir\nawait db.from('posts').create({'title': 'Hola', 'published': true});\nawait db.from('posts').update(id, {'title': 'Actualizado'});\nawait db.from('posts').delete(id);`,
        },
    },
    {
        id: 'realtime',
        label: 'Realtime',
        icon: <Radio className="w-4 h-4" />,
        snippet: {
            js: `// Suscribirse a cambios\nconst unsub = db.from('messages').subscribe((event) => {\n  console.log(event.type, event.record) // INSERT | UPDATE | DELETE\n})\n\n// Desuscribirse\nunsub()`,
            flutter: `final sub = db.realtime.subscribe('messages', (event) {\n  print('\${event.type}: \${event.record}');\n});\n\nawait sub.cancel();`,
        },
    },
    {
        id: 'storage',
        label: 'Storage',
        icon: <HardDrive className="w-4 h-4" />,
        snippet: {
            js: `// Subir archivo\nconst { data: file } = await db.storage.upload(imageFile, { bucket: 'avatars' })\n\n// Listar\nconst { data: files } = await db.storage.list()\n\n// URL firmada (tiempo limitado)\nconst { data: url } = await db.storage.getSignedUrl(file.id)\n\nawait db.storage.delete(file.id)`,
            flutter: `final result = await db.storage.upload(file, bucket: 'avatars');\nfinal files = await db.storage.list();\nfinal url   = await db.storage.getSignedUrl(result.data!.id);\nawait db.storage.delete(result.data!.id);`,
        },
    },
    {
        id: 'notifications',
        label: 'Notificaciones',
        icon: <Bell className="w-4 h-4" />,
        snippet: {
            js: `// Push (requiere service key)\nawait db.notifications.send({\n  userIds: ['user-1'],\n  title: 'Nuevo mensaje',\n  body: 'Tenés 3 sin leer',\n})\n\n// In-app\nawait db.notifications.sendInApp({ userIds: ['user-1'], title: 'Info', type: 'info' })\nawait db.notifications.markAsRead(id)\nawait db.notifications.readAll()`,
            flutter: `// Registrar token FCM\nfinal token = await FirebaseMessaging.instance.getToken();\nawait db.notifications.registerToken(token!);\n\n// Listar notificaciones in-app\nfinal notifs = await db.notifications.listMy(limit: 20);\nawait db.notifications.markAsRead(id);\nawait db.notifications.readAll();`,
        },
    },
    {
        id: 'functions',
        label: 'Functions',
        icon: <Zap className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Invocar función serverless\nconst { data } = await db.functions.invoke('send-welcome-email', {\n  userId: 'user-123',\n  template: 'onboarding',\n})\n\n// También disponible via MCP para agentes IA`,
            flutter: `final result = await db.functions.invoke(\n  'send-welcome-email',\n  args: {'userId': 'user-123', 'template': 'onboarding'},\n);`,
        },
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: <BarChart2 className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Registrar evento\nawait db.analytics.track('page_view', { url: '/pricing', userId: user.id })\n\n// Consultar eventos\nconst { data } = await db.analytics.getEvents({\n  from: '2024-01-01', to: '2024-12-31',\n})\n\n// Funnel de conversión\nconst { data: funnel } = await db.analytics.getFunnel({\n  steps: ['signup', 'onboarding', 'first_purchase'],\n})`,
        },
    },
    {
        id: 'ai',
        label: 'AI Gateway',
        icon: <Sparkles className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Chat (proxy a OpenAI / Anthropic / Groq)\nconst { data } = await db.ai.chat({\n  messages: [\n    { role: 'system', content: 'Sos un asistente útil.' },\n    { role: 'user',   content: userMessage },\n  ]\n})\nconst reply = data.choices[0].message.content\n\n// Embeddings para búsqueda semántica\nconst { data: embed } = await db.ai.embed({ input: query })\nconst { data: usage } = await db.ai.getUsage()`,
        },
    },
    {
        id: 'forms',
        label: 'Forms',
        icon: <FileText className="w-4 h-4" />,
        snippet: {
            js: `// Enviar form público (sin auth)\nawait db.forms.submitPublic('contacto', {\n  nombre: 'Juan Pérez',\n  email: 'juan@empresa.com',\n  mensaje: '¿Tienen planes enterprise?',\n})\n\n// URL pública (también como iframe embed)\n// https://TU-PROYECTO.matecito.dev/f/contacto\n\n// Ver submissions (service key)\nconst { data } = await db.from('contacto').orderBy('created_at','desc').get()`,
        },
    },
    {
        id: 'geo',
        label: 'Geo',
        icon: <MapPin className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Buscar registros cercanos\nconst { data } = await db.geo.near('stores', lat, lng, { radiusKm: 5 })\n\n// Por bounding box\nconst { data: inBounds } = await db.geo.bounds('stores', { north, south, east, west })\n\n// Distancias en batch\nconst { data: dists } = await db.geo.batchDistance('stores', { lat, lng }, ['id1', 'id2'])`,
            flutter: `final result = await db.geo.near('stores', lat, lng, radiusKm: 5);\nfinal bounds = await db.geo.bounds('stores', north: n, south: s, east: e, west: w);`,
        },
    },
    {
        id: 'sync',
        label: 'Offline Sync',
        icon: <RefreshCcw className="w-4 h-4" />,
        v2only: true,
        snippet: {
            flutter: `// Pull: cambios desde último sync\nfinal pulled = await db.sync.pull(\n  collection: 'todos',\n  since: lastSyncTimestamp,\n);\nfor (final r in pulled.records) localDb.upsert(r);\n\n// Push: cambios locales al server\nawait db.sync.push(\n  collection: 'todos',\n  changes: pendingChanges,\n  conflictStrategy: 'server_wins',\n);`,
        },
    },
    {
        id: 'batch',
        label: 'Batch / Atómico',
        icon: <Layers className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Transacción atómica (todo o nada)\nconst result = await db.batch()\n  .atomic()\n  .insert('orders', { user_id: userId, total: 9999, status: 'pending' })\n  .update(productId, { stock: currentStock - 1 }, { collection: 'products' })\n  .execute()\n\nconsole.log(result.data) // array con los registros creados/modificados`,
        },
    },
    {
        id: 'webhooks',
        label: 'Webhooks',
        icon: <Webhook className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Registrar webhook (service key)\nawait db.webhooks.create({\n  url: 'https://mi-api.com/hooks/matecito',\n  events: ['records.insert', 'records.update'],\n  collection: 'orders',\n  secret: 'my-webhook-secret',\n})\n\n// En tu servidor: verificar firma\n// X-Matecito-Signature: sha256=...`,
        },
    },
    {
        id: 'sql',
        label: 'SQL raw',
        icon: <Terminal className="w-4 h-4" />,
        snippet: {
            js: `// SQL directo (requiere sql_enabled en Settings)\nconst { data } = await db.sql.query(\n  'SELECT id, email FROM _auth_users WHERE created_at > $1 LIMIT $2',\n  ['2024-01-01', 50]\n)\n\n// Introspección de schema\nconst { data: schema } = await db.schema.introspect()\nconst { data: history } = await db.schema.migrations()`,
        },
    },
    {
        id: 'remoteConfig',
        label: 'Feature Flags',
        icon: <Package className="w-4 h-4" />,
        v2only: true,
        snippet: {
            js: `// Obtener todos los flags\nconst { data: flags } = await db.remoteConfig.getAll()\n\n// Obtener uno\nconst { data: flag } = await db.remoteConfig.get('new_checkout_ui')\n\n// Usar\nif (flag.value === 'true') showNewCheckout()`,
            flutter: `final flags = await db.remoteConfig.getAll();\nfinal flag  = await db.remoteConfig.get('new_checkout_ui');\nif (flag.data?.value == 'true') showNewCheckout();`,
        },
    },
]

// ─── Quickstart presets ───────────────────────────────────────────────────────
const PRESETS = [
    { label: 'Auth + Datos',         modules: ['auth', 'data'] },
    { label: 'Chat en tiempo real',  modules: ['auth', 'data', 'realtime'] },
    { label: 'Mobile con Push',      modules: ['auth', 'data', 'notifications'] },
    { label: 'App con IA',           modules: ['auth', 'data', 'ai', 'functions'] },
    { label: 'E-commerce',           modules: ['auth', 'data', 'storage', 'batch', 'functions'] },
    { label: 'Offline-first Mobile', modules: ['auth', 'data', 'sync', 'realtime'] },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConnectPage() {
    const { project, fetchApiKeys, createApiKey, revokeApiKey } = useProject()
    const [revealAnon,    setRevealAnon]    = useState(false)
    const [revealService, setRevealService] = useState(false)
    const [activeTab,     setActiveTab]     = useState<'js' | 'rn' | 'flutter'>('js')

    // Custom API keys
    const [apiKeys,       setApiKeys]       = useState<any[]>([])
    const [loadingKeys,   setLoadingKeys]   = useState(true)
    const [creating,      setCreating]      = useState(false)
    const [selectedScopes, setSelectedScopes] = useState<string[]>(['*'])
    const [newKeyValue,   setNewKeyValue]   = useState<string | null>(null)
    const [revoking,      setRevoking]      = useState<string | null>(null)

    // Quickstart
    const [selectedModules,  setSelectedModules]  = useState<string[]>([])
    const [activeModuleTab,  setActiveModuleTab]  = useState<'install' | 'init' | 'snippet'>('snippet')
    const [platformTab,      setPlatformTab]      = useState<'js' | 'flutter'>('js')

    useEffect(() => {
        (async () => {
            try {
                const keys = await fetchApiKeys()
                setApiKeys(keys)
            } catch { /* silencioso */ }
            finally { setLoadingKeys(false) }
        })()
    }, [])

    if (!project) return null

    const copy = (text: string, label = 'Copiado') => {
        navigator.clipboard.writeText(text)
        toast.success(label)
    }

    const projectUrl = `https://${project.subdomain}.matecito.dev`
    const mcpWsUrl   = `wss://${project.subdomain}.matecito.dev/api/v2/project/mcp`
    const llmsUrl    = `https://${project.subdomain}.matecito.dev/api/v2/project/llms.txt`
    const envSnippet = `# .env.local\nNEXT_PUBLIC_MATECITO_URL=${projectUrl}\nNEXT_PUBLIC_MATECITO_ANON_KEY=${project.anon_key}\nMATECITO_SERVICE_KEY=${project.service_key}`

    const mcpConfig = JSON.stringify({
        mcpServers: {
            [`matecito-${project.subdomain}`]: {
                transport: 'websocket',
                url: mcpWsUrl,
                headers: { 'x-matecito-key': project.service_key },
            },
        },
    }, null, 2)

    const claudeMd = `# Matecito Project Context
Backend: Matecito BaaS
Base URL: ${projectUrl}
SDK: matecitodb (npm install matecitodb)
Full API ref: ${llmsUrl}
MCP: ${mcpWsUrl} (header: x-matecito-key)`

    const toggleScope = (s: string) => {
        if (s === '*') { setSelectedScopes(['*']); return }
        setSelectedScopes(prev => {
            const without = prev.filter(x => x !== '*')
            return without.includes(s) ? without.filter(x => x !== s) : [...without, s]
        })
    }

    const handleCreate = async () => {
        setCreating(true)
        setNewKeyValue(null)
        try {
            const res = await createApiKey(selectedScopes)
            const key = res.key
            setNewKeyValue(key.key)
            setApiKeys(prev => [key, ...prev])
            toast.success('Key creada — copiala ahora, no la verás de nuevo')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setCreating(false)
        }
    }

    const handleRevoke = async (id: string) => {
        if (!confirm('¿Revocar esta key? Se invalida inmediatamente.')) return
        setRevoking(id)
        try {
            await revokeApiKey(id)
            setApiKeys(prev => prev.filter(k => k.id !== id))
            toast.success('Key revocada')
        } catch (err: any) {
            toast.error('Error: ' + err.message)
        } finally {
            setRevoking(null)
        }
    }

    const toggleModule = (id: string) => {
        setSelectedModules(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        )
    }

    const activeMods  = MODULES.filter(m => selectedModules.includes(m.id))
    const hasFlutter  = activeMods.some(m => m.snippet.flutter)
    const hasJs       = activeMods.some(m => m.snippet.js)

    const getQuickstartCode = () => {
        const lang = platformTab
        if (activeModuleTab === 'install') {
            return lang === 'flutter' ? INSTALL_FLUTTER : INSTALL_JS
        }
        if (activeModuleTab === 'init') {
            return lang === 'flutter' ? INIT_FLUTTER : INIT_JS
        }
        if (!activeMods.length) return '// Seleccioná uno o más módulos arriba'
        return activeMods
            .map(m => {
                const code = (lang === 'flutter' ? m.snippet.flutter : m.snippet.js)
                    ?? m.snippet.js ?? m.snippet.flutter ?? ''
                return `// ── ${m.label} ──\n${code}`
            })
            .join('\n\n')
    }

    return (
        <div className="max-w-3xl space-y-6 animate-in fade-in duration-500 pb-16">
            {/* Header */}
            <div className="pb-4 border-b border-[var(--border)]">
                <h1 className="text-2xl font-extrabold text-[var(--fg-primary)]">Conexión & API Keys</h1>
                <p className="text-xs text-[var(--fg-tertiary)] mt-1">Configurá tu app para conectarse a este proyecto.</p>
            </div>

            {/* Project URL + system keys */}
            <div className="space-y-4">
                <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] p-5 space-y-3">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[var(--fg-tertiary)]" />
                        <span className="text-xs font-semibold text-[var(--fg-secondary)]">Project URL</span>
                    </div>
                    <div className="flex gap-2">
                        <input readOnly value={projectUrl}
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm font-mono text-[var(--fg-secondary)] outline-none" />
                        <button onClick={() => copy(projectUrl, 'URL copiada')}
                            className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:border-[var(--border)] hover:bg-[var(--accent-soft)] transition-all">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Anon key */}
                <div className="bg-[var(--bg-tertiary)] rounded-xl border border-l-4 border-emerald-300 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-[var(--fg-secondary)]">Anon Key</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-emerald-950/20 text-emerald-400 border border-emerald-800/40 rounded">Client-safe</span>
                    </div>
                    <p className="text-xs text-[var(--fg-tertiary)]">Segura para usar en el frontend — NO expone datos privados.</p>
                    <div className="flex gap-2">
                        <input readOnly type={revealAnon ? "text" : "password"} value={project.anon_key || ''}
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs font-mono text-[var(--fg-secondary)] outline-none" />
                        <button onClick={() => setRevealAnon(v => !v)}
                            className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition-all">
                            {revealAnon ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => copy(project.anon_key || '', 'Anon Key copiada')}
                            className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:border-[var(--border)] hover:bg-[var(--accent-soft)] transition-all">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Service key */}
                <div className="bg-[var(--bg-tertiary)] rounded-xl border border-l-4 border-red-300 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-semibold text-[var(--fg-secondary)]">Service Key</span>
                        </div>
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-red-950/20 text-red-400 border border-red-800/40 rounded">Server only</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-800/40 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs text-red-400 font-medium">Nunca uses esta key en el código del cliente.</span>
                    </div>
                    <div className="flex gap-2">
                        <input readOnly type={revealService ? "text" : "password"} value={project.service_key || ''}
                            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs font-mono text-[var(--fg-secondary)] outline-none" />
                        <button onClick={() => setRevealService(v => !v)}
                            className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] transition-all">
                            {revealService ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => copy(project.service_key || '', 'Service Key copiada')}
                            className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:border-[var(--border)] hover:bg-[var(--accent-soft)] transition-all">
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Custom API Keys */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--border)]">
                    <h3 className="font-bold text-[var(--fg-primary)]">API Keys Personalizadas</h3>
                    <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">Creá keys con permisos limitados para casos de uso específicos</p>
                </div>

                {/* New key creator */}
                <div className="px-6 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border)] space-y-3">
                    <p className="text-xs font-semibold text-[var(--fg-secondary)]">Nueva key</p>
                    <div className="flex flex-wrap gap-2">
                        {SCOPE_OPTIONS.map(s => (
                            <button key={s.value} onClick={() => toggleScope(s.value)}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                                    selectedScopes.includes(s.value)
                                        ? `${s.bg} ${s.color} ${s.border}`
                                        : "bg-[var(--bg-primary)] text-[var(--fg-secondary)] border-[var(--border)] hover:border-slate-600/50"
                                )}>
                                <CheckSquare className="w-3 h-3" />
                                {s.label}
                                <span className="opacity-60">{s.desc}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={handleCreate} disabled={creating || selectedScopes.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50">
                        {creating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        Crear key
                    </button>
                </div>

                {/* New key reveal (one-time) */}
                {newKeyValue && (
                    <div className="px-6 py-4 bg-amber-950/20 border-b border-amber-800/40 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-amber-700 mb-1">Copiá esta key ahora — no se mostrará de nuevo</p>
                            <code className="text-xs font-mono text-amber-800 break-all">{newKeyValue}</code>
                        </div>
                        <button onClick={() => copy(newKeyValue, 'Key copiada')}
                            className="p-2 bg-amber-900/30 border border-amber-300 rounded-lg text-amber-400 hover:bg-amber-200 transition-all shrink-0">
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Keys list */}
                <div className="divide-y divide-[var(--border)]">
                    {loadingKeys ? (
                        <div className="px-6 py-8 text-center text-xs text-[var(--fg-tertiary)]">
                            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
                            Cargando keys...
                        </div>
                    ) : apiKeys.filter(k => k.type === 'custom').length === 0 ? (
                        <div className="px-6 py-8 text-center text-xs text-[var(--fg-tertiary)]">
                            No hay keys personalizadas
                        </div>
                    ) : (
                        apiKeys.filter(k => k.type === 'custom').map(k => (
                            <div key={k.id} className="flex items-center justify-between px-6 py-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Key className="w-3.5 h-3.5 text-[var(--fg-tertiary)] shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-mono text-[var(--fg-secondary)] truncate">{k.key?.slice(0, 20)}…</p>
                                        <p className="text-[10px] text-[var(--fg-tertiary)]">
                                            {k.scopes ? k.scopes.join(', ') : 'all access'} · {new Date(k.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {(k.scopes ?? ['*']).map((s: string) => {
                                        const opt = SCOPE_OPTIONS.find(o => o.value === s)
                                        return opt ? (
                                            <span key={s} className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase", opt.bg, opt.color, opt.border)}>
                                                {opt.label}
                                            </span>
                                        ) : null
                                    })}
                                    <button onClick={() => handleRevoke(k.id)} disabled={revoking === k.id}
                                        className="p-1.5 text-[var(--fg-tertiary)] hover:text-red-500 hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-50">
                                        {revoking === k.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Env vars */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--fg-secondary)]">Variables de entorno</span>
                    <button onClick={() => copy(envSnippet, 'Variables copiadas')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:text-violet-700 transition-colors">
                        <Copy className="w-3 h-3" /> Copiar todo
                    </button>
                </div>
                <div className="p-5 bg-[var(--bg-tertiary)]">
                    <pre className="text-xs font-mono leading-relaxed overflow-x-auto">
                        <span className="text-[var(--fg-secondary)]"># .env.local</span>{'\n'}
                        <span className="text-violet-400">NEXT_PUBLIC_MATECITO_URL</span><span className="text-[var(--fg-tertiary)]">={projectUrl}</span>{'\n'}
                        <span className="text-violet-400">NEXT_PUBLIC_MATECITO_ANON_KEY</span><span className="text-[var(--fg-tertiary)]">={project.anon_key}</span>{'\n'}
                        <span className="text-red-400">MATECITO_SERVICE_KEY</span><span className="text-[var(--fg-tertiary)]">={project.service_key}</span>
                    </pre>
                </div>
            </div>

            {/* ── AI & Claude Integration ─────────────────────────────────────── */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
                    <Bot className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <span className="text-sm font-bold text-[var(--fg-primary)]">AI & Claude Integration</span>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--accent)' }}>MCP</span>
                </div>
                <div className="p-5 space-y-5">
                    {/* MCP WebSocket URL */}
                    <div>
                        <p className="text-xs font-semibold mb-1.5 text-[var(--fg-secondary)]">MCP WebSocket URL</p>
                        <p className="text-xs text-[var(--fg-tertiary)] mb-2">Conectá Claude Code, Cursor u otro agente IA directamente a los datos de este proyecto.</p>
                        <div className="flex gap-2">
                            <input readOnly value={mcpWsUrl}
                                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--fg-secondary)] outline-none" />
                            <button onClick={() => copy(mcpWsUrl, 'URL copiada')}
                                className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all">
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Claude Code config */}
                    <div>
                        <p className="text-xs font-semibold mb-1.5 text-[var(--fg-secondary)]">Agregar a Claude Code</p>
                        <div className="flex items-center gap-2 p-3 rounded-xl border mb-2" style={{ backgroundColor: 'var(--warning-soft)', borderColor: 'var(--warning)' }}>
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--warning)' }} />
                            <p className="text-xs" style={{ color: 'var(--warning)' }}>Este config contiene tu service key. No lo commitees a repos públicos.</p>
                        </div>
                        <pre className="text-xs font-mono p-4 rounded-xl leading-relaxed overflow-x-auto mb-2"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
                            {mcpConfig}
                        </pre>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-[var(--fg-tertiary)]">Pegá esto en <code className="font-mono">.claude/settings.json</code> de tu proyecto o <code className="font-mono">~/.claude/settings.json</code> globalmente.</p>
                            <button onClick={() => copy(mcpConfig, 'MCP config copiado')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shrink-0 ml-3 hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: 'var(--accent)' }}>
                                <Copy className="w-3 h-3" /> Copiar config
                            </button>
                        </div>
                    </div>

                    {/* llms.txt */}
                    <div>
                        <p className="text-xs font-semibold mb-1.5 text-[var(--fg-secondary)]">llms.txt — Contexto para cualquier IA</p>
                        <p className="text-xs text-[var(--fg-tertiary)] mb-2">Agregá esta URL al contexto de Claude, GPT o Cursor para que entiendan el schema y la API de tu proyecto automáticamente.</p>
                        <div className="flex gap-2">
                            <input readOnly value={llmsUrl}
                                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-mono text-[var(--fg-secondary)] outline-none" />
                            <button onClick={() => copy(llmsUrl, 'URL copiada')}
                                className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all">
                                <Copy className="w-4 h-4" />
                            </button>
                            <a href={llmsUrl} target="_blank" rel="noopener noreferrer"
                                className="p-2.5 border border-[var(--border)] rounded-xl text-[var(--fg-tertiary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* CLAUDE.md snippet */}
                    <div>
                        <p className="text-xs font-semibold mb-1.5 text-[var(--fg-secondary)]">CLAUDE.md — contexto permanente en tu repo</p>
                        <p className="text-xs text-[var(--fg-tertiary)] mb-2">Pegá esto en <code className="font-mono text-[10px]">CLAUDE.md</code> en la raíz de tu proyecto para que Claude Code siempre conozca tu stack.</p>
                        <pre className="text-xs font-mono p-4 rounded-xl leading-relaxed overflow-x-auto mb-2"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)' }}>
                            {claudeMd}
                        </pre>
                        <div className="flex justify-end">
                            <button onClick={() => copy(claudeMd, 'CLAUDE.md copiado')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[var(--bg-secondary)] transition-colors"
                                style={{ color: 'var(--fg-secondary)', border: '1px solid var(--border)' }}>
                                <Copy className="w-3 h-3" /> Copiar CLAUDE.md
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick start (static) ─────────────────────────────────────────── */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--border)]">
                    <div className="flex gap-1">
                        {[{id:'js',label:'JavaScript'},{id:'rn',label:'React Native'},{id:'flutter',label:'Flutter'}].map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id as any)}
                                className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                    activeTab === t.id ? "bg-[var(--accent)] text-white" : "text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]")}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="bg-[var(--bg-tertiary)] p-6">
                    {activeTab === 'js' && (
                        <pre className="text-xs font-mono text-[var(--fg-tertiary)] leading-relaxed overflow-x-auto">{`import { createClient } from 'matecitodb'

const db = createClient(
  process.env.NEXT_PUBLIC_MATECITO_URL,
  { apiKey: process.env.NEXT_PUBLIC_MATECITO_ANON_KEY }
)

const { data } = await db.from('posts').get()`}</pre>
                    )}
                    {activeTab === 'rn' && (
                        <pre className="text-xs font-mono text-[var(--fg-tertiary)] leading-relaxed overflow-x-auto">{`import { createClient } from 'matecitodb-rn'

const db = createClient('${projectUrl}', {
  apiKey: '${project.anon_key}'
})

await db.auth.initialize()
const { data } = await db.from('posts').get()`}</pre>
                    )}
                    {activeTab === 'flutter' && (
                        <pre className="text-xs font-mono text-[var(--fg-tertiary)] leading-relaxed overflow-x-auto">{`import 'package:matecitodb_flutter/matecitodb.dart';

final db = MatecitoDB.createClient(
  '${projectUrl}',
  anonKey: '${project.anon_key}',
);

await db.auth.initialize();
final result = await db.from('posts').get();`}</pre>
                    )}
                </div>
            </div>

            {/* ── Interactive Quickstart ────────────────────────────────────────── */}
            <div className="bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--border)]">
                    <h3 className="font-bold text-[var(--fg-primary)]">Quickstart interactivo</h3>
                    <p className="text-xs text-[var(--fg-tertiary)] mt-0.5">Seleccioná los módulos que vas a usar — el código se genera automáticamente.</p>
                </div>

                {/* Presets */}
                <div className="px-4 pt-3 pb-2 border-b border-[var(--border)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-tertiary)] mb-2">Presets rápidos</p>
                    <div className="flex flex-wrap gap-1.5">
                        {PRESETS.map(p => (
                            <button key={p.label}
                                onClick={() => setSelectedModules(p.modules)}
                                className="text-[11px] px-2.5 py-1 rounded-lg border transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                                style={{ borderColor: 'var(--border)', color: 'var(--fg-secondary)', backgroundColor: 'var(--bg-tertiary)' }}>
                                {p.label}
                            </button>
                        ))}
                        {selectedModules.length > 0 && (
                            <button onClick={() => setSelectedModules([])}
                                className="text-[11px] px-2.5 py-1 rounded-lg border border-red-800/40 text-red-500 bg-red-950/20 transition-all hover:bg-red-900/30">
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* Module grid */}
                <div className="p-4 border-b border-[var(--border)]">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {MODULES.map(m => {
                            const active = selectedModules.includes(m.id)
                            return (
                                <button key={m.id} onClick={() => toggleModule(m.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all",
                                        active
                                            ? "text-white border-transparent"
                                            : "border-[var(--border)] hover:border-[var(--accent)] text-[var(--fg-secondary)]"
                                    )}
                                    style={active
                                        ? { backgroundColor: 'var(--accent)' }
                                        : { backgroundColor: 'var(--bg-secondary)' }}>
                                    <span className={active ? 'text-white' : 'text-[var(--fg-tertiary)]'}>{m.icon}</span>
                                    <span className="text-[10px] font-semibold leading-tight">{m.label}</span>
                                    {m.v2only && (
                                        <span className={cn("text-[8px] font-bold px-1 rounded", active ? "bg-white/20 text-white" : "bg-[var(--accent-soft)] text-[var(--accent)]")}>v2</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Code panel */}
                <div>
                    {/* Tabs + platform toggle */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="flex gap-1">
                            {(['install', 'init', 'snippet'] as const).map(t => (
                                <button key={t} onClick={() => setActiveModuleTab(t)}
                                    className={cn("px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                                        activeModuleTab === t ? "bg-[var(--accent)] text-white" : "text-[var(--fg-secondary)] hover:bg-[var(--bg-primary)]")}>
                                    {t === 'install' ? 'Instalar' : t === 'init' ? 'Inicializar' : 'Usar API'}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {(['js', 'flutter'] as const).map(p => (
                                <button key={p} onClick={() => setPlatformTab(p)}
                                    className={cn("px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
                                        platformTab === p ? "bg-[var(--accent)] text-white" : "text-[var(--fg-tertiary)] hover:bg-[var(--bg-primary)]")}>
                                    {p === 'js' ? 'JS / TS' : 'Flutter'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Code */}
                    <div className="relative">
                        <pre className="text-xs font-mono p-5 leading-relaxed overflow-x-auto"
                            style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-tertiary)', minHeight: '140px' }}>
                            {getQuickstartCode()}
                        </pre>
                        <button
                            onClick={() => copy(getQuickstartCode(), 'Código copiado')}
                            className="absolute top-3 right-3 p-1.5 rounded-lg border transition-colors hover:bg-[var(--bg-secondary)]"
                            style={{ borderColor: 'var(--border)', color: 'var(--fg-tertiary)' }}>
                            <Copy className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Selected modules summary */}
                    {activeMods.length > 0 && (
                        <div className="px-5 py-3 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-tertiary)]">Seleccionados:</span>
                            {activeMods.map(m => (
                                <span key={m.id}
                                    className="text-[11px] font-mono px-2 py-0.5 rounded-full border"
                                    style={{ borderColor: 'var(--border)', color: 'var(--accent)', backgroundColor: 'var(--accent-soft)' }}>
                                    db.{m.id}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
