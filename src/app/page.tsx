import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { TechIcons, TechIconName } from "@/components/ui/TechIcons";
import { Search, Megaphone, Layout, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-black px-6 py-24 sm:py-32">
        {/* Subtle background grid for texture (optional) */}
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
                className="h-auto w-full max-w-[500px] object-contain filter drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* RIGHT SIDE: TEXT & CTA */}
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-white backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-white mr-3 animate-pulse"></span>
              Consultoría & Arquitectura
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:leading-[1.1]">
              Ingeniería de software <br />
              <span className="text-zinc-500">que escala tu negocio.</span>
            </h1>

            <p className="mt-8 max-w-md font-mono text-lg font-light leading-relaxed text-zinc-400 sm:text-xl">
              Diseño, desarrollo y performance extrema. Resolvemos tus desafíos tecnológicos con soluciones reales y sin vueltas.
            </p>

            <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <a
                href="https://wa.me/541124025239?text=Hola!%20Quisiera%20más%20info%20sobre%20tus%20servicios%20en%20Matecito.Dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full font-mono text-xs uppercase tracking-widest sm:w-auto sm:px-10 rounded-none h-14 bg-white text-black hover:bg-zinc-200">
                  Consultar Ahora
                </Button>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* SERVICES GRID SECTION */}
      <section className="bg-black py-24 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col gap-4 mb-16">
            <h2 className="text-4xl font-bold text-white uppercase tracking-tighter sm:text-6xl">
              Nuestras <br /><span className="text-zinc-500">Verticales</span>
            </h2>
            <p className="max-w-md text-zinc-400 font-mono text-sm uppercase tracking-widest text-balance">
              Soluciones de ingeniería enfocadas en resultados tangibles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {/* SEO & Performance */}
            <Link href="/seo" className="group bg-black p-10 flex flex-col gap-8 hover:bg-zinc-950 transition-all">
              <div className="h-12 w-12 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/30 transition-all">
                <Search className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">SEO & Performance</h3>
                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                  Optimizamos tu arquitectura para dominar Google. Core Web Vitals en verde y carga ultra-rápida.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Explorar Ingeniería SEO <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* High Conversion Landings */}
            <Link href="/landings" className="group bg-black p-10 flex flex-col gap-8 hover:bg-zinc-950 transition-all">
              <div className="h-12 w-12 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/30 transition-all">
                <Layout className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Landings de Élite</h3>
                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                  Diseño premium enfocado en conversión. Landings creadas con Next.js para una experiencia de usuario superior.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Ver Landings de Élite <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Sales Engineering */}
            <Link href="/marketing" className="group bg-black p-10 flex flex-col gap-8 hover:bg-zinc-950 transition-all">
              <div className="h-12 w-12 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-white/30 transition-all">
                <Megaphone className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Ingeniería de Ventas</h3>
                <p className="text-zinc-500 font-light text-sm leading-relaxed">
                  Embudos automatizados y analítica de alta precisión. Sabé exactamenten de dónde vienen tus clientes.
                </p>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-2 text-white font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Automatizar Ventas <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section className="bg-black py-24 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-bold text-white uppercase tracking-tighter sm:text-6xl">Lo que <br /><span className="text-zinc-500">construimos</span></h2>
              <p className="max-w-md text-zinc-400 font-mono text-sm uppercase tracking-widest text-balance">Productos propios y soluciones a medida diseñadas para impactar.</p>
            </div>
            <Link href="/estudio" className="font-mono text-xs text-white uppercase tracking-widest underline underline-offset-8 hover:text-zinc-500 transition-colors mb-4">Ver todos los casos →</Link>
          </div>

          <div className="flex flex-col">
            {/* Project 1 */}
            <Link
              href="https://stockcito.com"
              target="_blank"
              className="group border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-white/[0.02] px-4"
            >
              <div className="flex items-center gap-8">
                <div className="h-14 w-14 flex-shrink-0 bg-zinc-950 border border-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image
                    src="/projects/stockcito.png"
                    alt="Stockcito"
                    width={56}
                    height={56}
                    className="p-2 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Stockcito.com</h3>
                  <span className="hidden lg:block h-1 w-1 rounded-full bg-zinc-700"></span>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">SaaS / Gestión de Inventario Inteligente</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest px-3 py-1 border border-white/5">2025</span>
                <span className="text-white group-hover:translate-x-2 transition-transform duration-300">↗</span>
              </div>
            </Link>

            {/* Project 2 */}
            <Link
              href="https://recienllegue.com"
              target="_blank"
              className="group border-y border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:bg-white/[0.02] px-4"
            >
              <div className="flex items-center gap-8">
                <div className="h-14 w-14 flex-shrink-0 bg-zinc-950 border border-white/5 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image
                    src="/projects/recienllegue.png"
                    alt="Recienllegue"
                    width={56}
                    height={56}
                    className="p-0.5 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
                  <h3 className="text-xl font-bold text-white uppercase tracking-tight">Recienllegue.com</h3>
                  <span className="hidden lg:block h-1 w-1 rounded-full bg-zinc-700"></span>
                  <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Logística / Plataforma Digital Local</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest px-3 py-1 border border-white/5">2026</span>
                <span className="text-white group-hover:translate-x-2 transition-transform duration-300">↗</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROP SECTION */}
      <section className="border-t border-white/10 bg-zinc-950 py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xl font-semibold text-white uppercase">01 / Escalabilidad</h3>
              <p className="text-zinc-400 leading-relaxed font-light">
                Construimos bases sólidas desde el día cero. Sistemas que permiten un crecimiento exponencial sin acumular deuda técnica.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xl font-semibold text-white uppercase">02 / Carga Instántanea</h3>
              <p className="text-zinc-400 leading-relaxed font-light mb-4">
                Milisegundos que deciden conversiones. Optimizamos hasta el último byte para garantizar retención absoluta de usuarios.
              </p>
              <Link href="/landings" className="text-white font-mono text-[10px] uppercase tracking-widest hover:text-zinc-500 transition-colors flex items-center gap-2">
                Ver Landings de Elite ↗
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-mono text-xl font-semibold text-white uppercase">03 / Dirección</h3>
              <p className="text-zinc-400 leading-relaxed font-light mb-4">
                Intervenimos directamente en tu arquitectura actual. Auditamos, refactorizamos y educamos a tu equipo en las mejores prácticas.
              </p>
              <Link href="/seo" className="text-white font-mono text-[10px] uppercase tracking-widest hover:text-zinc-500 transition-colors flex items-center gap-2">
                Explorar Ingeniería SEO ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NewsletterForm />

      {/* TECH STACK MARQUEE */}
      <section className="py-8 border-t border-white/5 bg-black overflow-hidden select-none">
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
                  <div className="w-8 h-8 text-zinc-600 group-hover:text-white transition-colors duration-500">
                    <Icon className="w-full h-full" />
                  </div>
                  <span className="text-zinc-600 font-mono text-sm uppercase tracking-widest group-hover:text-white transition-colors duration-500">
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
