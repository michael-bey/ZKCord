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

async function grantDiscordRole(guildId: string, userId: string, roleId: string, reason: string) {
    const url = `https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'X-Audit-Log-Reason': reason,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Discord API error: ${response.status} ${error}`);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { nonce, verified, uniqueIdentifier, firstname, nationality } = await req.json();

        if (!verified) {
            return NextResponse.json({ error: 'Proof not verified' }, { status: 400 });
        }

        const nonceData = await getNonce(nonce);
        if (!nonceData) {
            return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 400 });
        }

        const { discordUserId, guildId } = nonceData;

        // Sybil protection
        const existingUser = await isIdentifierUsed(uniqueIdentifier);
        if (existingUser && existingUser !== discordUserId) {
            return NextResponse.json({ error: 'This passport has already been used to verify another Discord account.' }, { status: 400 });
        }

        console.log(`Verified user ${discordUserId} (${firstname}) in guild ${guildId} with unique ID ${uniqueIdentifier}`);

        // Grant the role if VERIFIED_ROLE_ID is set
        if (VERIFIED_ROLE_ID) {
            try {
                await grantDiscordRole(guildId, discordUserId, VERIFIED_ROLE_ID, 'ZKcord verification successful');
                console.log(`Granted role ${VERIFIED_ROLE_ID} to user ${discordUserId}`);
            } catch (roleError) {
                console.error('Failed to grant verified role:', roleError);
            }
        }

        // Grant US role if applicable
        if (US_ROLE_ID && nationality === 'United States') {
            try {
                await grantDiscordRole(guildId, discordUserId, US_ROLE_ID, 'ZKcord US citizenship verification');
                console.log(`Granted US role ${US_ROLE_ID} to user ${discordUserId}`);
            } catch (roleError) {
                console.error('Failed to grant US role:', roleError);
            }
        }

        // Grant EU role if applicable
        if (EU_ROLE_ID && EU_COUNTRIES.includes(nationality as any)) {
            try {
                await grantDiscordRole(guildId, discordUserId, EU_ROLE_ID, 'ZKcord EU citizenship verification');
                console.log(`Granted EU role ${EU_ROLE_ID} to user ${discordUserId}`);
            } catch (roleError) {
                console.error('Failed to grant EU role:', roleError);
            }
        }

        // Mark nonce and identifier as used
        await deleteNonce(nonce);
        await markIdentifierAsUsed(uniqueIdentifier, discordUserId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
