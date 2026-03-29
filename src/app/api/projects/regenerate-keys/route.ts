import { NextResponse } from 'next/server'

// Redirige al nuevo endpoint del backend directamente.

export async function POST(req: Request) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { projectId } = body

    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 })

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/${projectId}/regenerate-key`,
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
