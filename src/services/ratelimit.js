import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
});

const DAILY_LIMIT = 4;
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

export async function checkRateLimit(userId) {
  const date = new Date().toISOString().split('T')[0];
  const dailyKey = `limiter:${userId}:${date}`;
  const windowKey = `limiter:${userId}:window`;
  
  // Check daily limit
  const dailyCount = await redis.incr(dailyKey);
  if (dailyCount === 1) {
    await redis.expire(dailyKey, 24 * 60 * 60); // 24 hours TTL
  }
  if (dailyCount > DAILY_LIMIT) {
    return false;
  }
  
  // Check rate limit window
  const windowCount = await redis.incr(windowKey);
  if (windowCount === 1) {
    await redis.expire(windowKey, RATE_LIMIT_WINDOW);
  }
  if (windowCount > RATE_LIMIT_MAX) {
    return false;
  }
  
  return true;
}