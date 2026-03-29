import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { name, slug, token, userId } = await req.json()

        if (!name || !slug || !token || !userId) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // 1. Llamar al nuevo backend para crear el workspace
        const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                slug,
                owner_id: userId
            })
        })

        const data = await backendRes.json()

        if (!backendRes.ok) {
            return NextResponse.json({ error: data.message || 'Error al crear workspace en el backend' }, { status: backendRes.status })
        }

        return NextResponse.json({ success: true, workspace: data.workspace })

    } catch (err: any) {
        console.error('Error in create workspace route:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

