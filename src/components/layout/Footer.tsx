import Link from "next/link"

export function Footer() {
    return (
        <footer className="px-6 py-12 border-t" style={{ backgroundColor: '#000', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-10 mb-10">
                    {/* Brand */}
                    <div className="shrink-0">
                        <div className="flex items-center gap-2 mb-3">
                            <img src="/logos/matecitonobg.png" alt="matecito.dev" className="w-6 h-6 object-contain" />
                            <span className="font-bold text-base tracking-tight" style={{ color: '#f0f0f0' }}>
                                matecito<span style={{ color: '#6d001a' }}>.dev</span>
                            </span>
                        </div>
                        <p className="text-sm max-w-[200px] leading-relaxed" style={{ color: 'rgba(240,240,240,0.35)' }}>
                            Comunidades, videojuegos<br />y productos digitales.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6 text-sm">
                        <div className="flex flex-col gap-2.5">
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
                                style={{ color: 'rgba(240,240,240,0.25)' }}>
                                Ecosistema
                            </p>
                            <Link href="https://recienllegue.com.ar" target="_blank" rel="noopener noreferrer"
                                className="transition-colors hover:text-white"
                                style={{ color: 'rgba(240,240,240,0.50)' }}>Recién Llegué</Link>
                            <span style={{ color: 'rgba(240,240,240,0.25)' }}>ZeroLagARG</span>
                            <span style={{ color: 'rgba(240,240,240,0.25)' }}>Conquest of Etheria</span>
                            <Link href="/labs" className="transition-colors hover:text-white"
                                style={{ color: 'rgba(240,240,240,0.50)' }}>Labs</Link>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
                                style={{ color: 'rgba(240,240,240,0.25)' }}>
                                Cuenta
                            </p>
                            <Link href="/dashboard" className="transition-colors hover:text-white"
                                style={{ color: 'rgba(240,240,240,0.50)' }}>Dashboard</Link>
                            <Link href="/login" className="transition-colors hover:text-white"
                                style={{ color: 'rgba(240,240,240,0.50)' }}>Iniciar sesión</Link>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
                                style={{ color: 'rgba(240,240,240,0.25)' }}>
                                Legal
                            </p>
                            <Link href="/privacidad" className="transition-colors hover:text-white"
                                style={{ color: 'rgba(240,240,240,0.50)' }}>Privacidad</Link>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
                    style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(240,240,240,0.25)' }}>
                    <span>© {new Date().getFullYear()} matecito.dev</span>
                    <span>Hecho con mate 🧉 en Pergamino</span>
                </div>
            </div>
        </footer>
    )
}
