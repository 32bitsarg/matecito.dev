import { NextResponse } from 'next/server'

/**
 * Proxy para crear workspaces.
 * El servicio real usa WorkspaceService.create() → /api/v1/platform/create-w
 * Esta ruta queda como fallback por compatibilidad.
 */
export async function POST(req: Request) {
    try {
        const { name, slug, token } = await req.json()

        if (!name || !slug || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/create-w`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, slug }),
            }
        )

        const data = await backendRes.json()

        if (!backendRes.ok) {
            return NextResponse.json(
                { error: data.error || data.message || 'Error al crear workspace' },
                { status: backendRes.status }
            )
        }

        return NextResponse.json({ success: true, workspace: data.workspace })

    } catch (err: any) {
        console.error('[create workspace proxy]', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
