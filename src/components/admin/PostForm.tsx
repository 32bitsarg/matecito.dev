"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    read_time: string;
};

export default function PostForm({ initialData }: { initialData?: Post }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Post>(initialData || {
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "Ingeniería",
        read_time: "5 MIN",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-slug generation
        if (name === "title" && !initialData) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase()
                    .replace(/ /g, '-')
                    .replace(/[^\w-]+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const method = formData.id ? "PATCH" : "POST";
        const url = formData.id ? `/api/admin/posts/${formData.id}` : "/api/admin/posts";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            router.push("/matecito-admin");
            router.refresh();
        } else {
            alert("Error al guardar el artículo.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest">Título del Artículo</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border border-white/10 px-4 py-3 text-lg focus:outline-none focus:border-white transition-colors rounded-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest">Slug (URL)</label>
                    <input
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm font-mono focus:outline-none focus:border-white transition-colors rounded-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest">Categoría</label>
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors rounded-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest">Resumen (Excerpt)</label>
                    <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors rounded-none h-24 resize-none"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest">Contenido (Markdown)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border border-white/10 px-4 py-4 text-sm font-mono focus:outline-none focus:border-white transition-colors rounded-none h-96 resize-y"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] uppercase text-zinc-600 tracking-widest">Tiempo de Lectura</label>
                    <input
                        name="read_time"
                        value={formData.read_time}
                        onChange={handleChange}
                        className="bg-zinc-900/50 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors rounded-none text-zinc-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/5">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-white text-black px-12 py-4 text-xs font-mono font-bold uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                    {loading ? "Guardando..." : (formData.id ? "Actualizar Artículo" : "Publicar Artículo")}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="text-zinc-500 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
