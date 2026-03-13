"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Bloqueo de scroll agresivo
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }, [isMenuOpen]);

    const navLinks = [
        { href: "/servicios", label: "Servicios" },
        { href: "/consultoria", label: "Consultoría" },
        { href: "/estudio", label: "Estudio" },
        { href: "/insights", label: "Insights" },
    ];

    return (
        <>
            {/* HEADER - Prioridad Máxima (z-[1001]) */}
            <header className={`sticky top-0 w-full border-b border-white/10 transition-all duration-300 z-[1001] ${isMenuOpen ? 'bg-transparent border-transparent' : 'bg-black/90 backdrop-blur-md'}`}>
                <div className="container mx-auto flex h-16 sm:h-24 max-w-7xl items-center justify-between px-6 md:px-12 relative">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0 relative z-[1002]">
                        <Image
                            src="/logos/onlytext.png"
                            alt="Matecito.Dev Logo"
                            width={300}
                            height={80}
                            className="h-3 sm:h-4 w-auto object-contain brightness-0 invert"
                        />
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-10 font-mono text-sm tracking-wide">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-zinc-400 transition-colors hover:text-white relative after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-white after:transition-all hover:after:w-full uppercase"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* MOBILE BUTTONS */}
                    <div className="flex items-center gap-4 relative z-[1002]">
                        <a
                            href="https://wa.me/541124025239"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:block"
                        >
                            <Button variant="default" className="rounded-none font-mono uppercase tracking-widest text-xs px-8 h-12 bg-white text-black">
                                Contacto
                            </Button>
                        </a>

                        {/* HAMBURGER - Siempre por encima */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex flex-col gap-1.5 md:hidden p-4 -mr-4 group focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <span className={`h-0.5 w-8 bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                            <span className={`h-0.5 w-8 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                            <span className={`h-0.5 w-8 bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                        </button>
                    </div>
                </div>
            </header>

            {/* MENÚ MÓVIL - Capa Media (z-[1000]) */}
            <div
                className={`fixed inset-0 menu-solid-black transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                style={{ zIndex: 1000 }}
            >
                <div className="relative flex flex-col h-full pt-32 pb-12 px-10">
                    <nav className="flex flex-col gap-6">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="group flex items-end gap-3 border-b border-white/5 pb-6"
                            >
                                <span className="font-mono text-[10px] text-zinc-600 mb-1 font-bold">0{idx + 1}</span>
                                <span className="text-3xl font-bold text-white uppercase tracking-tighter">
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Disponibilidad</span>
                            <div className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                                <span className="text-xs text-white uppercase tracking-tight">Abierto a proyectos</span>
                            </div>
                        </div>

                        <a
                            href="https://wa.me/541124025239"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-white text-black py-5 text-center font-mono text-sm uppercase tracking-widest font-black"
                        >
                            WhatsApp Directo ↗
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
