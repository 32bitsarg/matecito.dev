# Manejo de errores

MatecitoDB usa un patrón consistente: todos los métodos devuelven `{ data, error }`. Nunca tiran excepciones salvo `find()`, `findOne()` y `count()` (que lanzan `Error` si hay un fallo).

---

## El objeto `MatecitoError`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | `number` | Código HTTP (0 = error de red / timeout) |
| `message` | `string` | Mensaje legible para el desarrollador |
| `raw` | `any?` | Respuesta raw del servidor |

---

## Patrón básico

````carousel
```ts
const { data, error } = await db.from('posts').insert({ title: 'Test' })

if (error) {
  switch (error.status) {
    case 0:   console.error('Error de red o timeout'); break
    case 400: console.error('Datos inválidos:', error.message); break
    case 401: console.error('No autenticado'); break
    case 403: console.error('Sin permisos'); break
    case 404: console.error('Recurso no encontrado'); break
    case 429: console.error('Rate limit excedido'); break
    case 500: console.error('Error del servidor'); break
    default:  console.error('Error:', error.message)
  }
} else {
  console.log('Creado:', data)
}
```
<!-- slide -->
```dart
final res = await db.from('posts').insert({'title': 'Test'});

if (res.error != null) {
  final err = res.error!;
  switch (err.status) {
    case 0:   print('Error de red o timeout'); break;
    case 400: print('Datos inválidos: ${err.message}'); break;
    case 401: print('No autenticado'); break;
    case 403: print('Sin permisos'); break;
    case 404: print('Recurso no encontrado'); break;
    case 429: print('Rate limit excedido'); break;
    case 500: print('Error del servidor'); break;
    default:  print('Error: ${err.message}');
  }
} else {
  print('Creado: ${res.data}');
}
```
````

---

## Auto-retry y auto-refresh

El SDK maneja automáticamente dos situaciones comunes:

### Auto-retry (errores de red)
Si una request falla por un error de red (no de aplicación), el SDK la reintenta automáticamente con backoff exponencial.

### Auto-refresh (token vencido)
Si el servidor devuelve `401`, el SDK intenta refrescar el JWT con el `refreshToken` y reintenta la request original una vez. Si el refresh también falla, cierra la sesión automáticamente.

### Configuración

````carousel
```ts
const db = createClient({
  url,
  apiKey,
  autoRefresh: true,
  retry: {
    attempts:  3,      // máximo de reintentos
    baseDelay: 500,    // delay inicial en ms (se duplica en cada intento)
  },
  timeout: 30_000,     // timeout por request en ms (0 = sin timeout)
})
```
<!-- slide -->
```dart
final db = MatecitoDB.createClient(
  url,
  config: const ClientConfig(
    apiKey:      'mk_anon_...',
    autoRefresh: true,
    retry: RetryConfig(
      attempts:    3,
      baseDelayMs: 500,
    ),
    timeoutMs: 30000,
  ),
);
```
````

---

## Debug mode

En desarrollo podés habilitar logs de todas las requests. Los headers sensibles (`Authorization`, `x-matecito-key`) se redactan automáticamente.

````carousel
```ts
const db = createClient({ url, apiKey, debug: true })
// [matecitodb] GET https://tu-proyecto.matecito.dev/records?...
// [matecitodb] 200 { records: [...] }
```
<!-- slide -->
```dart
final db = MatecitoDB.createClient(
  url,
  config: const ClientConfig(apiKey: 'mk_anon_...', debug: true),
);
// [MatecitoDB] GET https://tu-proyecto.matecito.dev/records?...
// [MatecitoDB] 200 response
```
````

---

Volver a [Inicio rápido](getting-started.md)
