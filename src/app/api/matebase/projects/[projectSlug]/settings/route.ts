import { NextResponse } from 'next/server'

// Settings de SMTP y configuración avanzada — pendiente de implementar en backend.
// Por ahora retorna valores vacíos para que el dashboard no crashee.

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params
  return NextResponse.json({
    name: projectSlug,
    smtp: { host: '', port: 587, user: '', from: '' },
    _note: 'SMTP settings not yet implemented',
  })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectSlug: string }> }
) {
  const { projectSlug } = await params
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  // Si vienen cambios de nombre, los redirigimos al endpoint real
  if (body.name) {
    const meRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (meRes.ok) {
      const me = await meRes.json()
      const project = me.projects?.find((p: any) => p.subdomain === projectSlug)
      if (project) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/platform/rename-p/${project.id}`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: body.name }),
          }
        )
      }
    }
  }

  return NextResponse.json({ ok: true, _note: 'SMTP settings not yet implemented' })
}
