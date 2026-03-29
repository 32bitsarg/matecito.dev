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
            { method: "POST", path: "/auth/register", auth: "anon-key", desc: "Crear una cuenta de usuario nueva. Si el proyecto tiene SMTP configurado, envía email de bienvenida.", body: `{ "email": "string", "password": "string (mín. 6 chars)", "name": "string (opcional)", "login_url": "string (opcional — link en el email de bienvenida)" }`, response: `{ "access_token": "...", "refresh_token": "...", "expires_in": 3600, "user": { ... } }`, notes: "Rate limit: 10 req/minuto." },
            { method: "POST", path: "/auth/login",    auth: "anon-key", desc: "Iniciar sesión con email y contraseña.", body: `{ "email": "string", "password": "string" }`, response: `{ "access_token": "...", "refresh_token": "...", "expires_in": 3600, "user": { ... } }` },
            { method: "POST", path: "/auth/refresh",  auth: "anon-key", desc: "Renovar el access token con un refresh token.", body: `{ "refresh_token": "string" }`, response: `{ "access_token": "...", "refresh_token": "...", "expires_in": 3600 }` },
            { method: "GET",  path: "/auth/me",       auth: "project-jwt", desc: "Obtener el perfil del usuario autenticado.", response: `{ "user": { "id", "email", "name", "username", "avatar_url", "created_at" } }` },
            { method: "PATCH",path: "/auth/me",       auth: "project-jwt", desc: "Actualizar nombre o username.", body: `{ "name": "string (opcional)", "username": "string (opcional)" }`, response: `{ "user": { ... } }` },
            { method: "POST", path: "/auth/logout",   auth: "project-jwt", desc: "Revocar el refresh token activo.", body: `{ "refresh_token": "string (opcional)" }`, response: `{ "ok": true }` },
            { method: "POST", path: "/auth/request-reset", auth: "anon-key", desc: "Solicitar token de recuperación (válido 1 hora). Si hay SMTP configurado, envía el email automáticamente. Siempre retorna 200.", body: `{ "email": "string", "reset_url_base": "string (opcional — URL de tu app, ej: https://miapp.com/reset)" }`, response: `{ "message": "string", "token": "string (solo dev, si no hay SMTP)" }`, notes: "Rate limit: 5 req / 15 minutos." },
            { method: "POST", path: "/auth/reset-password", auth: "anon-key", desc: "Resetear contraseña. Revoca todas las sesiones.", body: `{ "token": "string", "password": "string (mín. 8 chars)" }`, response: `{ "message": "string" }` },
        ],
    },
    {
        id: "registros", icon: Database, color: "bg-violet-50 text-violet-600", label: "Registros",
        endpoints: [
            { method: "GET",    path: "/records",            auth: "jwt / service-key", desc: "Listar registros con filtros avanzados y paginación. Soporta soft-delete.", query: "collection · filter=campo:valor (ops: != > >= < <= ~) · search=texto · page=1 · limit=50 (máx 200) · sort · order · include_deleted=true", response: `{ "records": [...], "pagination": { "page", "limit", "total", "pages" } }` },
            { method: "GET",    path: "/records/export",     auth: "jwt / service-key", desc: "Exportar todos los registros de una colección en CSV o JSON.", query: "collection (requerido) · format=csv|json", response: `Archivo descargable (Content-Disposition: attachment)` },
            { method: "GET",    path: "/records/:id",        auth: "jwt / service-key", desc: "Obtener un registro por ID.", response: `{ "record": { "id", "collection", "data": {...}, "created_at", "updated_at", "deleted_at" } }` },
            { method: "POST",   path: "/records",            auth: "jwt / service-key", desc: "Crear un nuevo registro.", body: `{ "collection": "string", "data": { ... } }`, response: `{ "record": { ... } }  → 201` },
            { method: "PATCH",  path: "/records/:id",        auth: "jwt / service-key", desc: "Actualizar. Con merge:true hace JSONB merge (actualización parcial).", body: `{ "data": { ... }, "merge": false }`, response: `{ "record": { ... } }` },
            { method: "DELETE", path: "/records/:id",        auth: "jwt / service-key", desc: "Eliminar registro. Si la colección tiene soft_delete activado, marca deleted_at en vez de borrar.", response: `{ "ok": true }` },
            { method: "POST",   path: "/records/:id/restore",auth: "jwt / service-key", desc: "Restaurar un registro soft-deleted (limpia deleted_at).", response: `{ "record": { ... } }` },
            { method: "DELETE", path: "/records/:id/hard",   auth: "service-key",        desc: "Eliminación definitiva de un registro, incluso si tiene soft_delete activo.", response: `{ "ok": true }` },
            { method: "POST",   path: "/batch",              auth: "jwt / service-key", desc: "Hasta 50 operaciones en una sola transacción PostgreSQL. ROLLBACK automático si falla alguna. RLS aplicado por operación.", body: `{ "operations": [\n  { "op": "insert", "collection": "posts", "data": {...} },\n  { "op": "update", "id": "uuid", "data": {...}, "merge": true },\n  { "op": "delete", "id": "uuid" }\n] }`, response: `{ "results": [{ "ok": true, "record": {...} }, ...] }`, notes: "Rate limit: 30 req/minuto." },
        ],
    },
    {
        id: "storage", icon: HardDrive, color: "bg-emerald-50 text-emerald-600", label: "Storage",
        endpoints: [
            { method: "GET",    path: "/storage",            auth: "jwt / service-key", desc: "Listar todos los archivos del proyecto.", response: `{ "files": [{ "id", "url", "mime", "size", "width", "height", "created_at" }] }` },
            { method: "POST",   path: "/storage/upload",     auth: "jwt / service-key", desc: "Subir imagen. Se convierte a WebP y se redimensiona a máx 1600px.", body: `multipart/form-data  →  campo "file"  (image/*)  · máx 10 MB`, response: `{ "file": { "id", "url", ... } }  → 201` },
            { method: "POST",   path: "/storage/upload-url", auth: "jwt / service-key", desc: "Importar imagen desde URL remota. El servidor descarga, convierte y almacena.", body: `{ "url": "https://example.com/photo.jpg", "filename": "opcional" }`, response: `{ "file": { "id", "url", ... } }  → 201`, notes: "Rate limit: 20 req/minuto." },
            { method: "DELETE", path: "/storage/:fileId",    auth: "jwt / service-key", desc: "Eliminar archivo y copia en disco.", response: `{ "ok": true }` },
        ],
    },
    {
        id: "permisos", icon: Shield, color: "bg-rose-50 text-rose-600", label: "Permisos",
        desc: "Niveles: public · auth · service · nobody",
        endpoints: [
            { method: "GET",   path: "/permissions",              auth: "service-key", desc: "Todos los permisos del proyecto por colección.", response: `{ "permissions": { "posts": { "list": "public", "create": "auth", ... } } }` },
            { method: "GET",   path: "/permissions/:collection",  auth: "service-key", desc: "Permisos de una colección específica.", response: `{ "collection": "string", "permissions": { "list", "get", "create", "update", "delete" } }` },
            { method: "PATCH", path: "/permissions/:collection",  auth: "service-key", desc: "Actualizar permisos.", body: `{ "permissions": { "list": "public", "create": "auth", "delete": "service" } }`, response: `{ "message": "string" }` },
        ],
    },
    {
        id: "realtime", icon: Radio, color: "bg-teal-50 text-teal-600", label: "Realtime",
        endpoints: [
            { method: "WS", path: "/ws", auth: "?key=anonKey o ?token=jwt", desc: "Canal de eventos en tiempo real. Soporta suscripción por colección.", body: `// Suscribirse\n{ "type": "subscribe", "collection": "posts" }\n\n// Cancelar\n{ "type": "unsubscribe" }\n\n// Keepalive\n{ "type": "ping" }`, response: `{ "type": "record.created", "collection": "posts", "record": {...} }\n{ "type": "record.updated", "collection": "posts", "record": {...} }\n{ "type": "record.deleted", "collection": "posts", "recordId": "uuid" }` },
        ],
    },
    {
        id: "webhooks", icon: Webhook, color: "bg-violet-50 text-violet-600", label: "Webhooks",
        desc: "Notificaciones HTTP cuando cambian tus datos",
        endpoints: [
            { method: "GET",    path: "/webhooks",       auth: "service-key", desc: "Listar todos los webhooks del proyecto.", response: `{ "webhooks": [{ "id", "url", "collection", "event", "enabled", "secret" (bool) }] }` },
            { method: "POST",   path: "/webhooks",       auth: "service-key", desc: "Crear un webhook.", body: `{ "url": "string (requerido)", "collection": "* | nombre", "event": "* | record.created | record.updated | record.deleted", "secret": "string (opcional)" }`, response: `{ "webhook": { ... } }  → 201`, notes: "El secret se devuelve solo en la creación. Usá HMAC-SHA256 para verificar la firma en el header X-Matecito-Signature." },
            { method: "PATCH",  path: "/webhooks/:id",   auth: "service-key", desc: "Actualizar un webhook (ej: activar/desactivar).", body: `{ "url": "string (opcional)", "enabled": boolean, "event": "string", "collection": "string" }`, response: `{ "webhook": { ... } }` },
            { method: "DELETE", path: "/webhooks/:id",   auth: "service-key", desc: "Eliminar un webhook.", response: `{ "ok": true }` },
        ],
    },
    {
        id: "smtp", icon: Mail, color: "bg-sky-50 text-sky-600", label: "SMTP & Emails",
        desc: "Configura tu propio proveedor de email por proyecto",
        endpoints: [
            { method: "GET",    path: "/smtp",                    auth: "service-key", desc: "Obtener la configuración SMTP del proyecto. El password se devuelve enmascarado.", response: `{ "smtp": { "host", "port", "secure", "user", "password": "***", "from_name", "from_email" } | null }` },
            { method: "PUT",    path: "/smtp",                    auth: "service-key", desc: "Guardar o reemplazar la configuración SMTP. Enviá '***' en password para conservar el existente.", body: `{ "host": "string", "port": 587, "secure": false, "user": "string", "password": "string", "from_name": "string", "from_email": "string" }`, response: `{ "ok": true }` },
            { method: "DELETE", path: "/smtp",                    auth: "service-key", desc: "Eliminar la configuración SMTP del proyecto.", response: `{ "ok": true }` },
            { method: "POST",   path: "/smtp/test",               auth: "service-key", desc: "Enviar un email de prueba con la configuración guardada.", body: `{ "to": "destinatario@email.com" }`, response: `{ "ok": true }` },
            { method: "GET",    path: "/email-templates",         auth: "service-key", desc: "Listar todos los templates del proyecto.", response: `{ "templates": [{ "id", "name", "subject", "variables", "is_system" }] }` },
            { method: "GET",    path: "/email-templates/:id",     auth: "service-key", desc: "Obtener un template con su HTML y texto plano.", response: `{ "template": { "id", "name", "subject", "html_body", "text_body", "variables" } }` },
            { method: "POST",   path: "/email-templates",         auth: "service-key", desc: "Crear un template personalizado. Las variables se detectan automáticamente del HTML ({{variable}}).", body: `{ "name": "string", "subject": "string", "html_body": "string", "text_body": "string (opcional)" }`, response: `{ "template": { ... } }  → 201` },
            { method: "PATCH",  path: "/email-templates/:id",     auth: "service-key", desc: "Actualizar un template.", body: `{ "subject": "string (opcional)", "html_body": "string (opcional)", "text_body": "string (opcional)" }`, response: `{ "template": { ... } }` },
            { method: "DELETE", path: "/email-templates/:id",     auth: "service-key", desc: "Eliminar un template. Los templates de sistema (welcome, reset-password) no se pueden eliminar.", response: `{ "ok": true }` },
            { method: "POST",   path: "/email-templates/seed",    auth: "service-key", desc: "Insertar los templates de sistema predeterminados (welcome, reset-password) si no existen.", response: `{ "seeded": ["welcome", "reset-password"] }` },
        ],
    },
    {
        id: "logs", icon: Terminal, color: "bg-amber-50 text-amber-600", label: "Logs & Stats",
        endpoints: [
            { method: "GET", path: "/logs",  auth: "service-key", desc: "Logs de requests con filtro por status.", query: "page=1 · limit=100 (máx 200) · status=200|2xx|4xx|5xx", response: `{ "logs": [{ "method", "path", "status_code", "duration_ms", "ip", "created_at" }], "total" }` },
            { method: "GET", path: "/stats", auth: "service-key", desc: "Estadísticas generales del proyecto.", response: `{ "users_count", "collections_count", "records_count", "db_size" }` },
        ],
    },
]

// ─── SDK data ─────────────────────────────────────────────────────────────────

const SDK_SECTIONS: SdkSection[] = [
    {
        id: "sdk-install", icon: Package, color: "bg-slate-100 text-slate-700", label: "Instalación",
        blocks: [
            { code: `npm install matecitodb@2.1.1`, note: "v2.1.1 — Corrección de bugs en RLS, retry del cliente y useRealtime. Ver changelog abajo." },
            { title: ".env.local", code: `MATECITODB_URL=https://api.matecito.dev\nMATECITODB_PROJECT_ID=tu-project-uuid\nNEXT_PUBLIC_MATECITODB_ANON_KEY=mk_anon_...\nMATECITODB_SERVICE_KEY=mk_service_...` },
            { title: "lib/db.ts", code: `import { createClient } from 'matecitodb'\nimport type { Database } from '@/matecito/database'\n\nexport const db = createClient<Database>(\n  process.env.MATECITODB_URL!,\n  {\n    projectId: process.env.MATECITODB_PROJECT_ID!,\n    anonKey:   process.env.NEXT_PUBLIC_MATECITODB_ANON_KEY!,\n  }\n)`, note: "Generá el tipo Database con: npx matecitodb generate types" },
            { title: "Changelog v2.1.1", code: `// Bug fixes\n// ✔ RLS: índices de parámetros $? ahora son correctos en list, get, update, delete y batch\n// ✔ batch: UPDATE/DELETE ahora aplican RLS correctamente (antes se saltaban los filtros)\n// ✔ retry: con attempts:3 ahora ejecuta 3 reintentos reales (era 2 por off-by-one)\n// ✔ useRealtime: onEvent siempre usa la versión más reciente del callback (era stale ref)` },
        ],
    },
    {
        id: "sdk-auth", icon: Users, color: "bg-blue-50 text-blue-600", label: "Autenticación",
        blocks: [
            { title: "Registro, login y logout", code: `const { data, error } = await db.auth.signUp(email, password, { name })\nconst { data, error } = await db.auth.signIn(email, password)\nawait db.auth.signOut()\n\ndb.auth.user        // AuthUser | null\ndb.auth.isLoggedIn  // boolean` },
            { title: "Auth reactiva", code: `// Escuchar cambios de sesión\nconst unsub = db.auth.onAuthChange(user => {\n  console.log(user ? \`Hola \${user.email}\` : 'Sesión cerrada')\n})\n\n// Revalidar sesión desde el servidor\nconst { data: user } = await db.auth.getMe()\n\n// Actualizar perfil\nawait db.auth.updateProfile({ name: 'Juan' })` },
            { title: "Recuperación de contraseña", code: `// Solicitar email de recuperación\nawait db.auth.requestPasswordReset(\n  'usuario@ejemplo.com',\n  'https://miapp.com/reset-password'  // opcional\n)\n\n// Completar el reset con el token recibido\nconst token = new URLSearchParams(window.location.search).get('token')\nawait db.auth.resetPassword(token!, 'nuevaContraseña123')`, note: "Si el proyecto tiene SMTP configurado, el email se envía automáticamente con el link de reset." },
            { title: "OAuth (Google / GitHub)", code: `// Redirigir al proveedor\nconst url = db.auth.getOAuthUrl('google', 'https://miapp.com/auth/callback')\nwindow.location.href = url\n\n// En la página /auth/callback — leer tokens de la URL\nconst { data, error } = await db.auth.handleOAuthCallback()\nif (!error) router.push('/dashboard')`, note: "Configurá el Client ID y Secret en Dashboard → Usuarios → Providers OAuth." },
            { title: "Server-side (Next.js SSR)", code: `// En server actions o route handlers\ndb.auth.setSession({\n  access_token:  session.token,\n  refresh_token: session.refreshToken,\n  user:          session.user,\n})`, note: "Scaffold completo: npx matecitodb generate auth" },
        ],
    },
    {
        id: "sdk-queries", icon: Database, color: "bg-violet-50 text-violet-600", label: "Queries",
        blocks: [
            { title: "CRUD", code: `// Listar\nconst { data: posts } = await db.from('posts').latest().limit(20).get()\n\n// Uno\nconst { data: post } = await db.from('posts').getOne(id)\n\n// Crear\nconst { data, error } = await db.from('posts').insert({ title, body })\n\n// Actualizar (reemplaza todo)\nawait db.from('posts').update(id, { ...post, title: 'Nuevo' })\n\n// Actualización parcial (merge)\nawait db.from('posts').merge(id, { title: 'Nuevo' })\n\n// Eliminar\nawait db.from('posts').delete(id)` },
            { title: "Filtros", code: `db.from('products')\n  .eq('status', 'active')   // =\n  .neq('stock', 0)          // !=\n  .gt('price', 100)         // >\n  .gte('rating', 4)         // >=\n  .lt('age', 30)            // <\n  .lte('discount', 50)      // <=\n  .like('name', 'mate')     // ILIKE %mate%\n  .get()` },
            { title: "Búsqueda, conteo y paginación", code: `// Búsqueda full-text en todos los campos\nawait db.from('articles').search('backend argentino').get()\n\n// Conteo sin bajar datos\nconst total = await db.from('posts').eq('status', 'draft').count()\n\n// Paginación\nconst { data, total, pages } = await db.from('posts')\n  .latest().page(2).limit(10).get()\n\n// Iterar todas las páginas (seguro en datasets grandes)\nfor await (const batch of db.from('logs').paginate({ batchSize: 100 })) {\n  await processBatch(batch)\n}` },
            { title: "Exportar", code: `const csvBlob  = await db.from('orders').export('csv')\nconst jsonBlob = await db.from('users').export('json')\n\n// Descarga directa en browser\nconst url = URL.createObjectURL(csvBlob)\n// El export itera todas las páginas automáticamente` },
        ],
    },
    {
        id: "sdk-realtime", icon: Radio, color: "bg-teal-50 text-teal-600", label: "Realtime",
        blocks: [
            { title: "Callback", code: `const unsub = db.from('messages').subscribe(event => {\n  if (event.type === 'record.created') addMessage(event.record)\n  if (event.type === 'record.updated') updateMessage(event.record)\n  if (event.type === 'record.deleted') removeMessage(event.recordId)\n})\n\nunsub() // desuscribirse` },
            { title: "AsyncIterator (for-await)", code: `for await (const event of db.from('orders').watch()) {\n  console.log(event.type, event.record)\n  // WS se cierra automáticamente al salir del loop\n}` },
            { title: "React hook generado", code: `// npx matecitodb generate hook posts\nconst { records, loading } = usePosts()\n// Lista en tiempo real: escucha created/updated/deleted`, note: "El hook generado maneja suscripción, limpieza y estado de carga." },
        ],
    },
    {
        id: "sdk-storage", icon: HardDrive, color: "bg-emerald-50 text-emerald-600", label: "Storage",
        blocks: [
            { code: `// Subir desde browser\nconst { data: file } = await db.storage.upload(imageFile)\nawait db.from('posts').merge(postId, { cover_url: file.url })\n\n// Importar desde URL\nconst { data: avatar } = await db.storage.uploadFromUrl(\n  'https://avatars.githubusercontent.com/u/12345'\n)\n\n// Listar\nconst { data: files } = await db.storage.list()\n\n// Eliminar\nawait db.storage.delete(fileId)`, note: "Imágenes se convierten a WebP y se redimensionan a máx 1600px automáticamente." },
        ],
    },
    {
        id: "sdk-batch", icon: GitMerge, color: "bg-rose-50 text-rose-600", label: "Batch",
        blocks: [
            { code: `const { results } = await db.batch()\n  .insert('posts', { title: 'Hola mundo', status: 'draft' })\n  .insert('tags',  { name: 'lanzamiento' })\n  .update(postId,  { status: 'published' })\n  .merge(profileId, { posts_count: 42 })\n  .delete(oldDraftId)\n  .execute()\n\n// results[0].ok · results[0].record\n// Si cualquier op falla → ROLLBACK automático`, note: "Máx 50 operaciones por batch. Rate limit: 30 req/min." },
        ],
    },
    {
        id: "sdk-permissions", icon: Shield, color: "bg-amber-50 text-amber-600", label: "Permisos",
        blocks: [
            { code: `const { data } = await db.permissions.get('posts')\n// { list: 'public', get: 'public', create: 'auth', ... }\n\nawait db.permissions.set('posts', {\n  list:   'public',\n  get:    'public',\n  create: 'auth',\n  update: 'auth',\n  delete: 'service',\n})\n\n// Poner todas las ops al mismo nivel\nawait db.permissions.setAll('drafts', 'service')`, note: "Niveles: public · auth · service · nobody" },
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
        id: "sdk-cli", icon: Code2, color: "bg-slate-100 text-slate-700", label: "CLI",
        blocks: [
            { code: `# Configurar .env.local con las credenciales\nnpx matecitodb init\n\n# Tipos TypeScript desde el schema del proyecto\nnpx matecitodb generate types\n\n# Scaffold auth completo (Next.js App Router)\nnpx matecitodb generate auth\n\n# Hook React con CRUD + realtime para una colección\nnpx matecitodb generate hook posts\n# → hooks/usePosts.ts  (usePosts, usePost, usePostMutations)\n\n# DbProvider + useDb() + useUser()\nnpx matecitodb generate context\n# → components/DbProvider.tsx\n\n# Páginas Next.js list / detail / new\nnpx matecitodb generate page posts\n# → app/posts/page.tsx\n# → app/posts/[id]/page.tsx\n# → app/posts/new/page.tsx` },
        ],
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const METHOD_COLORS: Record<string, string> = {
    GET:    "bg-emerald-100 text-emerald-700",
    POST:   "bg-blue-100 text-blue-700",
    PATCH:  "bg-amber-100 text-amber-700",
    DELETE: "bg-red-100 text-red-700",
    WS:     "bg-teal-100 text-teal-700",
}

const AUTH_LABELS: Record<string, string> = {
    "anon-key":              "Anon Key",
    "project-jwt":           "Project JWT",
    "service-key":           "Service Key",
    "jwt / service-key":     "JWT · Service Key",
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
    const [tab, setTab]                   = useState<Tab>("sdk")
    const [activeSdk, setActiveSdk]       = useState(SDK_SECTIONS[0].id)
    const [activeRest, setActiveRest]     = useState(REST_SECTIONS[0].id)

    const currentSdkSection  = SDK_SECTIONS.find(s => s.id === activeSdk)!
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                tab === "sdk" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" /> SDK
                        </button>
                        <button
                            onClick={() => setTab("rest")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                                tab === "rest" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                                activeSdk === s.id
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
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                                activeRest === s.id
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
                                        { label: "Anon Key",    header: "x-matecito-key: mk_anon_...",   desc: "Apps cliente. Seguro exponerlo." },
                                        { label: "Service Key", header: "x-matecito-key: mk_service_...",desc: "Solo backend. Acceso total." },
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
