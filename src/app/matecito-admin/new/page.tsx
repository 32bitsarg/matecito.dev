import PostForm from "@/components/admin/PostForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPostPage() {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session || session.value !== "matecito_active") {
        redirect("/matecito-admin/login");
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 sm:p-24">
            <div className="container mx-auto max-w-5xl">
                <header className="flex flex-col gap-4 mb-20 border-b border-white/10 pb-12">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-600">Creación Manual</span>
                    <h1 className="text-4xl font-semibold tracking-tighter">Nuevo Artículo</h1>
                </header>

                <PostForm />
            </div>
        </div>
    );
}
