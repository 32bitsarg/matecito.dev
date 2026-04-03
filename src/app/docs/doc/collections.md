# Colecciones y Schema

MatecitoDB te permite gestionar tu schema directamente desde el SDK. Requiere `serviceKey`.

---

## Operaciones sobre colecciones

````carousel
```ts
// Listar todas las colecciones
const { data: cols } = await db.collections.list()

// Crear con campos iniciales
await db.collections.create('products', {
  fields: [
    { name: 'name',     type: 'text',     required: true },
    { name: 'price',    type: 'number',   required: true },
    { name: 'in_stock', type: 'boolean' },
    { name: 'image',    type: 'file' },
    { name: 'category', type: 'relation', options: { collection: 'categories' } },
    { name: 'tags',     type: 'select',   options: { values: ['nuevo', 'oferta'] } },
  ]
})

// Renombrar
await db.collections.rename('old_name', 'new_name')

// Eliminar (todos los registros se pierden)
await db.collections.delete('temp_data')
```
<!-- slide -->
```dart
// Listar colecciones
final res = await db.collections.list();

// Crear con campos
await db.collections.create('products', fields: [
  {'name': 'name',     'type': 'text',     'required': true},
  {'name': 'price',    'type': 'number',   'required': true},
  {'name': 'in_stock', 'type': 'boolean'},
  {'name': 'image',    'type': 'file'},
  {'name': 'category', 'type': 'relation', 'options': {'collection': 'categories'}},
]);

// Renombrar
await db.collections.rename('old_name', 'new_name');

// Eliminar
await db.collections.delete('temp_data');
```
````

---

## Tipos de campo

| Tipo | Descripción |
|------|-------------|
| `text` | Cadena de texto |
| `number` | Número (entero o decimal) |
| `boolean` | Verdadero / Falso |
| `email` | Email validado |
| `date` | Fecha y hora |
| `file` | Referencia a archivo en Storage |
| `json` | Objeto JSON libre |
| `relation` | FK a otra colección |
| `select` | Lista de valores fijos |

---

## Operaciones sobre campos

````carousel
```ts
// Listar campos de una colección
const { data: fields } = await db.collections.fields('products').list()

// Agregar campo
await db.collections.fields('products').create({
  name:     'discount',
  type:     'number',
  required: false,
})

// Actualizar campo (ej. volverlo requerido)
await db.collections.fields('products').update(fieldId, {
  required: true,
})

// Eliminar campo (los datos de ese campo en los registros se pierden)
await db.collections.fields('products').delete(fieldId)
```
<!-- slide -->
```dart
// Listar campos
final res = await db.collections.fields('products').list();

// Agregar
await db.collections.fields('products').create(
  name:     'discount',
  type:     'number',
  required: false,
);

// Actualizar
await db.collections.fields('products').update(fieldId, required: true);

// Eliminar
await db.collections.fields('products').delete(fieldId);
```
````

---

## Permisos por colección

Podés controlar quién puede leer y escribir en cada colección. Ver [Permisos](../README.md#permisos) para más detalles.

---

Siguiente: [Realtime](realtime.md)
