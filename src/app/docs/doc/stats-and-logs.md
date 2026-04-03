# Stats y Logs

Monitoreo e infraestructura del proyecto accesibles via `db.stats` y `db.logs`. Requieren `serviceKey`.

---

## Estadísticas del proyecto

````carousel
```ts
const { data: stats, error } = await db.stats.get()

if (stats) {
  console.log('Registros totales:',  stats.total_records)
  console.log('Storage usado (MB):', stats.storage_used_mb)
  console.log('Requests hoy:',       stats.requests_today)
  console.log('Usuarios activos:',   stats.active_users)
}
```
<!-- slide -->
```dart
final res = await db.stats.get();

if (res.data != null) {
  print('Registros: ${res.data!['total_records']}');
  print('Storage:   ${res.data!['storage_used_mb']} MB');
  print('Requests:  ${res.data!['requests_today']}');
}
```
````

---

## Logs de requests

Útil para debugging, auditoría y tracking de errores en producción.

````carousel
```ts
// Últimos 50 logs
const { data: logs } = await db.logs.list({ limit: 50 })

// Filtrar por código HTTP
const { data: errors }   = await db.logs.list({ status: 500 })
const { data: notFound } = await db.logs.list({ status: 404 })

// Filtrar por método HTTP
const { data: writes }  = await db.logs.list({ method: 'POST' })
const { data: deletes } = await db.logs.list({ method: 'DELETE' })

// Filtrar por path
const { data: authLogs } = await db.logs.list({ path: '/auth' })

// Cada log tiene:
// log.method, log.path, log.status, log.duration_ms,
// log.ip, log.user_id, log.created_at
```
<!-- slide -->
```dart
// Últimos 50 logs
final res = await db.logs.list(limit: 50);

// Filtrar
final errors   = await db.logs.list(status: 500);
final posts    = await db.logs.list(method: 'POST');
final authLogs = await db.logs.list(path: '/auth');

// Cada log:
// log['method'], log['path'], log['status'],
// log['duration_ms'], log['user_id'], log['created_at']
```
````

---

Siguiente: [SMTP y Email](smtp-and-email.md)
