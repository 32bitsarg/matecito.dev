# Estadísticas y Logs (Stats & Logs)

La gestión y monitorización de la infraestructura del proyecto son accesibles a través de `db.stats` y `db.logs`. Estas son herramientas administrativas y requieren el uso de una `serviceKey`.

## Estadísticas del Proyecto

````carousel
```ts
// Obtener estadísticas globales del proyecto
const { data: stats } = await db.stats.get()

console.log('Total de registros:', stats.total_records)
console.log('Almacenamiento usado:', stats.storage_used_mb, 'MB')
console.log('Solicitudes hoy:', stats.requests_today)
```
<!-- slide -->
```dart
// Obtener estadísticas globales del proyecto
final res = await db.stats.get();

if (res.data != null) {
  print('Total de registros: ${res.data!['total_records']}');
  print('Almacenamiento usado: ${res.data!['storage_used_mb']} MB');
  print('Solicitudes hoy: ${res.data!['requests_today']}');
}
```
````

## Logs de Solicitudes (Request Logs)

Los logs son útiles para depurar y realizar un seguimiento de la actividad en tu proyecto.

````carousel
```ts
// Listar logs recientes
const { data: logs } = await db.logs.list({ limit: 50 })

// Filtrar por código de estado (ej: errores 500)
const { data: errors } = await db.logs.list({ status: 500 })

// Filtrar por método HTTP
const { data: postLogs } = await db.logs.list({ method: 'POST' })
```
<!-- slide -->
```dart
// Listar logs recientes
final res = await db.logs.list(limit: 50);

// Filtrar por código de estado (ej: errores 500)
final errorRes = await db.logs.list(status: 500);

// Filtrar por método HTTP
final postRes = await db.logs.list(method: 'POST');
```
````

---

Siguiente: [SMTP y Plantillas de Correo](smtp-and-email.md)
