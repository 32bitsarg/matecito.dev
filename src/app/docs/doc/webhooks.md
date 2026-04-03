# Webhooks

Configurá URLs externas que reciben un `POST` cuando ocurre un evento en tu proyecto. Requiere `serviceKey`.

---

## Operaciones

````carousel
```ts
// Crear webhook
const { data: hook } = await db.webhooks.create({
  url:    'https://miapp.com/hooks/matecito',
  events: ['record.created', 'record.deleted'],
  secret: 'mi-secreto-de-firma',  // para verificar la firma HMAC
})

// Listar webhooks configurados
const { data: hooks } = await db.webhooks.list()

// Actualizar (ej. deshabilitar temporalmente)
await db.webhooks.update('hook-uuid', { enabled: false })

// Volver a habilitar
await db.webhooks.update('hook-uuid', {
  enabled: true,
  events:  ['record.created', 'record.updated', 'record.deleted'],
})

// Eliminar
await db.webhooks.delete('hook-uuid')
```
<!-- slide -->
```dart
// Crear
final res = await db.webhooks.create(
  url:    'https://miapp.com/hooks/matecito',
  events: ['record.created', 'record.deleted'],
  secret: 'mi-secreto-de-firma',
);

// Listar
final hooks = await db.webhooks.list();

// Actualizar
await db.webhooks.update('hook-uuid', enabled: false);

// Eliminar
await db.webhooks.delete('hook-uuid');
```
````

---

## Eventos disponibles

| Evento | Cuándo se dispara |
|--------|------------------|
| `record.created` | Se inserta un nuevo registro |
| `record.updated` | Se actualiza un registro |
| `record.deleted` | Se elimina un registro (soft o hard) |
| `auth.signup` | Un usuario se registra |
| `auth.login` | Un usuario inicia sesión |
| `storage.upload` | Se sube un archivo |

---

## Verificar la firma (servidor receptor)

El cuerpo del POST incluye un header `X-Matecito-Signature`. Podés verificarlo con el secreto:

```ts
import crypto from 'crypto'

function verifySignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  return `sha256=${expected}` === signature
}
```

---

## Estructura del payload

```json
{
  "event":      "record.created",
  "collection": "orders",
  "record": {
    "id":         "abc-123",
    "created_at": "2025-06-01T12:00:00Z",
    "total":      1500
  },
  "timestamp": "2025-06-01T12:00:01Z"
}
```

---

Siguiente: [Manejo de errores](error-handling.md)
