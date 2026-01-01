import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getNonce, deleteNonce } from '@/lib/nonce-store';
import { isIdentifierUsed, markIdentifierAsUsed } from '@/lib/identifier-store';

const EU_COUNTRIES = [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Czechia',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
    'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
    'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'
];

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const VERIFIED_ROLE_ID = process.env.DISCORD_VERIFIED_ROLE_ID;
const US_ROLE_ID = process.env.DISCORD_US_ROLE_ID;
const EU_ROLE_ID = process.env.DISCORD_EU_ROLE_ID;

async function grantDiscordRole(guildId: string, userId: string, roleId: string, reason: string): Promise<{ success: boolean; roleId: string; error?: string }> {
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`;
    console.log(`[Role Grant] Attempting to grant role ${roleId} to user ${userId} in guild ${guildId}`);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bot ${DISCORD_TOKEN}`,
                'X-Audit-Log-Reason': reason,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Role Grant] Failed for role ${roleId}: ${response.status} ${errorText}`);

            // Parse Discord error for user-friendly message
            let friendlyError = `${response.status}: ${errorText}`;
            try {
                const errorJson = JSON.parse(errorText);
                if (errorJson.code === 50013) {
                    friendlyError = 'Bot lacks permission to assign roles. Please ensure the bot\'s role is positioned above the verification roles in Discord server settings.';
                } else if (errorJson.code === 10007) {
                    friendlyError = 'User not found in this server. Please make sure you are a member of the Discord server.';
                } else if (errorJson.code === 10011) {
                    friendlyError = 'Role not found. The configured role may have been deleted from the server.';
                } else if (errorJson.message) {
                    friendlyError = errorJson.message;
                }
            } catch {
                // Keep original error if JSON parsing fails
            }

            return { success: false, roleId, error: friendlyError };
        }

        console.log(`[Role Grant] Successfully granted role ${roleId}`);
        return { success: true, roleId };
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`[Role Grant] Exception for role ${roleId}: ${errorMsg}`);
        return { success: false, roleId, error: errorMsg };
    }
}

export async function POST(req: NextRequest) {
    try {
        const { nonce, verified, uniqueIdentifier, firstname, nationality } = await req.json();

        if (!nonce || !uniqueIdentifier || verified === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!verified) {
            return NextResponse.json({ error: 'Proof not verified' }, { status: 400 });
        }

        const nonceData = await getNonce(nonce);
        if (!nonceData) {
            return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 400 });
        }

        // Invalidate nonce immediately to prevent replay
        await deleteNonce(nonce);

        const { discordUserId, guildId } = nonceData;

        // Rate limit: 3 verification attempts per hour
        const { checkRateLimit } = await import('@/lib/rate-limit');
        const rateLimit = await checkRateLimit(`result:${discordUserId}`, 3, 3600);

        if (!rateLimit.allowed) {
            console.log(`⚠️ Rate limit exceeded for verification attempts: ${discordUserId}`);
            return NextResponse.json({
                error: `Too many verification attempts. Please try again in ${Math.ceil(rateLimit.resetInSeconds / 60)} minutes.`
            }, { status: 429 });
        }

        // Sybil protection
        const existingUser = await isIdentifierUsed(uniqueIdentifier);
        if (existingUser && existingUser !== discordUserId) {
            return NextResponse.json({ error: 'This passport has already been used to verify another Discord account.' }, { status: 400 });
        }

        console.log(`Verified user ${discordUserId} (${firstname}) in guild ${guildId} with unique ID ${uniqueIdentifier}`);

        // Mark identifier as used early to prevent parallel races
        await markIdentifierAsUsed(uniqueIdentifier, discordUserId);

        // Grant roles and wait for completion
        const rolePromises: Promise<{ success: boolean; roleId: string; error?: string }>[] = [];

        console.log(`[Verification] Starting role grants for user ${discordUserId}, nationality: ${nationality}`);
        console.log(`[Verification] Available role IDs - Verified: ${VERIFIED_ROLE_ID}, US: ${US_ROLE_ID}, EU: ${EU_ROLE_ID}`);

        if (VERIFIED_ROLE_ID) {
            rolePromises.push(grantDiscordRole(guildId, discordUserId, VERIFIED_ROLE_ID, 'ZKCord verification successful'));
        } else {
            console.warn('[Verification] DISCORD_VERIFIED_ROLE_ID is not set!');
        }

        // Normalize nationality for matching
        const normalizedNationality = typeof nationality === 'string' ? nationality.toUpperCase().trim() : '';
        console.log(`[Verification] Normalized nationality: "${normalizedNationality}"`);

        // US matching - handle various formats: "USA", "US", "United States", "UNITED STATES OF AMERICA", etc.
        const isUS = ['USA', 'US', 'UNITED STATES', 'UNITED STATES OF AMERICA', 'AMERICAN'].includes(normalizedNationality);

        if (US_ROLE_ID && isUS) {
            console.log(`[Verification] Matched US nationality`);
            rolePromises.push(grantDiscordRole(guildId, discordUserId, US_ROLE_ID, 'ZKCord US citizenship verification'));
        }

        // EU matching - normalize the check
        const EU_COUNTRIES_UPPER = EU_COUNTRIES.map(c => c.toUpperCase());
        const isEU = EU_COUNTRIES_UPPER.includes(normalizedNationality);

        if (EU_ROLE_ID && isEU) {
            console.log(`[Verification] Matched EU nationality`);
            rolePromises.push(grantDiscordRole(guildId, discordUserId, EU_ROLE_ID, 'ZKCord EU citizenship verification'));
        }

        // Wait for all role grants to complete
        const results = await Promise.all(rolePromises);

        const failedRoles = results.filter(r => !r.success);
        const successRoles = results.filter(r => r.success);

        console.log(`[Verification] Role grant results: ${successRoles.length} succeeded, ${failedRoles.length} failed`);

        if (failedRoles.length > 0) {
            console.error('[Verification] Failed roles:', failedRoles);
            // Still return success if at least one role was granted
            if (successRoles.length > 0) {
                return NextResponse.json({
                    success: true,
                    warning: `Some roles could not be granted: ${failedRoles.map(r => r.error).join(', ')}`,
                    rolesGranted: successRoles.length
                });
            } else {
                return NextResponse.json({
                    error: `Failed to grant roles: ${failedRoles.map(r => r.error).join(', ')}`
                }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true, rolesGranted: successRoles.length });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
