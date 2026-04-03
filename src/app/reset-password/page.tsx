'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Lock, ArrowLeft, RefreshCw, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'
import api from '@/lib/api'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router       = useRouter()
    const token        = searchParams.get('token')

    const [password,  setPassword]  = useState('')
    const [confirm,   setConfirm]   = useState('')
    const [showPass,  setShowPass]  = useState(false)
    const [loading,   setLoading]   = useState(false)
    const [done,      setDone]      = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error('Link inválido — token no encontrado')
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return toast.error('Token inválido')
        if (password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres')
        if (password !== confirm) return toast.error('Las contraseñas no coinciden')

        setLoading(true)
        try {
            await api.public.post('/api/v1/platform/auth/reset-password', {
                token,
                password,
            })
            setDone(true)
            setTimeout(() => router.push('/login'), 3000)
        } catch (err: any) {
            toast.error(err.message || 'Error al restablecer la contraseña')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center space-y-4">
                <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
                <h1 className="text-xl font-bold text-red-700 uppercase tracking-tight">Link inválido</h1>
                <p className="text-sm text-red-600">El link no contiene un token válido.</p>
                <Link href="/forgot-password"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Solicitar un nuevo link
                </Link>
            </div>
        )
    }

    if (done) {
        return (
            <div className="rounded-3xl border border-[var(--accent)]/10 bg-[var(--background)] p-10 shadow-sm text-center space-y-5">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--accent)] uppercase mb-2">
                        ¡Contraseña actualizada!
                    </h1>
                    <p className="text-sm text-[var(--foreground)] opacity-60">
                        Redirigiendo al login...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-[var(--accent)]/10 bg-[var(--background)] p-10 shadow-sm space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--accent)] uppercase mb-2">
                    Nueva contraseña
                </h1>
                <p className="text-[var(--foreground)] opacity-40 text-[9px] font-mono uppercase tracking-[0.3em]">
                    Elegí una contraseña segura
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {[
                    { id: 'password', label: 'Nueva contraseña', value: password, onChange: setPassword },
                    { id: 'confirm',  label: 'Confirmar contraseña', value: confirm,  onChange: setConfirm  },
                ].map(field => (
                    <div key={field.id}>
                        <label htmlFor={field.id}
                            className="block text-xs font-bold text-[var(--foreground)] opacity-60 uppercase tracking-[0.2em] mb-2 ml-1">
                            {field.label}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground)] opacity-30" />
                            <input
                                id={field.id}
                                type={showPass ? 'text' : 'password'}
                                required
                                value={field.value}
                                onChange={e => field.onChange(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-12 py-4 rounded-full border border-[var(--accent)]/10 bg-[var(--accent)]/5 text-sm text-[var(--accent)] placeholder-[var(--foreground)]/40 outline-none transition-all focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]"
                            />
                            {field.id === 'password' && (
                                <button type="button" onClick={() => setShowPass(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--foreground)] opacity-40 hover:opacity-80 transition-opacity">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-bold text-[var(--background)] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.2em]">
                    {loading
                        ? <><RefreshCw className="w-4 h-4 animate-spin" /> Guardando...</>
                        : 'Guardar contraseña'}
                </button>
            </form>

            <div className="text-center">
                <Link href="/login"
                    className="text-[10px] font-mono uppercase tracking-widest text-[var(--foreground)] opacity-40 hover:text-[var(--accent)] hover:opacity-100 transition-colors inline-flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Volver al login
                </Link>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 font-sans">
            <div className="w-full max-w-md space-y-8">
                <Suspense fallback={
                    <div className="flex justify-center py-20">
                        <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)] opacity-40" />
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    )
}
