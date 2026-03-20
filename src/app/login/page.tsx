'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import pb from '@/lib/pocketbase'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // Sincronización agresiva en el montaje del Login
    useEffect(() => {
        const checkExisting = () => {
            const isValid = pb.authStore.isValid
            const hasRecord = !!pb.authStore.record

            if (isValid && hasRecord) {
                console.log("[Login] Valid session found. Redirecting...");
                router.push('/dashboard')
            } else if (isValid && !hasRecord) {
                console.warn("[Login] Partial session found. Clearing store.");
                pb.authStore.clear()
            }
        }

        checkExisting()
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
            // Aseguramos que la store esté limpia antes de intentar nada
            pb.authStore.clear()
            
            const authData = await pb.collection('users').authWithPassword(formEmail, formPassword)
            
            if (authData.record) {
                toast.success('Sesión iniciada correctamente.')
                // Forzamos un hard redirect al dashboard para asegurar que todo el estado global 
                // se inicialice con la nueva sesión limpia.
                window.location.href = '/dashboard'
            } else {
                throw new Error("No se pudo recuperar el perfil de usuario.")
            }
        } catch (error: any) {
            console.error('[Login Error]', error)
            if (error.status === 400 || error.status === 403) {
                toast.error('Credenciales inválidas.')
            } else {
                toast.error('Error de conexión con el servidor.')
            }
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
                        Esta función está en fase de desarrollo. <br />
                        Si querés tener acceso, participá en el <Link href="/insights" className="text-[var(--accent)] hover:underline">journal</Link>.
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
