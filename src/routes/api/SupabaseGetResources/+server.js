import { json } from '@sveltejs/kit';
import supabase from "../../../supabaseClient";

export async function GET() {
    let { data: resources } = await supabase.from('resources').select('*').order('flowOrder', { ascending: true }).order('name', { ascending: true });
    
    return json({
        resources: resources ?? []
    });
}
