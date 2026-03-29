'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, clearToken } from '@/lib/api'
import Sidebar from '@/components/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = isAuthenticated()
            
            if (!isAuth) {
                console.warn("[Layout Debug] Unauthorized session. Redirecting...");
                
                clearToken()
                router.push('/login')
                
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
        
        // El api helper no tiene un "onChange" como PB, así que simplemente verificamos en el montaje
        // o podríamos agregar un listener a localStorage si fuera necesario.
    }, [router])

    if (!authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
                    <span className="text-xs font-medium text-slate-400">Verificando sesión...</span>
                </div>
            </div>
        )
    }


    return (
        <div className="flex h-screen bg-slate-50 text-slate-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
