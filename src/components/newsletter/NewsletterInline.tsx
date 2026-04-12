"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterInline() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "¡Listo! Te avisamos cuando lancemos.");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Algo salió mal, intentá de nuevo.");
            }
        } catch {
            setStatus("error");
            setMessage("Error de conexión.");
        }
    };

    if (status === "success") {
        return (
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.35)' }}>
                    <Check className="w-5 h-5" style={{ color: '#34d399' }} />
                </div>
                <p className="text-sm font-medium" style={{ color: '#34d399' }}>{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    disabled={status === "loading"}
                    className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-colors disabled:opacity-50"
                    style={{
                        backgroundColor: '#161616',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#f0f0f0',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
                    style={{ backgroundColor: '#6d001a' }}
                >
                    {status === "loading" ? "Enviando..." : "Anotarme"}
                    {status !== "loading" && <ArrowRight className="w-4 h-4" />}
                </button>
            </div>
            {status === "error" && (
                <p className="mt-3 text-xs text-center" style={{ color: '#f87171' }}>{message}</p>
            )}
            <p className="mt-3 text-xs text-center" style={{ color: 'rgba(240,240,240,0.25)' }}>
                Sin spam. Podés darte de baja cuando quieras.
            </p>
        </form>
    );
}
