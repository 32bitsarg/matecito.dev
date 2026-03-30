# Almacenamiento y Archivos (Storage)

El módulo de Almacenamiento de MatecitoDB te permite subir y gestionar archivos en tu proyecto.

## Subida de Archivos

Puedes subir archivos directamente desde tu aplicación.

````carousel
```ts
// Web (Objeto File)
const fileInput = document.getElementById('miArchivo') as HTMLInputElement
const file = fileInput.files?.[0]

if (file) {
  const { data, error } = await db.storage.upload(file, {
    path: 'avatares/usuario-1.png',
    public: true,
  })
}

// Subida desde URL (Lado del servidor)
await db.storage.uploadFromUrl('https://ejemplo.com/img.jpg', {
  path: 'otros/ejemplo.jpg',
})
```
<!-- slide -->
```dart
// Flutter (Objeto File)
import 'dart:io';

final file = File('ruta/a/mi/imagen.png');
final res = await db.storage.upload(file, 
  path: 'avatares/usuario-1.png',
  public: true,
);

// Subida desde bytes
final resBytes = await db.storage.uploadBytes(miUint8List, 
  path: 'datos/test.json',
  contentType: 'application/json',
);
```
````

## Listar y Gestionar Archivos

````carousel
```ts
// Listar archivos en un directorio
const { data: files } = await db.storage.list('avatares/')

// Eliminar un archivo
const { error } = await db.storage.delete('avatares/usuario-1.png')

// Obtener URL pública
const url = db.storage.getPublicUrl('avatares/usuario-1.png')
```
<!-- slide -->
```dart
// Listar archivos en un directorio
final res = await db.storage.list('avatares/');

// Eliminar un archivo
final err = await db.storage.delete('avatares/usuario-1.png');

// Obtener URL pública
final url = db.storage.getPublicUrl('avatares/usuario-1.png');
```
````

---

Siguiente: [Estadísticas y Logs](stats-and-logs.md)
