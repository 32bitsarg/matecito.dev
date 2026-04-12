import { NextResponse } from 'next/server'

/**
 * Proxy para eliminar proyectos.
 * El servicio real usa ProjectService.delete() → /api/v1/platform/delete-p/:id
 * El backend orquesta internamente la limpieza de infraestructura.
 */
export async function DELETE(req: Request) {
    try {
        const { projectId, token } = await req.json()

        if (!projectId || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        const backendRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/delete-p/${projectId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        )

        if (!backendRes.ok) {
            const error = await backendRes.json().catch(() => ({}))
            return NextResponse.json(
                { error: error.error || error.message || 'Error al eliminar proyecto' },
                { status: backendRes.status }
            )
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        console.error('[delete project proxy]', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
