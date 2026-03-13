import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/5 bg-zinc-950 py-12 text-sm text-zinc-400">
            <div className="container mx-auto max-w-6xl px-6 flex flex-col items-center justify-between md:flex-row">

                <div className="flex flex-col items-center gap-2 md:items-start">
                    <p className="font-sans text-base font-bold text-white">Matecito.Dev</p>
                    <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
                </div>

                <div className="mt-8 flex gap-6 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors">Términos</Link>
                    <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
                    <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
                    <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
                </div>

            </div>
        </footer>
    );
}
