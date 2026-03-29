import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
    try {
        const { subdomain, projectId, token } = await req.json()

        // 1. Validaciones básicas
        if (!subdomain || !projectId || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // 2. Intentar llamar al VPS para limpiar la infraestructura
        // Nota: En una arquitectura final con backend propio, el backend debería orquestar esto.
        // Por ahora mantenemos la lógica de Next.js como orquestador si el backend no lo hace.
        try {
            const vpsRes = await fetch(`${process.env.INTERNAL_API_URL}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-token': process.env.INTERNAL_API_TOKEN!
                },
                body: JSON.stringify({ subdomain })
            })

            const vpsData = await vpsRes.json()
            
            if (!vpsRes.ok || !vpsData.success) {
                return NextResponse.json({ 
                    error: vpsData.error || 'Fallo al eliminar en el VPS' 
                }, { status: 500 })
            }
        } catch (vpsErr: any) {
            console.error('[Delete API] Error connecting to VPS:', vpsErr)
            return NextResponse.json({ 
                error: 'Error de conexión con el servidor de despliegue' 
            }, { status: 500 })
        }

        // 3. Si el VPS limpió OK, procedemos a borrar el registro en el nuevo Backend
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!backendRes.ok) {
            const error = await backendRes.json()
            throw new Error(error.message || 'Error al eliminar en el backend')
        }

        return NextResponse.json({ success: true })

    } catch (err: any) {
        console.error('[Delete API] Error general:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

