import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

export function getRedis(): Redis {
    if (!redisInstance) {
        // Only try to initialize if variables are present, or use dummy strings during build
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            // During build time, return a mock or throw a more helpful error
            // if it's actually being called. 
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
