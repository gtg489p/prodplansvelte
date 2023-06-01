import { Redis } from 'ioredis'
import { REDIS_CONNECTION_DEV, REDIS_CONNECTION_PROD} from '$env/static/private'

let REDIS_CONNECTION;
let isWin = process.platform == "win32"

if (isWin) {
    console.log('Running local redis as windows dev')
    REDIS_CONNECTION = REDIS_CONNECTION_DEV
} else{
    REDIS_CONNECTION = REDIS_CONNECTION_PROD
}

// Check that REDIS_CONNECTION is defined and has a valid value
if (!REDIS_CONNECTION) {
    throw new Error('REDIS_CONNECTION environment variable is not defined')
}

// Parse REDIS_CONNECTION string to JSON
let redisConnectionJSON = JSON.parse(REDIS_CONNECTION);

// Create a Redis client
const redisClient = new Redis(JSON.parse(REDIS_CONNECTION));

// Handle Redis connection success
redisClient.on("connect", function() {
    console.log(`Redis connected successfully to ${redisConnectionJSON.host}:${redisConnectionJSON.port}`);
});

// Handle Redis connection errors
redisClient.on("error", function(error) {
    console.error("Redis connection error", error);
});

export default redisClient