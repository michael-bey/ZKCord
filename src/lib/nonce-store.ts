import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;

function getRedis() {
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

interface NonceData {
  discordUserId: string;
  guildId: string;
  createdAt: number;
}

const NONCE_PREFIX = 'nonce:';

export async function saveNonce(nonce: string, data: NonceData) {
  await getRedis().set(NONCE_PREFIX + nonce, data, { ex: 600 });
}

export async function getNonce(nonce: string): Promise<NonceData | null> {
  const redis = getRedis();
  try {
    return await redis.get<NonceData>(NONCE_PREFIX + nonce);
  } catch (e) {
    return null;
  }
}

export async function deleteNonce(nonce: string) {
  await getRedis().del(NONCE_PREFIX + nonce);
}
