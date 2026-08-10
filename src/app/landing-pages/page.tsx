import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Code2,
  LayoutTemplate,
  Megaphone,
  MessageCircle,
  Search,
  Smartphone,
  Sparkles,
  Target,
} from "lucide-react";
import { WhatsAppButton } from "@/components/ContactCta";
import { LANDING_WHATSAPP_URL } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  absoluteTitle: "Landing pages desde $50.000 ARS | Matecito.dev",
  description:
    "Diseño y desarrollo de landing pages profesionales desde $50.000 ARS. Sitios rápidos, responsive, con SEO base y contacto directo por WhatsApp.",
  path: "/landing-pages",
  ogImage: {
    url: "/landing-pages/opengraph-image",
    width: 1200,
    height: 630,
    alt: "Landing pages profesionales desde $50.000 ARS — Matecito.dev",
  },
});

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Diseño y desarrollo de landing page",
  description:
    "Landing page responsive con diseño personalizado, SEO base, integración con WhatsApp y publicación en Vercel.",
  provider: {
    "@type": "Organization",
    name: "Matecito.dev",
    url: "https://matecito.dev",
  },
  areaServed: { "@type": "Country", name: "Argentina" },
  offers: {
    "@type": "Offer",
    price: "50000",
    priceCurrency: "ARS",
    url: "https://matecito.dev/landing-pages",
    availability: "https://schema.org/InStock",
  },
};

const INCLUDED = [
  "Diseño personalizado para tu negocio",
  "Una página responsive para celular y desktop",
  "Estructura pensada para generar consultas",
  "SEO técnico y on-page básico",
  "Botón y mensaje directo a WhatsApp",
  "Publicación en Vercel y conexión de dominio",
];

const FAQS = [
  {
    question: "¿Qué incluye la landing de $50.000?",
    answer:
      "Incluye una página de una sola sección continua, diseño responsive, estructura de contenidos, SEO base, integración con WhatsApp y publicación en Vercel. Si ya tenés dominio, también lo conectamos.",
  },
  {
    question: "¿El dominio está incluido?",
    answer:
      "No. El dominio y cualquier servicio pago de terceros se abonan por separado. Podemos ayudarte a elegirlo y conectarlo.",
  },
  {
    question: "¿Tengo que enviar textos e imágenes?",
    answer:
      "Trabajamos a partir de la información y el material que tengas. Te ayudamos a ordenar el mensaje para que la propuesta sea clara; si necesitás producción de contenido, la cotizamos aparte.",
  },
  {
    question: "¿Después puedo sumar más secciones o funciones?",
    answer:
      "Sí. La landing puede crecer con nuevas páginas, formularios, analítica, campañas o automatizaciones. Esas mejoras se presupuestan según el alcance.",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />
      <section className="relative overflow-hidden border-b-2 border-ink bg-paper">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-55" />
        <div className="page-wrap relative grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24 lg:py-28">
          <div className="reveal">
            <p className="section-label mb-5 text-accent">
              Diseño y desarrollo web · Argentina
            </p>
            <h1 className="max-w-3xl text-[clamp(2.9rem,7.5vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.04em] text-ink">
              Una landing que explique, convenza y
              <span className="text-accent"> venda.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">
              Diseñamos tu página profesional para convertir visitas en consultas.
              Rápida, clara y lista para compartir desde
              <strong className="font-semibold text-ink"> $50.000 ARS.</strong>
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton className="justify-center !bg-accent hover:!bg-[#6f1130]">
                Quiero mi landing
              </WhatsAppButton>
              <a href="#incluye" className="btn-ghost justify-center">
                Ver qué incluye
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 font-mono text-[11px] text-ink-faint">
              <BadgeCheck className="h-4 w-4 text-live" />
              Presupuesto claro · contacto directo · sin vueltas
            </p>
          </div>

          <div className="reveal reveal-delay-1">
            <div className="relative rounded-[2rem] border-2 border-ink bg-surface p-7 shadow-[9px_9px_0_0_var(--ink)] md:p-9">
              <span className="absolute -right-3 -top-3 rotate-3 rounded-full bg-accent px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                Precio lanzamiento
              </span>
              <p className="section-label mb-5">Tu landing profesional</p>
              <div className="flex items-end gap-2 border-b border-line pb-6">
                <span className="text-5xl font-bold tracking-tight text-ink md:text-6xl">
                  $50.000
                </span>
                <span className="pb-2 font-mono text-xs font-bold text-ink-faint">ARS</span>
              </div>
              <ul className="mt-6 space-y-3">
                {INCLUDED.slice(0, 5).map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-ink-muted">
                    <span className="mt-0.5 rounded-full bg-accent-soft p-1 text-accent">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={LANDING_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Consultar disponibilidad
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Características principales" className="border-b border-line bg-ink text-white">
        <div className="page-wrap grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {[
            [Smartphone, "100% responsive"],
            [Search, "SEO base"],
            [MessageCircle, "WhatsApp integrado"],
            [Code2, "Código rápido"],
          ].map(([Icon, label]) => {
            const FeatureIcon = Icon as typeof Smartphone;
            return (
              <div key={label as string} className="flex items-center gap-3 px-3 py-5 md:justify-center">
                <FeatureIcon className="h-4 w-4 shrink-0 text-accent" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/80 sm:text-xs">
                  {label as string}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="page-wrap">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="section-label mb-4">Una página, un objetivo</p>
              <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-[0.98] tracking-tight text-ink">
                Tu negocio se entiende en
                <span className="text-accent"> segundos.</span>
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">
              Una buena landing elimina distracciones y guía a la persona hacia una acción:
              pedir información, reservar un turno o comprar. Diseñamos cada bloque alrededor
              de ese objetivo.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Target,
                number: "01",
                title: "Mensaje claro",
                body: "Ordenamos tu propuesta para que el cliente entienda qué ofrecés, para quién y por qué elegirte.",
              },
              {
                icon: LayoutTemplate,
                number: "02",
                title: "Diseño que guía",
                body: "Jerarquía visual, beneficios y llamados a la acción ubicados para facilitar la decisión.",
              },
              {
                icon: Sparkles,
                number: "03",
                title: "Lista para crecer",
                body: "Base rápida y escalable para sumar analítica, campañas, formularios o nuevas páginas.",
              },
            ].map(({ icon: Icon, number, title, body }) => (
              <article key={number} className="rounded-[1.5rem] border border-line-strong bg-surface p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-2xl bg-accent-soft p-3 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-xs font-bold text-ink-faint">{number}</span>
                </div>
                <h3 className="mt-8 text-2xl font-bold text-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="incluye" className="scroll-mt-20 border-y-2 border-ink bg-surface py-20 md:py-28">
        <div className="page-wrap grid gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <p className="section-label mb-4">Paquete landing</p>
            <h2 className="text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-none tracking-tight text-ink">
              Todo lo esencial.
              <br />
              <span className="text-ink-muted">Nada de relleno.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              Una solución concreta para profesionales, comercios y emprendimientos que
              necesitan una presencia online seria y enfocada en conseguir consultas.
            </p>
            <p className="mt-7 inline-flex rounded-full border border-line-strong bg-paper px-4 py-2 font-mono text-xs text-ink-muted">
              El dominio y servicios pagos de terceros no están incluidos.
            </p>
          </div>

          <div className="rounded-[2rem] bg-paper-warm p-7 md:p-9">
            <ul className="grid gap-4">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-line-strong pb-4 last:border-0 last:pb-0">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={3} />
                  <span className="font-semibold text-ink">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4 border-t-2 border-ink pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink-faint">Inversión</p>
                <p className="mt-1 text-4xl font-bold text-ink">$50.000 <span className="font-mono text-xs">ARS</span></p>
              </div>
              <WhatsAppButton className="justify-center">Empezar ahora</WhatsAppButton>
            </div>
          </div>
        </div>
      </section>

      <section id="proceso" className="scroll-mt-20 py-20 md:py-28">
        <div className="page-wrap">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-4">Cómo trabajamos</p>
            <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Simple de principio a fin.
            </h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Nos contás tu idea", "Hablamos por WhatsApp sobre tu negocio, público y objetivo principal."],
              ["02", "Diseñamos y construimos", "Definimos el mensaje, diseñamos la experiencia y desarrollamos la página."],
              ["03", "Revisamos y publicamos", "Ajustamos los detalles, conectamos tu dominio y dejamos la landing online."],
            ].map(([number, title, body]) => (
              <li key={number} className="relative border-t-2 border-ink pt-6">
                <span className="font-mono text-xs font-bold text-accent">{number}</span>
                <h3 className="mt-5 text-2xl font-bold text-ink">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-20 md:py-28">
        <div className="page-wrap grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="section-label mb-4">Trabajo real</p>
            <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              También construimos nuestros propios productos.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Aplicamos en proyectos propios lo que ofrecemos: estrategia, diseño,
              desarrollo y mejora continua.
            </p>
            <Link href="/proyectos" className="btn-ghost mt-7">
              Conocer proyectos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <a
            href="https://recienllegue.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[2rem] border-2 border-ink bg-[#e8f2ef] p-8 shadow-[7px_7px_0_0_var(--accent)] transition-transform hover:-translate-y-1 md:p-10"
          >
            <div className="flex items-center justify-between">
              <span className="text-5xl" aria-hidden>🌎</span>
              <span className="badge-live">Proyecto online</span>
            </div>
            <p className="section-label mt-12">Plataforma local</p>
            <h3 className="mt-2 text-3xl font-bold text-ink md:text-4xl">Recién Llegué</h3>
            <p className="mt-3 max-w-lg text-ink-muted">
              Recursos y comunidad para ayudar a las personas a adaptarse a una nueva ciudad.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent">
              Visitar proyecto <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="page-wrap grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
          <div>
            <p className="section-label mb-4">Cuando quieras dar el próximo paso</p>
            <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              La landing es el comienzo.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
              Una vez que tu propuesta está online, podemos ayudarte a atraer visitas y medir
              resultados. Estos servicios se cotizan según cada objetivo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [Megaphone, "Marketing digital"],
              [Target, "Campañas publicitarias"],
              [Search, "SEO y contenidos"],
              [Sparkles, "Automatizaciones"],
            ].map(([Icon, service]) => {
              const ServiceIcon = Icon as typeof Megaphone;
              return (
                <div key={service as string} className="flex items-center gap-4 rounded-2xl border border-line-strong bg-surface p-5">
                  <ServiceIcon className="h-5 w-5 shrink-0 text-accent" />
                  <span className="font-semibold text-ink">{service as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="preguntas" className="scroll-mt-20 border-t border-line bg-paper-warm py-20 md:py-28">
        <div className="page-wrap grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="section-label mb-4">Preguntas frecuentes</p>
            <h2 className="text-4xl font-bold tracking-tight text-ink">Antes de empezar.</h2>
          </div>
          <div className="divide-y divide-line-strong border-y border-line-strong">
            {FAQS.map(({ question, answer }) => (
              <details key={question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold text-ink">
                  {question}
                  <span className="text-2xl font-normal text-accent transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pr-10 pt-4 text-sm leading-relaxed text-ink-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
