'use client'

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.matecito.dev'

export default function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/api/v1/platform/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || 'Error al suscribirse')
            }

            setDone(true)
            setEmail('')
        } catch (err: any) {
            toast.error(err.message || 'Error al suscribirse')
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <p className="font-semibold text-slate-800">¡Gracias por suscribirte!</p>
                <p className="text-sm text-slate-400">Te escribimos cuando tengamos algo bueno.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
            <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
            />
            <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shrink-0"
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Suscribirme
            </button>
        </form>
    )
}
