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

    const handleLogout = async () => {
        await logout();
        setIsMenuOpen(false);
    };

    if (isDashboard) return null;

    const navLinks = [
        { href: "/estudio", label: "Proyectos", tag: null },
        { href: "/labs",    label: "Labs",      tag: null },
    ];

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <>
            <header className="sticky top-0 z-[1001] w-full border-b transition-all duration-300"
                style={{
                    backgroundColor: scrolled ? 'rgba(0,0,0,0.92)' : '#000',
                    borderColor: 'rgba(255,255,255,0.08)',
                    backdropFilter: scrolled ? 'blur(12px)' : 'none',
                }}>
                <div className="max-w-5xl mx-auto flex h-14 items-center justify-between px-6">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
                        <img src="/logos/matecitonobg.png" alt="Matecito.dev" className="w-7 h-7 object-contain" />
                        <span className="font-bold text-base tracking-tight" style={{ color: '#f0f0f0' }}>
                            matecito<span style={{ color: '#6d001a' }}>.dev</span>
                        </span>
                    </Link>

                    {/* Nav links */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
                                style={{
                                    color: isActive(l.href) ? '#f0f0f0' : 'rgba(240,240,240,0.50)',
                                    backgroundColor: isActive(l.href) ? 'rgba(255,255,255,0.07)' : 'transparent',
                                }}>
                                {l.label}
                                {l.tag && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                        style={{ backgroundColor: 'rgba(109,0,26,0.30)', color: '#f0f0f0', border: '1px solid rgba(109,0,26,0.50)' }}>
                                        {l.tag}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <Link href="/dashboard"
                                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors text-white"
                                    style={{ backgroundColor: '#6d001a' }}>
                                    Consola
                                </Link>
                                <button onClick={handleLogout}
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ color: 'rgba(240,240,240,0.40)' }}
                                    title="Cerrar sesión">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <Link href="/login"
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-opacity hover:opacity-80 text-white"
                                style={{ backgroundColor: '#6d001a' }}>
                                Iniciar sesión
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg transition-colors"
                        style={{ color: 'rgba(240,240,240,0.60)' }}>
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            {/* Mobile menu */}
            <div className="fixed inset-0 z-[1000] md:hidden transition-transform duration-300"
                style={{
                    backgroundColor: '#000',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                }}>
                <div className="flex flex-col h-full pt-20 pb-10 px-6 gap-4">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map(l => (
                            <Link key={l.href} href={l.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-2 py-3 px-4 rounded-xl text-lg font-semibold transition-colors"
                                style={{
                                    color: isActive(l.href) ? '#f0f0f0' : 'rgba(240,240,240,0.50)',
                                    backgroundColor: isActive(l.href) ? 'rgba(255,255,255,0.06)' : 'transparent',
                                }}>
                                {l.label}
                                {l.tag && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                        style={{ backgroundColor: 'rgba(109,0,26,0.30)', color: '#f0f0f0', border: '1px solid rgba(109,0,26,0.50)' }}>
                                        {l.tag}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}
                                    className="py-3 text-center font-bold text-white rounded-xl"
                                    style={{ backgroundColor: '#6d001a' }}>
                                    Ir a Consola
                                </Link>
                                <button onClick={handleLogout}
                                    className="py-3 text-center font-semibold rounded-xl border"
                                    style={{ color: 'rgba(240,240,240,0.50)', borderColor: 'rgba(255,255,255,0.12)' }}>
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}
                                className="py-3 text-center font-bold text-white rounded-xl"
                                style={{ backgroundColor: '#6d001a' }}>
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
