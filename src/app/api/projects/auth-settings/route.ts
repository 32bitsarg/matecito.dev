import { NextResponse } from 'next/server'

// Auth settings por proyecto (requireVerification, OAuth2, etc.)
// Pendiente de implementar en el backend de matebase.
// Por ahora retorna defaults razonables para que el dashboard no crashee.

const defaultSettings = {
  requireVerification: false,
  emailVisibility: false,
  passwordAuth: true,
  mfa: false,
  oauth2: { providers: [] },
  _note: 'Auth settings not yet implemented in backend',
}

export async function GET() {
  return NextResponse.json(defaultSettings)
}

export async function PATCH(req: Request) {
  const token = req.headers.get('Authorization')?.split(' ')[1]
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Absorber el request sin crash — pendiente implementación real
  return NextResponse.json({ ok: true, ...defaultSettings })
}
