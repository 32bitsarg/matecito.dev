"use client";

import { useState } from "react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Algo salió mal.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Error de conexión.");
        }
    };

    return (
        <section className="bg-black py-24 border-t border-white/5 relative overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ffffff03_0%,transparent_40%)] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
                <div className="flex flex-col items-center gap-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                        Crónicas Técnicas
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter">
                        Suscribite al <span className="text-zinc-600 italic font-light">Journal</span>
                    </h2>
                    <p className="text-zinc-500 max-w-md font-light leading-relaxed">
                        Recibí actualizaciones sobre arquitectura, ingeniería boutique y procesos de software
                        directamente en tu inbox. Sin spam, solo ingeniería.
                    </p>

                    <form onSubmit={handleSubmit} className="w-full max-w-md mt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                className="flex-1 bg-zinc-900/50 border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-white transition-colors rounded-none"
                                required
                                disabled={status === "loading" || status === "success"}
                            />
                            <button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className="bg-white text-black px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 min-w-[140px]"
                            >
                                {status === "loading" ? "..." : status === "success" ? "Listo" : "Unirse"}
                            </button>
                        </div>
                        {message && (
                            <p className={`mt-4 text-[11px] font-mono uppercase tracking-widest ${status === "error" ? "text-red-500" : "text-zinc-400"}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
