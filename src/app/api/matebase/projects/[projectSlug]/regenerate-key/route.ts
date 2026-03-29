import { NextResponse } from 'next/server'

const INTERNAL_API = process.env.INTERNAL_API_URL ?? 'https://api.matecito.dev/api/v1/platform'
const INTERNAL_TOKEN = process.env.INTERNAL_API_TOKEN ?? ''

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  try {
    const { projectSlug } = await params
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Buscar el proyecto por subdomain usando la plataforma
    const meRes = await fetch(`${INTERNAL_API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const me = await meRes.json()
    const project = me.projects?.find((p: any) => p.subdomain === projectSlug)
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    // Regenerar keys en el backend
    const regen = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/${project.id}/regenerate-key`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    )
    const data = await regen.json()
    if (!regen.ok) return NextResponse.json(data, { status: regen.status })

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
