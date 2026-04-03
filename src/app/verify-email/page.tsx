'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, RefreshCw, Mail } from 'lucide-react'
import api from '@/lib/api'

type Status = 'verifying' | 'success' | 'error'

function VerifyEmailContent() {
    const searchParams = useSearchParams()
    const token        = searchParams.get('token')

    const [status,  setStatus]  = useState<Status>('verifying')
    const [message, setMessage] = useState('')

    // projectId is optional — present when link comes from a project's email
    const projectId = searchParams.get('project')

    useEffect(() => {
        if (!token) {
            setStatus('error')
            setMessage('No se encontró el token de verificación en el link.')
            return
        }

        const url = projectId
            ? `/api/v1/project/${projectId}/auth/verify-email?token=${encodeURIComponent(token)}`
            : `/api/v1/platform/auth/verify-email?token=${encodeURIComponent(token)}`

        fetch(url)
            .then(async r => {
                const data = await r.json().catch(() => ({}))
                if (!r.ok) throw new Error(data.error || 'Error al verificar')
                setStatus('success')
            })
            .catch((err: any) => {
                setStatus('error')
                setMessage(err.message || 'El link de verificación es inválido o ya expiró.')
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (status === 'verifying') {
        return (
            <div className="text-center space-y-4">
                <RefreshCw className="w-10 h-10 text-[var(--accent)] opacity-40 animate-spin mx-auto" />
                <p className="text-sm text-[var(--foreground)] opacity-50 font-mono uppercase tracking-widest text-[10px]">
                    Verificando...
                </p>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="rounded-3xl border border-[var(--accent)]/10 bg-[var(--background)] p-10 shadow-sm text-center space-y-5">
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--accent)] uppercase mb-2">
                        Email verificado
                    </h1>
                    <p className="text-sm text-[var(--foreground)] opacity-60">
                        Tu dirección de email fue confirmada correctamente.
                    </p>
                </div>
                <Link href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-[var(--background)] text-sm font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all">
                    Iniciar sesión
                </Link>
            </div>
        )
    }

    return (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center space-y-5">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
            <div>
                <h1 className="text-2xl font-bold text-red-700 uppercase tracking-tight mb-2">
                    Link inválido
                </h1>
                <p className="text-sm text-red-600">{message}</p>
            </div>
            <div className="flex flex-col items-center gap-3">
                <p className="text-xs text-red-500">¿El link expiró?</p>
                <Link href="/login"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
                    <Mail className="w-3 h-3" /> Iniciá sesión para reenviar la verificación
                </Link>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4 font-sans">
            <div className="w-full max-w-md">
                <Suspense fallback={
                    <div className="flex justify-center py-20">
                        <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent)] opacity-40" />
                    </div>
                }>
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    )
}
