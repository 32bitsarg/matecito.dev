'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import pb from '@/lib/pocketbase'
import Sidebar from '@/components/sidebar'
import { WorkspaceProvider } from '@/contexts/WorkspaceContext'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const isValid = pb.authStore.isValid
            const hasRecord = !!pb.authStore.record
            
            if (!isValid || !hasRecord) {
                console.warn("[Layout Debug] Unauthorized or Inconsistent Session. Redirecting...");
                
                // Si es un estado inconsistente (token sin record), limpiamos localmente
                if (isValid && !hasRecord) {
                    pb.authStore.clear();
                }

                // Intentamos redirección suave primero
                router.push('/login');
                
                // Si estamos en un estado atascado despues de un segundo, forzamos hard redirect
                const backupTimer = setTimeout(() => {
                    if (window.location.pathname.startsWith('/dashboard')) {
                        console.log("[Layout Debug] Redirect stuck. Forcing hard redirect.");
                        window.location.href = '/login';
                    }
                }, 1000);

                return () => clearTimeout(backupTimer);
            } else {
                setAuthorized(true)
            }
        };

        checkAuth();
        
        const unsubscribe = pb.authStore.onChange(checkAuth);
        return () => unsubscribe();
    }, [router])

    if (!authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Verificando Sesión...</span>
                </div>
            </div>
        )
    }

    return (
        <WorkspaceProvider>
            <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)]">
                {/* Sidebar Fijo */}
                <Sidebar />

                {/* Contenido Principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl p-8">
                        {children}
                    </div>
                </main>
            </div>
        </WorkspaceProvider>
    )
}
