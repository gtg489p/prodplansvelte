import { json } from '@sveltejs/kit';
import supabase from "../../../../supabaseClient";

export async function DELETE({ params }) {

    const { error: deleteError } = await supabase
    .from('resources')
    .delete()
    .match({ id: params.id });

    if (deleteError) return json({ error: deleteError.message }, { status: 500 });

    // If the delete was successful, make another request to fetch all remaining rows
    const { data: allData, error: fetchError } = await supabase
    .from('resources')
    .select('*');

    if (fetchError) return json({ error: fetchError.message }, { status: 500 });

    return json(allData, { status: 200 });
}

