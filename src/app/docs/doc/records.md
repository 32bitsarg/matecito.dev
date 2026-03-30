# Registros y Operaciones CRUD

El QueryBuilder te permite interactuar con tus datos de forma fluida y segura (type-safe). Accédelo a través de `db.from('nombre_coleccion')`.

## Lectura de Registros

````carousel
```ts
// Listar todos los posts
const { data: posts } = await db.from('posts').find()

// Buscar uno por filtro
const { data: post } = await db.from('posts').eq('titulo', 'Mi Post').findOne()

// Contar registros
const { count } = await db.from('posts').eq('publico', true).count()
```
<!-- slide -->
```dart
// Listar todos los posts
final res = await db.from('posts').find();

// Buscar uno por filtro
final postRes = await db.from('posts').eq('titulo', 'Mi Post').findOne();

// Contar registros
final countRes = await db.from('posts').eq('publico', true).count();
```
````

## Escritura de Registros

````carousel
```ts
// Insertar un nuevo registro
const { data, error } = await db.from('posts').insert({
  title: 'Hola Mundo',
  content: '¡Mi primer post!',
})

// Actualizar un registro existente
await db.from('posts').eq('id', 'abc-123').update({
  title: 'Título actualizado',
})

// Upsert (Insertar si no existe, de lo contrario actualizar)
await db.from('posts').upsert({
  id: 'abc-123',
  title: 'Título actualizado o insertado',
})
```
<!-- slide -->
```dart
// Insertar un nuevo registro
final res = await db.from('posts').insert({
  'title': 'Hola Mundo',
  'content': '¡Mi primer post!',
});

// Actualizar un registro existente
await db.from('posts').eq('id', 'abc-123').update({
  'title': 'Título actualizado',
});

// Upsert
await db.from('posts').upsert({
  'id': 'abc-123',
  'title': 'Título actualizado o insertado',
});
```
````

## Borrado Permanente vs. Borrado Suave (Soft Delete)

MatecitoDB soporta por defecto el "borrado suave". Puedes restaurar registros que hayan sido eliminados recientemente.

````carousel
```ts
// Borrado suave (Soft-delete)
await db.from('posts').delete('abc-123')

// Restaurar (si fue borrado suavemente)
await db.from('posts').restore('abc-123')

// Borrado permanente (¡No se puede deshacer!)
await db.from('posts').hardDelete('abc-123')
```
<!-- slide -->
```dart
// Borrado suave (Soft-delete)
await db.from('posts').delete('abc-123');

// Restaurar (si fue borrado suavemente)
await db.from('posts').restore('abc-123');

// Borrado permanente (¡No se puede deshacer!)
await db.from('posts').hardDelete('abc-123');
```
````

## Filtrado y Paginación

Puedes encadenar múltiples filtros y luego llamar a un método terminal como `.find()` o `.get()`.

- `.eq(col, val)` / `.neq(col, val)`
- `.gt(col, val)` / `.gte(col, val)`
- `.lt(col, val)` / `.lte(col, val)`
- `.like(col, patron)`
- `.inValues(col, [v1, v2])`
- `.limit(10)`
- `.page(2)`
- `.latest()` / `.oldest()`
- `.order(col, { ascending: true })`

---

Siguiente: [Esquema y Colecciones](collections.md)
