import { NextResponse } from 'next/server'

/**
 * Proxy para crear proyectos.
 * El servicio real usa ProjectService.create() → /api/v1/platform/create-p
 * Esta ruta queda como fallback por compatibilidad.
 */
export async function POST(req: Request) {
    try {
        const { name, workspaceId, api_version, token } = await req.json()

        if (!name || !workspaceId || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/create-p`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, workspaceId, api_version: api_version ?? 'v2' }),
            }
        )

        const data = await backendRes.json()

        if (!backendRes.ok) {
            return NextResponse.json(
                { error: data.error || data.message || 'Error al crear proyecto' },
                { status: backendRes.status }
            )
        }

        return NextResponse.json({ success: true, project: data.project, api_keys: data.api_keys })

    } catch (err: any) {
        console.error('[create project proxy]', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
