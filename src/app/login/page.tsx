'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clearToken, isAuthenticated } from '@/lib/api'
import { AuthService } from '@/services/api.service'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // Sincronización en el montaje del Login
    useEffect(() => {
        if (isAuthenticated()) {
            console.log("[Login] Valid session found. Redirecting...");
            router.push('/dashboard')
        }
    }, [router])

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (loading) return
        
        setLoading(true)
        const formEmail = email.trim()
        const formPassword = password

        if (!formEmail || !formPassword) {
            toast.error('Por favor, completá todos los campos.')
            setLoading(false)
            return
        }

        try {
            // Limpiamos sesión previa
            clearToken()

            // AuthService.login() llama a POST /api/v1/platform/auth/login
            // y guarda el token + user en localStorage automáticamente
            await AuthService.login(formEmail, formPassword)

            toast.success('Sesión iniciada correctamente.')
            // Hard redirect para asegurar limpieza de estado global
            window.location.href = '/dashboard'
        } catch (error: any) {
            console.error('[Login Error]', error)
            toast.error(error.message || 'Error al iniciar sesión.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 font-sans">
            <div className="w-full max-w-md space-y-8">
                {/* Beta Warning */}
                <div className="rounded-2xl border border-[var(--accent)]/10 bg-[var(--accent)]/5 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--foreground)] opacity-60 font-mono leading-relaxed">
                        Esta función está en fase de desarrollo.
                    </p>
                </div>

                <div className="rounded-3xl border border-[var(--accent)]/10 bg-[var(--background)] p-10 shadow-sm transition-all duration-300 hover:border-[var(--accent)]/30">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-[var(--accent)] mb-2 uppercase">
                            Console
                        </h1>
                        <p className="text-[var(--foreground)] opacity-40 text-[9px] font-mono uppercase tracking-[0.3em]">
                            Matecito Architecture
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-[var(--foreground)] opacity-60 uppercase tracking-[0.2em] mb-2 ml-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full rounded-full border border-[var(--accent)]/10 bg-[var(--accent)]/5 px-6 py-4 text-sm text-[var(--accent)] placeholder-[var(--foreground)]/40 outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                                    placeholder="usuario@dominio"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-xs font-bold text-[var(--foreground)] opacity-60 uppercase tracking-[0.2em] mb-2 ml-1">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full rounded-full border border-[var(--accent)]/10 bg-[var(--accent)]/5 px-6 py-4 text-sm text-[var(--accent)] placeholder-[var(--foreground)]/40 outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-[var(--background)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--background)] border-t-transparent" />
                                    Autenticando
                                </div>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="text-center">
                    <Link href="/" className="text-[10px] font-mono uppercase tracking-widest text-[var(--foreground)] opacity-40 hover:text-[var(--accent)] transition-colors">
                        ← Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}

