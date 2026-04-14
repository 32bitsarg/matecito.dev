# Permisos

Controlá quién puede leer y escribir en cada colección. Requiere `serviceKey`.

---

## Niveles de acceso

| Nivel | Descripción |
|-------|-------------|
| `public` | Sin autenticación — cualquiera puede acceder |
| `auth` | Requiere un JWT válido (usuario autenticado) |
| `service` | Solo con `serviceKey` (admin / server-side) |
| `nobody` | Nadie puede acceder (útil para bloquear temporalmente) |

---

## Ver permisos

````carousel
```ts
// Ver permisos de todas las colecciones
const { data } = await db.permissions.getAll()
// { posts: { list: 'public', get: 'public', create: 'auth', update: 'auth', delete: 'service' }, ... }

// Ver permisos de una colección específica
const { data: perms } = await db.permissions.get('posts')
console.log(perms.list)    // 'public'
console.log(perms.create)  // 'auth'
```
<!-- slide -->
```dart
// Todas las colecciones
final res = await db.permissions.getAll();

// Una colección
final res = await db.permissions.get('posts');
print(res.data?['list']);    // 'public'
print(res.data?['create']);  // 'auth'
```
````

---

## Actualizar permisos

````carousel
```ts
// Configurar por operación
await db.permissions.set('posts', {
  list:   'public',   // cualquiera puede listar
  get:    'public',   // cualquiera puede ver uno
  create: 'auth',     // solo usuarios autenticados crean
  update: 'auth',     // solo usuarios autenticados actualizan
  delete: 'service',  // solo el servidor puede borrar
})

// Aplicar el mismo nivel a TODAS las operaciones
await db.permissions.setAll('private_data', 'service')
await db.permissions.setAll('public_config', 'public')

// Bloquear completamente (mantenimiento / colección interna)
await db.permissions.setAll('system_logs', 'nobody')
```
<!-- slide -->
```dart
// Configurar por operación
await db.permissions.set('posts', {
  'list':   'public',
  'get':    'public',
  'create': 'auth',
  'update': 'auth',
  'delete': 'service',
});

// Aplicar el mismo nivel a todas las operaciones
await db.permissions.setAll('private_data', 'service');
await db.permissions.setAll('public_config', 'public');
```
````

---

## Operaciones disponibles

| Operación | Descripción |
|-----------|-------------|
| `list` | Listar registros (GET con filtros) |
| `get` | Obtener un registro por ID |
| `create` | Insertar nuevos registros |
| `update` | Actualizar registros existentes |
| `delete` | Eliminar registros (soft o hard) |

---

## REST API (v1)

```http
# Ver permisos de una colección
GET /api/v1/project/:id/permissions?collection=posts
Authorization: Bearer <service-token>

# Actualizar permisos
POST /api/v1/project/:id/permissions
Authorization: Bearer <service-token>
Content-Type: application/json

{
  "collection": "posts",
  "list":   "public",
  "get":    "public",
  "create": "auth",
  "update": "auth",
  "delete": "service"
}
```

---

Siguiente: [Stats y Logs](stats-and-logs.md)
