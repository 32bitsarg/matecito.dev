# Webhooks

El módulo de Webhooks de MatecitoDB te permite configurar URLs que recibirán una solicitud POST cada vez que ocurra un evento seleccionado en tu proyecto. Estas son herramientas administrativas y requieren el uso de una `serviceKey`.

## Operaciones de Webhook

Accesible a través de `db.webhooks`.

````carousel
```ts
// Listar todos los webhooks configurados
const { data: hooks } = await db.webhooks.list()

// Crear un nuevo webhook
const { data: hook } = await db.webhooks.create({
  url: 'https://miapp.com/webhooks/matecito',
  events: ['record.created', 'record.deleted'],
  secret: 'mi-secreto-de-firma',
})

// Actualizar parcialmente un webhook
await db.webhooks.update('hook-uuid', { enabled: false })

// Eliminar un webhook
await db.webhooks.delete('hook-uuid')
```
<!-- slide -->
```dart
// Listar todos los webhooks configurados
final res = await db.webhooks.list();

// Crear un nuevo webhook
final hookRes = await db.webhooks.create(
  url: 'https://miapp.com/webhooks/matecito',
  events: ['record.created', 'record.deleted'],
  secret: 'mi-secreto-de-firma',
);

// Actualizar parcialmente un webhook
await db.webhooks.update('hook-uuid',
  enabled: false,
);

// Eliminar un webhook
await db.webhooks.delete('hook-uuid');
```
````

### Eventos de Webhook
Los eventos pueden ser:
- `record.created`
- `record.updated`
- `record.deleted`
- `auth.signup`
- `auth.login`
- `storage.upload`

---

Siguiente: [Manejo de Errores](error-handling.md)
