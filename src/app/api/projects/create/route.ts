import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { name, workspaceId, subdomain, token } = await req.json()

        if (!name || !workspaceId || !subdomain || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // 1. Llamar al nuevo backend para crear el proyecto
        // El nuevo backend manejará internamente la creación del registro y la orquestación con el VPS
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                workspace_id: workspaceId,
                subdomain
            })
        })

        const data = await backendRes.json()

        if (!backendRes.ok) {
            return NextResponse.json({ error: data.message || 'Error al crear proyecto en el backend' }, { status: backendRes.status })
        }

        return NextResponse.json({ success: true, project: data.project })

    } catch (err: any) {
        console.error('Error general in create project route:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}