# CLI

MatecitoDB incluye una CLI para inicializar proyectos y generar código automáticamente.

```bash
npx matecitodb <comando>
```

---

## Comandos disponibles

### `init` — Inicializar proyecto

Conecta tu entorno local con un proyecto de matecito.dev y genera el archivo `.env.local` con tus credenciales.

```bash
npx matecitodb init
```

Genera:
```env
# .env.local
NEXT_PUBLIC_MATECITODB_API_KEY=mk_anon_...
MATECITODB_API_KEY=mk_service_...
MATECITODB_URL=https://tu-proyecto.matecito.dev
```

---

### `generate types` — Tipos TypeScript

Genera interfaces TypeScript basadas en el schema actual de tu proyecto.

```bash
npx matecitodb generate types
```

Genera `matecito.types.ts`:

```ts
// matecito.types.ts (generado automáticamente — no editar)
export interface Database {
  posts: {
    id:         string
    title:      string
    content:    string
    status:     'borrador' | 'publicado'
    views:      number
    created_at: string
    updated_at: string
  }
  users: {
    id:       string
    email:    string
    name:     string
    role:     string
    created_at: string
  }
}
```

Una vez generado, pasalo al cliente para obtener autocompletado completo:

```ts
import { createClient } from 'matecitodb'
import type { Database } from './matecito.types'

const db = createClient<Database>({
  url:    process.env.MATECITODB_URL!,
  apiKey: process.env.NEXT_PUBLIC_MATECITODB_API_KEY!,
})

// db.from('posts') → completamente tipado
const { data } = await db.from('posts').eq('status', 'publicado').find()
// data es Database['posts'][]
```

---

### `generate auth` — Scaffold de autenticación (Next.js)

Genera los archivos necesarios para autenticación completa en Next.js: contexto, hooks, páginas de login y registro.

```bash
npx matecitodb generate auth
```

Archivos generados:
- `src/lib/matecito.ts` — cliente singleton
- `src/context/AuthContext.tsx` — proveedor de sesión
- `src/hooks/useAuth.ts` — hook `useAuth()`
- `src/app/login/page.tsx` — página de login
- `src/app/register/page.tsx` — página de registro

---

### `generate hook <coleccion>` — React hook para una colección

Genera un hook tipado con CRUD completo para una colección específica.

```bash
npx matecitodb generate hook posts
```

Genera `src/hooks/usePosts.ts`:

```ts
import { usePosts } from '@/hooks/usePosts'

function PostList() {
  const { data: posts, loading, error, create, update, remove } = usePosts({
    filters: { status: 'publicado' },
    order:   'latest',
  })

  if (loading) return <p>Cargando...</p>
  if (error)   return <p>Error: {error.message}</p>

  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}
```

---

## Opciones globales

| Flag | Descripción |
|------|-------------|
| `--url <url>` | URL del proyecto (sobreescribe `.env`) |
| `--key <key>` | Service key (sobreescribe `.env`) |
| `--out <dir>` | Directorio de salida (default: `./`) |
| `--yes` | Confirmar todos los prompts automáticamente |

---

Volver a [Inicio rápido](getting-started.md)
