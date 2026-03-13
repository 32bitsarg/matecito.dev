"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Verificamos contra la admin key (esto es una versión simplificada)
        // En una app real usaríamos Supabase Auth, pero para mantenerlo "boutique" y rápido:
        const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            router.push("/matecito-admin");
            router.refresh();
        } else {
            setError("Acceso denegado. Clave incorrecta.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">Admin Portal</span>
                        <h1 className="text-4xl font-semibold tracking-tighter">Matecito.Dev</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="font-mono text-[10px] uppercase text-zinc-500">Clave de Acceso</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-zinc-900 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors rounded-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs font-mono">{error}</p>}
                        <button
                            type="submit"
                            className="bg-white text-black py-4 text-xs font-mono uppercase tracking-widest hover:bg-zinc-200 transition-all font-bold"
                        >
                            Verificar Identidad
                        </button>
                    </form>

                    <p className="text-[10px] font-mono text-zinc-700 leading-relaxed uppercase">
                        Solo personal autorizado de Matecito.Dev. <br />
                        Toda actividad es monitoreada.
                    </p>
                </div>
            </div>
        </div>
    );
}
