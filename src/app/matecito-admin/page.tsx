import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminActions from "@/components/admin/AdminActions";
import crypto from "crypto";

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    const sessionSecret = process.env.SESSION_SECRET;

    // Validación de la sesión firmada
    let isValidSession = false;
    if (session?.value && sessionSecret) {
        const [value, signature] = session.value.split(":");
        const expectedSignature = crypto
            .createHmac("sha256", sessionSecret)
            .update(value)
            .digest("hex");

        if (value === "admin_authorized" && signature === expectedSignature) {
            isValidSession = true;
        }
    }

    if (!isValidSession) {
        redirect("/matecito-admin/login");
    }

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false });

    return (
        <div className="min-h-screen bg-black text-white p-6 sm:p-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

            <div className="relative z-10 container mx-auto max-w-5xl">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mb-20 border-b border-white/10 pb-12">
                    <div className="flex flex-col gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">Gestión de Contenido</span>
                        <h1 className="text-4xl font-semibold tracking-tighter">Panel de Administración</h1>
                    </div>
                    <Link
                        href="/matecito-admin/new"
                        className="bg-white text-black px-8 py-3 text-xs font-mono uppercase tracking-widest hover:bg-zinc-200 transition-all font-bold"
                    >
                        + Nuevo Post
                    </Link>
                </header>

                <div className="flex flex-col border-x border-white/5">
                    {posts?.map((post) => (
                        <div
                            key={post.id}
                            className="group border-b border-white/10 p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-600 uppercase">
                                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                    <span>{post.category}</span>
                                </div>
                                <h3 className="text-xl font-medium tracking-tight truncate max-w-md">{post.title || "(Sin Título)"}</h3>
                            </div>
                            <AdminActions postId={post.id} />
                        </div>
                    ))}
                    {!posts?.length && (
                        <div className="py-20 text-center text-zinc-600 font-mono text-sm uppercase tracking-widest">
                            No se encontraron artículos.
                        </div>
                    )}
                </div>

                <footer className="mt-24 pt-8 border-t border-white/5 opacity-30 flex justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Matecito // Admin Dev</span>
                    <Link href="/insights" className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Volver a la Web ↗</Link>
                </footer>
            </div>
        </div>
    );
}
