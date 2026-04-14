# SQL Directo

El módulo SQL te permite ejecutar queries raw contra tu base de datos. Requiere `serviceKey`.

---

## Ejecutar una query

````carousel
```ts
const { data, error } = await db.sql.run(
  'SELECT id, title, views FROM posts WHERE views > $1 ORDER BY views DESC LIMIT $2',
  [100, 10]
)

if (error) {
  console.error(error.message)
} else {
  console.log(data.rows)        // array de objetos planos
  console.log(data.rowCount)    // cantidad de filas devueltas
  console.log(data.durationMs)  // tiempo de ejecución en ms
  console.log(data.truncated)   // true si el resultado fue cortado
}
```
<!-- slide -->
```dart
final res = await db.sql.query(
  'SELECT id, title, views FROM posts WHERE views > \$1 LIMIT \$2',
  [100, 10],
);

if (res.error != null) {
  print(res.error!.message);
} else {
  print(res.data!['rows']);        // List<Map<String,dynamic>>
  print(res.data!['rowCount']);    // int
  print(res.data!['durationMs']);  // double
}
```
````

---

## Mutations con SQL

````carousel
```ts
// Insertar
await db.sql.run(
  'INSERT INTO events (name, payload) VALUES ($1, $2)',
  ['user.signup', JSON.stringify({ userId: 'abc' })]
)

// Actualizar masivo
const { data } = await db.sql.run(
  'UPDATE posts SET status = $1 WHERE created_at < $2 RETURNING id',
  ['archivado', '2024-01-01']
)
console.log(`${data.rowCount} posts archivados`)
```
<!-- slide -->
```dart
// Insertar
await db.sql.query(
  'INSERT INTO events (name, payload) VALUES (\$1, \$2)',
  ['user.signup', '{"userId":"abc"}'],
);

// Actualizar masivo
final res = await db.sql.query(
  'UPDATE posts SET status = \$1 WHERE created_at < \$2',
  ['archivado', '2024-01-01'],
);
print('${res.data!['rowCount']} posts archivados');
```
````

---

## Respuesta del SQL Runner

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `rows` | `object[]` | Array de filas como objetos planos |
| `rowCount` | `number` | Cantidad de filas en la respuesta |
| `durationMs` | `number` | Tiempo de ejecución en milisegundos |
| `truncated` | `boolean` | `true` si el resultado fue cortado por límite interno |

> **Nota:** Los resultados se limitan a 1000 filas. Para exportar datasets grandes, usá el método `.export()` en el query builder.

---

## Seguridad

- Siempre usá parámetros (`$1`, `$2`, ...) en lugar de interpolar valores directamente — previene SQL injection.
- El módulo SQL solo está disponible con `serviceKey`. **Nunca expongas el `serviceKey` en el cliente.**
- Las operaciones de DDL (`DROP TABLE`, `ALTER TABLE`) pueden romper el schema de tu proyecto — usalas con cuidado.

---

Siguiente: [Permisos](permissions.md)
