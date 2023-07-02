import { json } from '@sveltejs/kit';
import supabase from "../../../supabaseClient";

export async function POST({ request }) {
    const resourceOptionsForm = await request.json();
  
    const { data: insertData, error: insertError } = await supabase
    .from('resources')
    .insert([
      {
        id: resourceOptionsForm.id,
        label: resourceOptionsForm.selectedLabel,
        name: resourceOptionsForm.selectedName,
        category: resourceOptionsForm.selectedCategory,
        fillRates: JSON.stringify(resourceOptionsForm.selectedFillRates),
        pumpRates: JSON.stringify(resourceOptionsForm.selectedPumpRates),
        gallons: resourceOptionsForm.selectedGallons,
        mixTimes: JSON.stringify(resourceOptionsForm.selectedMixTimes),
        pumpToLines: JSON.stringify(resourceOptionsForm.selectedPumpToLines),
        manpower: resourceOptionsForm.selectedManpower,
        classes: resourceOptionsForm.selectedClasses,
        headerHtml: resourceOptionsForm.selectedHeaderHtml
      }
    ]);

  if (insertError) return json({ error: insertError.message }, { status: 500 });

  // If the insertion was successful, make another request to fetch all rows
  const { data: allData, error: fetchError } = await supabase
    .from('resources')
    .select('*');

  if (fetchError) return json({ error: fetchError.message }, { status: 500 });

  return json(allData, { status: 201 });

  }