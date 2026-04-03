# Realtime

El módulo Realtime te permite suscribirte a cambios en vivo en tus colecciones mediante WebSockets. La conexión se mantiene automáticamente con reconexión exponencial y heartbeat (ping/pong cada 30 segundos).

---

## Suscribirse a una colección

````carousel
```ts
// Escuchar todos los cambios
const unsub = db.from('messages').subscribe((event) => {
  console.log(event.action)     // 'created' | 'updated' | 'deleted'
  console.log(event.collection) // 'messages'
  console.log(event.record)     // el registro como objeto plano
  console.log(event.recordId)   // ID del registro
})

// Dejar de escuchar
unsub()
```
<!-- slide -->
```dart
// Callback
final unsub = db.from('messages').subscribe<Map<String,dynamic>>((event) {
  print(event.action);      // RealtimeAction.created / updated / deleted
  print(event.collection);  // 'messages'
  print(event.record);      // Map<String,dynamic>
  print(event.recordId);
});
unsub();

// Stream (ideal para StreamBuilder)
db.from('messages').watch().listen((event) {
  print('${event.action}: ${event.record}');
});
```
````

---

## StreamBuilder en Flutter

````carousel
```dart
StreamBuilder<RealtimeEvent>(
  stream: db.from('chat').watch(),
  builder: (context, snapshot) {
    if (!snapshot.hasData) return const SizedBox.shrink();
    final event = snapshot.data!;

    switch (event.action) {
      case RealtimeAction.created:
        print('Nuevo mensaje: ${event.record?['text']}');
      case RealtimeAction.updated:
        print('Mensaje editado');
      case RealtimeAction.deleted:
        print('Mensaje eliminado: ${event.recordId}');
      default:
        break;
    }
    return const SizedBox.shrink();
  },
)
```
````

---

## Estado de la conexión

````carousel
```ts
const unsub = db.realtime.onStatusChange((status) => {
  // 'connected' | 'disconnected'
  console.log('Realtime:', status)
})

unsub() // dejar de escuchar

// Saber si está conectado
console.log(db.realtime.isConnected)
```
<!-- slide -->
```dart
final unsub = db.realtime.onStatusChange((status) {
  // 'connected' | 'disconnected'
  print('Realtime: $status');
});
unsub();

// Saber si está conectado
print(db.realtime.isConnected);
```
````

---

## Desconectar manualmente

````carousel
```ts
// Cierra el WebSocket y limpia todas las suscripciones
db.realtime.disconnect()
```
<!-- slide -->
```dart
db.realtime.disconnect();
```
````

---

## Reconexión automática

El SDK maneja la reconexión automáticamente cuando:

- Se pierde la conexión de red
- El servidor cierra el socket inesperadamente
- Un pong no llega en 5 segundos después del ping (conexión zombi)

El tiempo entre reintentos crece exponencialmente desde 2 segundos hasta un máximo de 30 segundos.

Al reconectarse, el SDK re-suscribe automáticamente a todas las colecciones activas.

---

Siguiente: [Storage](storage.md)
