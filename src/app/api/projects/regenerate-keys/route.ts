import { NextResponse } from 'next/server'

/**
 * Proxy para regenerar API keys.
 * Respeta la api_version del proyecto — llama v1 o v2 según corresponda.
 * El servicio real usa ProjectContext.regenerateApiKey() → pApi.post('/regenerate-key')
 * que ya es version-aware. Esta ruta es fallback por compatibilidad.
 */
export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { projectId, apiVersion = 'v1' } = body

    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

    const version = apiVersion === 'v2' ? 'v2' : 'v1'

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/${version}/project/${projectId}/regenerate-key`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    )
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
