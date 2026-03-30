# Operaciones en Tiempo Real (Realtime)

El módulo Realtime de MatecitoDB te permite suscribirte a cambios en vivo en tus registros.

## Monitorizar una Colección

Puedes escuchar todos los cambios en una colección con una simple llamada:

````carousel
```ts
// Basado en Callback
const unsubscribe = db.from('posts').subscribe((event) => {
  console.log('Acción:', event.action)  // 'created', 'updated', o 'deleted'
  console.log('Datos:',   event.record)
})

// Dejar de escuchar
unsubscribe()
```
<!-- slide -->
```dart
// Basado en Stream (Ideal para Flutter)
db.from('posts').watch().listen((event) {
  print('Acción: ${event.action}');  // 'created', 'updated', o 'deleted'
  print('Datos: ${event.record}');
});

// Basado en Callback
final unsubscribe = db.from('posts').subscribe((event) {
  print('Acción: ${event.action}');
});

// Dejar de escuchar
unsubscribe();
```
````

## Monitorizar Registros Específicos

Puedes filtrar qué registros te interesan usando filtros antes de suscribirte:

````carousel
```ts
// Solo escuchar actualizaciones en un post específico
db.from('posts')
  .eq('id', 'abc-123')
  .subscribe((event) => {
    if (event.action === 'updated') {
      console.log('¡El post se ha actualizado!')
    }
  })
```
<!-- slide -->
```dart
// Solo escuchar actualizaciones en un post específico
db.from('posts')
  .eq('id', 'abc-123')
  .watch()
  .listen((event) {
    if (event.action == 'updated') {
      print('¡El post se ha actualizado!');
    }
  });
```
````

## Monitorizar el Estado de la Conexión

Puedes recibir notificaciones si la conexión se pierde o se restablece:

````carousel
```ts
db.realtime.onStatusChange((status) => {
  console.log('Estado Realtime:', status) // 'connected', 'reconnecting', 'disconnected'
})
```
<!-- slide -->
```dart
db.realtime.onStatusChange((status) {
  print('Estado Realtime: $status');
});
```
````

---

Siguiente: [Almacenamiento y Archivos](storage.md)
