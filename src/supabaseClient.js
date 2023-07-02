import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_API_KEY} from '$env/static/private'
import { writable } from 'svelte/store';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);


// function handleTableChange(payload) {
//     console.log('Record updated')
//     console.log(payload);
//     // NEED TO USE SSE TO TELL CLIENTS THAT THE DATA HAS CHANGED
// };

// supabase
// .channel('any')
// .on('postgres_changes', { event: '*', schema: 'public', table: 'zipTable' },(payload) =>  handleTableChange(payload))
// .subscribe()

export default supabase;

