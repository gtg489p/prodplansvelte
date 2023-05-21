import { json } from '@sveltejs/kit';
import redisClient from '../../../redis';
import { promisify } from 'util';

const setAsync = promisify(redisClient.set).bind(redisClient);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  const { ganttData } = await request.json();

  try {
    await setAsync('jvl.ganttData', JSON.stringify(ganttData));
    console.log(`ganttData dumped into Redis`);
    // Return success response
    return json({ status: 200, body: { message: "Success" } });
  } catch (err) {
    console.error(err);
    // Return failure response
    return json({ status: 500, body: { message: "Internal server error" } });
  }
}
