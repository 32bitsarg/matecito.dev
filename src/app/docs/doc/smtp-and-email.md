# SMTP y Plantillas de Correo (Email Templates)

MatecitoDB te permite enviar correos transaccionales y gestionar tus plantillas directamente desde el SDK. Estas son herramientas administrativas y requieren el uso de una `serviceKey`.

## Configuración SMTP

Accesible a través de `db.smtp`.

````carousel
```ts
// Establecer configuración SMTP
await db.smtp.set({
  host: 'smtp.gmail.com',
  port: 587,
  user: 'noreply@miapp.com',
  pass: 'tu-password-de-app',
  from_name: 'MiApp',
  from_email: 'noreply@miapp.com',
})

// Actualizar configuración parcialmente
await db.smtp.update({ port: 465 })

// Enviar un correo de prueba para verificar la configuración
const { error } = await db.smtp.test('admin@miapp.com')
```
<!-- slide -->
```dart
// Establecer configuración SMTP
await db.smtp.set(
  host: 'smtp.gmail.com',
  port: 587,
  user: 'noreply@miapp.com',
  pass: 'tu-password-de-app',
  from_name: 'MiApp',
  from_email: 'noreply@miapp.com',
);

// Actualizar configuración parcialmente
await db.smtp.update(port: 465);

// Enviar un correo de prueba para verificar la configuración
final err = await db.smtp.test('admin@miapp.com');
```
````

## Plantillas de Correo (Email Templates)

Puedes gestionar tus plantillas de correo transaccionales con soporte para interpolación de variables tipo `{{variable}}`. Accesible a través de `db.emailTemplates`.

````carousel
```ts
// Sembrar plantillas de sistema por defecto (bienvenida, reset-password, etc.)
await db.emailTemplates.seed()

// Crear una nueva plantilla
const { data: tmpl } = await db.emailTemplates.create({
  name: 'pedido_confirmado',
  subject: '¡Pedido {{n_pedido}} confirmado!',
  html_body: '<h1>Hola {{nombre_usuario}}</h1><p>¡Tu pedido está en camino!</p>',
})

// Listar todas las plantillas
const { data: list } = await db.emailTemplates.list()

// Eliminar una plantilla
await db.emailTemplates.delete('template-uuid')
```
<!-- slide -->
```dart
// Sembrar plantillas de sistema por defecto (bienvenida, reset-password, etc.)
await db.emailTemplates.seed();

// Crear una nueva plantilla
final res = await db.emailTemplates.create(
  name: 'pedido_confirmado',
  subject: '¡Pedido {{n_pedido}} confirmado!',
  html_body: '<h1>Hola {{nombre_usuario}}</h1><p>¡Tu pedido está en camino!</p>',
);

// Listar todas las plantillas
final listRes = await db.emailTemplates.list();

// Eliminar una plantilla
await db.emailTemplates.delete('template-uuid');
```
````

---

Siguiente: [Webhooks](webhooks.md)
