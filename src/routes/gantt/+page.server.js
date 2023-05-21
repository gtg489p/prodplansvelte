import redisClient from '../../redis';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {

  //const factoryId = url.searchParams.get('factoryId')
  const factoryId = 'JVL'

  if (!factoryId) {
    // If layoutId is null or undefined, return an empty object
    return {
      factoryId: null,
      ganttData: {}
    };
  }

  const redisValue = await redisClient.get('jvl.ganttData');

  if (redisValue === null) {
    // If the Redis value is null, return an empty object
    return {
      factoryId: factoryId,
      ganttData: {}
    };
  } else {
    // If the Redis value is not null, parse the JSON object and return it
    return {
      factoryId: factoryId,
      ganttData: JSON.parse(redisValue)
    };
  }
}
