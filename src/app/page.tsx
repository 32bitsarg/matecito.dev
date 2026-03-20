import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { TechIcons, TechIconName } from "@/components/ui/TechIcons";
import { Search, Megaphone, Layout } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col bg-[var(--background)]">
      {/* HERO SECTION */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
        {/* Subtle background grid for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* LEFT SIDE: GIANT LOGO */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <Image
                src="/logos/matecitonobg.png"
                alt="Matecito.Dev Logo"
                width={800}
                height={800}
                className="h-auto w-full max-w-[500px] object-contain brightness-0 invert opacity-90 transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* RIGHT SIDE: TEXT & CTA */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center border border-[var(--accent)]/10 bg-[var(--accent)]/5 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] mr-3 animate-pulse"></span>
              Consultoría & Arquitectura
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-[var(--accent)] sm:text-7xl md:leading-[1.1]">
              Landing Pages que <br />
              <span className="text-[var(--foreground)] opacity-70">venden en toda Argentina.</span>
            </h1>

            <p className="mt-8 max-w-md font-mono text-lg font-light leading-relaxed text-[var(--foreground)] sm:text-xl">
              Diseño premium e ingeniería de software con enfoque local en <strong>Pergamino</strong> y <strong>Buenos Aires</strong>. Escalamos tu negocio a nivel nacional con performance extrema y SEO estratégico.
            </p>

            <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="https://wa.me/541124025239?text=Hola!%20Quisiera%20más%20info%20sobre%20tus%20servicios%20en%20Matecito.Dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full font-mono text-xs uppercase tracking-widest sm:w-auto sm:px-10 rounded-full h-14 bg-[var(--accent)] text-[var(--background)] hover:opacity-90">
                  Consultar Ahora
                </Button>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* PROBLEM / SOLUTION SECTION */}
      <section className="py-24 bg-[var(--accent)]/5 border-t border-[var(--accent)]/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[var(--accent)] uppercase tracking-tighter sm:text-5xl mb-8">
                ¿Por qué tu web <br /><span className="text-[var(--foreground)] opacity-70">no está vendiendo?</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 flex items-center justify-center text-[var(--accent)] text-xs font-mono font-bold mt-1">1</div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] uppercase text-sm mb-2">Latencia Crítica</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed italic">Alojar tus datos en EE.UU. genera una latencia innecesaria que hace que tu sitio se sienta "pesado" para los usuarios locales, frustrando las conversiones en tiempo real.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 flex items-center justify-center text-[var(--accent)] text-xs font-mono font-bold mt-1">2</div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] uppercase text-sm mb-2">SEO Genérico</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed italic">Estás compitiendo con el mundo, en lugar de dominar las búsquedas locales en Pergamino y alrededores.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5 flex items-center justify-center text-[var(--accent)] text-xs font-mono font-bold mt-1">3</div>
                  <div>
                    <h4 className="font-bold text-[var(--foreground)] uppercase text-sm mb-2">Fuga de Conversión</h4>
                    <p className="text-sm text-[var(--foreground)] opacity-70 leading-relaxed italic">Diseños lentos que frustran al usuario. Si tu sitio tarda más de 3 segundos, ya perdiste al cliente.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[var(--accent)]/10 p-8 lg:p-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
               <h3 className="text-2xl font-bold text-[var(--accent)] uppercase mb-6">Nuestra solución</h3>
               <p className="text-lg text-[var(--foreground)] leading-relaxed mb-8 opacity-90">
                En <strong>Matecito.Dev</strong> fusionamos ingeniería de software con marketing de precisión. Creamos infraestructura en Argentina para garantizar que tu negocio escale desde <strong>Pergamino</strong> a todo el país con velocidad total.
               </p>
               <a href="https://wa.me/541124025239" className="inline-flex items-center gap-2 text-[var(--accent)] font-mono text-[10px] uppercase tracking-widest border-b border-[var(--accent)] pb-1 hover:opacity-70 transition-all">
                Diagnosticar mi sitio gratis ↗
               </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID SECTION */}
      <section id="servicios" className="py-24 border-t border-[var(--accent)]/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-4xl font-bold text-[var(--accent)] uppercase tracking-tighter sm:text-6xl">
              Nuestros <br /><span className="text-[var(--foreground)] opacity-70">Diferenciales</span>
            </h2>
            <p className="max-w-md text-[var(--foreground)] font-mono text-sm uppercase tracking-widest text-balance">
              No es una web común. Es una landing diseñada para vender en Argentina.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--accent)]/10 border border-[var(--accent)]/10">
            {/* SEO & Performance */}
            <div className="group bg-[var(--background)] p-10 flex flex-col gap-8 hover:bg-[var(--accent)]/5 transition-all">
              <div className="h-12 w-12 border border-[var(--accent)]/10 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">Fundación SEO</h3>
                <p className="text-[var(--foreground)] font-light text-sm leading-relaxed">
                  Optimizamos tu arquitectura técnica desde el primer byte para dominar Google en <strong>Pergamino</strong>, <strong>Buenos Aires</strong> y toda Argentina.
                </p>
              </div>
            </div>

            {/* High Conversion Landings */}
            <div className="group bg-[var(--background)] p-10 flex flex-col gap-8 hover:bg-[var(--accent)]/5 transition-all">
              <div className="h-12 w-12 border border-[var(--accent)]/10 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                <Layout className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">Diseño de Conversión</h3>
                <p className="text-[var(--foreground)] font-light text-sm leading-relaxed">
                  Estética de ingeniería premium. Creamos landings con interfaces rápidas y flujos de venta optimizados para máxima retención de usuarios.
                </p>
              </div>
            </div>

            {/* Database Service */}
            <div className="group bg-[var(--background)] p-10 flex flex-col gap-8 hover:bg-[var(--accent)]/5 transition-all">
              <div className="h-12 w-12 border border-[var(--accent)]/10 flex items-center justify-center text-[var(--foreground)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">Velocidad Argentina</h3>
                <p className="text-[var(--foreground)] font-light text-sm leading-relaxed">
                  Bases de datos locales en Sudamérica. Reducimos el lag al mínimo con infraestructura en la región, garantizando cargas instantáneas en el mercado local.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* VALUE PROP SECTION */}
      <section className="border-t border-[var(--accent)]/10 py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-lg font-bold text-[var(--accent)] uppercase tracking-wider">01 / Escalabilidad</h3>
              <p className="text-[var(--foreground)] leading-relaxed font-light text-sm">
                Arquitectura preparada para el mañana. Sistemas robustos que crecen junto a tu volumen de clientes sin degradar la performance.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-lg font-bold text-[var(--accent)] uppercase tracking-wider">02 / Carga Instantánea</h3>
              <p className="text-[var(--foreground)] leading-relaxed font-light text-sm mb-4">
                Cada milisegundo es dinero. Optimizamos tus landings para que la experiencia en Pergamino sea tan fluida como en cualquier hub tecnológico del mundo.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-lg font-bold text-[var(--accent)] uppercase tracking-wider">03 / Baja Latencia</h3>
              <p className="text-[var(--foreground)] leading-relaxed font-light text-sm">
                Servidores locales en Sudamérica. Eliminamos el lag geográfico para que tu negocio en Buenos Aires responda en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-32 border-t border-[var(--accent)]/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0.5px,transparent_0.5px)] bg-[size:48px_48px] opacity-10"></div>
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-5xl font-bold text-[var(--accent)] uppercase tracking-tighter mb-8 sm:text-7xl">
            ¿Listo para <br /> <span className="text-[var(--foreground)] opacity-70">dominar tu mercado?</span>
          </h2>
          <p className="text-xl text-[var(--foreground)] font-mono mb-12 opacity-80">
            Hablemos de ingeniería, diseño y resultados reales en Pergamino.
          </p>
          <a
            href="https://wa.me/541124025239"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="font-mono text-xs uppercase tracking-[0.3em] px-12 rounded-full h-16 bg-[var(--accent)] text-[var(--background)] hover:opacity-90 shadow-2xl shadow-[var(--accent)]/20">
              Solicitar Presupuesto ↗
            </Button>
          </a>
        </div>
      </section>

      <NewsletterForm />

      {/* TECH STACK MARQUEE */}
      <section className="py-12 border-t border-[var(--accent)]/5 overflow-hidden select-none">
        <div className="flex animate-marquee whitespace-nowrap gap-16 lg:gap-32 items-center">
          {(() => {
            const techs: { name: string; slug: TechIconName }[] = [
              { name: "Next.js", slug: "nextdotjs" },
              { name: "React", slug: "react" },
              { name: "TypeScript", slug: "typescript" },
              { name: "Node.js", slug: "nodedotjs" },
              { name: "PostgreSQL", slug: "postgresql" },
              { name: "AWS", slug: "amazonwebservices" },
              { name: "Docker", slug: "docker" },
              { name: "Tailwind CSS", slug: "tailwindcss" },
              { name: "Prisma", slug: "prisma" },
              { name: "Vercel", slug: "vercel" },
              { name: "Python", slug: "python" },
              { name: "Supabase", slug: "supabase" },
              { name: "Flutter", slug: "flutter" },
              { name: "Framer", slug: "framer" },
            ];

            // Duplicamos el array para que el scroll sea infinito y fluido
            const doubleTechs = [...techs, ...techs];

            return doubleTechs.map((tech, index) => {
              const Icon = TechIcons[tech.slug];
              return (
                <div key={`${tech.slug}-${index}`} className="flex items-center gap-4 group transition-all duration-500">
                  <div className="w-8 h-8 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-500 opacity-40 group-hover:opacity-100">
                    <Icon className="w-full h-full" />
                  </div>
                  <span className="text-[var(--foreground)] font-mono text-xs uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors duration-500 opacity-40 group-hover:opacity-100">
                    {tech.name}
                  </span>
                </div>
              );
            });
          })()}
        </div>
      </section>
    </div>
  );
}
