'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
    const pathname = usePathname()
    
    // Si la ruta empieza con /dashboard, no mostramos el footer
    const isDashboard = pathname?.startsWith('/dashboard')
    
    if (isDashboard) return null
    
    return <Footer />
}
