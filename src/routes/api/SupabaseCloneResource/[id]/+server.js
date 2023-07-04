import { json } from '@sveltejs/kit';
import supabase from "../../../../supabaseClient";
import { ulid } from 'ulid';

export async function POST({ params }) {
    // Fetch the existing record
    const { data: oldData, error: fetchError } = await supabase
    .from('resources')
    .select('*')
    .eq('id', params.id)
    .single();

    if (fetchError) return json({ error: fetchError.message }, { status: 500 });
  
    // Generate new unique id
    const newId = oldData.category.toLowerCase().charAt(0) + ulid();

    // Append "_clone" to the name
    const newName = oldData.name + "_clone";

    // Create new headerHtml
    const newHeaderHtml = `<button type="button" id="${(newName ?? '').replaceAll(" ", "")}">${newName}: ${oldData.label}</button>`;

    // Clone old data & replace id, name, and headerHtml
    const newData = { ...oldData, id: newId, name: newName, headerHtml: newHeaderHtml };

    // Insert new record
    const { data: clonedData, error: cloneError } = await supabase
    .from('resources')
    .insert([newData]);

    if (cloneError) return json({ error: cloneError.message }, { status: 500 });

    return json(clonedData, { status: 200 });
}
