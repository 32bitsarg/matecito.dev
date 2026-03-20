import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function POST(req: Request) {
    try {
        const { projectId, subdomain, token } = await req.json()

        if (!projectId || !subdomain || !token) {
            return NextResponse.json({ error: 'Faltan parámetros obligatorios' }, { status: 400 })
        }

        // 1. Llamar al VPS para regenerar las keys
        const vpsRes = await fetch(`${process.env.INTERNAL_API_URL}/generate-keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-internal-token': process.env.INTERNAL_API_TOKEN!
            },
            body: JSON.stringify({ subdomain })
        })

        if (!vpsRes.ok) {
            const errorText = await vpsRes.text()
            return NextResponse.json({ error: `Error del VPS: ${errorText}` }, { status: vpsRes.status })
        }

        const data = await vpsRes.json()
        if (!data.success) {
            return NextResponse.json({ error: data.error }, { status: 500 })
        }

        // 2. Actualizar en PocketBase central
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)
        pb.authStore.save(token, null)

        // Verificamos que el token sea válido para esta operación
        try {
            await pb.collection('projects').update(projectId, {
                anon_key: data.anonKey,
                service_key: data.serviceKey
            })
        } catch (pbErr: any) {
            return NextResponse.json({ error: 'Error al actualizar PocketBase: ' + pbErr.message }, { status: 403 })
        }

        return NextResponse.json({
            success: true,
            anonKey: data.anonKey,
            serviceKey: data.serviceKey
        })

    } catch (err: any) {
        console.error('[Regenerate Keys Error]:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
