import { getRedis } from '@/lib/redis';

interface NonceData {
  discordUserId: string;
  guildId: string;
  username?: string;
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
