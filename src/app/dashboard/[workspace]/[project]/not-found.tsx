'use client'

import { useRouter } from 'next/navigation'
import { Database, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <Database className="w-8 h-8" style={{ color: 'var(--fg-tertiary)' }} />
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg-primary)' }}>Proyecto no encontrado</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--fg-tertiary)' }}>
          El proyecto que buscás no existe o fue eliminado.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            style={{ borderColor: 'var(--border)' }}>
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <button onClick={() => router.push('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
