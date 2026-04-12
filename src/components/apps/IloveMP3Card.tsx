"use client"

import Image from "next/image"
import { useState } from "react"
import { ArrowUpRight, Check, Loader2 } from "lucide-react"

export function IloveMP3Card() {
    const [email, setEmail]   = useState("")
    const [state, setState]   = useState<"idle" | "loading" | "success" | "error">("idle")
    const [focused, setFocused] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || state === "loading" || state === "success") return
        setState("loading")
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, source: "ilovemp3-beta" }),
            })
            setState(res.ok ? "success" : "error")
        } catch {
            setState("error")
        }
    }

    return (
        <div
            className="flex flex-col gap-5 p-6 rounded-2xl border col-span-full sm:col-span-2"
            style={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.10)' }}
        >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border"
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <Image
                        src="/icons/ilovemp3.png"
                        alt="ilovemp3"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: 'rgba(109,0,26,0.20)', color: '#e0a0a0', border: '1px solid rgba(109,0,26,0.50)' }}>
                    Beta cerrada
                </span>
            </div>

            {/* Content */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-base font-bold" style={{ color: '#f0f0f0' }}>ilovemp3</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.30)' }}>
                        Sin anuncios
                    </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,240,240,0.50)' }}>
                    Reproductor de música para Android. Playlists, modo offline, toda tu biblioteca de MP3 organizada.{' '}
                    <span style={{ color: 'rgba(240,240,240,0.75)' }}>Sin anuncios, sin suscripciones, sin distracciones.</span>{' '}
                    En beta cerrada — anotate para ser de los primeros en probarlo.
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
                {["Android", "Flutter", "Offline", "MP3"].map(tag => (
                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md font-mono"
                        style={{ backgroundColor: '#1c1c1c', color: 'rgba(240,240,240,0.40)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }} />

            {/* Waitlist form */}
            {state === "success" ? (
                <div className="flex items-center gap-2 text-sm font-mono" style={{ color: '#34d399' }}>
                    <Check className="w-4 h-4 shrink-0" />
                    ¡Anotado! Te avisamos cuando abramos más accesos.
                </div>
            ) : (
                <div>
                    <p className="text-xs mb-3 font-mono" style={{ color: 'rgba(240,240,240,0.35)' }}>
                        Anotate para acceso anticipado
                    </p>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            required
                            className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm font-mono outline-none transition-all"
                            style={{
                                backgroundColor: '#0d0d0d',
                                border: `1px solid ${focused ? 'rgba(109,0,26,0.70)' : 'rgba(255,255,255,0.10)'}`,
                                color: '#f0f0f0',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={state === "loading"}
                            className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50 flex items-center gap-2"
                            style={{ backgroundColor: '#6d001a' }}
                        >
                            {state === "loading"
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : "Quiero probarlo"
                            }
                        </button>
                    </form>
                    {state === "error" && (
                        <p className="mt-2 text-xs font-mono" style={{ color: '#f87171' }}>
                            Algo salió mal. Intentá de nuevo.
                        </p>
                    )}
                </div>
            )}

            {/* Already registered link */}
            <a
                href="https://play.google.com/apps/testing/com.matecitomp3.ilm.reproductor_mp3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-mono transition-opacity opacity-50 hover:opacity-100 w-fit"
                style={{ color: '#f0f0f0' }}
            >
                ¿Ya estás registrado? Accedé a la beta
                <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
        </div>
    )
}
