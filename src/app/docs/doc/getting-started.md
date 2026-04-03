# Inicio rápido

MatecitoDB es un Backend-as-a-Service completo. Este SDK te permite interactuar con tus registros, autenticación, storage y herramientas de administración de forma type-safe e intuitiva.

## Instalación

### TypeScript / JavaScript
```bash
npm install matecitodb
```

### Flutter / Dart
```yaml
dependencies:
  matecitodb_flutter: ^3.1.0
```

---

## Inicialización

````carousel
```ts
import { createClient } from 'matecitodb'

const db = createClient({
  url:         'https://tu-proyecto.matecito.dev',
  apiKey:      'mk_anon_...',    // clave pública (client-side)
  // serviceKey: 'mk_service_...', // admin/server-side
  autoRefresh: true,
  timeout:     30_000,
  retry:       { attempts: 3, baseDelay: 500 },
  debug:       false,            // loguea requests (headers sensibles redactados)
})
```
<!-- slide -->
```dart
import 'package:matecitodb_flutter/matecitodb_flutter.dart';

final db = MatecitoDB.createClient(
  'https://tu-proyecto.matecito.dev',
  config: const ClientConfig(
    apiKey:      'mk_anon_...',
    autoRefresh: true,
    timeoutMs:   30000,
    retry:       RetryConfig(attempts: 3, baseDelayMs: 500),
    debug:       false,
  ),
);
```
````

---

## Variables de entorno (Next.js / Vite)

```env
# .env.local
NEXT_PUBLIC_MATECITODB_API_KEY=mk_anon_...
MATECITODB_API_KEY=mk_service_...
MATECITODB_URL=https://tu-proyecto.matecito.dev
```

O generalo automáticamente con el CLI:

```bash
npx matecitodb init
```

---

## Módulos disponibles

El SDK está organizado en módulos accesibles desde la instancia `db`:

| Módulo | Descripción |
|--------|-------------|
| `db.from('coleccion')` | CRUD, filtros, paginación, exportación |
| `db.auth` | Registro, login, OAuth, JWT |
| `db.realtime` | WebSockets, eventos en vivo |
| `db.storage` | Archivos y URLs públicas |
| `db.batch()` | Operaciones en una sola transacción |
| `db.sql` | SQL raw (requiere serviceKey) |
| `db.permissions` | Control de acceso por colección |
| `db.collections` | Gestión de schema (admin) |
| `db.stats` / `db.logs` | Monitoreo del proyecto |
| `db.smtp` / `db.emailTemplates` | Email transaccional |
| `db.webhooks` | Eventos hacia URLs externas |

---

## Formato de respuesta

La mayoría de los métodos devuelven `{ data, error }`. Nunca tiran excepciones salvo `find()`, `findOne()` y `count()`.

````carousel
```ts
const { data: posts, error } = await db.from('posts').find()

if (error) {
  console.error(error.status)   // código HTTP (0 = error de red)
  console.error(error.message)  // mensaje legible
  console.error(error.raw)      // respuesta raw del servidor
} else {
  console.log(posts)
}
```
<!-- slide -->
```dart
final res = await db.from('posts').find();

if (res.error != null) {
  print(res.error!.status);   // código HTTP
  print(res.error!.message);  // mensaje legible
} else {
  print(res.data);
}
```
````

---

## Health check

````carousel
```ts
const { data, error } = await db.healthCheck()
// data: { status: 'ok' }
```
<!-- slide -->
```dart
final res = await db.healthCheck();
// res.data: { 'status': 'ok' }
```
````

---

Siguiente: [Autenticación](auth.md)
