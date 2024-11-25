import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379', // Update with your Redis connection info
});

redisClient.on('connect', () => console.log('Redis connected'));
redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
    await redisClient.connect();
})();

export default redisClient;
