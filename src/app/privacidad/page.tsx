import Link from "next/link";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacidad",
  description:
    "Política de privacidad de las aplicaciones del ecosistema Matecito.dev.",
  path: "/privacidad",
});

const apps = [
  {
    name: "ILoveMP3",
    description: "Reproductor de música local con radio social y descarga de audio.",
    sections: [
      {
        title: "Datos que recopilamos",
        content: `ILoveMP3 puede recopilar los siguientes datos según las funcionalidades que uses:
• **Cuenta de usuario**: si te registrás, guardamos tu email y nombre de usuario.
• **Token de notificaciones (FCM)**: para enviarte notificaciones push sobre actividad en la radio social.
• **Contenido social**: recomendaciones, me gusta y votos en el muro.
• **Canciones locales**: solo se leen en el dispositivo para reproducir. No se suben a servidores.`,
      },
      {
        title: "Cómo usamos los datos",
        content: `• Para mostrar el muro social y enviarte notificaciones (si las habilitaste).
• No vendemos ni compartimos tus datos con terceros con fines publicitarios.`,
      },
      {
        title: "Servicios de terceros",
        content: `• **Firebase (Google)**: notificaciones push.
• **YouTube / Cobalt**: descargas de audio vía API pública. No almacenamos el contenido descargado.`,
      },
    ],
  },
];

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (!line.trim()) return null;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="mt-2 text-sm leading-relaxed text-ink-muted first:mt-0">
        {parts.map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold text-ink">
              {part}
            </strong>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default function PrivacidadPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="page-wrap py-16 md:py-20">
          <Link href="/" className="mb-6 inline-block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            ← Inicio
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">Privacidad</h1>
          <p className="mt-4 max-w-2xl text-sm text-ink-muted">
            Última actualización:{" "}
            {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </section>

      <section className="page-wrap py-16">
        <div className="max-w-3xl space-y-16">
          {apps.map((app) => (
            <div key={app.name}>
              <h2 className="text-2xl font-bold text-ink">{app.name}</h2>
              <p className="mt-2 text-sm text-ink-muted">{app.description}</p>
              <div className="mt-8 space-y-8">
                {app.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="section-label mb-3">{section.title}</h3>
                    <div className="rounded-2xl border-2 border-line bg-paper-warm p-6">
                      {renderContent(section.content)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <h2 className="text-2xl font-bold text-ink">Disposiciones generales</h2>
            <div className="mt-8 space-y-6">
              {[
                {
                  title: "Contacto",
                  content: "Consultas sobre esta política: a través del sitio matecito.dev.",
                },
                {
                  title: "Menores",
                  content: "Nuestras apps no están dirigidas a menores de 13 años.",
                },
                {
                  title: "Cambios",
                  content: "Podemos actualizar esta política. Los cambios relevantes se comunicarán por la app o el sitio.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="section-label mb-3">{item.title}</h3>
                  <div className="rounded-2xl border-2 border-line bg-paper-warm p-6">
                    <p className="text-sm leading-relaxed text-ink-muted">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
