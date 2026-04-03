# Autenticación

MatecitoDB incluye un sistema de autenticación completo: email/password, OAuth, verificación de email, reset de contraseña y gestión de usuarios admin.

## Registro e inicio de sesión

````carousel
```ts
// Registrar
const { data, error } = await db.auth.signUp({
  email:    'usuario@ejemplo.com',
  password: 'contraseña123',
  username: 'miusuario',  // campo extra opcional
})

// Iniciar sesión
const { data, error } = await db.auth.signIn({
  email:    'usuario@ejemplo.com',
  password: 'contraseña123',
})

// Cerrar sesión
await db.auth.signOut()

// Estado actual
const user     = db.auth.user
const token    = db.auth.token
const loggedIn = db.auth.isLoggedIn
```
<!-- slide -->
```dart
// Registrar
final res = await db.auth.signUp(
  email:    'usuario@ejemplo.com',
  password: 'contraseña123',
  extra:    {'username': 'miusuario'},
);

// Iniciar sesión
final res = await db.auth.signIn(
  email:    'usuario@ejemplo.com',
  password: 'contraseña123',
);

// Cerrar sesión
await db.auth.signOut();

// Estado actual
final user     = db.auth.user;
final token    = db.auth.token;
final loggedIn = db.auth.isLoggedIn;
```
````

La sesión se persiste automáticamente en `localStorage` (Web) o `SharedPreferences` (Flutter).

---

## Escuchar cambios de sesión

````carousel
```ts
const unsubscribe = db.auth.onAuthChange((user) => {
  if (user) {
    console.log('Sesión activa:', user.email)
  } else {
    console.log('Sesión cerrada')
  }
})

// Dejar de escuchar
unsubscribe()
```
<!-- slide -->
```dart
// Callback
final unsub = db.auth.onAuthChange((user) {
  if (user != null) {
    print('Sesión activa: ${user.email}');
  } else {
    print('Sesión cerrada');
  }
});
unsub();

// Stream (ideal para StreamBuilder / Provider)
StreamBuilder<AuthUser?>(
  stream: db.auth.authStateStream,
  builder: (context, snapshot) {
    final user = snapshot.data;
    return user != null
        ? Text('Hola, ${user.email}')
        : const LoginScreen();
  },
)
```
````

---

## Perfil y contraseña

````carousel
```ts
// Obtener perfil fresco del servidor
const { data: user } = await db.auth.getMe()

// Actualizar perfil
await db.auth.updateProfile({ name: 'Juan', avatar_seed: 'abc' })

// Solicitar reset de contraseña (envía email)
await db.auth.requestPasswordReset('usuario@ejemplo.com', {
  resetUrlBase: 'https://miapp.com/reset',
})

// Confirmar nuevo password con el token del email
await db.auth.resetPassword(token, 'nueva-contraseña')
```
<!-- slide -->
```dart
// Obtener perfil fresco
await db.auth.getMe();

// Actualizar perfil
await db.auth.updateProfile({'name': 'Juan', 'avatar_seed': 'abc'});

// Solicitar reset de contraseña
await db.auth.requestPasswordReset(
  'usuario@ejemplo.com',
  resetUrlBase: 'https://miapp.com/reset',
);

// Confirmar nuevo password
await db.auth.resetPassword(token, 'nueva-contraseña');
```
````

---

## Verificación de email

````carousel
```ts
// Verificar con el token del link enviado por email
const { data, error } = await db.auth.verifyEmail(token)

// Reenviar email de verificación
await db.auth.resendVerification({ email: 'usuario@ejemplo.com' })
await db.auth.resendVerification({ userId: 'user-uuid' })
```
<!-- slide -->
```dart
// Verificar con el token del link
await db.auth.verifyEmail(token);

// Reenviar email de verificación
await db.auth.resendVerification(email: 'usuario@ejemplo.com');
await db.auth.resendVerification(userId: 'user-uuid');
```
````

---

## OAuth

````carousel
```ts
// 1. Generar URL con state para protección CSRF
const state = crypto.randomUUID()
const url = db.auth.getOAuthUrl('google', 'https://miapp.com/callback', { state })

// 2. Redirigir al usuario a `url`
window.location.href = url

// 3. En el callback, completar el flujo
const { data, error } = await db.auth.handleOAuthCallback({
  access_token:  searchParams.get('access_token'),
  refresh_token: searchParams.get('refresh_token'),
})

// Inyectar sesión manualmente (SSO / server-side)
db.auth.setSession({
  accessToken:  'jwt...',
  refreshToken: 'refresh...',
})
```
<!-- slide -->
```dart
// 1. Generar URL con state para CSRF
final state = const Uuid().v4();
final url = db.auth.getOAuthUrl(
  'google',
  'https://miapp.com/callback',
  state: state,
);

// 2. Abrir en el navegador
await launchUrl(Uri.parse(url));

// 3. Completar desde el deep link
final res = await db.auth.handleOAuthCallback({
  'access_token':  params['access_token'],
  'refresh_token': params['refresh_token'],
});

// Inyectar sesión manualmente
db.auth.setSession(
  accessToken:  'jwt...',
  refreshToken: 'refresh...',
);
```
````

---

## Administración de usuarios (requiere `serviceKey`)

````carousel
```ts
// Listar usuarios con búsqueda y paginación
const { data } = await db.auth.admin.listUsers({
  limit:  20,
  page:   1,
  search: 'juan',
})

// Eliminar usuario (irreversible)
await db.auth.admin.deleteUser('user-uuid')
```
<!-- slide -->
```dart
// Listar usuarios
final res = await db.auth.admin.listUsers(
  limit:  20,
  page:   1,
  search: 'juan',
);

// Eliminar usuario
await db.auth.admin.deleteUser('user-uuid');
```
````

---

## Configurar proveedores OAuth (requiere `serviceKey`)

````carousel
```ts
// Configurar proveedor
await db.auth.oauth.configure('google', {
  clientId:     'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  redirectUri:  'https://miapp.com/callback',
})

// Listar proveedores activos
const { data: providers } = await db.auth.oauth.listProviders()

// Eliminar proveedor
await db.auth.oauth.remove('github')
```
<!-- slide -->
```dart
await db.auth.oauth.configure('google',
  clientId:     'TU_CLIENT_ID',
  clientSecret: 'TU_CLIENT_SECRET',
  redirectUri:  'https://miapp.com/callback',
);

final res = await db.auth.oauth.listProviders();

await db.auth.oauth.remove('github');
```
````

---

Siguiente: [Records & CRUD](records.md)
