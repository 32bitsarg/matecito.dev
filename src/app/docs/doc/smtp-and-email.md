# SMTP y Email Templates

Enviá emails transaccionales y gestioná tus templates desde el SDK. Requiere `serviceKey`.

---

## Configurar SMTP

````carousel
```ts
// Configurar conexión SMTP
await db.smtp.set({
  host: 'smtp.gmail.com',
  port: 587,
  user: 'noreply@miapp.com',
  pass: 'app-password',
  from: 'Mi App <noreply@miapp.com>',
})

// Actualizar parcialmente
await db.smtp.update({ port: 465 })

// Enviar email de prueba para verificar la configuración
const { error } = await db.smtp.test('admin@miapp.com')
if (!error) console.log('SMTP funciona correctamente')
```
<!-- slide -->
```dart
// Configurar
await db.smtp.set(
  host: 'smtp.gmail.com',
  port: 587,
  user: 'noreply@miapp.com',
  pass: 'app-password',
  from: 'Mi App <noreply@miapp.com>',
);

// Actualizar parcialmente
await db.smtp.update(port: 465);

// Email de prueba
final err = await db.smtp.test('admin@miapp.com');
if (err == null) print('SMTP funciona correctamente');
```
````

---

## Email Templates

Los templates soportan interpolación de variables con `{{nombre_variable}}`.

````carousel
```ts
// Generar templates del sistema por defecto
// (welcome, reset-password, verify-email, etc.)
await db.emailTemplates.seed()

// Crear template personalizado
const { data: tmpl } = await db.emailTemplates.create({
  name:    'pedido_confirmado',
  subject: 'Tu pedido {{order_id}} fue confirmado',
  body:    `
    <h1>¡Hola {{user_name}}!</h1>
    <p>Tu pedido <strong>{{order_id}}</strong> está en camino.</p>
    <p>Total: ${{total}}</p>
  `,
})

// Listar todos los templates
const { data: list } = await db.emailTemplates.list()

// Actualizar template existente
await db.emailTemplates.update('template-uuid', {
  subject: 'Asunto actualizado',
  body:    '<p>Nuevo cuerpo del email</p>',
})

// Eliminar template
await db.emailTemplates.delete('template-uuid')
```
<!-- slide -->
```dart
// Templates del sistema
await db.emailTemplates.seed();

// Crear template
final res = await db.emailTemplates.create(
  name:    'pedido_confirmado',
  subject: 'Tu pedido {{order_id}} fue confirmado',
  body:    '''
    <h1>¡Hola {{user_name}}!</h1>
    <p>Tu pedido <strong>{{order_id}}</strong> está en camino.</p>
  ''',
);

// Listar
final list = await db.emailTemplates.list();

// Actualizar
await db.emailTemplates.update('template-uuid', {
  'subject': 'Asunto actualizado',
});

// Eliminar
await db.emailTemplates.delete('template-uuid');
```
````

---

Siguiente: [Webhooks](webhooks.md)
