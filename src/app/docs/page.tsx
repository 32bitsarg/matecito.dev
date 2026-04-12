'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  Copy, Check, ChevronDown, ChevronRight, Search, Code2, Globe,
  Database, Shield, Zap, Mail, Key, BarChart3, Workflow, Sparkles,
  FileText, Settings, Terminal, ArrowRight, Menu, X, Smartphone, Bell
} from 'lucide-react'

type Tab = 'sdk' | 'rest-v1' | 'rest-v2' | 'flutter'

// ═══════════════════════════════════════════════════════════
// Code snippets
// ═══════════════════════════════════════════════════════════

const CODE = {
  install: `npm install matecitodb`,

  clientV1: `// API v1 (default) — Compatibilidad con proyectos existentes
export const db = createClient<Database>({
  url:        process.env.MATECITODB_URL!,
  apiKey:     process.env.MATECITODB_API_KEY!,
  apiVersion: 'v1',  // default, no hace falta especificarlo
})`,

  clientV2: `// API v2 (recomendada) — Features avanzadas + security fixes
export const db = createClient<Database>({
  url:        process.env.MATECITODB_URL!,
  apiKey:     process.env.MATECITODB_API_KEY!,
  apiVersion: 'v2',
})

// Con serviceKey (server-side / admin)
export const dbAdmin = createClient<Database>({
  url:        process.env.MATECITODB_URL!,
  serviceKey: process.env.MATECITODB_SERVICE_KEY!,
  apiVersion: 'v2',
})`,

  client: `import { createClient } from 'matecitodb'
import type { Database } from '@/matecito/database'

export const db = createClient<Database>({
  url:    process.env.MATECITODB_URL!,
  apiKey: process.env.NEXT_PUBLIC_MATECITODB_API_KEY!,
  // serviceKey: process.env.MATECITODB_SERVICE_KEY!,  // server-side
  // apiVersion: 'v2',  // descomentá para v2
})`,

  auth: `// Registro
const { user } = await db.auth.signUp({
  email:    'user@example.com',
  password: 'secure-password',
  name:     'Juan Pérez',
})

// Login
const { token, user } = await db.auth.signIn({
  email:    'user@example.com',
  password: 'secure-password',
})

// Logout
await db.auth.signOut()

// Usuario actual
const me = await db.auth.getMe()`,

  authOAuth: `// Obtener URL OAuth (v2)
const { url } = await db.auth.getOAuthUrl('google')
window.location.href = url

// Manejar callback en /auth/callback
const { token, user } = await db.auth.handleOAuthCallback(window.location.href)`,

  authSession: `// Persistir sesión manualmente
await db.auth.setSession(token)

// Refresh de token expirado
const { token: newToken } = await db.auth.refreshSession()

// Escuchar cambios de sesión
const unsub = db.auth.onAuthChange((event, session) => {
  // event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED'
  if (event === 'SIGNED_IN') console.log('User:', session?.user)
  if (event === 'SIGNED_OUT') router.push('/login')
})
// unsub() para dejar de escuchar`,

  authPassword: `// Solicitar reset de contraseña
await db.auth.requestPasswordReset('user@example.com')

// Confirmar reset (con token del email)
await db.auth.resetPassword({ token: 'reset-token', newPassword: 'new-pass' })

// Verificar email
await db.auth.verifyEmail(token)
await db.auth.resendVerification('user@example.com')

// Actualizar perfil
await db.auth.updateProfile({ name: 'New Name', avatar_url: 'https://...' })`,

  authMagicLink: `// Magic link (v2 only)
await db.auth.magicLink('user@example.com')
// El usuario recibe email → link → autenticado automáticamente`,

  authTOTP: `// TOTP / 2FA (v2 only)
// 1. Setup — devuelve secret + QR URL
const { secret, qr_url } = await db.auth.totpSetup()

// 2. Confirmar con código del authenticator
await db.auth.totpConfirm({ code: '123456' })

// 3. Verificar en cada login
await db.auth.totpVerify({ code: '123456' })

// 4. Desactivar 2FA
await db.auth.totpDisable({ password: 'current-password' })`,

  authAdmin: `// Auth Admin (serviceKey requerida)
// Listar usuarios
const { users } = await db.auth.admin.listUsers({ page: 1, limit: 50 })

// Crear usuario como admin
const { user } = await db.auth.admin.createUser({
  email: 'user@example.com', password: 'pass', name: 'Juan',
})

// Banear / desbanear
await db.auth.admin.banUser(userId)
await db.auth.admin.unbanUser(userId)

// Eliminar usuario
await db.auth.admin.deleteUser(userId)

// Roles
await db.auth.roles.assign(userId, 'moderator')
await db.auth.roles.revoke(userId, 'moderator')`,

  authInvitations: `// Invitaciones
const { link } = await db.auth.invitations.create({
  email: 'nuevo@example.com',
  role:  'editor',
  expiresInHours: 48,
})

// Listar invitaciones pendientes
const { invitations } = await db.auth.invitations.list()

// Revocar
await db.auth.invitations.revoke(invitationId)`,

  queryBuilder: `// QueryBuilder — API fluida y tipada
const posts = await db
  .from('posts')
  .eq('status', 'published')
  .order('created_at', 'desc')
  .limit(20)
  .get()

// Múltiples filtros
const results = await db
  .from('products')
  .gte('price', 100)
  .lte('price', 500)
  .like('name', '%laptop%')
  .in('category', ['tech', 'gaming'])
  .notIn('status', ['draft', 'archived'])
  .limit(10)
  .get()

// Búsqueda por campo nullable
const noPhone = await db.from('users').isNull('phone').get()

// Contiene en array (v2)
const tagged = await db.from('posts').has('tags', 'javascript').get()`,

  queryBuilderAdvanced: `// Full-text search (v2)
const articles = await db
  .from('articles')
  .search('base de datos')
  .order('relevance', 'desc')
  .get()

// Vector / semántico (v2)
const similar = await db
  .from('documents')
  .searchFullText('machine learning')
  .limit(5)
  .get()

// Between
const recent = await db
  .from('orders')
  .between('created_at', '2024-01-01', '2024-12-31')
  .get()

// OR conditions
const active = await db
  .from('users')
  .or([{ field: 'status', op: 'eq', value: 'active' }, { field: 'role', op: 'eq', value: 'admin' }])
  .get()

// Relaciones (populate)
const withAuthor = await db
  .from('posts')
  .populate('author_id', 'users')
  .limit(10)
  .get()

// Soft-deleted + expirados
const all = await db.from('items').includeDeleted().includeExpired().get()`,

  queryBuilderMutations: `// Crear
const post = await db.from('posts').insert({ title: 'Hola', status: 'draft' })

// Crear múltiples
const posts = await db.from('posts').insertMany([
  { title: 'Post 1' }, { title: 'Post 2' },
])

// Upsert (insert o update por clave única)
await db.from('users').upsert({ email: 'j@ex.com', name: 'Juan' }, 'email')

// Actualizar filtrado
await db.from('posts').eq('status', 'draft').update({ status: 'published' })

// Merge (actualización parcial con ID)
await db.from('products').merge(productId, { price: 299 })

// Soft delete
await db.from('posts').eq('id', postId).delete()

// Hard delete (permanente)
await db.from('posts').eq('id', postId).hardDelete()

// Restaurar soft-deleted
await db.from('posts').eq('id', postId).restore()`,

  queryBuilderPaginate: `// Paginación fluida
const page = await db
  .from('products')
  .eq('category', 'tech')
  .order('price', 'asc')
  .paginate(1, 20) // página 1, 20 por página

// Devuelve:
// { data: [...], total: 150, page: 1, limit: 20, pages: 8 }

// findOne
const user = await db.from('users').eq('email', 'j@ex.com').findOne()

// count
const total = await db.from('posts').eq('status', 'published').count()

// Seleccionar campos
const names = await db
  .from('users')
  .select(['id', 'name', 'email'])
  .limit(100)
  .get()

// Exportar (v2)
const csv = await db.from('orders').export('csv')
const json = await db.from('orders').export('json')`,

  queryBuilderRealtime: `// Realtime desde QueryBuilder
const unsubscribe = await db
  .from('messages')
  .eq('room_id', 'room-123')
  .subscribe((event) => {
    // event.action: 'create' | 'update' | 'delete'
    console.log('Nuevo evento:', event.action, event.record)
  })

// watch — escucha todos los eventos de una colección
const stop = db.from('notifications').watch((event) => {
  if (event.action === 'create') showToast(event.record.message)
})

unsubscribe() // o stop()`,

  records: `// API clásica (db.records)
const record = await db.records.create('users', {
  name: 'Juan', email: 'juan@example.com',
})

const { records, pagination } = await db.records.list('users', {
  page: 1, limit: 50, sort: '-created_at',
})

await db.records.update(record.id, { name: 'Juan Updated' })
await db.records.delete(record.id)
await db.records.hardDelete(record.id)`,

  realtime: `// Suscripción básica
const unsubscribe = db.realtime.subscribe('users', (event) => {
  console.log('Acción:', event.action) // create | update | delete
  console.log('Registro:', event.record)
})

// Con filtro
db.realtime.subscribe('posts', (event) => {
  setFeed(prev => [event.record, ...prev])
}, { status: 'published' })

unsubscribe()`,

  storage: `// Subir archivo
const file = await db.storage.upload('avatar.png', fileData, {
  collection: 'users',
  recordId:   'user-id-123',
  public:     true,
})

// Obtener URL pública
const url = db.storage.getUrl(file.path)

// Listar archivos
const { files } = await db.storage.list({ collection: 'users', recordId: 'user-id-123' })

// Eliminar
await db.storage.delete(file.id)`,

  emails: `// Configurar SMTP
await db.emails.saveSmtp({
  host:     'smtp.gmail.com',
  port:     587,
  username: 'noreply@myapp.com',
  password: 'app-password',
  secure:   false,
})

// Enviar
await db.emails.send({
  to:      ['user@example.com'],
  subject: 'Bienvenido a mi app',
  html:    '<h1>¡Hola!</h1><p>Gracias por registrarte.</p>',
})`,

  functions: `// Invocar una function (v2)
const { result, duration_ms } = await db.functions.invoke('send-welcome', {
  args: { email: 'user@example.com', name: 'Juan' },
})

// Crear function
await db.functions.create({
  name:       'process-order',
  code:       \`const { args, db } = context; return { ok: true }\`,
  timeout_ms: 5000,
  is_public:  false,
})

// Listar
const { functions } = await db.functions.list()

// Historial de ejecuciones
const { executions } = await db.functions.history('send-welcome')`,

  analytics: `// Trackear evento (v2)
await db.analytics.track('page_view', {
  user_id:    currentUser.id,
  properties: { page: '/pricing', source: 'google' },
})

// Obtener eventos agrupados
const { results } = await db.analytics.events({
  group_by: 'event',
  days:     30,
})

// Funnel de conversión
const { funnel } = await db.analytics.funnel({
  steps: ['page_view', 'signup', 'checkout', 'purchase'],
})`,

  aiGateway: `// Configurar AI (v2)
await db.ai.setConfig({
  provider: 'openai', // 'anthropic' | 'groq'
  model:    'gpt-4o-mini',
  api_key:  'sk-...',
})

// Chat completion
const { content } = await db.ai.chat([
  { role: 'user', content: '¿Cómo implemento auth con matecitodb?' },
])

// Con system prompt
const { content } = await db.ai.chat(messages, {
  system:     'Sos un asistente técnico de MatecitoDB.',
  max_tokens: 500,
})`,

  remoteConfig: `// Remote Config (v2)
// Obtener todos los valores
const { configs } = await db.config.getAll()

// Obtener uno
const mode = await db.config.get('maintenance_mode')

// Crear / actualizar
await db.config.set('maintenance_mode', false, {
  description: 'Desactiva el acceso público',
})

// Eliminar
await db.config.delete('old_flag')`,

  notifications: `// Notificaciones push (v2)
// Registrar dispositivo
await db.notifications.registerDevice({
  token:    fcmToken,
  platform: 'android', // 'ios' | 'web'
})

// Enviar notificación
await db.notifications.send({
  user_ids: [userId],
  title:    '¡Nueva actualización!',
  body:     'Revisá las novedades de la app.',
  data:     { screen: 'updates' },
})

// Enviar a todos
await db.notifications.broadcast({
  title: 'Mantenimiento programado',
  body:  'El servicio estará caído el sábado 02:00-04:00 AM.',
})`,

  // V1 REST
  v1Login: `POST /api/v1/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "secure-password" }

# Response: 200
{ "token": "eyJhbGci...", "refresh_token": "eyJhbGc..." }`,

  v1Register: `POST /api/v1/auth/register
Content-Type: application/json

{ "email": "user@example.com", "password": "secure-password", "name": "Juan Pérez" }

# Response: 201
{ "user": { "id": "uuid", "email": "user@example.com", "name": "Juan Pérez" } }`,

  v1Refresh: `POST /api/v1/auth/refresh
Content-Type: application/json

{ "refresh_token": "eyJhbGc..." }

# Response: 200
{ "token": "eyJhbGci...", "refresh_token": "eyJhbGc..." }`,

  v1PasswordReset: `# Solicitar reset
POST /api/v1/auth/password-reset
{ "email": "user@example.com" }

# Confirmar con token del email
POST /api/v1/auth/password-reset/confirm
{ "token": "reset-token", "password": "new-secure-pass" }`,

  v1ListRecords: `GET /api/v1/project/:id/records?collection=users&page=1&limit=50&sort=-created_at
Authorization: Bearer <token>

# Response: 200
{
  "records": [{
    "id": "uuid",
    "collection": "users",
    "data": { "name": "Juan", "email": "juan@example.com" },
    "created_at": "2024-01-15T10:30:00Z"
  }],
  "pagination": { "total": 150, "page": 1, "limit": 50 }
}`,

  v1CreateRecord: `POST /api/v1/project/:id/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "collection": "users",
  "data": { "name": "María", "email": "maria@example.com" }
}

# Response: 201
{ "id": "uuid", "collection": "users", "data": { ... } }`,

  v1UpdateRecord: `PATCH /api/v1/project/:id/records/:recordId
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "María Updated" }`,

  v1DeleteRecord: `DELETE /api/v1/project/:id/records/:recordId
Authorization: Bearer <token>

# Soft delete por defecto. Hard delete:
DELETE /api/v1/project/:id/records/:recordId?hard=true`,

  v1ListCollections: `GET /api/v1/project/:id/collections
Authorization: Bearer <token>`,

  v1CreateCollection: `POST /api/v1/project/:id/collections
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "posts" }`,

  v1AddField: `POST /api/v1/project/:id/collections/:name/fields
Authorization: Bearer <token>
Content-Type: application/json

{ "name": "title", "type": "text", "required": true }

# Tipos: text, number, bool, email, date, file, json, relation, select`,

  v1Storage: `# Subir archivo
POST /api/v1/project/:id/storage
Authorization: Bearer <token>
Content-Type: multipart/form-data

file=<binary>
collection=users
record_id=<uuid>
public=true

# Response: 201
{ "id": "uuid", "path": "users/<uuid>/avatar.png", "url": "https://..." }

# Listar archivos
GET /api/v1/project/:id/storage?collection=users&record_id=<uuid>

# Eliminar
DELETE /api/v1/project/:id/storage/:fileId`,

  v1Realtime: `# Conectar WebSocket (v1)
ws://tu-proyecto.matecito.dev/api/v1/ws

# Autenticar
→ { "type": "auth", "token": "Bearer <jwt>" }

# Suscribirse a colección
→ { "type": "subscribe", "collection": "messages" }

# Con filtro
→ { "type": "subscribe", "collection": "posts", "filter": { "status": "published" } }

# Recibir eventos
← { "type": "event", "action": "create", "collection": "messages", "record": { ... } }
← { "type": "event", "action": "update", "collection": "messages", "record": { ... } }
← { "type": "event", "action": "delete", "collection": "messages", "id": "uuid" }`,

  v1Permissions: `# Listar reglas de acceso
GET /api/v1/project/:id/permissions
Authorization: Bearer <token>

# Crear regla
POST /api/v1/project/:id/permissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "collection": "posts",
  "action":     "read",    // create | read | update | delete
  "allow":      "public",  // public | authenticated | owner | role
  "role":       "editor"   // si allow = role
}`,

  v1Webhook: `POST /api/v1/project/:id/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url":         "https://myserver.com/webhook",
  "collections": ["users", "posts"],
  "events":      ["create", "update", "delete"],
  "secret":      "optional-hmac-secret"
}

# Payload recibido
{
  "event":      "record.created",
  "collection": "users",
  "record":     { "id": "uuid", "data": { ... } },
  "timestamp":  "2024-01-15T10:30:00Z",
  "signature":  "sha256=abc..."
}`,

  v1Stats: `GET /api/v1/project/:id/stats
Authorization: Bearer <token>

# Response
{
  "records":     15420,
  "collections": 12,
  "storage_mb":  234,
  "users":       3800
}`,

  // V2 REST
  v2Track: `POST /api/v2/project/:id/analytics/track
Content-Type: application/json

{
  "event":   "page_view",
  "user_id": "user-123",
  "properties": { "page": "/pricing", "source": "google" }
}`,

  v2Events: `GET /api/v2/project/:id/analytics/events?group_by=event&days=30

# Response
{
  "results": [
    { "event": "page_view",    "count": 15000, "unique_users": 3200 },
    { "event": "button_click", "count": 4500,  "unique_users": 1800 }
  ]
}`,

  v2Funnel: `GET /api/v2/project/:id/analytics/funnel?steps=page_view,signup,checkout,purchase

# Response
{
  "funnel": [
    { "step": "page_view", "users": 10000 },
    { "step": "signup",    "users": 3500  },
    { "step": "checkout",  "users": 1200  },
    { "step": "purchase",  "users": 450   }
  ]
}`,

  v2Function: `POST /api/v2/project/:id/functions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name":       "send-welcome",
  "code":       "const { args, db } = context; await db.emails.send(...); return { ok: true }",
  "timeout_ms": 5000,
  "is_public":  false
}`,

  v2Invoke: `POST /api/v2/project/:id/functions/:name/invoke
Authorization: Bearer <token>
Content-Type: application/json

{ "args": { "email": "user@example.com", "name": "Juan" } }

# Response
{ "result": { "ok": true }, "duration_ms": 45 }`,

  v2FunctionHistory: `GET /api/v2/project/:id/functions/history
GET /api/v2/project/:id/functions/history?name=send-welcome

# Response
{
  "executions": [{
    "id":            "uuid",
    "function_name": "send-welcome",
    "status":        "success",
    "duration_ms":   45,
    "created_at":    "2024-01-15T10:30:00Z"
  }]
}`,

  v2AIConfig: `PUT /api/v2/project/:id/project/ai-config
Authorization: Bearer <token>
Content-Type: application/json

{
  "provider": "openai",     // "anthropic" | "groq"
  "model":    "gpt-4o-mini",
  "api_key":  "sk-..."
}
# API keys encriptadas con AES-256 en la DB`,

  v2AIChat: `POST /api/v2/project/:id/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "messages": [{ "role": "user", "content": "¿Cómo implemento auth?" }],
  "system":   "Sos un asistente técnico especializado en MatecitoDB.",
  "max_tokens": 500
}

# Response
{ "content": "Para implementar auth con MatecitoDB...", "usage": { "tokens": 230 } }`,

  v2ConfigSet: `PUT /api/v2/project/:id/config/:key
Authorization: Bearer <token>
Content-Type: application/json

{ "value": false, "description": "Activa el modo mantenimiento" }`,

  v2ConfigGet: `GET /api/v2/project/:id/config

# Response
{
  "configs": {
    "maintenance_mode": {
      "value":       false,
      "description": "Activa el modo mantenimiento",
      "updated_at":  "2024-01-15T10:30:00Z"
    },
    "feature_new_ui": { "value": true, "description": "Activa nueva UI" }
  }
}`,

  v2Form: `POST /api/v2/project/:id/forms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name":       "contacto",
  "collection": "messages",
  "fields":     [
    { "name": "email",   "type": "email",  "required": true },
    { "name": "message", "type": "text",   "required": true }
  ]
}

# URL pública: https://tu-proyecto.matecito.dev/f/contacto`,

  v2Submissions: `GET /api/v2/project/:id/forms/contacto/submissions
Authorization: Bearer <token>

# Response
{
  "submissions": [{
    "id":         "uuid",
    "email":      "juan@example.com",
    "message":    "Hola!",
    "created_at": "2024-01-15T10:30:00Z"
  }]
}`,

  v2Filters: `# Between valores
GET /api/v2/project/:id/records?collection=products&price[between]=10,100

# Es nulo
GET /api/v2/project/:id/records?collection=users&phone[isNull]=true

# Contiene en array
GET /api/v2/project/:id/records?collection=posts&tags[has]=javascript

# Full-text search
GET /api/v2/project/:id/records?collection=articles&q=base+datos

# Incluir soft-deleted
GET /api/v2/project/:id/records?collection=posts&include_deleted=true

# Exportar
GET /api/v2/project/:id/records?collection=orders&export=csv`,

  v2AuthOAuth: `# Iniciar flujo OAuth
GET /api/v2/project/:id/auth/oauth/:provider?redirect=https://myapp.com/callback
# provider: google | github | discord | apple

# Callback — intercambiar code por token
POST /api/v2/project/:id/auth/oauth/:provider/callback
{ "code": "...", "state": "..." }

# Response
{ "token": "eyJhbGci...", "user": { "id": "uuid", "email": "..." } }`,

  v2AuthTOTP: `# Setup TOTP
POST /api/v2/project/:id/auth/totp/setup
Authorization: Bearer <token>
# Response: { "secret": "...", "qr_url": "otpauth://..." }

# Confirmar TOTP
POST /api/v2/project/:id/auth/totp/confirm
{ "code": "123456" }

# Verificar en login
POST /api/v2/project/:id/auth/totp/verify
{ "code": "123456" }`,

  v2Realtime: `# Conectar WebSocket (v2 — /realtime)
wss://tu-proyecto.matecito.dev/api/v2/realtime

# Autenticar
→ { "type": "auth", "token": "Bearer <jwt>" }

# Suscribirse
→ { "type": "subscribe", "collection": "messages", "filter": { "room_id": "room-123" } }

# Presence (v2)
→ { "type": "presence", "channel": "room-123", "state": { "username": "Juan", "status": "online" } }

# Recibir
← { "type": "event",    "action": "create", "record": { ... } }
← { "type": "presence", "users": [{ "id": "uuid", "username": "Juan" }] }`,

  v2Notifications: `# Registrar dispositivo push
POST /api/v2/project/:id/notifications/devices
Authorization: Bearer <token>
{ "token": "<fcm-token>", "platform": "android" }  // ios | android | web

# Enviar notificación
POST /api/v2/project/:id/notifications/send
Authorization: Bearer <token>
{
  "user_ids": ["uuid-1", "uuid-2"],
  "title":    "Nueva actualización",
  "body":     "Versión 2.0 disponible",
  "data":     { "screen": "updates" }
}

# Broadcast a todos
POST /api/v2/project/:id/notifications/broadcast
{ "title": "Mantenimiento", "body": "Sábado 02:00 AM" }`,

  v2Batch: `# Batch de operaciones (v2)
POST /api/v2/project/:id/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "operations": [
    { "method": "POST",   "path": "/records", "body": { "collection": "users", "data": { "name": "A" } } },
    { "method": "PATCH",  "path": "/records/uuid-1", "body": { "status": "active" } },
    { "method": "DELETE", "path": "/records/uuid-2" }
  ]
}

# Response — todas las operaciones o ninguna (transaccional)
{ "results": [{ "status": 201, "body": { ... } }, ...] }`,

  // ─── Flutter ──────────────────────────────────────────────────────────────
  flutterInstall: `# pubspec.yaml
dependencies:
  matecitodb_flutter: ^4.0.0
  shared_preferences: ^2.2.0  # para persistencia de sesión
  web_socket_channel: ^2.4.0  # para realtime`,

  flutterInit: `import 'package:matecitodb_flutter/matecitodb_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final db = MatecitoDB.createClient(
    'https://mi-proyecto.matecito.dev',
    config: const ClientConfig(
      apiKey:      'mi-anon-key',
      // serviceKey: 'mi-service-key',  // solo server-side
      apiVersion:  'v2',   // 'v1' por defecto
      autoRefresh: true,   // refresh automático de tokens
      debug:       false,  // logs HTTP en consola
      timeoutMs:   15000,
    ),
  );

  // Esperar a que la sesión persisida se restaure
  await db.auth.sessionReady;

  runApp(MyApp(db: db));
}`,

  flutterAuth: `// Registro
final res = await db.auth.signUp(
  email:    'user@example.com',
  password: 'secure-password',
  extra:    {'name': 'Juan Pérez'},
);
if (res.hasError) print(res.error!.message);

// Login
final res = await db.auth.signIn(
  email:    'user@example.com',
  password: 'secure-password',
);
final token = res.data?.accessToken;

// Logout
await db.auth.signOut();

// Usuario actual
final me = await db.auth.getMe();
print(me.data?.email);

// Estado actual (sin request)
final isLogged = db.auth.isLoggedIn;
final user     = db.auth.user;`,

  flutterAuthStream: `// Stream de cambios de sesión
StreamBuilder<AuthUser?>(
  stream: db.auth.authStateStream,
  builder: (context, snapshot) {
    if (snapshot.data != null) return const HomeScreen();
    return const LoginScreen();
  },
)

// Callback (con unsubscribe)
final unsub = db.auth.onAuthChange((user) {
  if (user == null) Navigator.pushReplacementNamed(context, '/login');
});

@override
void dispose() {
  unsub();  // limpiar listener
  super.dispose();
}`,

  flutterAuthPassword: `// Reset de contraseña
await db.auth.requestPasswordReset('user@example.com');

// Confirmar con token del email
await db.auth.resetPassword('reset-token', 'new-secure-pass');

// Verificar email
await db.auth.verifyEmail(token);
await db.auth.resendVerification(email: 'user@example.com');

// Actualizar perfil
await db.auth.updateProfile({'name': 'Nuevo nombre', 'avatar_url': 'https://...'});

// Setear sesión manualmente (deep link, etc.)
db.auth.setSession(accessToken: token, refreshToken: refreshToken);

// Refresh manual
await db.auth.refreshSession();`,

  flutterAuthOAuth: `// Obtener URL OAuth (v2)
final url = db.auth.getOAuthUrl(
  'google',
  'myapp://auth/callback',  // deeplink o URL de callback
);

// Abrir en browser
await launchUrl(Uri.parse(url));

// En el callback del deeplink
final res = await db.auth.handleOAuthCallback({
  'code':  uri.queryParameters['code']!,
  'state': uri.queryParameters['state']!,
});
// res.data?.accessToken listo para usar`,

  flutterAuthMagicTOTP: `// Magic link (v2)
await db.auth.magicLink('user@example.com',
  redirectUrl: 'myapp://auth/magic');

// TOTP — Setup
final res = await db.auth.totpSetup();
final secret = res.data!['secret'];
final qrUrl  = res.data!['qr_url'];

// Confirmar con código del authenticator
await db.auth.totpConfirm('123456');

// Verificar en login (cuando 2FA está activo)
await db.auth.totpVerify(totpSession, '123456');

// Desactivar 2FA
await db.auth.totpDisable();`,

  flutterAuthAdmin: `// Admin — requiere serviceKey
// Listar usuarios
final res = await db.auth.admin.listUsers(page: 1, limit: 50, search: 'juan');

// Eliminar usuario
await db.auth.admin.deleteUser(userId);

// OAuth providers
await db.auth.oauth.configure('google',
  clientId:     'CLIENT_ID',
  clientSecret: 'CLIENT_SECRET',
);
final providers = await db.auth.oauth.listProviders();

// Roles (v2)
await db.auth.roles.assign(userId, 'moderator');
await db.auth.roles.unassign(userId, 'moderator');
await db.auth.roles.create('editor', description: 'Puede editar contenido');

// Invitaciones (v2)
final inv = await db.auth.invitations.create(
  email: 'nuevo@example.com', role: 'editor', expiresIn: '48h',
);
final list = await db.auth.invitations.list();
await db.auth.invitations.revoke(invitationId);`,

  flutterQBFilters: `// QueryBuilder — misma API fluida que JS/TS
final posts = await db
  .from('posts')
  .eq('status', 'published')
  .order('created_at', ascending: false)
  .limit(20)
  .get();

// Filtros combinados
final results = await db
  .from('products')
  .gte('price', 100)
  .lte('price', 500)
  .ilike('name', '%laptop%')
  .inValues('category', ['tech', 'gaming'])
  .notInValues('status', ['draft'])
  .get();

// Nullable
final noPhone = await db.from('users').isNull('phone').get();

// Array contains (v2)
final tagged = await db.from('posts').has('tags', 'dart').get();

// OR conditions
await db.from('users').or(['status.eq.active', 'role.eq.admin']).get();`,

  flutterQBAdvanced: `// Between (v2)
final recent = await db
  .from('orders')
  .between('total', 100, 1000)
  .get();

// Full-text search (v2)
final articles = await db
  .from('articles')
  .searchFullText('machine learning', limit: 10)
  .then((r) => r.data);

// Búsqueda simple
final found = await db.from('products').search('zapatillas').get();

// Relaciones (populate) (v2)
final withAuthor = await db
  .from('posts')
  .populate('author_id')  // o populate(['author_id', 'category_id'])
  .limit(10)
  .get();

// POST /records/query (body complejo) (v2)
final res = await db
  .from('orders')
  .queryBody(
    where: {'status': 'pending'},
    sort: 'created_at',
    ascending: false,
    limit: 50,
    includeDeleted: false,
  );`,

  flutterQBMutations: `// Crear
final post = await db.from('posts').insert({
  'title':  'Hola Dart',
  'status': 'draft',
});

// Crear múltiples
final posts = await db.from('posts').insertMany([
  {'title': 'Post A'},
  {'title': 'Post B'},
]);

// Upsert (insert o update por clave única)
await db.from('users')
  .upsert({'email': 'j@ex.com', 'name': 'Juan'}, 'email');

// Update filtrado
await db.from('posts').eq('status', 'draft').update({'status': 'published'});

// Merge (actualización parcial)
await db.from('products').eq('id', productId).merge({'price': 299});

// Con expiración
await db.from('sessions')
  .eq('id', sessionId)
  .update({'active': true}, expiresAt: DateTime.now().add(Duration(hours: 2)));

// Soft delete
await db.from('posts').eq('id', postId).delete();

// Hard delete (permanente)
await db.from('posts').hardDelete(postId);

// Restaurar
await db.from('posts').restore(postId);`,

  flutterQBPaginate: `// findOne por ID o filtro
final user = await db.from('users').findOne('user-uuid');
final byEmail = await db.from('users').findOne({'email': 'j@ex.com'});

// find (lista sin paginación)
final admins = await db.from('users').find({'role': 'admin'});

// getFirst
final latest = await db.from('posts').latest().getFirst();

// count
final total = await db.from('posts').eq('status', 'published').count();

// Seleccionar campos
final names = await db
  .from('users')
  .select(['id', 'name', 'email'])
  .limit(100)
  .get();

// Paginación como Stream (consume página por página)
await for (final page in db.from('orders').paginate(batchSize: 50)) {
  for (final order in page) {
    processOrder(order);
  }
}

// Exportar
final csvBytes = await db.from('orders').export(format: 'csv');
await File('orders.csv').writeAsBytes(csvBytes);`,

  flutterQBRealtime: `// subscribe desde QueryBuilder
final unsub = db
  .from('messages')
  .eq('room_id', 'room-123')
  .subscribe((event) {
    // event.type: 'create' | 'update' | 'delete'
    if (event.type == 'create') {
      setState(() => messages.add(event.record!));
    }
  });

// watch — devuelve Stream<RealtimeEvent>
StreamBuilder<RealtimeEvent>(
  stream: db.from('notifications').watch(),
  builder: (context, snapshot) {
    final event = snapshot.data;
    if (event == null) return const SizedBox();
    return NotificationBadge(event: event);
  },
)

// Limpiar
@override
void dispose() {
  unsub();
  super.dispose();
}`,

  flutterStorage: `// Subir con path de archivo
import 'package:matecitodb_flutter/matecitodb_flutter.dart';

final file = MatecitoFile(
  field:    'file',
  path:     '/tmp/avatar.jpg',
  filename: 'avatar.jpg',
);

final res = await db.storage.upload(file, onProgress: (sent, total) {
  print('Progreso: \${(sent / total * 100).toInt()}%');
});
print(res.data?.url);  // URL pública

// Subir desde URL remota
final res = await db.storage.uploadFromUrl(
  'https://example.com/photo.jpg',
  filename: 'imported.jpg',
);

// Listar archivos del proyecto
final files = await db.storage.list();
for (final f in files.data ?? []) {
  print('\${f.id} → \${f.url}');
}

// Eliminar
await db.storage.delete(fileId);`,

  flutterRealtime: `// Suscripción directa
final unsub = db.realtime.subscribe('posts', (event) {
  print('Acción: \${event.type}');
  print('Record: \${event.record}');
}, filter: {'status': 'published'});

// Stream con StreamBuilder
StreamBuilder<RealtimeEvent>(
  stream: db.realtime.watch('messages',
    filter: {'room_id': roomId}),
  builder: (context, snap) {
    final event = snap.data;
    return event != null
      ? MessageBubble(record: event.record!)
      : const SizedBox();
  },
)

// Estado de conexión
final stopListening = db.realtime.onStatusChange((status) {
  // 'connected' | 'disconnected'
  print('Realtime: \$status');
});

print(db.realtime.isConnected);

// Desconectar
db.realtime.disconnect();`,

  flutterCollections: `// Listar colecciones
final res = await db.collections.list();

// Crear colección con campos
await db.collections.create('events', fields: [
  {'name': 'title',    'type': 'text',   'required': true},
  {'name': 'date',     'type': 'date',   'required': true},
  {'name': 'capacity', 'type': 'number', 'required': false},
]);

// Renombrar / eliminar
await db.collections.rename('old_name', 'new_name');
await db.collections.delete('temp_table');

// Gestión de campos
final fields = db.collections.fields('posts');
await fields.list();
await fields.create(name: 'slug', type: 'text', required: true);
await fields.update(fieldId, required: false);
await fields.delete(fieldId);`,

  flutterPermissions: `// Permisos por colección
// Niveles: 'public' | 'auth' | 'service' | 'nobody'

// Obtener todos
final all = await db.permissions.getAll();

// Obtener permisos de una colección
final postPerms = await db.permissions.get('posts');

// Actualizar por operación
await db.permissions.set('posts', {
  'list':   'public',   // cualquiera puede listar
  'get':    'public',   // cualquiera puede ver uno
  'create': 'auth',     // solo autenticados pueden crear
  'update': 'auth',
  'delete': 'service',  // solo serviceKey puede eliminar
});

// Aplicar mismo nivel a todo
await db.permissions.setAll('drafts', 'auth');
await db.permissions.setAll('admin_logs', 'service');`,

  flutterWebhooks: `// Crear webhook
final res = await db.webhooks.create(
  url:    'https://myserver.com/hook',
  events: ['record.created', 'record.deleted', 'auth.signup'],
  secret: 'hmac-secret',
);

// Listar / actualizar / eliminar
final list = await db.webhooks.list();
await db.webhooks.update(hookId, enabled: false);
await db.webhooks.delete(hookId);

// Testear entrega
await db.webhooks.test(hookId);

// Historial de entregas
final attempts = await db.webhooks.attempts(hookId, limit: 50);

// Dead Letter Queue (entregas fallidas)
final dlq = await db.webhooks.dlqList(hookId);
await db.webhooks.dlqRetry(hookId, entryId);    // reintentar uno
await db.webhooks.dlqRetryAll(hookId);           // reintentar todos
await db.webhooks.dlqDiscard(hookId, entryId);   // descartar`,

  flutterSmtp: `// Configurar SMTP
await db.smtp.set(
  host: 'smtp.gmail.com',
  port: 587,
  user: 'noreply@myapp.com',
  from: 'noreply@myapp.com',
  pass: 'app-password',
);

// Actualizar parcialmente
await db.smtp.update(port: 465);

// Testear configuración
final err = await db.smtp.test('admin@myapp.com');
if (err == null) print('SMTP OK');

// Ver config actual
final config = await db.smtp.get();

// Eliminar config
await db.smtp.clear();`,

  flutterSql: `// SQL directo (requiere serviceKey)
final res = await db.sql.query(
  "SELECT id, name, email FROM auth_users WHERE created_at > NOW() - INTERVAL '7 days'"
);

if (!res.hasError) {
  final rows = res.data!.rows;  // List<Map<String, dynamic>>
  print('Filas: \${rows.length}');
}

// Útil para migraciones, reportes, etc.
await db.sql.query(
  "CREATE INDEX IF NOT EXISTS idx_posts_status ON posts_table(status)"
);`,

  flutterBatch: `// Batch básico
final result = await db.batch()
  .insert('users', {'name': 'Ana', 'role': 'editor'})
  .insert('users', {'name': 'Luis', 'role': 'viewer'})
  .update('user-uuid-1', {'role': 'admin'})
  .delete('user-uuid-old')
  .execute();

// Atómico — todo o nada (v2)
final atomic = await db.batch()
  .atomic()
  .insert('orders', {'product_id': 'p1', 'qty': 2})
  .update('p1', {'stock': 98}, collection: 'products')
  .execute();

// Dry run — validar sin escribir (v2)
final validation = await db.batch()
  .dryRun()
  .insert('posts', {'title': 'Test'})
  .delete('invalid-uuid')
  .execute();
// validation.valid / validation.invalid / validation.errors`,

  flutterFunctions: `// Invocar function (v2)
final result = await db.functions.invoke('send-welcome', args: {
  'email': 'user@example.com',
  'name':  'Juan',
});

// CRUD de functions
await db.functions.create(
  name:      'process-order',
  code:      "const { args } = context; return { ok: true }",
  timeoutMs: 5000,
  isPublic:  false,
);
final list = await db.functions.list();
await db.functions.update('process-order', timeoutMs: 10000);
await db.functions.delete('old-function');

// Logs
final logs = await db.functions.logs('send-welcome', limit: 20);

// Variables de entorno
await db.functions.envSet('STRIPE_KEY', 'sk_live_...');
final env = await db.functions.envList();
await db.functions.envDelete('OLD_KEY');

// Cron jobs
await db.functions.cronCreate(
  name:         'nightly-report',
  cronExpr:     '0 3 * * *',  // 3 AM todos los días
  functionName: 'generate-report',
  timezone:     'America/Buenos_Aires',
);
final crons = await db.functions.cronsList();
await db.functions.cronRun('nightly-report');  // ejecutar manualmente
await db.functions.cronDelete('nightly-report');

// Triggers (DB events → function)
await db.functions.triggerCreate(
  collection:   'orders',
  event:        'insert',  // insert | update | delete
  functionName: 'process-order',
);
final triggers = await db.functions.triggersList();
await db.functions.triggerToggle(triggerId, false);  // desactivar`,

  flutterAnalytics: `// Trackear evento (v2)
await db.analytics.track(
  'purchase',
  userId:     currentUser.id,
  sessionId:  sessionId,
  properties: {'product': 'Pro Plan', 'amount': 29.99, 'currency': 'USD'},
);

// Eventos agrupados
final events = await db.analytics.getEvents(
  groupBy: 'event',
  from:    '2024-01-01',
  to:      '2024-12-31',
);
for (final e in events) {
  print('\${e.event}: \${e.count} veces, \${e.uniqueUsers} usuarios únicos');
}

// Funnel
final funnel = await db.analytics.getFunnel(
  ['page_view', 'signup', 'checkout', 'purchase'],
);

// Historial de un usuario
final userEvents = await db.analytics.getUserEvents(userId, limit: 100);`,

  flutterAI: `// Chat (v2)
final res = await db.ai.chat([
  ChatMessage(role: 'system',    content: 'Sos un asistente técnico.'),
  ChatMessage(role: 'user',      content: '¿Cómo implemento auth?'),
], maxTokens: 500, temperature: 0.7);
print(res.data!['content']);

// Embeddings
final embed = await db.ai.embed('texto a vectorizar');
final vector = embed.data!['embedding'];  // List<double>

// Configurar proveedor
await db.ai.configureProvider(
  provider:       'openai',  // 'anthropic' | 'groq'
  apiKey:         'sk-...',
  model:          'gpt-4o-mini',
  embedModel:     'text-embedding-3-small',
  maxTokensPerDay: 100000,
);

// Generar schema con IA
final schema = await db.ai.generateSchema(
  'App de delivery con restaurantes, menú, pedidos y repartidores',
);
// Aplicar schema generado
await db.ai.applySchema(schema['collections']);

// Ver uso de tokens
final usage = await db.ai.usage();`,

  flutterConfig: `// Remote Config (v2)
// Obtener todos los valores
final configs = await db.remoteConfig.getAll();
final maintenance = configs['maintenance_mode']?.value ?? false;
final maxUpload   = configs['max_upload_mb']?.value ?? 10;

// Obtener uno
final res = await db.remoteConfig.get('feature_new_ui');
print(res.data?.value);  // true/false

// Crear / actualizar
await db.remoteConfig.set('feature_new_ui', true,
  description: 'Activa la nueva UI de dashboard',
  isPublic:    true,
);

// Eliminar
await db.remoteConfig.delete('old_flag');`,

  flutterNotifications: `// Registrar token push
await db.notifications.registerToken(fcmToken);

// Enviar push a usuarios (requiere serviceKey)
final result = await db.notifications.send(
  userIds: [userId1, userId2],
  title:   'Nueva actualización',
  body:    'Versión 2.0 disponible',
  data:    {'screen': 'updates', 'version': '2.0'},
);
print('Enviados: \${result.data?.successCount}');

// In-App Notifications (v2)
// Crear notificación in-app
await db.notifications.sendInApp(
  userIds: [userId],
  title:   'Pedido listo',
  body:    'Tu pedido #1234 está en camino.',
  type:    'success',  // info | success | warning | error
);

// Listar mis notificaciones
final list = await db.notifications.listMy(unreadOnly: true);
for (final n in list.notifications) {
  print('\${n.title}: \${n.body}');
}

// Contar no leídas
final count = await db.notifications.unreadCount();

// Marcar como leída
await db.notifications.markAsRead(notificationId);
await db.notifications.readAll();`,

  flutterForms: `// Forms (v2)
// Listar forms del proyecto
final forms = await db.forms.list();

// Ver submissions de un form
final submissions = await db.forms.submissions('contacto', limit: 50);

// Envío público (sin auth)
await db.forms.submitPublic('form-id', {
  'email':   'juan@example.com',
  'message': 'Consulta sobre precios',
});`,

  flutterWorkflows: `// Workflows (v2) — State machines para registros
// Listar workflows del proyecto
final workflows = await db.workflows.list();

// Ver estado actual de un registro en un workflow
final state = await db.workflows.getState('orders', orderId);
print('Estado: \${state.data?.currentState}');
print('Transiciones: \${state.data?.allowedTransitions}');

// Historial de transiciones
final history = await db.workflows.history('order-flow',
  recordId: orderId);`,

  flutterGeo: `// Geo queries (v2)
// Buscar registros cercanos a una ubicación
final nearby = await db.geo.near(
  'restaurants',
  lat:      -34.6037,
  lng:      -58.3816,   // Buenos Aires
  radiusKm: 5,
  limit:    20,
  filter:   {'category': 'pizza'},
);
for (final r in nearby) {
  print('\${r.data['name']} a \${r.distanceKm.toStringAsFixed(1)} km');
}

// Dentro de un bounding box
final inBounds = await db.geo.bounds(
  'events',
  north: -34.5, south: -34.7,
  east:  -58.3, west:  -58.5,
);`,

  flutterSync: `// Offline Sync (v2)
// Pull — bajar cambios desde el servidor
final changes = await db.sync.pull('posts',
  DateTime.now().subtract(Duration(hours: 1)).millisecondsSinceEpoch,
  limit: 100,
);
// changes: { records, deleted_ids, server_time }

// Push — subir cambios locales
final result = await db.sync.push('posts', [
  {'id': 'local-uuid', 'title': 'Draft offline', 'op': 'insert'},
  {'id': 'server-uuid', 'status': 'published', 'op': 'update'},
], conflictStrategy: 'last_write_wins'); // o 'server_wins'`,

  flutterSecurity: `// Security — IP Rules & Rate limits (v2)
// Bloquear un rango de IPs
await db.security.ipBlock('192.168.1.0/24',
  description: 'Rango corporativo sospechoso');

// Permitir un rango
await db.security.ipAllow('10.0.0.0/8',
  description: 'Red interna');

// Listar / eliminar reglas
final rules = await db.security.ipList();
await db.security.ipDelete(ruleId);
await db.security.ipToggle(ruleId, isActive: false);

// Testear si una IP sería bloqueada
final check = await db.security.ipTest('203.0.113.5');
print(check.data);  // { blocked: true, rule_id: '...' }

// Rate limits
await db.security.rateLimitCreate(
  path:     '/records',
  max:      100,
  windowMs: 60000,
  keyBy:    'user',  // 'ip' | 'user' | 'apiKey'
);
final limits = await db.security.rateLimitList();
await db.security.rateLimitDelete(limitId);`,

  flutterCache: `// Response Cache (v2)
// Cachear listados de 'products' por 5 minutos
await db.cache.create(
  collection: 'products',
  ttlSeconds: 300,
  varyBy:     [],  // mismo cache para todos los usuarios
);

// Cache por usuario (feed personalizado)
await db.cache.create(
  collection: 'feed',
  ttlSeconds: 30,
  varyBy:     ['user'],  // cache separado por usuario
);

// Por rol
await db.cache.create(
  collection: 'admin_reports',
  ttlSeconds: 3600,
  varyBy:     ['role'],
);

// Listar reglas
final rules = await db.cache.list();

// Invalidar inmediatamente (después de un write)
await db.cache.purge(ruleId);

// Estadísticas
final stats = await db.cache.stats();
print('Hit rate: \${stats.data?.hitRate}%');
await db.cache.delete(ruleId);`,

  flutterSchema: `// Schema Introspection (v2)
// Ver schema completo del proyecto
final schema = await db.schema.get();
for (final col in schema.data?.collections ?? []) {
  print('\${col.name}: \${col.fields.map((f) => f.name).join(', ')}');
}
// schema.data?.auth      → config de autenticación
// schema.data?.project   → metadata del proyecto

// Historial de migraciones
final migrations = await db.schema.migrations(limit: 50);
for (final m in migrations.data ?? []) {
  print('v\${m.version}: \${m.operation} on \${m.collection}');
}

// Rollback de una migración (solo estructural, no recupera datos)
await db.schema.rollback(version: 42);

// Explain query (requiere serviceKey)
final explain = await db.schema.explain(
  'orders',
  'status.eq.pending',
  sort: 'created_at', order: 'desc',
);
// explain.data: { estimated_rows, index_used, suggestions }`,
}

// ═══════════════════════════════════════════════════════════
// Section definitions
// ═══════════════════════════════════════════════════════════

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  description?: string
  snippets?: { title: string; code: string; lang: string; description?: string }[]
  badges?: string[]
}

const SDK_SECTIONS: Section[] = [
  {
    id: 'sdk-intro', title: 'Introducción', icon: <Code2 className="w-4 h-4" />,
    description: 'MatecitoDB es un Backend-as-a-Service (BaaS) con autenticación, bases de datos en tiempo real, storage y más. Soporta JavaScript/TypeScript y Flutter/Dart. El SDK soporta API v1 (default) y v2 (recomendada).',
    badges: ['npm install matecitodb', 'Flutter: matecitodb_flutter: ^4.0.0', 'v1: default · v2: recomendada'],
  },
  {
    id: 'sdk-api-version', title: 'API v1 vs v2', icon: <Globe className="w-4 h-4" />,
    description: 'El SDK soporta ambas versiones. Por defecto usa v1 para compatibilidad. Activá v2 para Functions, Analytics, AI, Remote Config, Forms, filtros avanzados y fixes de seguridad.',
    snippets: [
      { title: 'API v1 (default)', code: CODE.clientV1, lang: 'typescript', description: 'Compatible con todos los proyectos existentes.' },
      { title: 'API v2 (recomendada)', code: CODE.clientV2, lang: 'typescript', description: 'Incluye todos los módulos nuevos y security hardening.' },
    ],
    badges: ['v1: CRUD, Auth, Storage, Realtime, Webhooks', 'v2: v1 + Functions, Analytics, AI, Config, Forms, Notifications, vector search'],
  },
  {
    id: 'sdk-init', title: 'Inicialización', icon: <Key className="w-4 h-4" />,
    snippets: [{ title: 'lib/db.ts', code: CODE.client, lang: 'typescript', description: 'Inicializá el cliente con tus variables de entorno. Nunca expongas serviceKey en el cliente.' }],
  },
  {
    id: 'sdk-auth-basic', title: 'Auth — Básico', icon: <Shield className="w-4 h-4" />,
    description: 'Registro, login, logout y perfil del usuario actual.',
    snippets: [{ title: 'Auth básico', code: CODE.auth, lang: 'typescript' }],
  },
  {
    id: 'sdk-auth-session', title: 'Auth — Sesión', icon: <Shield className="w-4 h-4" />,
    description: 'Gestión de tokens, refresh y listener de cambios de sesión.',
    snippets: [{ title: 'Session & onAuthChange', code: CODE.authSession, lang: 'typescript' }],
  },
  {
    id: 'sdk-auth-password', title: 'Auth — Contraseña', icon: <Shield className="w-4 h-4" />,
    snippets: [{ title: 'Reset & verificación', code: CODE.authPassword, lang: 'typescript' }],
  },
  {
    id: 'sdk-auth-oauth', title: 'Auth — OAuth (v2)', icon: <Shield className="w-4 h-4" />,
    description: 'Login con Google, GitHub, Discord y Apple. Solo disponible en proyectos v2.',
    snippets: [{ title: 'OAuth flow', code: CODE.authOAuth, lang: 'typescript' }],
  },
  {
    id: 'sdk-auth-magiclink', title: 'Auth — Magic Link (v2)', icon: <Shield className="w-4 h-4" />,
    description: 'Login sin contraseña por email. El usuario recibe un link que lo autentica automáticamente.',
    snippets: [{ title: 'Magic link', code: CODE.authMagicLink, lang: 'typescript' }],
  },
  {
    id: 'sdk-auth-totp', title: 'Auth — TOTP / 2FA (v2)', icon: <Shield className="w-4 h-4" />,
    description: 'Autenticación de dos factores con Google Authenticator, Authy o cualquier app TOTP.',
    snippets: [{ title: 'TOTP setup & verify', code: CODE.authTOTP, lang: 'typescript' }],
  },
  {
    id: 'sdk-auth-admin', title: 'Auth — Admin & Roles', icon: <Shield className="w-4 h-4" />,
    description: 'Gestión de usuarios y roles desde el servidor. Requiere serviceKey.',
    snippets: [
      { title: 'Admin API', code: CODE.authAdmin, lang: 'typescript' },
      { title: 'Invitaciones', code: CODE.authInvitations, lang: 'typescript' },
    ],
  },
  {
    id: 'sdk-query-basic', title: 'QueryBuilder — Filtros', icon: <Database className="w-4 h-4" />,
    description: 'API fluida y tipada para consultar datos. Todos los métodos son encadenables.',
    snippets: [{ title: 'Filtros básicos', code: CODE.queryBuilder, lang: 'typescript' }],
  },
  {
    id: 'sdk-query-advanced', title: 'QueryBuilder — Avanzado', icon: <Database className="w-4 h-4" />,
    description: 'Full-text search, vector search, OR conditions, relaciones y más.',
    snippets: [{ title: 'Filtros avanzados', code: CODE.queryBuilderAdvanced, lang: 'typescript' }],
  },
  {
    id: 'sdk-query-mutations', title: 'QueryBuilder — Mutaciones', icon: <Database className="w-4 h-4" />,
    description: 'Insert, upsert, update, merge, delete, hard delete y restore.',
    snippets: [{ title: 'CRUD con QueryBuilder', code: CODE.queryBuilderMutations, lang: 'typescript' }],
  },
  {
    id: 'sdk-query-paginate', title: 'QueryBuilder — Paginación', icon: <Database className="w-4 h-4" />,
    description: 'paginate(), findOne(), count(), select() y export().',
    snippets: [{ title: 'Paginación & utilidades', code: CODE.queryBuilderPaginate, lang: 'typescript' }],
  },
  {
    id: 'sdk-query-realtime', title: 'QueryBuilder — Realtime', icon: <Zap className="w-4 h-4" />,
    description: 'subscribe() y watch() directamente desde el QueryBuilder.',
    snippets: [{ title: 'Realtime desde QB', code: CODE.queryBuilderRealtime, lang: 'typescript' }],
  },
  {
    id: 'sdk-records', title: 'Records (API clásica)', icon: <Database className="w-4 h-4" />,
    description: 'API imperativa con db.records.*. Compatible con v1 y v2.',
    snippets: [{ title: 'db.records.*', code: CODE.records, lang: 'typescript' }],
  },
  {
    id: 'sdk-realtime', title: 'Realtime', icon: <Zap className="w-4 h-4" />,
    description: 'Suscripción a eventos en tiempo real. v1 usa /ws, v2 usa /realtime (con presence).',
    snippets: [{ title: 'db.realtime.subscribe()', code: CODE.realtime, lang: 'typescript' }],
  },
  {
    id: 'sdk-storage', title: 'Almacenamiento', icon: <FileText className="w-4 h-4" />,
    snippets: [{ title: 'Storage', code: CODE.storage, lang: 'typescript' }],
  },
  {
    id: 'sdk-emails', title: 'Email (SMTP)', icon: <Mail className="w-4 h-4" />,
    snippets: [{ title: 'SMTP', code: CODE.emails, lang: 'typescript' }],
  },
  {
    id: 'sdk-functions', title: 'Functions (v2)', icon: <Workflow className="w-4 h-4" />,
    description: 'Ejecutar y gestionar serverless functions. Requiere proyecto v2.',
    snippets: [{ title: 'db.functions.*', code: CODE.functions, lang: 'typescript' }],
  },
  {
    id: 'sdk-analytics', title: 'Analytics (v2)', icon: <BarChart3 className="w-4 h-4" />,
    description: 'Eventos, funnels y métricas de uso. Requiere proyecto v2.',
    snippets: [{ title: 'db.analytics.*', code: CODE.analytics, lang: 'typescript' }],
  },
  {
    id: 'sdk-ai', title: 'AI Gateway (v2)', icon: <Sparkles className="w-4 h-4" />,
    description: 'Integrá OpenAI, Anthropic o Groq sin exponer API keys al cliente.',
    snippets: [{ title: 'db.ai.*', code: CODE.aiGateway, lang: 'typescript' }],
  },
  {
    id: 'sdk-config', title: 'Remote Config (v2)', icon: <Settings className="w-4 h-4" />,
    description: 'Feature flags y configuración remota en tiempo real.',
    snippets: [{ title: 'db.config.*', code: CODE.remoteConfig, lang: 'typescript' }],
  },
  {
    id: 'sdk-notifications', title: 'Notificaciones (v2)', icon: <Bell className="w-4 h-4" />,
    description: 'Push notifications a dispositivos iOS, Android y Web.',
    snippets: [{ title: 'db.notifications.*', code: CODE.notifications, lang: 'typescript' }],
  },
]

const V1_SECTIONS: Section[] = [
  {
    id: 'v1-intro', title: 'Overview', icon: <Globe className="w-4 h-4" />,
    description: 'API v1 — versión estable con CRUD, Auth, Storage, Realtime y Webhooks. Versión por defecto del SDK. Ideal para proyectos existentes.',
    snippets: [{ title: 'Base URL', code: 'https://tu-proyecto.matecito.dev/api/v1/', lang: 'http' }],
    badges: ['SDK default: apiVersion: "v1"', 'Estable y probada en producción', 'Headers: Authorization: Bearer <token>'],
  },
  {
    id: 'v1-auth', title: 'Autenticación', icon: <Shield className="w-4 h-4" />,
    snippets: [
      { title: 'POST /auth/register', code: CODE.v1Register, lang: 'http' },
      { title: 'POST /auth/login', code: CODE.v1Login, lang: 'http' },
      { title: 'POST /auth/refresh', code: CODE.v1Refresh, lang: 'http' },
      { title: 'Resetear contraseña', code: CODE.v1PasswordReset, lang: 'http' },
    ],
  },
  {
    id: 'v1-records', title: 'Registros', icon: <Database className="w-4 h-4" />,
    snippets: [
      { title: 'GET /records', code: CODE.v1ListRecords, lang: 'http' },
      { title: 'POST /records', code: CODE.v1CreateRecord, lang: 'http' },
      { title: 'PATCH /records/:id', code: CODE.v1UpdateRecord, lang: 'http' },
      { title: 'DELETE /records/:id', code: CODE.v1DeleteRecord, lang: 'http' },
    ],
  },
  {
    id: 'v1-collections', title: 'Colecciones', icon: <Code2 className="w-4 h-4" />,
    snippets: [
      { title: 'GET /collections', code: CODE.v1ListCollections, lang: 'http' },
      { title: 'POST /collections', code: CODE.v1CreateCollection, lang: 'http' },
      { title: 'POST /collections/:name/fields', code: CODE.v1AddField, lang: 'http' },
    ],
  },
  {
    id: 'v1-storage', title: 'Storage', icon: <FileText className="w-4 h-4" />,
    snippets: [{ title: 'Upload / List / Delete', code: CODE.v1Storage, lang: 'http' }],
  },
  {
    id: 'v1-realtime', title: 'Realtime (WebSocket)', icon: <Zap className="w-4 h-4" />,
    description: 'Conexión WebSocket para eventos en tiempo real. La URL de conexión usa wss:// en producción.',
    snippets: [{ title: 'WS v1 — /ws', code: CODE.v1Realtime, lang: 'http' }],
  },
  {
    id: 'v1-permissions', title: 'Permisos', icon: <Shield className="w-4 h-4" />,
    snippets: [{ title: 'GET / POST /permissions', code: CODE.v1Permissions, lang: 'http' }],
  },
  {
    id: 'v1-webhooks', title: 'Webhooks', icon: <Zap className="w-4 h-4" />,
    snippets: [{ title: 'POST /webhooks', code: CODE.v1Webhook, lang: 'http' }],
  },
  {
    id: 'v1-stats', title: 'Stats', icon: <BarChart3 className="w-4 h-4" />,
    snippets: [{ title: 'GET /stats', code: CODE.v1Stats, lang: 'http' }],
  },
]

const V2_SECTIONS: Section[] = [
  {
    id: 'v2-intro', title: 'Overview', icon: <Sparkles className="w-4 h-4" />,
    description: 'API v2 incluye todo lo de v1 + Functions, Analytics, AI Gateway, Remote Config, Forms, Notifications, batch operations y filtros avanzados. La migración de v1 a v2 es irreversible.',
    snippets: [{ title: 'Base URL', code: 'https://tu-proyecto.matecito.dev/api/v2/', lang: 'http' }],
    badges: ['Nuevos proyectos: v2 por defecto', 'Migración v1→v2: irreversible desde el dashboard', 'Security: token refresh, rate limiting, CORS config, AES-256 para API keys'],
  },
  {
    id: 'v2-auth-oauth', title: 'Auth — OAuth', icon: <Shield className="w-4 h-4" />,
    description: 'Login social con Google, GitHub, Discord y Apple.',
    snippets: [{ title: 'OAuth flow', code: CODE.v2AuthOAuth, lang: 'http' }],
  },
  {
    id: 'v2-auth-totp', title: 'Auth — TOTP / 2FA', icon: <Shield className="w-4 h-4" />,
    description: 'Autenticación de dos factores con apps TOTP (Google Authenticator, Authy).',
    snippets: [{ title: 'TOTP endpoints', code: CODE.v2AuthTOTP, lang: 'http' }],
  },
  {
    id: 'v2-functions', title: 'Functions', icon: <Workflow className="w-4 h-4" />,
    snippets: [
      { title: 'POST /functions — Crear', code: CODE.v2Function, lang: 'http' },
      { title: 'POST /functions/:name/invoke', code: CODE.v2Invoke, lang: 'http' },
      { title: 'GET /functions/history', code: CODE.v2FunctionHistory, lang: 'http' },
    ],
  },
  {
    id: 'v2-analytics', title: 'Analytics', icon: <BarChart3 className="w-4 h-4" />,
    snippets: [
      { title: 'POST /analytics/track', code: CODE.v2Track, lang: 'http' },
      { title: 'GET /analytics/events', code: CODE.v2Events, lang: 'http' },
      { title: 'GET /analytics/funnel', code: CODE.v2Funnel, lang: 'http' },
    ],
  },
  {
    id: 'v2-ai', title: 'AI Gateway', icon: <Sparkles className="w-4 h-4" />,
    snippets: [
      { title: 'PUT /project/ai-config', code: CODE.v2AIConfig, lang: 'http', description: 'Configurá el proveedor AI. Keys encriptadas con AES-256.' },
      { title: 'POST /ai/chat', code: CODE.v2AIChat, lang: 'http' },
    ],
  },
  {
    id: 'v2-config', title: 'Remote Config', icon: <Settings className="w-4 h-4" />,
    snippets: [
      { title: 'PUT /config/:key', code: CODE.v2ConfigSet, lang: 'http' },
      { title: 'GET /config', code: CODE.v2ConfigGet, lang: 'http' },
    ],
  },
  {
    id: 'v2-forms', title: 'Forms', icon: <FileText className="w-4 h-4" />,
    snippets: [
      { title: 'POST /forms', code: CODE.v2Form, lang: 'http' },
      { title: 'GET /forms/:name/submissions', code: CODE.v2Submissions, lang: 'http' },
    ],
  },
  {
    id: 'v2-notifications', title: 'Notificaciones Push', icon: <Bell className="w-4 h-4" />,
    description: 'Push notifications a dispositivos iOS, Android y Web via FCM/APNs.',
    snippets: [{ title: 'Devices & Send', code: CODE.v2Notifications, lang: 'http' }],
  },
  {
    id: 'v2-realtime', title: 'Realtime (WebSocket)', icon: <Zap className="w-4 h-4" />,
    description: 'v2 usa /realtime en lugar de /ws. Incluye soporte de presence para saber qué usuarios están conectados.',
    snippets: [{ title: 'WS v2 — /realtime', code: CODE.v2Realtime, lang: 'http' }],
  },
  {
    id: 'v2-batch', title: 'Batch Operations', icon: <Database className="w-4 h-4" />,
    description: 'Ejecutar múltiples operaciones en una sola request. Transaccional — o todas pasan o ninguna.',
    snippets: [{ title: 'POST /batch', code: CODE.v2Batch, lang: 'http' }],
  },
  {
    id: 'v2-filters', title: 'Filtros avanzados', icon: <Database className="w-4 h-4" />,
    description: 'v2 extiende los query params de v1 con between, isNull, has (arrays), full-text search, include_deleted y export.',
    snippets: [{ title: 'Query params v2', code: CODE.v2Filters, lang: 'http' }],
  },
]

const FLUTTER_SECTIONS: Section[] = [
  {
    id: 'fl-intro', title: 'Introducción', icon: <Smartphone className="w-4 h-4" />,
    description: 'El SDK Flutter de MatecitoDB tiene paridad completa con el SDK JS/TS. Soporta Auth, QueryBuilder, Realtime, Storage, Collections, Permissions, Webhooks, SMTP, SQL, Batch, y todos los módulos v2: Functions (con crons + triggers), Analytics, AI Gateway, Remote Config, Notifications (push + in-app), Forms, Workflows, Geo, Sync, Security y Cache.',
    badges: ['matecitodb_flutter: ^4.0.0', 'Dart SDK: >=3.0.0', 'Flutter: >=3.10.0', 'Null-safe', 'Auto-refresh de tokens', 'Retry con backoff exponencial'],
  },
  {
    id: 'fl-install', title: 'Instalación e Init', icon: <Terminal className="w-4 h-4" />,
    snippets: [
      { title: 'pubspec.yaml', code: CODE.flutterInstall, lang: 'yaml' },
      { title: 'main.dart — createClient', code: CODE.flutterInit, lang: 'dart', description: 'Esperá a sessionReady antes de renderizar la app para restaurar sesión persistida.' },
    ],
  },
  {
    id: 'fl-auth-basic', title: 'Auth — Básico', icon: <Shield className="w-4 h-4" />,
    snippets: [
      { title: 'signUp / signIn / signOut / getMe', code: CODE.flutterAuth, lang: 'dart' },
      { title: 'Stream de sesión', code: CODE.flutterAuthStream, lang: 'dart', description: 'authStateStream emite AuthUser? al loguearse/desloguearse.' },
    ],
  },
  {
    id: 'fl-auth-session', title: 'Auth — Sesión & Contraseña', icon: <Shield className="w-4 h-4" />,
    snippets: [{ title: 'refresh / reset / updateProfile', code: CODE.flutterAuthPassword, lang: 'dart' }],
  },
  {
    id: 'fl-auth-oauth', title: 'Auth — OAuth (v2)', icon: <Shield className="w-4 h-4" />,
    description: 'Login social con Google, GitHub, Discord, Apple. Manejá el deeplink de callback con handleOAuthCallback.',
    snippets: [{ title: 'getOAuthUrl + handleOAuthCallback', code: CODE.flutterAuthOAuth, lang: 'dart' }],
  },
  {
    id: 'fl-auth-totp', title: 'Auth — Magic Link & TOTP (v2)', icon: <Shield className="w-4 h-4" />,
    snippets: [{ title: 'magicLink / TOTP setup / verify', code: CODE.flutterAuthMagicTOTP, lang: 'dart' }],
  },
  {
    id: 'fl-auth-admin', title: 'Auth — Admin, Roles & Invitaciones', icon: <Shield className="w-4 h-4" />,
    description: 'admin.* y roles.* requieren serviceKey. invitations.* solo v2.',
    snippets: [{ title: 'admin / oauth / roles / invitations', code: CODE.flutterAuthAdmin, lang: 'dart' }],
  },
  {
    id: 'fl-qb-filters', title: 'QueryBuilder — Filtros', icon: <Database className="w-4 h-4" />,
    description: 'API fluida y tipada. Todos los métodos son encadenables.',
    snippets: [{ title: 'eq / gte / ilike / inValues / isNull / has', code: CODE.flutterQBFilters, lang: 'dart' }],
  },
  {
    id: 'fl-qb-advanced', title: 'QueryBuilder — Avanzado', icon: <Database className="w-4 h-4" />,
    description: 'between, full-text search, populate relaciones, or conditions, queryBody (v2).',
    snippets: [{ title: 'between / searchFullText / populate / queryBody', code: CODE.flutterQBAdvanced, lang: 'dart' }],
  },
  {
    id: 'fl-qb-mutations', title: 'QueryBuilder — Mutaciones', icon: <Database className="w-4 h-4" />,
    description: 'insert, insertMany, upsert, update, merge (con expiración), delete, hardDelete, restore.',
    snippets: [{ title: 'CRUD + upsert + expiración', code: CODE.flutterQBMutations, lang: 'dart' }],
  },
  {
    id: 'fl-qb-paginate', title: 'QueryBuilder — Paginación & Utilidades', icon: <Database className="w-4 h-4" />,
    description: 'findOne, find, getFirst, count, select, paginate (Stream), export a CSV/JSON.',
    snippets: [{ title: 'paginate / find / count / export', code: CODE.flutterQBPaginate, lang: 'dart' }],
  },
  {
    id: 'fl-qb-realtime', title: 'QueryBuilder — Realtime', icon: <Zap className="w-4 h-4" />,
    description: 'subscribe() callback y watch() Stream directamente desde el QueryBuilder.',
    snippets: [{ title: 'subscribe + StreamBuilder', code: CODE.flutterQBRealtime, lang: 'dart' }],
  },
  {
    id: 'fl-storage', title: 'Storage', icon: <FileText className="w-4 h-4" />,
    description: 'upload (con progress callback), uploadFromUrl, list, delete. El servidor convierte imágenes a WebP.',
    snippets: [{ title: 'upload / uploadFromUrl / list / delete', code: CODE.flutterStorage, lang: 'dart' }],
  },
  {
    id: 'fl-realtime', title: 'Realtime Service', icon: <Zap className="w-4 h-4" />,
    description: 'WebSocket con reconexión automática (backoff exponencial), ping/pong y re-subscribe automático tras reconexión.',
    snippets: [{ title: 'subscribe / watch / onStatusChange', code: CODE.flutterRealtime, lang: 'dart' }],
  },
  {
    id: 'fl-collections', title: 'Colecciones & Campos', icon: <Code2 className="w-4 h-4" />,
    description: 'Gestión de schema: crear/renombrar/eliminar colecciones y sus campos.',
    snippets: [{ title: 'collections + fields', code: CODE.flutterCollections, lang: 'dart' }],
  },
  {
    id: 'fl-permissions', title: 'Permisos', icon: <Shield className="w-4 h-4" />,
    description: 'Niveles: public, auth, service, nobody. Por operación (list/get/create/update/delete).',
    snippets: [{ title: 'permissions.set / setAll', code: CODE.flutterPermissions, lang: 'dart' }],
  },
  {
    id: 'fl-webhooks', title: 'Webhooks', icon: <Zap className="w-4 h-4" />,
    description: 'Eventos: record.created/updated/deleted, auth.signup/login, storage.upload. Incluye DLQ para reintentos.',
    snippets: [{ title: 'create / test / DLQ', code: CODE.flutterWebhooks, lang: 'dart' }],
  },
  {
    id: 'fl-smtp', title: 'SMTP', icon: <Mail className="w-4 h-4" />,
    description: 'Configuración de email transaccional para autenticación y notificaciones.',
    snippets: [{ title: 'smtp.set / test / clear', code: CODE.flutterSmtp, lang: 'dart' }],
  },
  {
    id: 'fl-sql', title: 'SQL Directo', icon: <Terminal className="w-4 h-4" />,
    description: 'Ejecutar SQL raw contra el schema aislado del proyecto. Requiere serviceKey.',
    snippets: [{ title: 'db.sql.query()', code: CODE.flutterSql, lang: 'dart' }],
  },
  {
    id: 'fl-batch', title: 'Batch', icon: <Database className="w-4 h-4" />,
    description: 'Múltiples operaciones en una request. atomic() = transaccional. dryRun() = validar sin escribir (v2).',
    snippets: [{ title: 'batch / atomic / dryRun', code: CODE.flutterBatch, lang: 'dart' }],
  },
  {
    id: 'fl-functions', title: 'Functions (v2)', icon: <Workflow className="w-4 h-4" />,
    description: 'Serverless functions con CRUD, env vars, cron jobs y triggers por eventos de DB.',
    snippets: [{ title: 'invoke / create / logs / env / crons / triggers', code: CODE.flutterFunctions, lang: 'dart' }],
  },
  {
    id: 'fl-analytics', title: 'Analytics (v2)', icon: <BarChart3 className="w-4 h-4" />,
    description: 'Track eventos, groupBy, funnels y historial por usuario.',
    snippets: [{ title: 'track / getEvents / getFunnel / getUserEvents', code: CODE.flutterAnalytics, lang: 'dart' }],
  },
  {
    id: 'fl-ai', title: 'AI Gateway (v2)', icon: <Sparkles className="w-4 h-4" />,
    description: 'Chat, embeddings, generación de schema con IA, configuración de proveedor y usage tracking.',
    snippets: [{ title: 'chat / embed / configureProvider / generateSchema', code: CODE.flutterAI, lang: 'dart' }],
  },
  {
    id: 'fl-config', title: 'Remote Config (v2)', icon: <Settings className="w-4 h-4" />,
    description: 'Feature flags y configuración remota. remoteConfig (no config) es el accessor en el SDK.',
    snippets: [{ title: 'db.remoteConfig.*', code: CODE.flutterConfig, lang: 'dart' }],
  },
  {
    id: 'fl-notifications', title: 'Notificaciones (v2)', icon: <Bell className="w-4 h-4" />,
    description: 'Push notifications (FCM) + in-app notifications con conteo de no leídas y marcado como leído.',
    snippets: [{ title: 'push + in-app notifications', code: CODE.flutterNotifications, lang: 'dart' }],
  },
  {
    id: 'fl-forms', title: 'Forms (v2)', icon: <FileText className="w-4 h-4" />,
    description: 'Listar forms, ver submissions, y envío público sin auth.',
    snippets: [{ title: 'list / submissions / submitPublic', code: CODE.flutterForms, lang: 'dart' }],
  },
  {
    id: 'fl-workflows', title: 'Workflows (v2)', icon: <Workflow className="w-4 h-4" />,
    description: 'State machines para registros. Definí flujos (borrador→revisión→publicado) y consultá el estado de cada registro.',
    snippets: [{ title: 'getState / history', code: CODE.flutterWorkflows, lang: 'dart' }],
  },
  {
    id: 'fl-geo', title: 'Geo (v2)', icon: <Globe className="w-4 h-4" />,
    description: 'Búsqueda de registros por proximidad geográfica y bounding box.',
    snippets: [{ title: 'geo.near / geo.bounds', code: CODE.flutterGeo, lang: 'dart' }],
  },
  {
    id: 'fl-sync', title: 'Offline Sync (v2)', icon: <Zap className="w-4 h-4" />,
    description: 'Sincronización offline-first: pull de cambios y push de operaciones locales con estrategias de conflicto.',
    snippets: [{ title: 'sync.pull / sync.push', code: CODE.flutterSync, lang: 'dart' }],
  },
  {
    id: 'fl-security', title: 'Security (v2)', icon: <Shield className="w-4 h-4" />,
    description: 'IP allowlist/blocklist y rate limits por endpoint. Solo v2.',
    snippets: [{ title: 'ipBlock / ipAllow / rateLimitCreate', code: CODE.flutterSecurity, lang: 'dart' }],
  },
  {
    id: 'fl-cache', title: 'Cache (v2)', icon: <Settings className="w-4 h-4" />,
    description: 'Cache de responses por colección con TTL y varyBy (global, por usuario, por rol).',
    snippets: [{ title: 'cache.create / purge / stats', code: CODE.flutterCache, lang: 'dart' }],
  },
  {
    id: 'fl-schema', title: 'Schema Introspection (v2)', icon: <Database className="w-4 h-4" />,
    description: 'Schema completo del proyecto, historial de migraciones, rollback estructural y explain de queries.',
    snippets: [{ title: 'schema.get / migrations / rollback / explain', code: CODE.flutterSchema, lang: 'dart' }],
  },
]

// ═══════════════════════════════════════════════════════════
// Components
// ═══════════════════════════════════════════════════════════

function CodeBlock({ code, lang, title }: { code: string; lang: string; title?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl overflow-hidden border group" style={{ borderColor: 'var(--border)' }}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <span className="text-[11px] font-medium" style={{ color: 'var(--fg-secondary)' }}>{title}</span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--fg-tertiary)' }}>{lang}</span>
        </div>
      )}
      {!title && (
        <div className="flex items-center justify-end px-3 py-1.5 border-b" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border)' }}>
          <span className="text-[10px] font-mono" style={{ color: 'var(--fg-tertiary)' }}>{lang}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--fg-secondary)' }}>
          {code}
        </pre>
        <button onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-secondary)]"
          style={{ color: 'var(--fg-tertiary)' }}>
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}

function SectionContent({ section }: { section: Section }) {
  return (
    <div className="space-y-6">
      {section.description && (
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{section.description}</p>
      )}
      {section.badges && (
        <div className="flex flex-wrap gap-2">
          {section.badges.map((b, i) => (
            <div key={i} className="inline-flex px-3 py-1.5 rounded-lg text-xs font-mono" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--fg-secondary)', border: `1px solid var(--border)` }}>
              {b}
            </div>
          ))}
        </div>
      )}
      {section.snippets?.map((s, i) => (
        <div key={i} className="space-y-2">
          {s.description && <p className="text-xs" style={{ color: 'var(--fg-tertiary)' }}>{s.description}</p>}
          <CodeBlock code={s.code} lang={s.lang} title={s.title} />
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════════════════

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('sdk')
  const [activeSection, setActiveSection] = useState('sdk-intro')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  const sectionsMap: Record<Tab, Section[]> = {
    sdk:       SDK_SECTIONS,
    'rest-v1': V1_SECTIONS,
    'rest-v2': V2_SECTIONS,
    flutter:   FLUTTER_SECTIONS,
  }
  const sections = sectionsMap[activeTab]

  useEffect(() => {
    setActiveSection(sections[0]?.id || '')
    setMobileMenuOpen(false)
  }, [activeTab])

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filteredSections = searchQuery
    ? sections.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sections

  const tabs: { id: Tab; label: string; icon: React.ReactNode; short: string; badge?: string }[] = [
    { id: 'sdk',       label: 'SDK JavaScript', icon: <Code2 className="w-4 h-4" />,      short: 'SDK' },
    { id: 'flutter',   label: 'SDK Flutter',    icon: <Smartphone className="w-4 h-4" />, short: 'Flutter' },
    { id: 'rest-v1',   label: 'REST API v1',    icon: <Globe className="w-4 h-4" />,       short: 'v1',      badge: 'stable' },
    { id: 'rest-v2',   label: 'REST API v2',    icon: <Sparkles className="w-4 h-4" />,   short: 'v2',      badge: 'recommended' },
  ]

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)' }}>
      {/* Top header */}
      <header className="h-14 flex items-center justify-between px-6 shrink-0 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <img src="/logos/matecitologo.png" alt="Matecito" className="w-7 h-7 object-contain" />
          <h1 className="text-sm font-semibold" style={{ color: 'var(--fg-primary)' }}>Documentación</h1>
        </div>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--fg-tertiary)' }} />
          <input
            type="text" placeholder="Buscar en docs..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-none w-56 transition-colors focus:border-[var(--accent)]"
            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--fg-primary)' }}
          />
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-1.5 rounded-md hover:bg-[var(--bg-secondary)]">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 px-6 py-1 border-b shrink-0 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "text-[var(--accent)]"
                : "text-[var(--fg-tertiary)] hover:text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)]")}
            style={activeTab === tab.id ? { backgroundColor: 'var(--accent-soft)' } : {}}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.short}</span>
            {tab.badge && (
              <span className={cn("hidden sm:inline text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                tab.badge === 'recommended' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400')}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar TOC — desktop */}
        <aside className={cn(
          "w-56 shrink-0 border-r overflow-y-auto hidden sm:block",
          mobileMenuOpen ? "!block absolute sm:relative z-30 h-[calc(100vh-7.5rem)] bg-[var(--bg-primary)]" : ""
        )} style={{ borderColor: 'var(--border)' }}>
          <nav className="p-3 space-y-0.5">
            {filteredSections.map(section => (
              <button key={section.id} onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all text-left",
                  activeSection === section.id ? "font-medium" : "hover:bg-[var(--bg-secondary)]"
                )}
                style={activeSection === section.id
                  ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }
                  : { color: 'var(--fg-secondary)' }
                }
              >
                <span className="shrink-0">{section.icon}</span>
                <span className="truncate">{section.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-20 bg-[var(--bg-overlay)] sm:hidden" onClick={() => setMobileMenuOpen(false)}>
            <aside className="w-64 h-[calc(100vh-7.5rem)] overflow-y-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <nav className="p-3 space-y-0.5">
                {filteredSections.map(section => (
                  <button key={section.id} onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all text-left",
                      activeSection === section.id ? "font-medium" : "hover:bg-[var(--bg-secondary)]"
                    )}
                    style={activeSection === section.id
                      ? { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }
                      : { color: 'var(--fg-secondary)' }
                    }
                  >
                    <span className="shrink-0">{section.icon}</span>
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-10">
            {filteredSections.map(section => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <div className="flex items-center gap-2.5 mb-4">
                  <span style={{ color: 'var(--fg-tertiary)' }}>{section.icon}</span>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--fg-primary)' }}>{section.title}</h2>
                </div>
                <SectionContent section={section} />
              </section>
            ))}

            {filteredSections.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--fg-tertiary)' }} />
                <p className="text-sm" style={{ color: 'var(--fg-secondary)' }}>Sin resultados para "{searchQuery}"</p>
              </div>
            )}

            <div className="h-20" />
          </div>
        </main>
      </div>
    </div>
  )
}
