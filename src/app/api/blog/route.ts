import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, slug, content, excerpt, category, readTime, secret_key } = body;

        // Seguridad: Validar Secret Key
        if (secret_key !== process.env.BLOG_ADMIN_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Insertar en Supabase
        const { data, error } = await supabase
            .from('posts')
            .upsert({
                title,
                slug,
                content,
                excerpt,
                category,
                read_time: readTime,
                published_at: new Date().toISOString(),
            }, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Revalidar la página de Insights para que el cambio sea instantáneo
        revalidatePath('/insights');
        revalidatePath(`/insights/${slug}`);

        return NextResponse.json({ message: 'Post created successfully', data }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
