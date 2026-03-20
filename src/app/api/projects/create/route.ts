import { NextResponse } from 'next/server'
import PocketBase from 'pocketbase'

export async function POST(req: Request) {
    try {
        const { name, workspaceId, subdomain, token } = await req.json()

        if (!name || !workspaceId || !subdomain || !token) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL)
        pb.authStore.save(token, null)

        // 1. Crear en PocketBase con status "creating"
        let project = await pb.collection('projects').create({
            name,
            workspace: workspaceId,
            subdomain,
            port: 0,
            status: 'creating'
        })

        // 2. Llamar al VPS — el VPS actualiza PocketBase directamente
        // Usamos AbortController para no esperar más de 60s
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 60000)

        try {
            const deployResponse = await fetch(`${process.env.INTERNAL_API_URL}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-token': process.env.INTERNAL_API_TOKEN!
                },
                body: JSON.stringify({
                    subdomain,
                    projectId: project.id,
                    userToken: token,
                    pbUrl: process.env.NEXT_PUBLIC_POCKETBASE_URL
                }),
                signal: controller.signal
            })

            clearTimeout(timeout)
            const deployData = await deployResponse.json()

            if (!deployData.success) {
                await pb.collection('projects').delete(project.id)
                return NextResponse.json({ error: deployData.error }, { status: 500 })
            }

            // 3. Si el deploy fue exitoso, actualizar el proyecto con sus datos finales
            project = await pb.collection('projects').update(project.id, {
                port: deployData.port,
                status: 'active',
                admin_email: deployData.adminEmail,
                admin_pass: deployData.adminPass,
                admin_token: deployData.adminToken,
                anon_key: deployData.anonKey,        
                service_key: deployData.serviceKey   
            })

            // 4. Configurar seguridad por defecto: Requerir verificación de email
            // Intentamos hasta 3 veces con un pequeño delay por si la instancia está arrancando
            const setSecurityDefault = async (retries = 3) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        const instancePb = new PocketBase(`https://${subdomain}.matecito.dev`)
                        instancePb.authStore.save(deployData.adminToken, null)
                        await instancePb.collections.update('_pb_users_auth_', {
                            authRule: 'verified = true'
                        })
                        console.log(`[Seguridad] Verificación activada tras ${i + 1} intentos para ${subdomain}`)
                        return true
                    } catch (secErr: any) {
                        console.warn(`Intento ${i + 1} fallido para configurar seguridad en ${subdomain}:`, secErr.message)
                        if (i < retries - 1) await new Promise(r => setTimeout(r, 3000)) // Esperar 3s entre reintentos
                    }
                }
                return false
            }

            setSecurityDefault() // Se ejecuta de fondo para no bloquear el retorno al UI

        } catch (fetchErr: any) {
            clearTimeout(timeout)
            // Si timeout o error de red, el VPS puede estar procesando
            // El proyecto queda en "creating" — el usuario verá el estado real cuando refresque
            console.error('Timeout o error de red al llamar al VPS:', fetchErr.message)
        }

        // 3. Retornar el proyecto
        return NextResponse.json({ success: true, project })

    } catch (err: any) {
        console.error('Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}