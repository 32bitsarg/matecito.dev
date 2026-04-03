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
            { method: "POST", path: "/auth/register", auth: "anon-key", desc: "Registro de usuario", body: `{ "email", "password", ...extra }`, response: `{ "user": { "id", "email", "username", ... }, "access_token": "jwt...", "refresh_token": "..." }` },
            { method: "POST", path: "/auth/login", auth: "anon-key", desc: "Login con email y contraseña", body: `{ "email", "password" }`, response: `{ "user": { ... }, "access_token": "jwt...", "refresh_token": "...", "expires_in": 900 }` },
            { method: "POST", path: "/auth/logout", auth: "project-jwt", desc: "Cerrar sesión (revoca refresh token)", body: `{ "refresh_token" }`, response: `{ "ok": true }` },
            { method: "POST", path: "/auth/refresh", auth: "anon-key", desc: "Refrescar access token", body: `{ "refresh_token" }`, response: `{ "access_token": "jwt...", "refresh_token": "...", "expires_in": 900 }` },
            { method: "GET", path: "/auth/me", auth: "project-jwt", desc: "Ver perfil del usuario autenticado", response: `{ "user": { "id", "email", "username", "name", "avatar_url", "created_at" } }` },
            { method: "PATCH", path: "/auth/me", auth: "project-jwt", desc: "Actualizar perfil del usuario", body: `{ "name"?, "username"?, "avatar_seed"?, ...extra }`, response: `{ "user": { ... } }` },
            { method: "POST", path: "/auth/request-reset", auth: "anon-key", desc: "Solicitar reset de contraseña (envía email)", body: `{ "email", "reset_url_base"? }`, response: `{ "ok": true }` },
            { method: "POST", path: "/auth/reset-password", auth: "anon-key", desc: "Confirmar nueva contraseña con token del email", body: `{ "token", "password" }`, response: `{ "ok": true }` },
            { method: "POST", path: "/auth/verify-email", auth: "anon-key", desc: "Verificar email con token del link", body: `{ "token" }`, response: `{ "ok": true, "user_id": "uuid" }` },
            { method: "POST", path: "/auth/resend-verification", auth: "anon-key", desc: "Reenviar email de verificación", body: `{ "email"? | "user_id"?, "login_url"? }`, response: `{ "ok": true }` },
            { method: "GET", path: "/auth/oauth/:provider", auth: "anon-key", desc: "Redirige al proveedor OAuth (Google, GitHub…)", query: "redirect_uri · state (CSRF)", response: "HTTP 302 redirect" },
            { method: "GET", path: "/auth/oauth-providers", auth: "service-key", desc: "Listar proveedores OAuth configurados", response: `{ "providers": [{ "provider", "enabled" }] }` },
            { method: "POST", path: "/auth/oauth-providers", auth: "service-key", desc: "Configurar proveedor OAuth", body: `{ "provider", "clientId", "clientSecret", "redirectUri"? }`, response: `{ "ok": true }` },
            { method: "DELETE", path: "/auth/oauth-providers/:provider", auth: "service-key", desc: "Eliminar configuración OAuth", response: `{ "ok": true }` },
            { method: "GET", path: "/auth/users", auth: "service-key", desc: "Listar usuarios del proyecto (admin)", query: "page · limit · search", response: `{ "users": [...], "total": 0, "pages": 0 }` },
            { method: "DELETE", path: "/auth/users/:userId", auth: "service-key", desc: "Eliminar usuario (admin, irreversible)", response: `{ "ok": true }` },
        ],
    },
    {
        id: "registros", icon: Database, color: "bg-violet-50 text-violet-600", label: "Registros",
        endpoints: [
            {
                method: "GET", path: "/records", auth: "jwt / service-key", desc: "Listar registros con filtros, búsqueda y paginación",
                query: "collection (req) · select · page · limit · sort · order · search · include_deleted · include_expired · or · [campo]=op.valor",
                response: `{ "records": [...], "pagination": { "page", "limit", "total", "pages", "next_cursor" } }`,
                notes: "Filtros: ?title=ilike.%hola% · ?price=gte.100 · ?or=(price.gte.100,name.ilike.%café%)",
            },
            { method: "POST", path: "/records", auth: "jwt / service-key", desc: "Crear registro", body: `{ "collection", "data": { ...campos } }`, response: `{ "record": { "id", "collection", "data", "created_at", "updated_at" } }` },
            { method: "GET", path: "/records/:id", auth: "jwt / service-key", desc: "Ver un registro por ID", query: "collection (req)", response: `{ "record": { ... } }` },
            { method: "PATCH", path: "/records/:id", auth: "jwt / service-key", desc: "Editar un registro por ID", body: `{ "data": { ...campos }, "merge"?: true, "expires_at"? }`, response: `{ "record": { ... } }` },
            { method: "PATCH", path: "/records", auth: "jwt / service-key", desc: "Bulk update — edita todos los que coinciden con los filtros", query: "collection (req) · [campo]=op.valor", body: `{ "data": { ...campos }, "merge"?: true }`, response: `{ "records": [...], "count": 0 }` },
            { method: "DELETE", path: "/records/:id", auth: "jwt / service-key", desc: "Soft-delete de un registro (recuperable)", query: "collection (req)", response: `{ "ok": true }` },
            { method: "DELETE", path: "/records", auth: "jwt / service-key", desc: "Bulk soft-delete — elimina todos los que coinciden", query: "collection (req) · [campo]=op.valor", response: `{ "count": 0 }` },
            { method: "POST", path: "/records/upsert", auth: "jwt / service-key", desc: "Insertar o actualizar según campo de conflicto", body: `{ "collection", "data", "onConflict": ["campo"], "expires_at"? }`, response: `{ "record": { ... }, "upserted": true }`, notes: "upserted: true = insertado, false = actualizado" },
            { method: "GET", path: "/records/count", auth: "jwt / service-key", desc: "Contar registros de una colección con filtros", query: "collection (req) · [campo]=op.valor · search", response: `{ "count": 42 }` },
            { method: "GET", path: "/records/export", auth: "jwt / service-key", desc: "Exportar hasta 10 000 registros", query: "collection (req) · format (json|csv) · include_deleted · include_expired", response: "Descarga del archivo (JSON o CSV)" },
            { method: "POST", path: "/records/:id/restore", auth: "jwt / service-key", desc: "Restaurar un registro soft-deleted", query: "collection (req)", response: `{ "record": { ... } }` },
            { method: "DELETE", path: "/records/:id/hard", auth: "service-key", desc: "Borrado permanente (irreversible)", query: "collection (req)", response: `{ "ok": true }` },
            { method: "POST", path: "/batch", auth: "jwt / service-key", desc: "Múltiples operaciones en una sola transacción", body: `{ "operations": [{ "op": "insert"|"update"|"delete", "collection", "data"?, "id"? }] }`, response: `{ "results": [{ "ok": true, "record"?: {...}, "recordId"?: "uuid", "error"?: "msg" }] }` },
            { method: "POST", path: "/sql", auth: "service-key", desc: "Raw SQL parametrizado (rate limit: 30 req/min)", body: `{ "query": "SELECT ...", "params"?: [] }`, response: `{ "command", "rows": [...], "row_count", "fields": [...], "truncated", "duration_ms" }`, notes: "Solo para operaciones de lectura o admin. No usar desde clients." },
        ],
    },
    {
        id: "colecciones", icon: Layers, color: "bg-emerald-50 text-emerald-600", label: "Colecciones",
        desc: "Gestión del schema del proyecto. Requiere service-key.",
        endpoints: [
            { method: "GET", path: "/collections", auth: "service-key", desc: "Listar todas las colecciones con sus campos", response: `{ "collections": [{ "name", "fields": [...] }] }` },
            { method: "POST", path: "/collections", auth: "service-key", desc: "Crear colección (opcionalmente con campos iniciales)", body: `{ "name", "fields"?: [{ "name", "type", "required"?, "options"? }] }`, response: `{ "collection": { "name", "fields": [] } }` },
            { method: "PATCH", path: "/collections/:name", auth: "service-key", desc: "Renombrar colección", body: `{ "name": "nuevo_nombre" }`, response: `{ "ok": true }` },
            { method: "DELETE", path: "/collections/:name", auth: "service-key", desc: "Eliminar colección y todos sus registros (irreversible)", response: `{ "ok": true }` },
            { method: "GET", path: "/collections/:name/fields", auth: "service-key", desc: "Listar campos de una colección", response: `{ "fields": [{ "id", "name", "type", "required", "options", "created_at" }] }` },
            { method: "POST", path: "/collections/:name/fields", auth: "service-key", desc: "Añadir campo", body: `{ "name", "type": "text|number|boolean|email|date|file|json|relation|select", "required"?: false, "options"?: {} }`, response: `{ "field": { ... } }` },
            { method: "PATCH", path: "/collections/:name/fields/:fieldId", auth: "service-key", desc: "Editar campo (nombre, required, options)", body: `{ "name"?, "required"?, "options"? }`, response: `{ "field": { ... } }` },
            { method: "DELETE", path: "/collections/:name/fields/:fieldId", auth: "service-key", desc: "Eliminar campo (datos del campo se pierden)", response: `{ "ok": true }` },
        ],
    },
    {
        id: "permisos", icon: Shield, color: "bg-rose-50 text-rose-600", label: "Permisos",
        desc: "Control de acceso por colección. Requiere service-key.",
        endpoints: [
            { method: "GET", path: "/permissions", auth: "service-key", desc: "Ver permisos de todas las colecciones", response: `{ "permissions": { "posts": { "list": "public", ... }, ... } }` },
            { method: "GET", path: "/permissions/:collection", auth: "service-key", desc: "Ver permisos de una colección", response: `{ "permissions": { "list": "public", "get": "public", "create": "auth", "update": "auth", "delete": "service" } }` },
            { method: "PATCH", path: "/permissions/:collection", auth: "service-key", desc: "Editar permisos de una colección", body: `{ "permissions": { "list"?, "get"?, "create"?, "update"?, "delete"? }, "filter_rule"? }`, response: `{ "ok": true }`, notes: "Niveles: public · auth · service · nobody. filter_rule: 'campo:{{auth.id}}'" },
        ],
    },
    {
        id: "smtp", icon: Mail, color: "bg-sky-50 text-sky-600", label: "SMTP & Email",
        desc: "Configuración de email transaccional. Requiere service-key.",
        endpoints: [
            { method: "GET", path: "/smtp", auth: "service-key", desc: "Ver configuración SMTP actual", response: `{ "smtp": { "host", "port", "user", "from" } }` },
            { method: "PUT", path: "/smtp", auth: "service-key", desc: "Reemplazar configuración SMTP completa", body: `{ "host", "port", "user", "pass", "from" }`, response: `{ "ok": true }` },
            { method: "PATCH", path: "/smtp", auth: "service-key", desc: "Actualizar campos SMTP parcialmente", body: `{ "host"?, "port"?, "user"?, "pass"?, "from"? }`, response: `{ "ok": true }` },
            { method: "DELETE", path: "/smtp", auth: "service-key", desc: "Eliminar configuración SMTP", response: `{ "ok": true }` },
            { method: "POST", path: "/smtp/test", auth: "service-key", desc: "Enviar email de prueba para verificar conexión", body: `{ "to": "admin@example.com" }`, response: `{ "ok": true }` },
            { method: "GET", path: "/email-templates", auth: "service-key", desc: "Listar plantillas de email", response: `{ "templates": [{ "id", "name", "subject", "body", "created_at" }] }` },
            { method: "POST", path: "/email-templates/seed", auth: "service-key", desc: "Generar plantillas del sistema (welcome, reset-password, verify-email)", response: `{ "ok": true, "created": 3 }` },
            { method: "POST", path: "/email-templates", auth: "service-key", desc: "Crear plantilla personalizada (soporta {{variable}})", body: `{ "name", "subject", "body" }`, response: `{ "template": { ... } }` },
            { method: "GET", path: "/email-templates/:id", auth: "service-key", desc: "Ver plantilla por ID", response: `{ "template": { ... } }` },
            { method: "PATCH", path: "/email-templates/:id", auth: "service-key", desc: "Editar plantilla", body: `{ "name"?, "subject"?, "body"? }`, response: `{ "template": { ... } }` },
            { method: "DELETE", path: "/email-templates/:id", auth: "service-key", desc: "Eliminar plantilla", response: `{ "ok": true }` },
        ],
    },
    {
        id: "storage", icon: HardDrive, color: "bg-teal-50 text-teal-600", label: "Storage",
        endpoints: [
            { method: "GET", path: "/storage", auth: "jwt / service-key", desc: "Listar archivos (opcionalmente por prefijo/carpeta)", query: "path? · limit? · page?", response: `{ "files": [{ "id", "url", "mime", "size", "width"?, "height"?, "variant", "created_at" }] }` },
            { method: "POST", path: "/storage/upload", auth: "jwt / service-key", desc: "Subir archivo (multipart/form-data)", body: `FormData: file (binario) · path · public? (true|false)`, response: `{ "file": { "id", "url", "mime", "size", "width"?, "height"?, "created_at" } }` },
            { method: "POST", path: "/storage/upload-url", auth: "jwt / service-key", desc: "Subir desde URL externa", body: `{ "url": "https://...", "path", "public"? }`, response: `{ "file": { ... } }` },
            { method: "DELETE", path: "/storage/:fileId", auth: "jwt / service-key", desc: "Eliminar archivo por ID", response: `{ "ok": true }` },
        ],
    },
    {
        id: "realtime", icon: Radio, color: "bg-amber-50 text-amber-600", label: "Realtime",
        desc: "Conexión WebSocket para eventos en vivo.",
        endpoints: [
            {
                method: "WS", path: "/ws", auth: "?key=apiKey o ?token=jwt", desc: "Conectar al servidor de tiempo real",
                response: "WebSocket bidireccional",
                notes: "Mensajes del cliente → servidor: { type: 'subscribe', collection } · { type: 'ping' }. Mensajes del servidor → cliente: { type: 'record.created'|'record.updated'|'record.deleted', collection, record, recordId } · { type: 'pong' }",
            },
        ],
    },
    {
        id: "settings", icon: KeyRound, color: "bg-slate-50 text-slate-600", label: "Settings, Logs & Webhooks",
        endpoints: [
            { method: "GET", path: "/settings", auth: "service-key", desc: "Ver configuración del proyecto", response: `{ "settings": { "name", "api_keys": { "anon", "service" }, ... } }` },
            { method: "PATCH", path: "/settings", auth: "service-key", desc: "Editar configuración del proyecto", body: `{ "name"?, ... }`, response: `{ "ok": true }` },
            { method: "GET", path: "/stats", auth: "service-key", desc: "Estadísticas del proyecto", response: `{ "stats": { "total_records", "storage_used_mb", "requests_today", "active_users" } }` },
            { method: "GET", path: "/logs", auth: "service-key", desc: "Logs de requests recientes", query: "limit · page · status · method · path", response: `{ "logs": [{ "method", "path", "status", "duration_ms", "ip", "user_id", "created_at" }] }` },
            { method: "GET", path: "/api-keys", auth: "service-key", desc: "Listar API keys del proyecto", response: `{ "keys": [{ "id", "prefix", "created_at" }] }` },
            { method: "POST", path: "/api-keys", auth: "service-key", desc: "Crear API key adicional", body: `{ "label"? }`, response: `{ "key": { "id", "value", "prefix" } }` },
            { method: "DELETE", path: "/api-keys/:id", auth: "service-key", desc: "Revocar API key", response: `{ "ok": true }` },
            { method: "GET", path: "/webhooks", auth: "service-key", desc: "Listar webhooks configurados", response: `{ "webhooks": [{ "id", "url", "events", "enabled", "created_at" }] }` },
            { method: "POST", path: "/webhooks", auth: "service-key", desc: "Crear webhook", body: `{ "url", "events": ["record.created", ...], "secret"? }`, response: `{ "webhook": { ... } }` },
            { method: "PATCH", path: "/webhooks/:webhookId", auth: "service-key", desc: "Editar webhook (url, events, enabled)", body: `{ "url"?, "events"?, "enabled"?, "secret"? }`, response: `{ "ok": true }` },
            { method: "DELETE", path: "/webhooks/:webhookId", auth: "service-key", desc: "Eliminar webhook", response: `{ "ok": true }` },
        ],
    },
]

// ─── SDK data ─────────────────────────────────────────────────────────────────

const SDK_SECTIONS: SdkSection[] = [
    {
        id: "sdk-install", icon: Package, color: "bg-slate-100 text-slate-700", label: "Instalación",
        blocks: [
            {
                code: `npm install matecitodb`,
                note: "Flutter/Dart: agrega matecitodb_flutter: ^3.1.0 a tu pubspec.yaml",
            },
            {
                title: ".env.local",
                code: `MATECITODB_URL=https://tu-proyecto.matecito.dev\nNEXT_PUBLIC_MATECITODB_API_KEY=mk_anon_...\nMATECITODB_API_KEY=mk_service_...`,
                note: "Generá este archivo automáticamente con: npx matecitodb init",
            },
            {
                title: "lib/db.ts",
                code: `import { createClient } from 'matecitodb'\nimport type { Database } from '@/matecito/database'\n\nexport const db = createClient<Database>({\n  url:    process.env.MATECITODB_URL!,\n  apiKey: process.env.NEXT_PUBLIC_MATECITODB_API_KEY!,\n  // serviceKey para server-side / admin:\n  // serviceKey: process.env.MATECITODB_API_KEY!,\n})`,
                note: "Generá el tipo Database con: npx matecitodb generate types",
            },
        ],
    },
    {
        id: "sdk-auth", icon: Users, color: "bg-blue-50 text-blue-600", label: "Autenticación",
        blocks: [
            {
                title: "Registro, Login y Logout",
                code: `// Registrar\nconst { data, error } = await db.auth.signUp({\n  email: 'user@ejemplo.com', password: 'pass123'\n})\n\n// Login\nconst { data, error } = await db.auth.signIn({\n  email: 'user@ejemplo.com', password: 'pass123'\n})\n\n// Logout\nawait db.auth.signOut()\n\n// Estado actual\nconst user  = db.auth.user\nconst token = db.auth.token\nconst ok    = db.auth.isLoggedIn`,
            },
            {
                title: "Observar cambios de sesión",
                code: `const unsub = db.auth.onAuthChange((user) => {\n  console.log(user ? \`Hola \${user.email}\` : 'Sesión cerrada')\n})\nunsub() // dejar de escuchar`,
            },
            {
                title: "Verificación de email y reset de contraseña",
                code: `// Verificar email con el token del link\nawait db.auth.verifyEmail(token)\n\n// Reenviar email de verificación\nawait db.auth.resendVerification({ email: 'user@ejemplo.com' })\n\n// Solicitar reset (envía email)\nawait db.auth.requestPasswordReset('user@ejemplo.com', {\n  resetUrlBase: 'https://miapp.com/reset'\n})\n\n// Confirmar nuevo password\nawait db.auth.resetPassword(token, 'nueva-contraseña')`,
            },
            {
                title: "OAuth",
                code: `// 1. Generar URL con state para protección CSRF\nconst state = crypto.randomUUID()\nconst url = db.auth.getOAuthUrl(\n  'google',\n  'https://miapp.com/callback',\n  { state }\n)\nwindow.location.href = url\n\n// 2. Completar en el callback\nconst { data } = await db.auth.handleOAuthCallback({\n  access_token:  searchParams.get('access_token'),\n  refresh_token: searchParams.get('refresh_token'),\n})`,
            },
            {
                title: "Admin de usuarios (requiere serviceKey)",
                code: `// Listar usuarios con búsqueda\nconst { data } = await db.auth.admin.listUsers({\n  limit: 20, search: 'juan'\n})\n\n// Eliminar usuario\nawait db.auth.admin.deleteUser(userId)\n\n// Configurar OAuth\nawait db.auth.oauth.configure('google', {\n  clientId: '...', clientSecret: '...'\n})\nawait db.auth.oauth.remove('github')`,
                note: "db.auth.admin y db.auth.oauth requieren serviceKey. Nunca los uses desde el cliente.",
            },
        ],
    },
    {
        id: "sdk-queries", icon: Database, color: "bg-violet-50 text-violet-600", label: "Registros (CRUD)",
        blocks: [
            {
                title: "Consultar",
                code: `// Todos\nconst records = await db.from('posts').find()\n\n// Con filtros, selección y paginación\nconst { data, total, pages } = await db.from('posts')\n  .select('id, title, author')\n  .eq('status', 'publicado')\n  .gte('views', 100)\n  .ilike('title', '%matecito%')\n  .latest()\n  .limit(20)\n  .page(2)\n\n// Por ID\nconst { data } = await db.from('posts').getOne('abc-123')\n\n// Primero que coincide\nconst post = await db.from('posts').findOne({ slug: 'mi-post' })\n\n// Contar\nconst count = await db.from('posts').eq('status', 'publicado').count()`,
            },
            {
                title: "Filtros disponibles",
                code: `db.from('products')\n  .eq('status', 'active')       // =\n  .neq('type', 'digital')       // !=\n  .gt('price', 100)             // >\n  .gte('stock', 1)              // >=\n  .lt('age', 18)                // <\n  .lte('price', 500)            // <=\n  .like('name', 'Juan%')        // LIKE\n  .ilike('title', '%café%')     // ILIKE\n  .inValues('tag', ['a', 'b'])  // IN (...)\n  .notInValues('status', ['spam'])\n  .or('price.gte.100,name.ilike.%café%') // OR\n  .search('texto')              // ILIKE en todos los campos\n  .find()`,
            },
            {
                title: "Insertar, actualizar y upsert",
                code: `// Insertar\nconst { data } = await db.from('posts').insert({ title: 'Hola' })\n\n// Actualizar (por ID o bulk)\nawait db.from('posts').eq('id', 'abc').update({ title: 'Editado' })\nawait db.from('posts').eq('status', 'draft').update({ archived: true })\n\n// Merge — preserva campos no enviados\nawait db.from('posts').eq('id', 'abc').merge({ views: 42 })\n\n// Upsert — inserta o actualiza según campo de conflicto\nconst { data, upserted } = await db.from('profiles').upsert(\n  { user_id: 'abc', bio: 'Dev' }, 'user_id'\n)\nconsole.log(upserted) // true = insertado, false = actualizado\n\n// Insertar múltiples\nconst records = await db.from('products').insertMany([\n  { name: 'Yerba', price: 500 },\n  { name: 'Mate',  price: 1200 },\n])`,
            },
            {
                title: "Soft-delete, restore y hard-delete",
                code: `// Soft-delete (recuperable)\nawait db.from('posts').delete('abc-123')\n\n// Bulk soft-delete\nawait db.from('posts').eq('status', 'spam').delete()\n\n// Restaurar\nawait db.from('posts').restore('abc-123')\n\n// Borrado permanente\nawait db.from('posts').hardDelete('abc-123')\n\n// Ver registros eliminados\nconst { data } = await db.from('posts').includeDeleted().find()\n\n// Ver registros expirados\nconst { data } = await db.from('sessions').includeExpired().find()`,
            },
            {
                title: "Paginar como stream y exportar",
                code: `// Iterar sobre todas las páginas\nfor await (const batch of db.from('posts').paginate({ batchSize: 100 })) {\n  console.log('Lote:', batch.length)\n}\n\n// Exportar hasta 10 000 registros (devuelve Blob)\nconst blob = await db.from('posts').export({ format: 'csv' })\nconst url  = URL.createObjectURL(blob)\n\n// Con expiración en update/upsert\nawait db.from('sessions').eq('id', 'xyz').update(\n  { active: true },\n  { expiresAt: new Date(Date.now() + 3600_000) }\n)`,
            },
        ],
    },
    {
        id: "sdk-realtime", icon: Radio, color: "bg-teal-50 text-teal-600", label: "Tiempo Real",
        blocks: [
            {
                title: "Suscribirse a una colección (TypeScript)",
                code: `// Callback\nconst unsub = db.from('messages').subscribe((event) => {\n  console.log(event.action)     // 'created' | 'updated' | 'deleted'\n  console.log(event.collection) // 'messages'\n  console.log(event.record)     // objeto plano\n  console.log(event.recordId)   // ID del registro\n})\nunsub()\n\n// Estado de conexión\ndb.realtime.onStatusChange((status) => {\n  console.log(status) // 'connected' | 'disconnected'\n})\n\ndb.realtime.disconnect()`,
            },
            {
                title: "Stream en Flutter/Dart",
                code: `// StreamBuilder\nStreamBuilder<RealtimeEvent>(\n  stream: db.from('chat').watch(),\n  builder: (context, snapshot) {\n    final event = snapshot.data;\n    if (event?.action == RealtimeAction.created) {\n      // nuevo registro llegó\n    }\n    return const SizedBox.shrink();\n  },\n)\n\n// Callback clásico\nfinal unsub = db.from('messages').subscribe((event) {\n  print(event.action);\n});\nunsub();`,
                note: "El SDK reconecta automáticamente con backoff exponencial y detecta conexiones zombi via ping/pong cada 30s.",
            },
        ],
    },
    {
        id: "sdk-storage", icon: HardDrive, color: "bg-emerald-50 text-emerald-600", label: "Almacenamiento",
        blocks: [
            {
                title: "Subir archivos",
                code: `// Browser (File object)\nconst { data, error } = await db.storage.upload(file, {\n  path: 'avatars/user-1.png', public: true\n})\nconsole.log(data.url)\n\n// Desde URL (server-side)\nawait db.storage.uploadFromUrl('https://ejemplo.com/img.jpg', {\n  path: 'imports/img.jpg'\n})`,
            },
            {
                title: "Listar, obtener URL y eliminar",
                code: `// Listar archivos en una carpeta\nconst { data: files } = await db.storage.list('avatars/')\n// files[0]: { id, url, mime, size, width, height, createdAt }\n\n// URL pública sin hacer request\nconst url = db.storage.getPublicUrl('avatars/user-1.png')\n\n// Eliminar\nawait db.storage.delete('avatars/user-1.png')`,
            },
        ],
    },
    {
        id: "sdk-collections", icon: Layers, color: "bg-emerald-50 text-emerald-600", label: "Colecciones (Schema)",
        blocks: [
            {
                title: "Crear, renombrar y eliminar colecciones",
                code: `// Listar\nconst { data: cols } = await db.collections.list()\n\n// Crear con campos iniciales\nawait db.collections.create('products', {\n  fields: [\n    { name: 'name',     type: 'text',     required: true },\n    { name: 'price',    type: 'number',   required: true },\n    { name: 'image',    type: 'file' },\n    { name: 'category', type: 'relation', options: { collection: 'categories' } },\n    { name: 'tags',     type: 'select',   options: { values: ['nuevo','oferta'] } },\n  ]\n})\n\nawait db.collections.rename('old_name', 'new_name')\nawait db.collections.delete('temp_data')`,
                note: "Tipos de campo: text · number · boolean · email · date · file · json · relation · select",
            },
            {
                title: "Gestión de campos",
                code: `// Listar campos\nconst { data: fields } = await db.collections.fields('products').list()\n\n// Agregar campo\nawait db.collections.fields('products').create({\n  name: 'discount', type: 'number'\n})\n\n// Actualizar campo\nawait db.collections.fields('products').update(fieldId, {\n  required: true\n})\n\n// Eliminar campo\nawait db.collections.fields('products').delete(fieldId)`,
            },
        ],
    },
    {
        id: "sdk-smtp", icon: Mail, color: "bg-sky-50 text-sky-600", label: "Email (SMTP)",
        blocks: [
            {
                title: "Configuración SMTP",
                code: `// Configurar\nawait db.smtp.set({\n  host: 'smtp.gmail.com', port: 587,\n  user: 'noreply@miapp.com', pass: 'app-password',\n  from: 'Mi App <noreply@miapp.com>',\n})\n\n// Actualizar parcialmente\nawait db.smtp.update({ port: 465 })\n\n// Test de conexión\nconst { error } = await db.smtp.test('admin@miapp.com')`,
            },
            {
                title: "Plantillas (soportan {{variable}})",
                code: `// Generar plantillas del sistema\nawait db.emailTemplates.seed()\n\n// Crear plantilla personalizada\nawait db.emailTemplates.create({\n  name:    'pedido_confirmado',\n  subject: 'Tu pedido {{order_id}} fue confirmado',\n  body:    '<h1>Hola {{user_name}}</h1><p>¡Tu pedido está en camino!</p>',\n})\n\n// Listar, actualizar y eliminar\nconst { data: list } = await db.emailTemplates.list()\nawait db.emailTemplates.update('uuid', { subject: 'Nuevo asunto' })\nawait db.emailTemplates.delete('uuid')`,
            },
        ],
    },
    {
        id: "sdk-permissions", icon: Shield, color: "bg-amber-50 text-amber-600", label: "Permisos (RLS)",
        blocks: [
            {
                code: `// Ver permisos de todas las colecciones\nconst { data } = await db.permissions.getAll()\n\n// Ver permisos de una colección\nconst { data } = await db.permissions.get('posts')\n\n// Configurar permisos por operación\nawait db.permissions.set('posts', {\n  list:   'public',   // sin autenticación\n  get:    'public',\n  create: 'auth',     // requiere JWT\n  update: 'auth',\n  delete: 'service',  // solo serviceKey\n})\n\n// Aplicar el mismo nivel a todas las operaciones\nawait db.permissions.setAll('private_data', 'service')`,
                note: "Niveles: public · auth · service · nobody. Requiere serviceKey.",
            },
        ],
    },
    {
        id: "sdk-stats", icon: Terminal, color: "bg-slate-50 text-slate-600", label: "Estadísticas y Logs",
        blocks: [
            {
                title: "Estadísticas del proyecto",
                code: `const { data: stats } = await db.stats.get()\nconsole.log(stats.total_records)    // registros en todas las colecciones\nconsole.log(stats.storage_used_mb)  // MB usados en Storage\nconsole.log(stats.requests_today)   // requests en las últimas 24h\nconsole.log(stats.active_users)     // usuarios con sesión activa`,
            },
            {
                title: "Logs de requests",
                code: `// Últimos 50 logs\nconst { data: logs } = await db.logs.list({ limit: 50 })\n\n// Filtrar por código de respuesta\nconst { data: errors } = await db.logs.list({ status: 500 })\n\n// Filtrar por método HTTP\nconst { data: writes } = await db.logs.list({ method: 'POST' })\n\n// Filtrar por path\nconst { data: auth }   = await db.logs.list({ path: '/auth' })\n\n// Cada log tiene:\n// { method, path, status, duration_ms, ip, user_id, created_at }`,
                note: "Requiere serviceKey.",
            },
        ],
    },
    {
        id: "sdk-webhooks", icon: Webhook, color: "bg-violet-50 text-violet-600", label: "Webhooks",
        blocks: [
            {
                title: "Crear y gestionar webhooks",
                code: `// Crear\nconst { data: hook } = await db.webhooks.create({\n  url:    'https://miapp.com/hooks/matecito',\n  events: ['record.created', 'record.deleted'],\n  secret: 'mi-secreto-de-firma',\n})\n\n// Listar\nconst { data: hooks } = await db.webhooks.list()\n\n// Deshabilitar temporalmente\nawait db.webhooks.update('hook-uuid', { enabled: false })\n\n// Eliminar\nawait db.webhooks.delete('hook-uuid')`,
                note: "Eventos: record.created · record.updated · record.deleted · auth.signup · auth.login · storage.upload",
            },
            {
                title: "Verificar firma en tu endpoint receptor",
                code: `import { createHmac } from 'crypto'\n\nfunction verifyWebhook(\n  body: string,\n  signature: string,\n  secret: string\n): boolean {\n  const expected = 'sha256=' +\n    createHmac('sha256', secret).update(body).digest('hex')\n  return expected === signature\n}\n\n// En tu Route Handler (Next.js):\nexport async function POST(req: Request) {\n  const sig  = req.headers.get('x-matecito-signature') ?? ''\n  const body = await req.text()\n\n  if (!verifyWebhook(body, sig, process.env.WEBHOOK_SECRET!)) {\n    return new Response('Forbidden', { status: 403 })\n  }\n\n  const { event, collection, record } = JSON.parse(body)\n  // event: 'record.created' | 'record.updated' | ...\n  return new Response('OK')\n}`,
                note: "Payload: { event, collection, record, timestamp }. Header: X-Matecito-Signature: sha256=HMAC(secret, body).",
            },
        ],
    },
    {
        id: "sdk-cli", icon: Code2, color: "bg-slate-100 text-slate-700", label: "CLI",
        blocks: [
            {
                code: `# Inicializar proyecto — genera .env.local interactivamente\n# (verifica conexión antes de guardar)\nnpx matecitodb init\n\n# Generar interfaces TypeScript desde el schema actual\nnpx matecitodb generate types\n# → matecito.types.ts con todas las colecciones tipadas\n\n# Scaffold de autenticación para Next.js App Router\nnpx matecitodb generate auth\n\n# React hook con CRUD + realtime para una colección\nnpx matecitodb generate hook posts\n# → hooks/usePosts.ts`,
            },
            {
                title: "Uso del schema generado",
                code: `// matecito.types.ts (generado automáticamente)\nexport interface Database {\n  posts: {\n    id:         string\n    title:      string\n    status:     'borrador' | 'publicado'\n    views:      number\n    created_at: string\n  }\n  // ...más colecciones\n}\n\n// lib/db.ts\nimport { createClient } from 'matecitodb'\nimport type { Database } from '@/matecito.types'\n\nexport const db = createClient<Database>({ url, apiKey })\n\n// Ahora db.from('posts') está completamente tipado\nconst { data: posts } = await db.from('posts').find()\n// posts es Database['posts'][] con autocompletado`,
                note: "Regenerá los tipos cada vez que modifiques el schema: npx matecitodb generate types",
            },
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
