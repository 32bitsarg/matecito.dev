import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subdomain = searchParams.get('subdomain')
    const adminToken = searchParams.get('adminToken')

    if (!subdomain || !adminToken) {
      return NextResponse.json({ error: 'Faltan parámetros: subdomain o adminToken' }, { status: 400 })
    }

    // Conectar directo a la instancia del proyecto como superadmin
    const instancePb = new PocketBase(`https://${subdomain}.matecito.dev`)
    instancePb.authStore.save(adminToken, null)

    // Obtener configuración actual de la colección users
    const usersCollection = await instancePb.collections.getOne('_pb_users_auth_')

    return NextResponse.json({
      requireVerification: usersCollection.authRule === 'verified = true',
      emailVisibility: usersCollection.emailVisibility ?? false,
      passwordAuth: usersCollection.passwordAuth ?? { enabled: true },
      mfa: usersCollection.mfa ?? { enabled: false },
      oauth2: usersCollection.oauth2 ?? { enabled: false, providers: [] }
    })

  } catch (err: any) {
    console.error('[API AuthSettings GET Error]:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { subdomain, adminToken, settings } = await req.json()

    if (!subdomain || !adminToken) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const instancePb = new PocketBase(`https://${subdomain}.matecito.dev`)
    instancePb.authStore.save(adminToken, null)

    // Lógica especial para requireVerification via authRule
    const finalSettings: any = { ...settings }
    
    if (settings.requireVerification !== undefined) {
      finalSettings.authRule = settings.requireVerification ? 'verified = true' : ''
      delete finalSettings.requireVerification
    }

    // Actualizar configuración de la colección users
    const updated = await instancePb.collections.update('_pb_users_auth_', finalSettings)

    return NextResponse.json({ success: true, collection: updated })

  } catch (err: any) {
    console.error('[API AuthSettings PATCH Error]:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
