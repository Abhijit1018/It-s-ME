import { Redis } from "@upstash/redis";

type Entry = { count: number; reset: number };
const store = new Map<string, Entry>();

let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) {
    redis = new Redis({ url, token });
  }
  return redis;
}

function rateLimitMemory(
  ip: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export async function rateLimit(
  ip: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number }> {
  const client = getRedis();
  if (!client) return rateLimitMemory(ip, limit, windowMs);

  const key = `ratelimit:${ip}`;
  const windowSeconds = Math.ceil(windowMs / 1000);
  const count = await client.incr(key);
  if (count === 1) await client.expire(key, windowSeconds);

  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
