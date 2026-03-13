import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        const adminKey = process.env.BLOG_ADMIN_KEY;
        const sessionSecret = process.env.SESSION_SECRET;

        if (!adminKey || !sessionSecret) {
            console.error("Missing environment variables for admin login");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        if (password === adminKey) {
            // Creamos un valor de sesión firmado
            // Usamos el secret para generar un HMAC del valor estático
            const sessionValue = "admin_authorized";
            const signature = crypto
                .createHmac("sha256", sessionSecret)
                .update(sessionValue)
                .digest("hex");

            // La cookie contiene: valor:firma
            const signedSession = `${sessionValue}:${signature}`;

            const response = NextResponse.json({ success: true });

            (await cookies()).set("admin_session", signedSession, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24, // 24 horas
            });

            return response;
        }

        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
}
