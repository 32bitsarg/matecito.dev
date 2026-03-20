import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function POST(req: Request) {
    try {
        const { name, slug, token, userId } = await req.json()

        // Instancia fresca con el token del usuario
        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)
        pb.authStore.save(token, null)

        const workspace = await pb.collection('workspaces').create({
            name,
            slug,
            owner: userId
        })

        return NextResponse.json({ success: true, workspace })

    } catch (err: any) {
        console.error('Error detallado:', JSON.stringify(err.response, null, 2))
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
