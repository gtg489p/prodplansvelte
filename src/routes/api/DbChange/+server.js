import supabase from "../../../supabaseClient";

/** @type {import('./$types').RequestHandler} */
export const GET = () => {
    let subscription;

    const stream = new ReadableStream({
    start(controller) {
        // Subscribe to the Supabase real-time changes
        subscription = supabase
        .channel('any')
        
        .on('postgres_changes', { event: '*', schema: 'public', table: 'zipTable' },(payload) => {
            console.log('zipTable updated');
            console.log(payload);
            
            // Send the update as a server-sent event
            const data = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
            controller.enqueue(data);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' },(payload) => {
            console.log('Resources updated');
            console.log(payload);
            
            // Send the update as a server-sent event
            const data = `event: message\ndata: ${JSON.stringify(payload)}\n\n`;
            controller.enqueue(data);
        })
        .on('error', error => console.error('Realtime error:', error))
        .subscribe();
    },
    cancel() {
        // Unsubscribe when the stream is cancelled
        subscription.unsubscribe();
    }
    });
  
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream'
      }
    });
  };
  