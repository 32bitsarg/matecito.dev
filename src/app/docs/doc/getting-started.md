# Primeirros Pasos con MatecitoDB SDK (v3.0.0)

MatecitoDB es una solución completa de backend-as-a-service. Este SDK te permite interactuar con tus registros, autenticación, almacenamiento y herramientas de gestión de proyectos de forma sencilla y segura (type-safe).

## Instalación

### TypeScript / JavaScript
```bash
npm install matecitodb@3.0.0
```

### Flutter / Dart
```yaml
dependencies:
  matecitodb_flutter: ^3.0.0
```

## Inicialización

Necesitas la URL de tu proyecto (y opcionalmente un `projectId` si la URL no lo incluye automáticamente).

````carousel
```ts
import { createClient } from 'matecitodb'

const db = createClient('https://tu-proyecto.matecito.dev', {
  projectId: 'tu-project-id',
  // Usa anonKey para el cliente, serviceKey para tareas administrativas
  apiKey: 'mk_anon_...' 
})
```
<!-- slide -->
```dart
import 'package:matecitodb_flutter/matecitodb_flutter.dart';

final db = MatecitoDB('https://tu-proyecto.matecito.dev', 
  config: ClientConfig(
    projectId: 'tu-project-id',
    apiKey: 'mk_anon_...',
  ),
);
```
````

## Conceptos Core

### Acceso Directo
El SDK está organizado en módulos accesibles directamente desde la instancia `db`:

- `db.auth`: Login, registro y gestión de usuarios.
- `db.from('coleccion')`: Operaciones CRUD sobre tus registros.
- `db.storage`: Subida y gestión de archivos.
- `db.collections`: Gestión del esquema de la base de datos (Solo Admin).
- `db.realtime`: Escucha cambios en tiempo real.

### Formato de Respuesta
La mayoría de los métodos devuelven un objeto de respuesta consistente:

```ts
const { data, error } = await db.from('posts').find()

if (error) {
  console.error('Código de error:', error.status)
  console.error('Mensaje:', error.message)
} else {
  console.log('Resultados:', data)
}
```

## Health Check

Puedes verificar si el servidor está activo y accesible:

```ts
const isUp = await db.healthCheck()
```

---

Siguiente: [Autenticación](auth.md)
