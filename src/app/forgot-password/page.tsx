'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'
import api from '@/lib/api'

export default function ForgotPasswordPage() {
    const [email, setEmail]       = useState('')
    const [loading, setLoading]   = useState(false)
    const [sent, setSent]         = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = email.trim()
        if (!trimmed) return toast.error('Ingresá tu email')

        setLoading(true)
        try {
            await api.public.post('/api/v1/platform/auth/request-reset', {
                email: trimmed,
                reset_url_base: `${window.location.origin}/reset-password`,
            })
            setSent(true)
        } catch (err: any) {
            toast.error(err.message || 'Error al enviar el email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 font-sans">
            <div className="w-full max-w-md space-y-8">

                {sent ? (
                    <div className="rounded-3xl border border-[var(--accent)]/10 bg-[var(--background)] p-10 shadow-sm text-center space-y-5">
                        <div className="flex justify-center">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[var(--accent)] uppercase mb-2">
                                Revisá tu casilla
                            </h1>
                            <p className="text-sm text-[var(--foreground)] opacity-60">
                                Si <span className="font-semibold">{email}</span> está registrado,
                                vas a recibir un email con las instrucciones para restablecer tu contraseña.
                            </p>
                        </div>
                        <Link href="/login"
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--foreground)] opacity-50 hover:text-[var(--accent)] hover:opacity-100 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> Volver al login
                        </Link>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-[var(--accent)]/10 bg-[var(--background)] p-10 shadow-sm space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-[var(--accent)] uppercase mb-2">
                                Recuperar acceso
                            </h1>
                            <p className="text-[var(--foreground)] opacity-40 text-[9px] font-mono uppercase tracking-[0.3em]">
                                Te enviamos un link por email
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email"
                                    className="block text-xs font-bold text-[var(--foreground)] opacity-60 uppercase tracking-[0.2em] mb-2 ml-1">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)] opacity-30" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="usuario@dominio"
                                        className="w-full pl-11 pr-5 py-4 rounded-full border border-[var(--accent)]/10 bg-[var(--accent)]/5 text-sm text-[var(--accent)] placeholder-[var(--foreground)]/40 outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-[var(--background)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em]">
                                {loading
                                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Enviando...</>
                                    : 'Enviar link'}
                            </button>
                        </form>

                        <div className="text-center">
                            <Link href="/login"
                                className="text-[10px] font-mono uppercase tracking-widest text-[var(--foreground)] opacity-40 hover:text-[var(--accent)] hover:opacity-100 transition-colors inline-flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Volver al login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
