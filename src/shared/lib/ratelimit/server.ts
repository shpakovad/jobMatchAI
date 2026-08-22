import "server-only";

import { Redis } from "@upstash/redis";

import { MAX_ATTEMPTS, WINDOW_SECONDS } from "@/src/shared/constants";

export const redisClient = Redis.fromEnv();

export async function checkIpLimit(ip: string): Promise<{ isBlocked: boolean; remaining: number }> {
  const key = `@job-match/ai-limit:${ip}`;

  const currentAttempts = await redisClient.get<number>(key);

  if (currentAttempts && currentAttempts > MAX_ATTEMPTS) {
    return { isBlocked: true, remaining: 0 };
  }

  return {
    isBlocked: false,
    remaining: MAX_ATTEMPTS - (currentAttempts || 0),
  };
}

export async function incrementIpLimit(ip: string): Promise<void> {
  const key = `@job-match/ai-limit:${ip}`;

  const newCount = await redisClient.incr(key);

  if (newCount === 1) {
    await redisClient.expire(key, WINDOW_SECONDS);
  }
}
