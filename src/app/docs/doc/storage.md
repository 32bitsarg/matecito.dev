# Storage & Archivos

El módulo Storage te permite subir, listar y gestionar archivos en tu proyecto.

---

## Subir archivos

````carousel
```ts
// Desde un File (browser)
const fileInput = document.getElementById('avatar') as HTMLInputElement
const file = fileInput.files?.[0]

const { data, error } = await db.storage.upload(file, {
  path:   'avatars/user-1.png',
  public: true,
})

console.log(data.url)  // URL pública del archivo

// Desde URL (server-side)
await db.storage.uploadFromUrl('https://ejemplo.com/foto.jpg', {
  path: 'imports/foto.jpg',
})
```
<!-- slide -->
```dart
import 'dart:io';

// Desde File
final res = await db.storage.upload(
  File('ruta/imagen.png'),
  path:   'avatars/user-1.png',
  public: true,
);
print(res.data?.url);

// Desde bytes (útil con image_picker, etc.)
final res = await db.storage.uploadBytes(
  imageBytes,
  path:        'avatars/user-1.jpg',
  contentType: 'image/jpeg',
  public:      true,
);
```
````

---

## Subir con progreso (Flutter)

````carousel
```dart
await db.storage.upload(
  File('video.mp4'),
  path: 'videos/intro.mp4',
  onProgress: (sent, total) {
    final percent = (sent / total * 100).toStringAsFixed(1);
    print('Subiendo: $percent%');
  },
);
```
````

---

## Listar y gestionar archivos

````carousel
```ts
// Listar archivos en una carpeta
const { data: files } = await db.storage.list('avatars/')

for (const file of files) {
  console.log(file.url, file.size, file.mime)
}

// Eliminar archivo
const { error } = await db.storage.delete('avatars/user-1.png')

// URL pública (sin hacer request)
const url = db.storage.getPublicUrl('avatars/user-1.png')
```
<!-- slide -->
```dart
// Listar
final res = await db.storage.list('avatars/');
for (final file in res.data ?? []) {
  print('${file.url} — ${file.size} bytes');
}

// Eliminar
await db.storage.delete('avatars/user-1.png');

// URL pública
final url = db.storage.getPublicUrl('avatars/user-1.png');
```
````

---

## Propiedades del archivo (`StorageFile`)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | string | UUID del archivo |
| `url` | string | URL pública |
| `mime` | string | Tipo MIME (ej. `image/png`) |
| `size` | number | Tamaño en bytes |
| `width` | number? | Ancho (si es imagen) |
| `height` | number? | Alto (si es imagen) |
| `variant` | string | Variante del archivo |
| `createdAt` | Date | Fecha de subida |

---

Siguiente: [Colecciones](collections.md)
