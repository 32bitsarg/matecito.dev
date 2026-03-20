import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function DELETE(req: Request) {
    try {
        const { subdomain, projectId, token } = await req.json()

        // 1. Validaciones básicas
        if (!subdomain || !projectId || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // 2. Intentar llamar al VPS para limpiar la infraestructura
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
            
            // Si el VPS falla críticamente, informamos pero permitimos el flujo (o no, dependiendo de la política)
            // En este caso, si no se borró en el VPS, es mejor no borrar el registro de PB 
            // para que el usuario pueda reintentar o sepamos que hay basura.
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

        // 3. Si el VPS limpió OK, procedemos a borrar el registro en PocketBase Central
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)
        pb.authStore.save(token, null)
        
        await pb.collection('projects').delete(projectId)

        return NextResponse.json({ success: true })

    } catch (err: any) {
        console.error('[Delete API] Error general:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
