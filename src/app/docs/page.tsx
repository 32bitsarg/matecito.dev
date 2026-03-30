"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Database, Users, HardDrive, Shield, Terminal,
    Radio, Package, Code2, Layers, GitMerge, Search,
    ChevronRight, Webhook, Mail, KeyRound,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Endpoint {
    method: string
    path: string
    auth: string
    desc: string
    query?: string
    body?: string
    response: string
    notes?: string
}

interface RestSection {
    id: string
    icon: React.ElementType
    color: string
    label: string
    desc?: string
    endpoints: Endpoint[]
}

interface SdkBlock {
    title?: string
    code: string
    note?: string
}

interface SdkSection {
    id: string
    icon: React.ElementType
    color: string
    label: string
    blocks: SdkBlock[]
}

// ─── REST data ────────────────────────────────────────────────────────────────

const REST_SECTIONS: RestSection[] = [
    {
        id: "autenticacion", icon: Users, color: "bg-blue-50 text-blue-600", label: "Autenticación",
        endpoints: [
            { method: "POST", path: "/auth/register", auth: "anon-key", desc: "Registro de usuario", response: `{ "user": { ... }, "access_token": "..." }` },
            { method: "POST", path: "/auth/login", auth: "anon-key", desc: "Login de usuario", response: `{ "user": { ... }, "access_token": "..." }` },
            { method: "POST", path: "/auth/logout", auth: "project-jwt", desc: "Cerrar sesión", response: `{ "ok": true }` },
            { method: "POST", path: "/auth/refresh", auth: "anon-key", desc: "Refrescar access token", response: `{ "access_token": "..." }` },
            { method: "GET", path: "/auth/me", auth: "project-jwt", desc: "Ver perfil del usuario", response: `{ "user": { ... } }` },
            { method: "PATCH", path: "/auth/me", auth: "project-jwt", desc: "Editar perfil del usuario", response: `{ "user": { ... } }` },
            { method: "POST", path: "/auth/request-reset", auth: "anon-key", desc: "Pedir reset de contraseña", response: `{ "message": "Email enviado" }` },
            { method: "POST", path: "/auth/reset-password", auth: "anon-key", desc: "Resetear contraseña", response: `{ "message": "Contraseña cambiada" }` },
            { method: "GET", path: "/auth/users", auth: "service-key", desc: "Listar usuarios del proyecto", response: `{ "users": [...], "total": 0 }` },
            { method: "DELETE", path: "/auth/users/:userId", auth: "service-key", desc: "Eliminar usuario", response: `{ "ok": true }` },
        ],
    },
    {
        id: "registros", icon: Database, color: "bg-violet-50 text-violet-600", label: "Registros",
        endpoints: [
            { method: "GET", path: "/records", auth: "jwt / service-key", desc: "Listar registros", query: "collection · filter · page · limit", response: `{ "records": [...] }` },
            { method: "POST", path: "/records", auth: "jwt / service-key", desc: "Crear registro", body: `{ "collection", "data" }`, response: `{ "record": { ... } }` },
            { method: "GET", path: "/records/:id", auth: "jwt / service-key", desc: "Ver detalle de registro", response: `{ "record": { ... } }` },
            { method: "PATCH", path: "/records/:id", auth: "jwt / service-key", desc: "Editar registro", response: `{ "record": { ... } }` },
            { method: "DELETE", path: "/records/:id", auth: "jwt / service-key", desc: "Borrar registro (soft-delete)", response: `{ "ok": true }` },
            { method: "GET", path: "/records/count", auth: "jwt / service-key", desc: "Contar registros de una colección", response: `{ "count": 0 }` },
            { method: "GET", path: "/records/export", auth: "jwt / service-key", desc: "Exportar registros (CSV/JSON)", response: "File download" },
            { method: "POST", path: "/records/upsert", auth: "jwt / service-key", desc: "Insertar o actualizar", response: `{ "record": { ... } }` },
            { method: "POST", path: "/records/:id/restore", auth: "jwt / service-key", desc: "Restaurar borrado suave", response: `{ "record": { ... } }` },
            { method: "DELETE", path: "/records/:id/hard", auth: "service-key", desc: "Borrado permanente", response: `{ "ok": true }` },
            { method: "POST", path: "/batch", auth: "jwt / service-key", desc: "Operaciones en bulk", response: `{ "results": [...] }` },
            { method: "POST", path: "/sql", auth: "service-key", desc: "Raw SQL query", response: `{ "rows": [...] }` },
        ],
    },
    {
        id: "colecciones", icon: Layers, color: "bg-emerald-50 text-emerald-600", label: "Colecciones",
        endpoints: [
            { method: "GET", path: "/collections", auth: "service-key", desc: "Listar colecciones", response: `{ "collections": [...] }` },
            { method: "POST", path: "/collections", auth: "service-key", desc: "Crear colección", response: `{ "collection": { ... } }` },
            { method: "DELETE", path: "/collections/:name", auth: "service-key", desc: "Eliminar colección", response: `{ "ok": true }` },
            { method: "PATCH", path: "/collections/:name", auth: "service-key", desc: "Renombrar colección", response: `{ "ok": true }` },
            { method: "GET", path: "/collections/:name/fields", auth: "service-key", desc: "Listar campos", response: `{ "fields": [...] }` },
            { method: "POST", path: "/collections/:name/fields", auth: "service-key", desc: "Añadir campo", response: `{ "field": { ... } }` },
            { method: "PATCH", path: "/collections/:name/fields/:fieldId", auth: "service-key", desc: "Editar campo", response: `{ "field": { ... } }` },
            { method: "DELETE", path: "/collections/:name/fields/:fieldId", auth: "service-key", desc: "Borrar campo", response: `{ "ok": true }` },
        ],
    },
    {
        id: "permisos", icon: Shield, color: "bg-rose-50 text-rose-600", label: "Permisos",
        endpoints: [
            { method: "GET", path: "/permissions/:collection", auth: "service-key", desc: "Ver permisos por colección", response: `{ "permissions": { ... } }` },
            { method: "PATCH", path: "/permissions/:collection", auth: "service-key", desc: "Editar permisos", response: `{ "ok": true }` },
        ],
    },
    {
        id: "smtp", icon: Mail, color: "bg-sky-50 text-sky-600", label: "SMTP & E-mails",
        endpoints: [
            { method: "GET", path: "/smtp", auth: "service-key", desc: "Ver configuración SMTP", response: `{ "smtp": { ... } }` },
            { method: "PATCH", path: "/smtp", auth: "service-key", desc: "Editar configuración SMTP", response: `{ "ok": true }` },
            { method: "PUT", path: "/smtp", auth: "service-key", desc: "Reemplazar configuración SMTP", response: `{ "ok": true }` },
            { method: "DELETE", path: "/smtp", auth: "service-key", desc: "Borrar configuración SMTP", response: `{ "ok": true }` },
            { method: "POST", path: "/smtp/test", auth: "service-key", desc: "Probar configuración SMTP", response: `{ "ok": true }` },
            { method: "GET", path: "/email-templates", auth: "service-key", desc: "Listar plantillas de email", response: `{ "templates": [...] }` },
            { method: "POST", path: "/email-templates", auth: "service-key", desc: "Crear plantilla", response: `{ "template": { ... } }` },
            { method: "GET", path: "/email-templates/:id", auth: "service-key", desc: "Ver detalle de plantilla", response: `{ "template": { ... } }` },
            { method: "PATCH", path: "/email-templates/:id", auth: "service-key", desc: "Editar plantilla", response: `{ "template": { ... } }` },
            { method: "DELETE", path: "/email-templates/:id", auth: "service-key", desc: "Borrar plantilla", response: `{ "ok": true }` },
            { method: "POST", path: "/email-templates/seed", auth: "service-key", desc: "Sembrar plantillas por defecto", response: `{ "ok": true }` },
        ],
    },
    {
        id: "storage", icon: HardDrive, color: "bg-teal-50 text-teal-600", label: "Storage",
        endpoints: [
            { method: "GET", path: "/storage", auth: "jwt / service-key", desc: "Listar archivos", response: `{ "files": [...] }` },
            { method: "HEAD", path: "/storage", auth: "jwt / service-key", desc: "Check de archivos", response: "Head response" },
            { method: "POST", path: "/storage/upload", auth: "jwt / service-key", desc: "Subir archivo", response: `{ "file": { ... } }` },
            { method: "POST", path: "/storage/upload-url", auth: "jwt / service-key", desc: "Subir desde URL externa", response: `{ "file": { ... } }` },
            { method: "DELETE", path: "/storage/:fileId", auth: "jwt / service-key", desc: "Eliminar archivo", response: `{ "ok": true }` },
        ],
    },
    {
        id: "realtime", icon: Radio, color: "bg-amber-50 text-amber-600", label: "Realtime",
        endpoints: [
            { method: "WS", path: "/ws", auth: "?key=anonKey o ?token=jwt", desc: "WebSocket para tiempo real", response: "WS connection" },
        ],
    },
    {
        id: "settings", icon: KeyRound, color: "bg-slate-50 text-slate-600", label: "Settings & Keys",
        endpoints: [
            { method: "GET", path: "/api-keys", auth: "service-key", desc: "Listar API keys personalizadas", response: `{ "keys": [...] }` },
            { method: "POST", path: "/api-keys", auth: "service-key", desc: "Crear API key", response: `{ "key": { ... } }` },
            { method: "DELETE", path: "/api-keys/:id", auth: "service-key", desc: "Revocar API key", response: `{ "ok": true }` },
            { method: "POST", path: "/regenerate-key", auth: "service-key", desc: "Regenerar Master Key", response: `{ "ok": true }` },
            { method: "GET", path: "/settings", auth: "service-key", desc: "Ver configuración del proyecto", response: `{ "settings": { ... } }` },
            { method: "PATCH", path: "/settings", auth: "service-key", desc: "Editar configuración", response: `{ "ok": true }` },
            { method: "GET", path: "/stats", auth: "service-key", desc: "Ver estadísticas", response: `{ "stats": { ... } }` },
            { method: "GET", path: "/logs", auth: "service-key", desc: "Ver logs de requests", response: `{ "logs": [...] }` },
            { method: "GET", path: "/webhooks", auth: "service-key", desc: "Listar webhooks", response: `{ "webhooks": [...] }` },
            { method: "POST", path: "/webhooks", auth: "service-key", desc: "Crear webhook", response: `{ "webhook": { ... } }` },
            { method: "PATCH", path: "/webhooks/:webhookId", auth: "service-key", desc: "Editar webhook", response: `{ "ok": true }` },
            { method: "DELETE", path: "/webhooks/:webhookId", auth: "service-key", desc: "Borrar webhook", response: `{ "ok": true }` },
        ],
    },
]

// ─── SDK data ─────────────────────────────────────────────────────────────────

const SDK_SECTIONS: SdkSection[] = [
    {
        id: "sdk-install", icon: Package, color: "bg-slate-100 text-slate-700", label: "Instalación",
        blocks: [
            { code: `npm install matecitodb@3.0.0`, note: "v3.0.0 — Migración completa a la nueva plataforma Matecito.dev. Ver changelog abajo." },
            { title: ".env.local", code: `MATECITODB_URL=https://api.matecito.dev\nMATECITODB_PROJECT_ID=tu-project-uuid\nNEXT_PUBLIC_MATECITODB_ANON_KEY=mk_anon_...\nMATECITODB_SERVICE_KEY=mk_service_...` },
            { title: "lib/db.ts", code: `import { createClient } from 'matecitodb'\nimport type { Database } from '@/matecito/database'\n\nexport const db = createClient<Database>(\n  process.env.MATECITODB_URL!,\n  {\n    projectId: process.env.MATECITODB_PROJECT_ID!,\n    anonKey:   process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY!,\n  }\n)`, note: "Generá el tipo Database con: npx matecitodb generate types" },

        ],
    },
    {
        id: "sdk-auth", icon: Users, color: "bg-blue-50 text-blue-600", label: "Autenticación",
        blocks: [
            { title: "Inicio de sesión y Registro", code: `// Login\nconst { data, error } = await db.auth.signIn({ email, password })\n\n// Registro\nawait db.auth.signUp({ email, password, name: 'Juan' })\n\n// Logout\nawait db.auth.signOut()` },
            { title: "Observar cambios de sesión", code: `const unsubscribe = db.auth.onAuthChange((user) => {\n  console.log(user ? 'Conectado' : 'Desconectado')\n})\n\n// Cerrar suscripción\nunsubscribe()` },
            { title: "Gestión Admin de Usuarios", code: `// Requiere serviceKey\nconst { data: users } = await db.auth.admin.listUsers({ limit: 10 })\nawait db.auth.admin.deleteUser(userId)`, note: "Operaciones administrativas accesibles vía db.auth.admin." },
            { title: "OAuth", code: `// Registro de providers\nawait db.auth.oauth.configure('google', { clientId, clientSecret })\n\n// Listar activos\nconst { data: providers } = await db.auth.oauth.listProviders()` },
        ],
    },
    {
        id: "sdk-queries", icon: Database, color: "bg-violet-50 text-violet-600", label: "Registros (CRUD)",
        blocks: [
            { title: "Lectura de Datos", code: `// Listar todos\nconst { data } = await db.from('posts').find()\n\n// Buscar uno con filtro\nconst { data } = await db.from('posts').eq('id', 'uuid').findOne()\n\n// Conteo\nconst { count } = await db.from('posts').eq('active', true).count()` },
            { title: "Escritura de Datos", code: `// Insertar\nawait db.from('posts').insert({ title: 'Hola' })\n\n// Actualizar parcial (merge)\nawait db.from('posts').eq('id', 'uuid').update({ title: 'Editado' })\n\n// Upsert\nawait db.from('posts').upsert({ id: 'uuid', title: 'Insert or Update' })` },
            { title: "Filtros y Paginación", code: `db.from('products')\n  .eq('status', 'active')\n  .gt('price', 100)\n  .latest()\n  .page(2)\n  .limit(10)\n  .find()` },
            { title: "Borrado Permanente vs Suave", code: `// Soft-delete (por defecto)\nawait db.from('posts').delete(id)\n\n// Restaurar\nawait db.from('posts').restore(id)\n\n// Hard-delete (permanente)\nawait db.from('posts').hardDelete(id)` },
        ],
    },
    {
        id: "sdk-realtime", icon: Radio, color: "bg-teal-50 text-teal-600", label: "Tiempo Real",
        blocks: [
            { title: "Suscripción a Colección", code: `const unsub = db.from('posts').subscribe((event) => {\n  console.log(event.action) // 'created' | 'updated' | 'deleted'\n  console.log(event.record)\n})\n\nunsub()` },
            { title: "Escuchar en Flutter/Dart", code: `db.from('posts').watch().listen((event) {\n  print(event.action);\n});` },
            { title: "Estado de Conexión", code: `db.realtime.onStatusChange((status) => {\n  console.log('Status:', status) // 'connected' | 'disconnected'\n})` },
        ],
    },
    {
        id: "sdk-storage", icon: HardDrive, color: "bg-emerald-50 text-emerald-600", label: "Almacenamiento",
        blocks: [
            { title: "Subida de Archivos", code: `// Web File object\nawait db.storage.upload(file, { path: 'avatars/1.png', public: true })\n\n// Desde URL (Backend)\nawait db.storage.uploadFromUrl('https://img.com/a.jpg', { path: 'img.jpg' })` },
            { title: "Gestión", code: `// Listar archivos\nconst { data: files } = await db.storage.list('dir/')\n\n// Obtener URL pública\nconst url = db.storage.getPublicUrl('path/to/file.png')\n\n// Eliminar\nawait db.storage.delete('path/to/file.png')` },
        ],
    },
    {
        id: "sdk-collections", icon: Layers, color: "bg-emerald-50 text-emerald-600", label: "Colecciones (Schema)",
        blocks: [
            { title: "Operaciones de Tabla", code: `// Listar\nconst { data } = await db.collections.list()\n\n// Crear\nawait db.collections.create('news', {\n  fields: [ { name: 'title', type: 'text', required: true } ]\n})` },
            { title: "Gestión de Campos", code: `// Añadir campo a colección existente\nawait db.collections.fields('posts').create({\n  name: 'author',\n  type: 'text'\n})` },
        ],
    },
    {
        id: "sdk-smtp", icon: Mail, color: "bg-sky-50 text-sky-600", label: "Email (SMTP)",
        blocks: [
            { title: "Configuración", code: `await db.smtp.set({\n  host: 'smtp.gmail.com', port: 587,\n  user: 'user@email.com', pass: '***',\n  from_name: 'Matecito', from_email: 'noreply@matecito.dev'\n})` },
            { title: "Plantillas", code: `// Sembrar plantillas de sistema\nawait db.emailTemplates.seed()\n\n// Crear plantilla personalizada\nawait db.emailTemplates.create({\n  name: 'promo', subject: 'Aprovecha!', \n  html_body: '<h1>Hola {{name}}</h1>'\n})` },
        ],
    },
    {
        id: "sdk-permissions", icon: Shield, color: "bg-amber-50 text-amber-600", label: "Permisos (RLS)",
        blocks: [
            { code: `// Ver permisos\nconst { data } = await db.permissions.get('posts')\n\n// Configurar niveles\nawait db.permissions.set('posts', {\n  list: 'public', get: 'public', create: 'auth',\n  update: 'auth', delete: 'service'\n})`, note: "Niveles disponibles: public, auth, service, nobody." },
        ],
    },
    {
        id: "sdk-stats", icon: Terminal, color: "bg-slate-50 text-slate-600", label: "Estadísticas y Logs",
        blocks: [
            { title: "Estadísticas", code: `const { data: stats } = await db.stats.get()\nconsole.log(stats.total_records, stats.storage_used_mb)` },
            { title: "Logs de Actividad", code: `// Listar logs de requests (Admin)\nconst { data: logs } = await db.logs.list({ limit: 50, status: 500 })` },
        ],
    },
    {
        id: "sdk-webhooks", icon: Webhook, color: "bg-violet-50 text-violet-600", label: "Webhooks",
        blocks: [
            { title: "CRUD de webhooks", code: `// Usar desde backend con serviceKey\nconst hooks = await db.from('_webhooks').get() // no recomendado\n\n// O con el service key directo via fetch:\n// GET  /webhooks\n// POST /webhooks   { url, collection, event, secret? }\n// PATCH /webhooks/:id  { enabled: false }\n// DELETE /webhooks/:id`, note: "Los webhooks se gestionan desde el Dashboard (Proyecto → Webhooks) o via REST API con service-key." },
            { title: "Verificar firma en tu endpoint", code: `import { createHmac } from 'crypto'\n\nexport function verifyWebhook(body: string, signature: string, secret: string): boolean {\n  const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex')\n  return expected === signature\n}\n\n// En tu handler:\nconst sig  = req.headers['x-matecito-signature'] as string\nconst body = await req.text()\nif (!verifyWebhook(body, sig, process.env.WEBHOOK_SECRET!)) {\n  return new Response('Forbidden', { status: 403 })\n}\nconst { event, collection, record } = JSON.parse(body)`, note: "Formato del payload: { event, collection, record, timestamp }. El header X-Matecito-Signature contiene sha256=HMAC(secret, body)." },
        ],
    },
    {
        id: "sdk-cli", icon: Code2, color: "bg-slate-100 text-slate-700", label: "Línea de Comandos (CLI)",
        blocks: [
            { code: `# Configurar .env.local con las credenciales\nnpx matecitodb init\n\n# Tipos TypeScript desde el schema del proyecto\nnpx matecitodb generate types\n\n# Scaffold auth completo (Next.js App Router)\nnpx matecitodb generate auth\n\n# Hook React con CRUD + realtime para una colección\nnpx matecitodb generate hook posts\n# → hooks/usePosts.ts  (usePosts, usePost, usePostMutations)\n\n# DbProvider + useDb() + useUser()\nnpx matecitodb generate context\n# → components/DbProvider.tsx\n\n# Páginas Next.js list / detail / new\nnpx matecitodb generate page posts\n# → app/posts/page.tsx\n# → app/posts/[id]/page.tsx\n# → app/posts/new/page.tsx` },
        ],
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-700",
    POST: "bg-blue-100 text-blue-700",
    PATCH: "bg-amber-100 text-amber-700",
    DELETE: "bg-red-100 text-red-700",
    WS: "bg-teal-100 text-teal-700",
}

const AUTH_LABELS: Record<string, string> = {
    "anon-key": "Anon Key",
    "project-jwt": "Project JWT",
    "service-key": "Service Key",
    "jwt / service-key": "JWT · Service Key",
    "?key=anonKey o ?token=jwt": "API Key / JWT",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EndpointCard({ ep }: { ep: Endpoint }) {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-start gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
                <span className={`shrink-0 px-2 py-0.5 rounded-md text-xs font-bold font-mono ${METHOD_COLORS[ep.method] ?? 'bg-slate-100 text-slate-600'}`}>
                    {ep.method}
                </span>
                <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono text-slate-800 font-semibold">{ep.path}</code>
                    <p className="text-xs text-slate-500 mt-0.5">{ep.desc}</p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500 whitespace-nowrap">
                    {AUTH_LABELS[ep.auth] ?? ep.auth}
                </span>
            </div>
            <div className="px-4 py-3 space-y-2.5">
                {'query' in ep && (
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Query params</p>
                        <code className="text-xs text-slate-600 font-mono">{ep.query}</code>
                    </div>
                )}
                {'body' in ep && (
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Body</p>
                        <pre className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 overflow-x-auto">{ep.body}</pre>
                    </div>
                )}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Respuesta</p>
                    <pre className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-3 overflow-x-auto">{ep.response}</pre>
                </div>
                {'notes' in ep && (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">⚠ {ep.notes}</p>
                )}
            </div>
        </div>
    )
}

function CodeBlock({ code, title, note }: SdkBlock) {
    return (
        <div className="space-y-2">
            {title && <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</p>}
            <pre className="text-xs font-mono bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre">
                <code>{code}</code>
            </pre>
            {note && (
                <p className="text-xs text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">{note}</p>
            )}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "sdk" | "rest"

export default function DocsPage() {
    const [tab, setTab] = useState<Tab>("sdk")
    const [activeSdk, setActiveSdk] = useState(SDK_SECTIONS[0].id)
    const [activeRest, setActiveRest] = useState(REST_SECTIONS[0].id)

    const currentSdkSection = SDK_SECTIONS.find(s => s.id === activeSdk)!
    const currentRestSection = REST_SECTIONS.find(s => s.id === activeRest)!

    return (
        <div className="min-h-screen bg-white flex flex-col">

            {/* Top bar */}
            <div className="border-b border-slate-200 bg-white sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-sm">matecitodb</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-sm text-slate-500">Documentación</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setTab("sdk")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "sdk" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Layers className="w-3.5 h-3.5" /> SDK
                        </button>
                        <button
                            onClick={() => setTab("rest")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "rest" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Search className="w-3.5 h-3.5" /> REST API
                        </button>
                    </div>
                </div>
            </div>

            {/* Body: sidebar + content, no scroll on outer container */}
            <div className="flex-1 flex max-w-6xl mx-auto w-full overflow-hidden" style={{ height: 'calc(100vh - 3.5rem)' }}>

                {/* Sidebar */}
                <aside className="w-52 shrink-0 border-r border-slate-100 overflow-y-auto py-6 px-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
                        {tab === "sdk" ? "SDK" : "Endpoints"}
                    </p>

                    {tab === "sdk" && SDK_SECTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSdk(s.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${activeSdk === s.id
                                    ? "bg-violet-50 text-violet-700 font-semibold"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                        >
                            <s.icon className="w-3.5 h-3.5 shrink-0" />
                            {s.label}
                            {activeSdk === s.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </button>
                    ))}

                    {tab === "rest" && REST_SECTIONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveRest(s.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${activeRest === s.id
                                    ? "bg-violet-50 text-violet-700 font-semibold"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                        >
                            <s.icon className="w-3.5 h-3.5 shrink-0" />
                            {s.label}
                            {activeRest === s.id && <ChevronRight className="w-3 h-3 ml-auto" />}
                        </button>
                    ))}
                </aside>

                {/* Content panel — only this scrolls */}
                <main className="flex-1 overflow-y-auto px-8 py-8">

                    {/* SDK panel */}
                    {tab === "sdk" && (
                        <div className="max-w-2xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentSdkSection.color}`}>
                                    <currentSdkSection.icon className="w-4 h-4" />
                                </div>
                                <h1 className="text-xl font-bold text-slate-900">{currentSdkSection.label}</h1>
                            </div>
                            {currentSdkSection.blocks.map((block, i) => (
                                <CodeBlock key={i} {...block} />
                            ))}
                        </div>
                    )}

                    {/* REST panel */}
                    {tab === "rest" && (
                        <div className="max-w-2xl space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentRestSection.color}`}>
                                    <currentRestSection.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">{currentRestSection.label}</h1>
                                    {currentRestSection.desc && (
                                        <p className="text-xs text-slate-500 mt-0.5">{currentRestSection.desc}</p>
                                    )}
                                </div>
                            </div>

                            {/* Auth keys reminder — only on auth section */}
                            {currentRestSection.id === "autenticacion" && (
                                <div className="grid grid-cols-3 gap-3 mb-2">
                                    {[
                                        { label: "Anon Key", header: "x-matecito-key: mk_anon_...", desc: "Apps cliente. Seguro exponerlo." },
                                        { label: "Service Key", header: "x-matecito-key: mk_service_...", desc: "Solo backend. Acceso total." },
                                        { label: "Project JWT", header: "Authorization: Bearer <token>", desc: "Usuario autenticado." },
                                    ].map(a => (
                                        <div key={a.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                                            <p className="text-xs font-bold text-slate-700">{a.label}</p>
                                            <code className="block text-[10px] font-mono text-violet-700 bg-violet-50 rounded px-1.5 py-1 break-all">{a.header}</code>
                                            <p className="text-[10px] text-slate-500">{a.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentRestSection.endpoints.map((ep, i) => (
                                <EndpointCard key={i} ep={ep} />
                            ))}

                            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 space-y-1">
                                <p className="text-xs font-semibold text-slate-700">URL base</p>
                                <code className="block text-xs font-mono text-violet-700">https://&#123;subdomain&#125;.matecito.dev</code>
                                <p className="text-xs text-slate-500">
                                    Encontralo en{" "}
                                    <Link href="/dashboard" className="text-violet-600 underline underline-offset-2">Dashboard</Link>
                                    {" "}→ Conexión & Keys.
                                </p>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    )
}
