import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    const data = await req.json();
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== "matecito_active") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase.from("posts").insert([data]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/insights");
    return NextResponse.json({ success: true });
}
