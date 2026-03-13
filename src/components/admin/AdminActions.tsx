"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminActions({ postId }: { postId: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este post? Esta acción es irreversible.")) {
            return;
        }

        setIsDeleting(true);
        const response = await fetch(`/api/admin/posts/${postId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            router.refresh();
        } else {
            alert("Error al eliminar el post.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center gap-6">
            <button
                onClick={() => router.push(`/matecito-admin/edit/${postId}`)}
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
            >
                [ Editar ]
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-900 hover:text-red-500 transition-colors disabled:opacity-30"
            >
                {isDeleting ? "[ Borrando... ]" : "[ Borrar ]"}
            </button>
        </div>
    );
}
