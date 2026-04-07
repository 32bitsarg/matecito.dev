import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad · Matecito.Dev",
  description: "Política de privacidad de las aplicaciones desarrolladas por Matecito.Dev.",
}

const apps = [
  {
    name: "ILoveMP3",
    description: "Reproductor de música local con radio social y descarga de audio.",
    sections: [
      {
        title: "Datos que recopilamos",
        content: `ILoveMP3 puede recopilar los siguientes datos según las funcionalidades que uses:
• **Cuenta de usuario**: si te registrás, guardamos tu email y nombre de usuario.
• **Token de notificaciones (FCM)**: para enviarte notificaciones push sobre actividad en la radio social. Este token se asocia a tu cuenta y se elimina si cerrás sesión.
• **Contenido social**: las canciones que recomendás en el muro y tus interacciones (me gusta, votos) se almacenan en nuestros servidores.
• **Canciones locales**: el reproductor accede a los archivos de música de tu dispositivo únicamente para reproducirlos. Estos archivos no se suben a ningún servidor.`,
      },
      {
        title: "Permisos que solicitamos",
        content: `• **Almacenamiento**: para leer y guardar archivos de música en tu dispositivo.
• **Notificaciones**: para enviarte alertas de actividad en la radio social (podés desactivarlas en cualquier momento desde la configuración de tu dispositivo).`,
      },
      {
        title: "Cómo usamos los datos",
        content: `• Para mostrarte el muro social con recomendaciones de otros usuarios.
• Para enviarte notificaciones push (solo si las habilitaste).
• No vendemos ni compartimos tus datos con terceros con fines publicitarios.`,
      },
      {
        title: "Retención y eliminación",
        content: `Podés eliminar tu cuenta en cualquier momento desde la configuración de la app. Al hacerlo, borramos tus datos personales y tu token de notificaciones de nuestros servidores. Los archivos de música en tu dispositivo no se ven afectados.`,
      },
      {
        title: "Servicios de terceros",
        content: `• **Firebase (Google)**: usamos Firebase Cloud Messaging para notificaciones push. Firebase puede recopilar datos de uso según su propia política de privacidad: https://firebase.google.com/support/privacy
• **YouTube / Cobalt**: las descargas de audio usan la API pública de YouTube y un servidor intermediario (Cobalt). No almacenamos el contenido descargado en nuestros servidores.`,
      },
    ],
  },
]

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-300">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <Link href="/" className="text-xs text-violet-400 hover:text-violet-300 transition-colors mb-4 inline-block">
            ← matecito.dev
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight">Política de Privacidad</h1>
          <p className="mt-2 text-sm text-slate-500">
            Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            En <span className="text-violet-400 font-semibold">Matecito.Dev</span> nos tomamos en serio tu privacidad.
            Esta página describe qué datos recopila cada una de nuestras aplicaciones, cómo los usamos y cuáles son tus derechos.
          </p>
        </div>
      </div>

      {/* Apps */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        {apps.map((app) => (
          <section key={app.name}>
            {/* App header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
                <span className="text-white font-black text-sm">{app.name[0]}</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{app.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{app.description}</p>
              </div>
            </div>

            <div className="space-y-8">
              {app.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                    {section.content.split("\n").map((line, i) => {
                      if (!line.trim()) return null
                      // Bold: **text**
                      const parts = line.split(/\*\*(.*?)\*\*/g)
                      return (
                        <p key={i} className="text-sm leading-relaxed text-slate-400 mt-1 first:mt-0">
                          {parts.map((part, j) =>
                            j % 2 === 1
                              ? <strong key={j} className="text-slate-200 font-semibold">{part}</strong>
                              : part
                          )}
                        </p>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* General */}
        <section>
          <h2 className="text-xl font-black text-white mb-6">Disposiciones generales</h2>
          <div className="space-y-6">
            {[
              {
                title: "Contacto",
                content: "Si tenés preguntas sobre esta política o querés ejercer tus derechos, escribinos a través del sitio matecito.dev o por WhatsApp.",
              },
              {
                title: "Menores de edad",
                content: "Nuestras aplicaciones no están dirigidas a menores de 13 años. No recopilamos intencionalmente datos de menores.",
              },
              {
                title: "Cambios a esta política",
                content: "Podemos actualizar esta política en cualquier momento. Te notificaremos sobre cambios significativos a través de la app o del sitio.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-3">{item.title}</h3>
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                  <p className="text-sm leading-relaxed text-slate-400">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer minimal */}
      <div className="border-t border-slate-800 mt-8">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-slate-600 text-center">
          © {new Date().getFullYear()} Matecito.Dev · <Link href="/" className="hover:text-violet-400 transition-colors">Inicio</Link>
        </div>
      </div>
    </main>
  )
}
