import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

function getRedis() {
    if (!redisInstance) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            return new Proxy({} as Redis, {
                get: () => { throw new Error('Upstash environment variables are missing.'); }
            });
        }

        redisInstance = new Redis({
            url,
            token,
        });
    }
    return redisInstance;
}

const RATE_LIMIT_PREFIX = 'rl:';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
}

/**
 * Check if a request is allowed under the rate limit using sliding window.
 * @param key - Unique identifier (e.g., userId, IP)
 * @param limit - Max requests allowed in the window
 * @param windowSeconds - Time window in seconds
 */
export async function checkRateLimit(
    key: string,
    limit: number,
    windowSeconds: number
): Promise<RateLimitResult> {
    const redis = getRedis();
    const redisKey = RATE_LIMIT_PREFIX + key;
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;

    try {
        // Remove old entries outside the window
        await redis.zremrangebyscore(redisKey, 0, windowStart);

        // Count current requests in window
        const count = await redis.zcard(redisKey);

        if (count >= limit) {
            // Get the oldest entry to calculate reset time
            const oldest = await redis.zrange(redisKey, 0, 0, { withScores: true });
            const resetTime = oldest.length > 1
                ? Math.ceil((Number(oldest[1]) + windowSeconds * 1000 - now) / 1000)
                : windowSeconds;

            return {
                allowed: false,
                remaining: 0,
                resetInSeconds: Math.max(1, resetTime),
            };
        }

        // Add this request with current timestamp as score
        await redis.zadd(redisKey, { score: now, member: `${now}-${Math.random()}` });
        await redis.expire(redisKey, windowSeconds);

        return {
            allowed: true,
            remaining: limit - count - 1,
            resetInSeconds: windowSeconds,
        };
    } catch (error) {
        console.error('Rate limit check failed:', error);
        // Fail open - allow request if rate limiting fails
        return {
            allowed: true,
            remaining: limit,
            resetInSeconds: windowSeconds,
        };
    }
}
