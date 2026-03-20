"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { usePathname, useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { LogOut } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const isDashboard = pathname.startsWith('/dashboard');

    // Manejo de hidratación y sincro de usuario
    useEffect(() => {
        const syncUser = () => {
            setUser(pb.authStore.record);
        };

        syncUser();
        const unsubscribe = pb.authStore.onChange(syncUser);
        
        return () => unsubscribe();
    }, [pathname]);

    // Bloqueo de scroll agresivo para el menú móvil
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isMenuOpen]);

    const handleLogout = () => {
        pb.authStore.clear();
        setUser(null);
        // Hard redirect for session cleaning
        window.location.href = '/login';
    };

    const navLinks = [
        { href: "/#servicios", label: "Servicios" },
        { href: "/estudio", label: "Estudio" },
        { href: "/insights", label: "Insights" },
    ];

    return (
        <>
            {/* HEADER - Minimalist Context-Aware */}
            <header className={`sticky top-0 w-full transition-all duration-300 z-[1001] border-b border-border/50 ${isMenuOpen ? 'bg-transparent border-transparent' : 'bg-background/80 backdrop-blur-xl'}`}>
                <div className="container mx-auto flex h-9 sm:h-11 max-w-7xl items-center justify-between px-6 md:px-12 relative">
                    
                    {/* LEFT SECTION: BRANDING & PRIMARY NAV */}
                    <div className="flex items-center gap-8 group shrink-0 relative z-[1002]">
                        <Link href="/" className="flex items-center gap-1 group">
                            <span className="font-bold tracking-tighter text-lg sm:text-xl text-white">matecito<span className="text-accent underline decoration-accent/30">.dev</span></span>
                        </Link>

                        {/* NAV LINKS (Left aligned next to logo) */}
                        <nav className="hidden md:flex items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] font-bold border-l border-[var(--foreground)]/10 pl-8 ml-2">
                            {isDashboard ? (
                                <>
                                    <Link href="/" className="text-[var(--foreground)]/60 transition-colors hover:text-[var(--accent)]">Inicio</Link>
                                    <Link href="/#servicios" className="text-[var(--foreground)]/60 transition-colors hover:text-[var(--accent)]">Servicios</Link>
                                    <Link href="/insights" className="text-[var(--foreground)]/60 transition-colors hover:text-[var(--accent)]">Insights</Link>
                                </>
                            ) : (
                                navLinks.map((link) => (
                                    <div key={link.label} className="relative group/item py-2">
                                        <Link href={link.href || "#"} className="text-[var(--foreground)]/60 transition-colors hover:text-[var(--accent)] relative">
                                            {link.label}
                                        </Link>
                                    </div>
                                ))
                            )}
                        </nav>
                    </div>

                    <div className="flex-1" />

                    {/* RIGHT SECTION: ACTIONS */}
                    <div className="flex items-center gap-6 relative z-[1002]">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {isDashboard ? (
                                    <>
                                        <div className="hidden lg:flex flex-col items-end min-w-0 pr-4 border-r border-[var(--foreground)]/5">
                                            <span className="text-[10px] font-bold text-[var(--accent)] truncate">{user.name || 'Usuario'}</span>
                                            <span className="text-[8px] font-mono opacity-40 truncate lowercase tracking-tighter">{user.email}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 text-[var(--foreground)]/60 hover:text-red-500 transition-colors font-mono text-[9px] uppercase tracking-widest pl-2"
                                        >
                                            Cerrar Sesión
                                            <LogOut className="w-3.5 h-3.5" />
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-colors font-mono uppercase text-[9px] tracking-[0.15em] border border-[var(--accent)]/10 px-4 py-1.5 rounded-full hover:bg-[var(--accent)]/5"
                                    >
                                        Ir a Consola
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:block text-[var(--foreground)]/60 hover:text-[var(--accent)] transition-colors font-mono uppercase text-[9px] tracking-[0.15em] border border-[var(--accent)]/10 px-4 py-1.5 rounded-full hover:bg-[var(--accent)]/5"
                            >
                                Login
                            </Link>
                        )}
                        
                        <a
                            href="https://wa.me/541124025239"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:block"
                        >
                            <Button variant="outline" className="rounded-full font-mono uppercase tracking-[0.2em] text-[8px] px-4 h-8 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)]">
                                Contacto
                            </Button>
                        </a>

                        {/* HAMBURGER (Mobile) */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex flex-col gap-1 md:hidden p-2 group focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <span className={`h-[1px] w-6 bg-[var(--accent)] transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`}></span>
                            <span className={`h-[1px] w-6 bg-[var(--accent)] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                            <span className={`h-[1px] w-6 bg-[var(--accent)] transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE MENU */}
            <div
                className={`fixed inset-0 bg-[var(--background)] transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ zIndex: 1000 }}
            >
                <div className="relative flex flex-col h-full pt-20 pb-12 px-10">
                    <nav className="flex flex-col gap-8">
                        {navLinks.map((link, idx) => (
                            <div key={link.label} className="flex flex-col gap-4">
                                <Link
                                    href={link.href || "#"}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="group flex items-end gap-2 border-b border-[var(--accent)]/10 pb-4"
                                >
                                    <span className="font-mono text-[8px] text-[var(--foreground)] mb-1 font-bold">0{idx + 1}</span>
                                    <span className="text-2xl font-bold text-[var(--accent)] uppercase tracking-tight">
                                        {link.label}
                                    </span>
                                </Link>
                            </div>
                        ))}
                    </nav>

                    <div className="mt-auto flex flex-col gap-6">
                        <Link
                            href="/dashboard"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-[var(--foreground)]/5 border border-[var(--accent)]/10 p-5 group flex justify-between items-center"
                        >
                            <span className="text-sm font-bold text-[var(--accent)] uppercase tracking-widest">Dashboard</span>
                            <span className="text-[var(--accent)] transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                        
                        <a
                            href="https://wa.me/541124025239"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-[var(--accent)] text-[var(--background)] py-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] font-black rounded-full"
                        >
                            WhatsApp Directo ↗
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
