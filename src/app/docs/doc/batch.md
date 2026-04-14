# Batch Operations

El módulo Batch te permite ejecutar múltiples operaciones en una sola transacción del servidor: todas se aplican o ninguna.

---

## Operaciones básicas

````carousel
```ts
const result = await db.batch()
  .insert('posts',    { title: 'Post A', status: 'publicado' })
  .insert('posts',    { title: 'Post B', status: 'borrador' })
  .update('settings', { key: 'theme', value: 'dark' }, { eq: { key: 'theme' } })
  .delete('drafts',   'draft-uuid')
  .execute()

for (const item of result.results) {
  if (item.ok) {
    console.log('OK:', item.record)
  } else {
    console.error('Error:', item.error)
  }
}
```
<!-- slide -->
```dart
final result = await db.batch()
    .insert('posts',    {'title': 'Post A', 'status': 'publicado'})
    .insert('posts',    {'title': 'Post B', 'status': 'borrador'})
    .update('settings', {'value': 'dark'}, eq: {'key': 'theme'})
    .delete('drafts',   'draft-uuid')
    .execute();

for (final item in result.results) {
  if (item.ok) {
    print('OK: ${item.record}');
  } else {
    print('Error: ${item.error}');
  }
}
```
````

---

## Modo atómico

En modo atómico, si una operación falla, **todas se revierten**.

````carousel
```ts
const result = await db.batch({ atomic: true })
  .insert('orders',        { user_id: 'abc', total: 1500 })
  .update('users',         { credits: 0 }, { eq: { id: 'abc' } })
  .delete('cart_items',    'cart-uuid')
  .execute()

if (!result.ok) {
  console.error('Transacción fallida, todo revertido:', result.error)
}
```
<!-- slide -->
```dart
final result = await db.batch(atomic: true)
    .insert('orders',     {'user_id': 'abc', 'total': 1500})
    .update('users',      {'credits': 0}, eq: {'id': 'abc'})
    .delete('cart_items', 'cart-uuid')
    .execute();

if (!result.ok) {
  print('Transacción fallida: ${result.error}');
}
```
````

---

## Dry run (validación sin persistir)

````carousel
```ts
// Simula las operaciones sin escribir en la base de datos
const result = await db.batch({ dryRun: true })
  .insert('products', { name: 'Yerba', price: -10 })  // precio negativo
  .execute()

if (!result.ok) {
  console.error('Validación falló:', result.results[0].error)
  // 'price must be a positive number'
}
```
<!-- slide -->
```dart
final result = await db.batch(dryRun: true)
    .insert('products', {'name': 'Yerba', 'price': -10})
    .execute();

if (!result.ok) {
  print('Validación falló: ${result.results.first.error}');
}
```
````

---

## REST API (v2)

```http
POST /api/v2/project/:id/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "atomic": true,
  "operations": [
    { "method": "POST",   "path": "/records", "body": { "collection": "users", "data": { "name": "Ana" } } },
    { "method": "PATCH",  "path": "/records/uuid-1", "body": { "status": "active" } },
    { "method": "DELETE", "path": "/records/uuid-2" }
  ]
}

# Response
{ "ok": true, "results": [{ "status": 201, "body": { ... } }, ...] }
```

---

Siguiente: [SQL Directo](sql.md)
