import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full bg-slate-900 text-slate-400">
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-800">

                    {/* Brand */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
                                <span className="text-white font-black text-xs">m</span>
                            </div>
                            <span className="font-bold text-white text-base tracking-tight">
                                matecito<span className="text-violet-400">.dev</span>
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Creamos páginas web y landings para emprendimientos y pymes. También estamos construyendo matecitodb, un backend-as-a-service hecho en Argentina.
                        </p>
                        <p className="text-xs text-slate-600">Construido en Argentina 🇦🇷</p>
                    </div>

                    {/* Servicios */}
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Servicios</p>
                        <nav className="flex flex-col gap-2.5 text-sm">
                            <Link href="/#servicios" className="hover:text-violet-400 transition-colors">Landing Pages</Link>
                            <Link href="/#servicios" className="hover:text-violet-400 transition-colors">Sitios Web</Link>
                            <Link href="/#servicios" className="hover:text-violet-400 transition-colors">SEO</Link>
                            <a href="https://wa.me/541124025239?text=Hola%2C%20quiero%20consultarles%20sobre%20una%20p%C3%A1gina%20web"
                                target="_blank" rel="noopener noreferrer"
                                className="hover:text-violet-400 transition-colors">Contacto</a>
                        </nav>
                    </div>

                    {/* matecitodb */}
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">matecitodb</p>
                        <nav className="flex flex-col gap-2.5 text-sm">
                            <Link href="/docs" className="hover:text-violet-400 transition-colors">Documentación</Link>
                            <Link href="/#newsletter" className="hover:text-violet-400 transition-colors">Acceder a la beta</Link>
                        </nav>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-600">
                    <span>© {new Date().getFullYear()} Matecito.Dev. Todos los derechos reservados.</span>
                    <Link href="/privacidad" className="hover:text-violet-400 transition-colors">Política de Privacidad</Link>
                </div>
            </div>
        </footer>
    )
}
