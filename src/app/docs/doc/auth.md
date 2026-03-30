# Autenticación y Gestión de Usuarios

MatecitoDB proporciona un sistema completo de autenticación con soporte para usuarios regulares, gestión administrativa (Admin) y proveedores de OAuth.

## Operaciones de Usuario Regular

Accesible a través de `db.auth`.

````carousel
```ts
// Inicio de sesión (Login)
const { data: user, error } = await db.auth.signIn({
  email: 'usuario@ejemplo.com',
  password: 'password123',
})

// Registro (Sign up)
await db.auth.signUp({
  email: 'nuevo@ejemplo.com',
  password: 'password123',
})

// Cerrar sesión
await db.auth.signOut()

// Sesión actual
const user = db.auth.user
const token = db.auth.token
```
<!-- slide -->
```dart
// Inicio de sesión (Login)
final res = await db.auth.signIn(
  email: 'usuario@ejemplo.com',
  password: 'password123',
);

// Registro (Sign up)
await db.auth.signUp(
  email: 'nuevo@ejemplo.com',
  password: 'password123',
);

// Cerrar sesión
await db.auth.signOut();

// Sesión actual
final user = db.auth.user;
final token = db.auth.token;
```
````

### Persistencia de Sesión
El SDK persiste automáticamente la sesión en el `localStorage` (Web) o en `SharedPreferences` (Flutter/Móvil).

### Observar Cambios en el Estado de Autenticación
Puedes suscribirte a `onAuthChange` para reaccionar a eventos de inicio/cierre de sesión o refresco de tokens:

````carousel
```ts
const unsubscribe = db.auth.onAuthChange((user) => {
  if (user) {
    console.log('Usuario conectado:', user.email)
  } else {
    console.log('Sesión cerrada')
  }
})

// Dejar de escuchar
unsubscribe()
```
<!-- slide -->
```dart
final unsubscribe = db.auth.onAuthChange((user) {
  if (user != null) {
    print('Usuario conectado: ${user.email}');
  } else {
    print('Sesión cerrada');
  }
});

// Dejar de escuchar
unsubscribe();
```
````

## Gestión Administrativa (Requiere `serviceKey`)

Accesible a través de `db.auth.admin`.

````carousel
```ts
// Listar todos los usuarios
const { data } = await db.auth.admin.listUsers({ 
  limit: 20, 
  search: 'juan' 
})

// Eliminar un usuario
await db.auth.admin.deleteUser('user-uuid')
```
<!-- slide -->
```dart
// Listar todos los usuarios
final res = await db.auth.admin.listUsers(
  limit: 20, 
  search: 'juan',
);

// Eliminar un usuario
await db.auth.admin.deleteUser('user-uuid');
```
````

## Configuración de Proveedores OAuth

Accesible a través de `db.auth.oauth`.

````carousel
```ts
// Configurar Google OAuth
await db.auth.oauth.configure('google', {
  clientId: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
})

// Listar proveedores activos
const { data: providers } = await db.auth.oauth.listProviders()

// Eliminar un proveedor
await db.auth.oauth.remove('github')
```
<!-- slide -->
```dart
// Configurar Google OAuth
await db.auth.oauth.configure('google',
  clientId: 'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
);

// Listar proveedores activos
final res = await db.auth.oauth.listProviders();

// Eliminar un proveedor
await db.auth.oauth.remove('github');
```
````

---

Siguiente: [Registros y CRUD](records.md)
