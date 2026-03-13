import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Regex robusto para validación de email
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        // 1. Validación Estricta
        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email es requerido" }, { status: 400 });
        }

        if (email.length > 254 || !EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 });
        }

        // 2. Inserción en Supabase
        const { error } = await supabase
            .from("subscribers")
            .insert([{ email: email.toLowerCase().trim() }]);

        if (error) {
            if (error.code === "23505") {
                return NextResponse.json(
                    { message: "Ya estás suscrito a las crónicas." },
                    { status: 200 }
                );
            }
            return NextResponse.json({ error: "Error al procesar suscripción" }, { status: 500 });
        }

        return NextResponse.json(
            { message: "Suscripción exitosa. Bienvenido a las crónicas." },
            { status: 201 }
        );
    } catch (err) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}
