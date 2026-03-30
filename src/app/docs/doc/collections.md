# Gestión de Esquema y Colecciones

MatecitoDB te permite gestionar el esquema de tu base de datos (colecciones y campos) directamente desde el SDK. Esta es una herramienta administrativa y requiere el uso de una `serviceKey`.

## Operaciones de Colección

Accesibles a través de `db.collections`.

````carousel
```ts
// Listar todas las colecciones
const { data: cols } = await db.collections.list()

// Crear una nueva colección
await db.collections.create('eventos_calendario', {
  fields: [
    { name: 'nombre-evento',  type: 'text',   required: true },
    { name: 'fecha',  type: 'date',   required: true },
  ]
})

// Renombrar una colección
const { error } = await db.collections.rename('nombre_viejo', 'nombre_nuevo')

// Eliminar una colección (¡Todos los registros se perderán!)
await db.collections.delete('coleccion_temporal')
```
<!-- slide -->
```dart
// Listar todas las colecciones
final res = await db.collections.list();

// Crear una nueva colección
await db.collections.create('eventos_calendario', 
  fields: [
    {'name': 'nombre-evento', 'type': 'text', 'required': true},
    {'name': 'fecha', 'type': 'date', 'required': true},
  ],
);

// Renombrar una colección
final err = await db.collections.rename('nombre_viejo', 'nombre_nuevo');

// Eliminar una colección (¡Todos los registros se perderán!)
await db.collections.delete('coleccion_temporal');
```
````

## Operaciones de Campos

Puedes gestionar campos individuales dentro de una colección usando el generador fluido `fields(nombre)`.

````carousel
```ts
// Listar todos los campos de una colección
const { data: fields } = await db.collections.fields('posts').list()

// Añadir un nuevo campo
await db.collections.fields('posts').create({
  name: 'imagen_portada',
  type: 'file',
  required: false,
})

// Actualizar un campo existente
await db.collections.fields('posts').update(fieldId, {
  required: true,
})

// Eliminar un campo (¡Los datos de este campo en los registros se perderán!)
await db.collections.fields('posts').delete(fieldId)
```
<!-- slide -->
```dart
// Listar todos los campos de una colección
final res = await db.collections.fields('posts').list();

// Añadir un nuevo campo
final newField = await db.collections.fields('posts').create(
  name: 'imagen_portada',
  type: 'file',
  required: false,
);

// Actualizar un campo existente
await db.collections.fields('posts').update(fieldId, 
  required: true,
);

// Eliminar un campo
await db.collections.fields('posts').delete(fieldId);
```
````

---

Siguiente: [Suscripciones en Tiempo Real](realtime.md)
