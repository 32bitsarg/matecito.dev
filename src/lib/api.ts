/**
 * api.ts
 * Cliente HTTP central PRO
 */

// En el navegador, usamos el host local para aprovechar el proxy de rewrites (evitar CORS)
// En el servidor (SSR), usamos la URL real del backend para llegar a la plataforma
const BASE_URL = typeof window !== 'undefined' ? '' : 'https://api.matecito.dev'

const TOKEN_KEY         = 'matecito_token'
const REFRESH_TOKEN_KEY = 'matecito_refresh_token'
const USER_KEY          = 'matecito_user'

// Flag para evitar múltiples refreshes simultáneos
let _refreshing: Promise<string | null> | null = null

async function tryRefreshToken(): Promise<string | null> {
  if (_refreshing) return _refreshing

  _refreshing = (async () => {
    try {
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refresh) return null

      const res = await fetch(`${BASE_URL}/api/v1/platform/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      })

      if (!res.ok) return null

      const data = await res.json()
      const newToken = data.access_token ?? data.token
      if (!newToken) return null

      setToken(newToken)
      if (data.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)

      return newToken
    } catch {
      return null
    } finally {
      _refreshing = null
    }
  })()

  return _refreshing
}

// ─── Error ───────────────────────────────────────────────

class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data: any) {
    super(message)
    this.status = status
    this.data = data
  }
}

// ─── Token helpers ───────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)

  // 🔥 dispara logout global
  window.dispatchEvent(new Event('auth:logout'))
}

// ─── User helpers ────────────────────────────────────────

export function getStoredUser<T = any>(): T | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

export function setStoredUser(user: any): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

// ─── Core request ────────────────────────────────────────

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'HEAD'
  auth?: boolean
  body?: any
  params?: Record<string, string>
}

async function request<T = any>(
  path: string,
  {
    method = 'GET',
    auth = true,
    body,
    params,
  }: RequestOptions = {}
): Promise<T> {

  // 🔥 AbortController por request
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    // ── URL ─────────────────────────────
    // Si la URL es relativa (/api/v1/...), necesitamos pasarle el origin base
    const baseOrigin = typeof window !== 'undefined' ? window.location.origin : undefined
    const url = new URL(`${BASE_URL}${path}`, baseOrigin)

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) url.searchParams.append(k, v)
      })
    }

    // ── Headers ─────────────────────────

    const headers: HeadersInit = {}
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    if (auth) {
      const token = getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    // ── Fetch ───────────────────────────

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    let data: any = null

    try {
      data = await res.json()
    } catch {
      // puede no haber body
    }

    // ── Errors ──────────────────────────

    if (!res.ok) {
      if (res.status === 401 && auth) {
        // Intentar refresh antes de logout
        const newToken = await tryRefreshToken()
        if (newToken) {
          // Reintentar la request original con el nuevo token
          const retryHeaders: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          }
          const retryRes = await fetch(url.toString(), {
            method,
            headers: retryHeaders,
            body: body ? JSON.stringify(body) : undefined,
          })
          let retryData: any = null
          try { retryData = await retryRes.json() } catch { /* sin body */ }
          if (retryRes.ok) return retryData as T
        }
        // Refresh falló → logout
        clearToken()
      }

      throw new ApiError(
        data?.error || data?.message || 'Request failed',
        res.status,
        data
      )
    }

    return data as T

  } catch (err: any) {

    if (err.name === 'AbortError') {
      throw new Error('Request timeout (15s)')
    }

    throw err

  } finally {
    clearTimeout(timeout)
  }
}

// ─── API pública ─────────────────────────────────────────

export const api = {
  get<T = any>(path: string, params?: Record<string, string>) {
    return request<T>(path, { method: 'GET', params })
  },

  post<T = any>(path: string, body?: any) {
    return request<T>(path, { method: 'POST', body })
  },

  patch<T = any>(path: string, body?: any) {
    return request<T>(path, { method: 'PATCH', body })
  },

  put<T = any>(path: string, body?: any) {
    return request<T>(path, { method: 'PUT', body })
  },

  delete<T = any>(path: string, body?: any, params?: Record<string, string>) {
    return request<T>(path, { method: 'DELETE', body, params })
  },

  head(path: string, params?: Record<string, string>) {
    return request(path, { method: 'HEAD', params })
  },

  public: {
    post<T = any>(path: string, body?: any) {
      return request<T>(path, {
        method: 'POST',
        body,
        auth: false,
      })
    },
  },
}

export default api