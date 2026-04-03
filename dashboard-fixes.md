# Dashboard — Plan de Fixes

## Goal
Corregir bugs de sesión, alinear el dashboard con el backend actualizado (password reset,
email verification, email_verified en usuarios) y cerrar inconsistencias menores.

---

## FASE 1 — Auth & Sesión · Bugs críticos

- [x] **1.1 — `isAuthenticated()` valida expiración del JWT**
  Decodificar el payload del token y comparar `exp * 1000` con `Date.now()`.
  Si está expirado, devolver `false` aunque el token exista en localStorage.
  → Verify: con token vencido en storage, `isAuthenticated()` retorna `false` y el layout redirige.

- [x] **1.2 — Retry loop sin límite en `api.ts`**
  El re-fetch tras refresh no lleva flag `isRetry`, por lo que un 401 en el segundo intento
  vuelve a llamar `tryRefreshToken()` → loop infinito posible.
  Extraer la lógica de retry a una función interna que reciba `isRetry: boolean` y no refresque
  si `isRetry === true`.
  → Verify: con refresh token inválido, el request falla limpiamente y llama `clearToken()` una sola vez.

- [x] **1.3 — `auth:logout` event no redirige**
  `WorkspaceContext` escucha `auth:logout` y resetea el estado, pero no navega a `/login`.
  El layout solo verifica auth al montar, así que el usuario queda en `/dashboard` con estado vacío.
  Agregar `window.location.href = '/login'` en el handler de `auth:logout`.
  → Verify: expirar token manualmente, hacer un request, verificar redirect a `/login`.

- [x] **1.4 — `p.subdomain` null en Sidebar**
  Los proyectos recién creados pueden tener `subdomain: null`. La URL queda
  `/dashboard/workspace/null`. Agregar guard: si `!p.subdomain` mostrar el proyecto deshabilitado
  o usar `p.id` como fallback.
  → Verify: crear proyecto con subdomain null, verificar que no aparece link roto en sidebar.

---

## FASE 2 — Páginas nuevas · Backend ya implementado

- [x] **2.1 — Página pública `/forgot-password`**
  Form con campo email. POST a `/api/v1/platform/auth/request-reset` (o el endpoint del proyecto
  según el contexto). Mostrar mensaje de confirmación con instrucción de revisar el email.
  → Verify: ingresar email válido → "Revisá tu casilla" message. Email inválido → toast error.

- [x] **2.2 — Página pública `/reset-password`**
  Lee `?token=xxx` de la URL. Form con `nueva contraseña` + `confirmar contraseña`.
  POST a `/api/v1/platform/auth/reset-password` con `{ token, password }`.
  En éxito, redirigir a `/login` con toast "Contraseña actualizada".
  → Verify: token válido → cambia contraseña. Token vencido/inválido → error descriptivo.

- [x] **2.3 — Página pública `/verify-email`**
  Lee `?token=xxx` de la URL. Al montar, hace GET `/api/v1/.../auth/verify-email?token=xxx`
  automáticamente. Muestra estado: verificando / verificado / error con enlace a reenviar.
  → Verify: token válido → "Email verificado ✓". Token inválido → "Link expirado".

- [x] **2.4 — Link "¿Olvidaste tu contraseña?" en Login**
  Agregar link debajo del form de login que lleve a `/forgot-password`.
  → Verify: el link existe y navega correctamente.

---

## FASE 3 — Usuarios del proyecto · Alineación con backend

- [x] **3.1 — Columna `email_verified` en tabla de usuarios**
  El backend ahora devuelve `email_verified` y `email_verified_at` en cada usuario.
  Agregar badge en la columna "Estado": si `email_verified` es `false` mostrar
  badge amarillo "Sin verificar", si es `true` mostrar badge verde "Verificado" junto al badge
  de método (Email/Google/GitHub).
  → Verify: usuario con `email_verified: false` muestra badge amarillo.

- [x] **3.2 — Botón "Reenviar verificación"**
  En el hover de cada usuario sin verificar, agregar botón "Reenviar email".
  POST a `/api/v1/project/:id/auth/resend-verification` con `{ userId }`.
  → Verify: click reenvía email (o muestra toast con dev token en dev mode).

---

## FASE 4 — Alineación con el SDK actualizado

- [x] **4.1 — Code snippets en Connect page usan `anonKey` (deprecado)**
  El SDK migró `anonKey` → `apiKey`. Actualizar los tres snippets (JS, RN, Flutter)
  en `connect/page.tsx` para usar `apiKey` en lugar de `anonKey`.
  → Verify: revisar la página Connect y ver `apiKey:` en el snippet.

- [x] **4.2 — Variables de entorno en Connect page**
  El snippet de `.env.local` usa `NEXT_PUBLIC_MATEBASE_*` como nombres de ejemplo.
  Actualizar a `NEXT_PUBLIC_MATECITO_URL` / `NEXT_PUBLIC_MATECITO_ANON_KEY` para que
  coincida con lo que usa el juego centeclash y la documentación.
  → Verify: snippet copiado tiene los nombres correctos.

---

## FASE 5 — UX y errores no mostrados

- [x] **5.1 — `WorkspaceContext.error` nunca se muestra**
  Cuando falla la carga inicial de workspaces, `error` se setea pero no hay UI que lo muestre.
  En `dashboard/layout.tsx` o en `dashboard/page.tsx`, si `error` no es null y `isInitialized`
  es true, mostrar un toast o banner de error.
  → Verify: cortar red, recargar dashboard → aparece mensaje de error.

- [x] **5.2 — Eliminar carpeta `d/` vacía**
  `src/app/dashboard/[workspace]/[project]/d/` existe pero está vacía. Si es un artefacto,
  eliminarlo para evitar confusión.
  → Verify: carpeta eliminada, `npm run build` sin errores.

---

## FASE 6 — Seguridad

- [x] **6.1 — `unsafe-eval` en CSP**
  El header CSP incluye `unsafe-eval` en `script-src`, lo que anula gran parte de la protección.
  Verificar si Next.js lo requiere en producción (generalmente solo en dev con HMR).
  Si no es necesario en producción, removerlo con guard `process.env.NODE_ENV`.
  → Verify: en build de producción, el header CSP no contiene `unsafe-eval`.

---

## Done When
- [ ] Token expirado → redirect automático a login sin loop
- [ ] Usuarios del proyecto muestran estado de verificación de email
- [ ] Flujo completo de password reset y email verification accesible desde el dashboard
- [ ] SDK snippets usan `apiKey` (no `anonKey`)
- [ ] Errores de carga visibles para el usuario
