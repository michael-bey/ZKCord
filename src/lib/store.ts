import { Redis } from '@upstash/redis';

let client: Redis | undefined;

function redis(): Redis {
  if (!client) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;
    if (!url || !token) throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set');
    client = new Redis({ url, token });
  }
  return client;
}

// Verification sessions: one per /verify click, valid for 10 minutes.

export interface Session {
  userId: string;
  guildId: string;
  username: string;
}

export async function createSession(id: string, session: Session) {
  await redis().set(`session:${id}`, session, { ex: 600 });
}

export function getSession(id: string) {
  return redis().get<Session>(`session:${id}`);
}

/** Reads and deletes in one step so a session can't be redeemed twice. */
export function consumeSession(id: string) {
  return redis().getdel<Session>(`session:${id}`);
}

// Role rules per server. Keys: "verified", "adult", "gender:M", "country:FRA", "region:EU".

export async function getRoleRules(guildId: string): Promise<Record<string, string>> {
  return (await redis().hgetall<Record<string, string>>(`guild:${guildId}:roles`)) ?? {};
}

export async function setRoleRule(guildId: string, rule: string, roleId: string) {
  await redis().hset(`guild:${guildId}:roles`, { [rule]: roleId });
}

export async function removeRoleRule(guildId: string, rule: string): Promise<boolean> {
  return (await redis().hdel(`guild:${guildId}:roles`, rule)) > 0;
}

// Verified members. A passport can back one Discord account per server.

/** Returns the user ID that already owns this passport in the server, if it isn't `userId`. */
export async function claimPassport(guildId: string, passportId: string, userId: string): Promise<string | null> {
  const key = `guild:${guildId}:passports`;
  const claimed = await redis().hsetnx(key, passportId, userId);
  if (!claimed) {
    const owner = await redis().hget<string>(key, passportId);
    if (owner && owner !== userId) return owner;
  }
  await redis().hset(`guild:${guildId}:members`, { [userId]: passportId });
  return null;
}

export async function getVerifiedMembers(guildId: string): Promise<string[]> {
  return redis().hkeys(`guild:${guildId}:members`);
}

export async function forgetVerifiedMembers(guildId: string) {
  await redis().del(`guild:${guildId}:members`, `guild:${guildId}:passports`);
}

/** Fixed-window limiter. Returns seconds until the window resets when over the limit, else null. */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<number | null> {
  const k = `ratelimit:${key}`;
  const count = await redis().incr(k);
  if (count === 1) await redis().expire(k, windowSeconds);
  if (count <= limit) return null;
  return Math.max(1, await redis().ttl(k));
}
