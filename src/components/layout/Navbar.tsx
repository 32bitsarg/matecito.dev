"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { LogOut, Menu, X } from "lucide-react";

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useWorkspace();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isDashboard = pathname.startsWith('/dashboard');

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
    }, [isMenuOpen]);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        window.location.href = '/login';
    };

    if (isDashboard) return null;

    const navLinks = [
        { href: "/matecitodb", label: "matecitodb" },
        { href: "/#servicios", label: "Servicios" },
        { href: "/#proyectos", label: "Proyectos" },
        { href: "/#contacto", label: "Contacto" },
    ];

    return (
        <>
            <header className={`sticky top-0 z-[1001] w-full transition-all duration-300 ${
                scrolled
                    ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
                    : "bg-white border-b border-slate-100"
            }`}>
                <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-black text-xs">m</span>
                        </div>
                        <span className="font-bold text-base text-slate-900 tracking-tight">
                            matecito<span className="text-violet-500">.dev</span>
                        </span>
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                className="hover:text-violet-600 transition-colors flex items-center gap-1.5">
                                {l.label}
                                {l.href === '/matecitodb' && (
                                    <span className="px-1.5 py-0.5 bg-violet-100 text-violet-600 text-[9px] font-bold uppercase tracking-wider rounded-full">
                                        beta
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="hidden md:flex items-center gap-3">
                                <Link href="/dashboard"
                                    className="px-4 py-2 text-sm font-semibold text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors">
                                    Consola
                                </Link>
                                <button onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Cerrar sesión">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <a href="https://wa.me/541124025239?text=Hola%2C%20quiero%20consultarles%20sobre%20una%20p%C3%A1gina%20web"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-sm">
                                    Empezar proyecto
                                </a>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors">
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile menu */}
            <div className={`fixed inset-0 z-[1000] bg-white transition-transform duration-400 ease-out md:hidden ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}>
                <div className="flex flex-col h-full pt-20 pb-10 px-8 gap-6">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="py-3 px-4 text-lg font-semibold text-slate-700 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all flex items-center gap-2">
                                {l.label}
                                {l.href === '/matecitodb' && (
                                    <span className="px-1.5 py-0.5 bg-violet-100 text-violet-600 text-[9px] font-bold uppercase tracking-wider rounded-full">
                                        beta
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}
                                    className="py-3 text-center font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all">
                                    Ir a Consola
                                </Link>
                                <button onClick={handleLogout}
                                    className="py-3 text-center font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-all">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <a href="https://wa.me/541124025239?text=Hola%2C%20quiero%20consultarles%20sobre%20una%20p%C3%A1gina%20web"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsMenuOpen(false)}
                                className="py-3 text-center font-bold text-white bg-violet-600 rounded-xl">
                                Empezar proyecto
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
