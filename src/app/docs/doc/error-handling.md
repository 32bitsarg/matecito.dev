# Manejo de Errores

Los métodos de MatecitoDB devuelven un objeto `error` consistente cuando falla una solicitud. Esto te permite gestionar problemas sin necesidad de bloques try-catch complejos en todas partes.

## El Objeto `MatecitoError`

El objeto `error` contiene las siguientes propiedades:
- `status`: El código de estado HTTP (ej: 401, 404, 500).
- `message`: Un mensaje de error legible por humanos.
- `raw`: Acceso opcional al objeto de respuesta original.

## Manejo de Escenarios Comunes

````carousel
```ts
const { data, error } = await db.from('posts').insert({ ... })

if (error) {
  if (error.status === 401) {
    console.error('Usuario no autenticado')
  } else if (error.status === 403) {
    console.error('Permiso denegado')
  } else {
    console.error('Ocurrió un error:', error.message)
  }
} else {
  console.log('Éxito:', data)
}
```
<!-- slide -->
```dart
final res = await db.from('posts').insert({ ... });

if (res.error != null) {
  if (res.error!.status == 401) {
    print('Usuario no autenticado');
  } else if (res.error!.status == 403) {
    print('Permiso denegado');
  } else {
    print('Ocurrió un error: ${res.error!.message}');
  }
} else {
  print('Éxito: ${res.data}');
}
```
````

## Fallos de Red y Reintentos

El SDK gestiona automáticamente los problemas comunes de red:
- **Auto-reintento**: Las solicitudes que fallan debido a problemas de red se reintentan según tu `RetryConfig`.
- **Auto-refresco**: Si una solicitud falla con 401, el SDK intenta refrescar la sesión y reintenta la solicitud original una vez de forma automática.

Puedes configurar esto al crear el cliente:

````carousel
```ts
const db = createClient(url, {
  autoRefresh: true,
  retry: {
      attempts: 5,
      baseDelay: 1000,
  }
})
```
<!-- slide -->
```dart
final db = MatecitoDB(url, 
  config: ClientConfig(
    autoRefresh: true,
    retry: RetryConfig(
        attempts: 5,
        baseDelay: 1000,
    ),
  ),
);
```
````

---

Volver a [Primeros Pasos](getting-started.md)
