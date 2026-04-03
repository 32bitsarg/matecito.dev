# Records & CRUD

El `QueryBuilder` te permite interactuar con tus datos de forma fluida y type-safe. Accedé con `db.from('nombre_coleccion')`. El builder es **thenable** — podés usar `await` directamente sobre la cadena.

---

## Consultar registros

````carousel
```ts
// Traer todos
const records = await db.from('posts').find()

// Con filtros y opciones
const { data: posts, error } = await db.from('posts')
  .select('id, title, author')
  .eq('status', 'publicado')
  .gte('views', 100)
  .ilike('title', '%matecito%')
  .latest()
  .limit(20)
  .page(2)

// Pagination info
const { data, total, pages, nextCursor } = await db.from('posts').find()

// Por ID
const { data: post } = await db.from('posts').getOne('abc-123')

// Primero que coincide
const { data: post } = await db.from('posts')
  .eq('slug', 'mi-post')
  .getFirst()

// findOne — acepta ID string o mapa de filtros
const post = await db.from('posts').findOne('abc-123')
const post = await db.from('posts').findOne({ slug: 'mi-post' })

// Contar
const count = await db.from('posts').eq('status', 'publicado').count()
```
<!-- slide -->
```dart
// Traer todos
final records = await db.from('posts').find();

// Con filtros y opciones
final res = await db.from('posts')
    .select(['id', 'title', 'author'])
    .eq('status', 'publicado')
    .gte('views', 100)
    .ilike('title', '%matecito%')
    .latest()
    .limit(20)
    .page(2)
    .get();

// Pagination info
final posts     = res.data;
final total     = res.total;
final pages     = res.pages;
final nextCursor = res.nextCursor;

// Por ID
final single = await db.from('posts').getOne('abc-123');

// Primero que coincide
final first = await db.from('posts').eq('slug', 'mi-post').getFirst();

// findOne
final post = await db.from('posts').findOne('abc-123');
final post = await db.from('posts').findOne({'slug': 'mi-post'});

// Contar
final count = await db.from('posts').eq('status', 'publicado').count();
```
````

---

## Filtros disponibles

| Método | Operador SQL | Ejemplo |
|--------|-------------|---------|
| `.eq(col, val)` | `=` | `.eq('status', 'activo')` |
| `.neq(col, val)` | `!=` | `.neq('role', 'admin')` |
| `.gt(col, val)` | `>` | `.gt('price', 100)` |
| `.gte(col, val)` | `>=` | `.gte('age', 18)` |
| `.lt(col, val)` | `<` | `.lt('stock', 10)` |
| `.lte(col, val)` | `<=` | `.lte('price', 500)` |
| `.like(col, pattern)` | `LIKE` | `.like('name', 'Juan%')` |
| `.ilike(col, pattern)` | `ILIKE` | `.ilike('title', '%café%')` |
| `.inValues(col, arr)` | `IN (...)` | `.inValues('tag', ['a','b'])` |
| `.notInValues(col, arr)` | `NOT IN (...)` | `.notInValues('status', ['spam'])` |
| `.or(expr)` | `OR (...)` | ver abajo |
| `.search(texto)` | `ILIKE` global | `.search('matecito')` |

### Filtro OR

````carousel
```ts
// Precio >= 100 O nombre contiene 'café'
await db.from('products')
  .or('price.gte.100,name.ilike.%café%')
  .find()
```
<!-- slide -->
```dart
await db.from('products')
    .or(['price.gte.100', 'name.ilike.%café%'])
    .find();
```
````

### Búsqueda full-text

````carousel
```ts
// Busca el texto en todos los campos del registro
await db.from('products').search('yerba mate').find()
```
<!-- slide -->
```dart
await db.from('products').search('yerba mate').find();
```
````

### Fechas como filtro

````carousel
```ts
// Acepta objetos Date — se envía como ISO 8601 completo (con hora)
await db.from('events')
  .gte('date', new Date('2025-01-01'))
  .lt('date', new Date('2026-01-01'))
  .find()
```
<!-- slide -->
```dart
await db.from('events')
    .gte('date', DateTime(2025, 1, 1))
    .lt('date', DateTime(2026, 1, 1))
    .find();
```
````

---

## Seleccionar campos

````carousel
```ts
// Traer solo algunos campos
await db.from('posts').select('id, title, created_at').find()
```
<!-- slide -->
```dart
await db.from('posts').select(['id', 'title', 'created_at']).find();
```
````

---

## Ordenar y paginar

````carousel
```ts
db.from('posts').latest()                            // ORDER BY created_at DESC
db.from('posts').oldest()                            // ORDER BY created_at ASC
db.from('posts').order('title', { ascending: true }) // ORDER BY title ASC
db.from('posts').limit(50).page(3)
```
<!-- slide -->
```dart
db.from('posts').latest();
db.from('posts').oldest();
db.from('posts').order('title', ascending: true);
db.from('posts').limit(50).page(3);
```
````

---

## Insertar

````carousel
```ts
const { data: post, error } = await db.from('posts').insert({
  title:   'Nuevo post',
  content: 'Contenido...',
})
```
<!-- slide -->
```dart
final res = await db.from('posts').insert({
  'title':   'Nuevo post',
  'content': 'Contenido...',
});
final post = res.data; // registro aplanado
```
````

---

## Actualizar

````carousel
```ts
// Por ID (un solo registro)
await db.from('posts').eq('id', 'abc-123').update({ title: 'Nuevo título' })

// Bulk update — todos los que coinciden con los filtros
await db.from('posts').eq('status', 'borrador').update({ archived: true })

// Merge — actualiza solo los campos enviados, preserva el resto
await db.from('posts').eq('id', 'abc-123').merge({ views: 42 })

// Con fecha de expiración
await db.from('sessions').eq('id', 'xyz').update(
  { active: true },
  { expiresAt: new Date(Date.now() + 3600_000) }
)
```
<!-- slide -->
```dart
// Por ID
await db.from('posts').eq('id', 'abc-123').update({'title': 'Nuevo título'}).get();

// Bulk update
await db.from('posts').eq('status', 'borrador').update({'archived': true}).get();

// Merge
await db.from('posts').eq('id', 'abc-123').merge({'views': 42}).get();

// Con expiración
await db.from('sessions').eq('id', 'xyz').update(
  {'active': true},
  expiresAt: DateTime.now().add(const Duration(hours: 1)),
).get();
```
````

---

## Upsert

Inserta el registro si no existe; si existe (según el campo de conflicto), lo actualiza.

````carousel
```ts
const { data, upserted } = await db.from('profiles').upsert(
  { user_id: 'abc', bio: 'Dev apasionado' },
  'user_id'
)

console.log(upserted) // true = insertado, false = actualizado
```
<!-- slide -->
```dart
final res = await db.from('profiles').upsert(
  {'user_id': 'abc', 'bio': 'Dev apasionado'},
  'user_id',
).get();

final upsertRes = res as MatecitoUpsertResponse;
print(upsertRes.upserted); // true = insertado, false = actualizado
```
````

---

## Eliminar

````carousel
```ts
// Soft-delete (recuperable)
await db.from('posts').delete('abc-123')

// Bulk soft-delete
await db.from('posts').eq('status', 'spam').delete()

// Restaurar
await db.from('posts').restore('abc-123')

// Borrado permanente (irreversible)
await db.from('posts').hardDelete('abc-123')
```
<!-- slide -->
```dart
// Soft-delete
await db.from('posts').delete('abc-123').get();

// Bulk soft-delete
await db.from('posts').eq('status', 'spam').delete().get();

// Restaurar
await db.from('posts').restore('abc-123');

// Borrado permanente
await db.from('posts').hardDelete('abc-123');
```
````

---

## Incluir registros eliminados y expirados

````carousel
```ts
// Ver registros soft-deleted
const { data } = await db.from('posts').includeDeleted().find()

// Ver registros con expires_at vencido
const { data } = await db.from('sessions').includeExpired().find()
```
<!-- slide -->
```dart
final res = await db.from('posts').includeDeleted().find();
final res = await db.from('sessions').includeExpired().find();
```
````

---

## Insertar múltiples (batch)

````carousel
```ts
const records = await db.from('products').insertMany([
  { name: 'Yerba', price: 500 },
  { name: 'Mate',  price: 1200 },
])
```
<!-- slide -->
```dart
final records = await db.from('products').insertMany([
  {'name': 'Yerba', 'price': 500},
  {'name': 'Mate',  'price': 1200},
]);
```
````

---

## Paginar como stream

````carousel
```ts
for await (const batch of db.from('posts').paginate({ batchSize: 100 })) {
  console.log('Lote:', batch.length, 'posts')
  processBatch(batch)
}
```
<!-- slide -->
```dart
await for (final batch in db.from('posts').paginate(batchSize: 100)) {
  print('Lote: ${batch.length} registros');
  processBatch(batch);
}
```
````

---

## Exportar

````carousel
```ts
// Devuelve un Blob con todos los registros (hasta 10k)
const blob = await db.from('posts').export({ format: 'csv' })
const blob = await db.from('posts').export({ format: 'json' })

// Descargar en el browser
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'posts.csv'
a.click()
```
<!-- slide -->
```dart
// Devuelve Uint8List
final bytes = await db.from('posts').export(format: 'csv');
final bytes = await db.from('posts').export(format: 'json');

// Guardar en disco
await File('/tmp/posts.csv').writeAsBytes(bytes);
```
````

---

## Suscribirse desde el builder

````carousel
```ts
// Ver Realtime para más detalles
const unsub = db.from('messages').subscribe((event) => {
  console.log(event.action, event.record)
})
```
<!-- slide -->
```dart
// Callback
final unsub = db.from('messages').subscribe((event) {
  print('${event.action}: ${event.record}');
});

// Stream
db.from('messages').watch().listen((event) { ... });
```
````

---

Siguiente: [Autenticación](auth.md)
