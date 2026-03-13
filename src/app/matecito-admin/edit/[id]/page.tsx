import PostForm from "@/components/admin/PostForm";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
    const { id } = await params;
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== "matecito_active") {
        redirect("/matecito-admin/login");
    }

    const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 sm:p-24">
            <div className="container mx-auto max-w-5xl">
                <header className="flex flex-col gap-4 mb-20 border-b border-white/10 pb-12">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">Edición de Contenido</span>
                    <h1 className="text-4xl font-semibold tracking-tighter">Editar Artículo</h1>
                </header>

                <PostForm initialData={post} />
            </div>
        </div>
    );
}
