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

const ID_PREFIX = 'id:';

export async function isIdentifierUsed(uniqueIdentifier: string): Promise<string | null> {
    const redis = getRedis();
    try {
        return await redis.get<string>(ID_PREFIX + uniqueIdentifier);
    } catch (e) {
        return null;
    }
}

export async function markIdentifierAsUsed(uniqueIdentifier: string, discordUserId: string) {
    await getRedis().set(ID_PREFIX + uniqueIdentifier, discordUserId);
}
