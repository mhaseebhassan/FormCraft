import { createClient } from 'redis';

export const redisClient = createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

let isConnected = false;

export async function connectRedis() {
  if (isConnected) return;
  await redisClient.connect();
  isConnected = true;
}
