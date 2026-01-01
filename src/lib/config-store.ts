import { getRedis } from '@/lib/redis';

export interface GuildConfig {
    verifiedRoleId?: string;
    usRoleId?: string;
    euRoleId?: string;
    portalChannelId?: string;
}

const CONFIG_PREFIX = 'guild:config:';

export async function getGuildConfig(guildId: string): Promise<GuildConfig | null> {
    const redis = getRedis();
    try {
        return await redis.get<GuildConfig>(CONFIG_PREFIX + guildId);
    } catch (e) {
        console.error(`Error fetching config for guild ${guildId}:`, e);
        return null;
    }
}

export async function updateGuildConfig(guildId: string, config: Partial<GuildConfig>) {
    const redis = getRedis();
    const key = CONFIG_PREFIX + guildId;

    // Get existing config to merge
    const existing = await getGuildConfig(guildId) || {};
    const newConfig = { ...existing, ...config };

    await redis.set(key, newConfig);
    return newConfig;
}
