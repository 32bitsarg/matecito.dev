import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Nota: En un entorno Serverless/Edge, este Map se reiniciará con cada "Cold Start".
// Para una protección 100% robusta se recomienda usar Redis (Upstash) o una DB.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";
    const { pathname } = request.nextUrl;

    // --- RATE LIMITING ---
    if (pathname.includes("/api/admin/login") || pathname.includes("/api/subscribe")) {
        const now = Date.now();
        const windowMs = 60 * 60 * 1000; // 1 hora
        const limit = pathname.includes("/api/subscribe") ? 3 : 5;

        const record = rateLimitMap.get(`${ip}:${pathname}`) || { count: 0, lastReset: now };

        if (now - record.lastReset > windowMs) {
            record.count = 0;
            record.lastReset = now;
        }

        if (record.count >= limit) {
            return NextResponse.json(
                { error: "Demasiadas peticiones. Intentá de nuevo más tarde." },
                { status: 429 }
            );
        }

        record.count++;
        rateLimitMap.set(`${ip}:${pathname}`, record);
    }
    // ---------------------

    const response = NextResponse.next();

    // 1. Content Security Policy (CSP)
    // Solo permitimos scripts de nuestro dominio, simpleicons (para la marquee) y google fonts si las hubiera.
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
        connect-src 'self' https://www.google-analytics.com *.google-analytics.com *.analytics.google.com *.googletagmanager.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https://cdn.simpleicons.org https://vsqvbtpivmshqfppwsws.supabase.co https://www.google-analytics.com *.google-analytics.com *.googletagmanager.com;
        font-src 'self' data: https://fonts.gstatic.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    response.headers.set('Content-Security-Policy', cspHeader);

    // 2. Otros headers de seguridad estándar
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Strict-Transport-Security (HSTS) - Solo en producción
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    return response;
}

// Aplicar a todas las rutas excepto static files y api especificas de assets
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
