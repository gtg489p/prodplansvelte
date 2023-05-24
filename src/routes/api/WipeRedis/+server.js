import { json } from '@sveltejs/kit';
import redisClient from '../../../redis';
import { promisify } from 'util';

const delAsync = promisify(redisClient.del).bind(redisClient);
const keysAsync = promisify(redisClient.keys).bind(redisClient);

/** @type {import('./$types').RequestHandler} */
export async function POST() {
  try {
    // Get all keys starting with "jvl."
    const keys = await keysAsync('jvl.*');

    // Delete all keys
    for(let key of keys) {
      await delAsync(key);
    }

    console.log(`All keys starting with 'jvl.' have been removed from Redis`);

    // Return success response
    return json({ status: 200, body: { message: "Success" } });
  } catch (err) {
    console.error(err);
    // Return failure response
    return json({ status: 500, body: { message: "Internal server error" } });
  }
}
