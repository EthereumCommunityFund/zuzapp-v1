import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";



export const uploadImage = async (
    file: File,
    imagePath: 'schedules' | 'tracks' | 'events' | 'profile'
): Promise<string> => {
    const supabase = createPagesBrowserClient({
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });

    const path = `${imagePath}/${Math.random().toString(36).substr(2)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage
        .from("image-bucket")
        .upload(path, file);

    if (error) {
        console.error(error, "error");
        throw error;
    }

    const { data } = await supabase.storage
        .from("image-bucket")
        .getPublicUrl(path);

    if (!data || !data.publicUrl) {
        throw new Error('Failed to retrieve the public URL.');
    }

    console.log(data.publicUrl, "data");

    return data.publicUrl;
};