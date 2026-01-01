import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { getNonce, deleteNonce } from '@/lib/nonce-store';
import { isIdentifierUsed, markIdentifierAsUsed } from '@/lib/identifier-store';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const VERIFIED_ROLE_ID = process.env.DISCORD_VERIFIED_ROLE_ID;
const US_ROLE_ID = process.env.DISCORD_US_ROLE_ID;
const EU_ROLE_ID = process.env.DISCORD_EU_ROLE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://zkcord.vercel.app';

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

// Define interfaces for ZKPassport types
interface QueryResult {
    firstname?: {
        disclose?: { result: string };
    };
    nationality?: {
        in?: Array<{ result: boolean; expected: string[] }>;
        out?: { result: boolean };
    };
    age?: {
        gte?: { result: boolean };
    };
    expiry_date?: {
        gte?: { result: boolean };
    };
}

export async function POST(req: NextRequest) {
    try {
        const { nonce, proofs, queryResult, uniqueIdentifier } = await req.json();

        if (!nonce || !proofs || !queryResult || !uniqueIdentifier) {
            return NextResponse.json({ error: 'Missing required fields (nonce, proofs, queryResult, uniqueIdentifier)' }, { status: 400 });
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

        // =========================================
        // SERVER-SIDE PROOF VERIFICATION (CRITICAL)
        // =========================================
        console.log('[Verification] Starting server-side proof verification...');

        // Extract domain from APP_URL for ZKPassport initialization
        const domain = new URL(APP_URL).hostname;

        // Dynamically import ZKPassport SDK for server-side verification. The SDK
        // will verify cryptographic proofs to ensure the client didn't forge data.
        const { ZKPassport } = await import('@zkpassport/sdk');
        const zkPassport = new ZKPassport(domain);

        const verificationResult = await zkPassport.verify({
            proofs,
            queryResult,
        });

        console.log('[Verification] Server verification result:', {
            verified: verificationResult.verified,
            uniqueIdentifier: verificationResult.uniqueIdentifier,
            errors: verificationResult.queryResultErrors,
        });

        if (!verificationResult.verified) {
            console.error('[Verification] Server-side verification FAILED:', verificationResult.queryResultErrors);
            return NextResponse.json({
                error: 'Proof verification failed on server. The verification data may have been tampered with.'
            }, { status: 400 });
        }

        // Use the server-verified unique identifier (not the client-provided one for security)
        const verifiedUniqueIdentifier = verificationResult.uniqueIdentifier || uniqueIdentifier;

        // Sybil protection
        const existingUser = await isIdentifierUsed(verifiedUniqueIdentifier);
        if (existingUser && existingUser !== discordUserId) {
            return NextResponse.json({ error: 'This passport has already been used to verify another Discord account.' }, { status: 400 });
        }

        // Extract verified data from queryResult
        const typedResult = queryResult as QueryResult;
        const firstname = typedResult.firstname?.disclose?.result || 'Unknown';

        // Extract nationality boolean results from .in() checks
        const nationalityInResults = typedResult.nationality?.in || [];
        const isUS = nationalityInResults[0]?.result === true;  // First .in() was US_COUNTRIES
        const isEU = nationalityInResults[1]?.result === true;  // Second .in() was EU_COUNTRIES

        // Verify sanctions and age checks passed
        const notSanctioned = typedResult.nationality?.out?.result === true;
        const isAdult = typedResult.age?.gte?.result === true;
        const passportValid = typedResult.expiry_date?.gte?.result === true;

        console.log(`[Verification] Verified user ${discordUserId} (${firstname}) in guild ${guildId}`);
        console.log(`[Verification] Checks: isUS=${isUS}, isEU=${isEU}, notSanctioned=${notSanctioned}, isAdult=${isAdult}, passportValid=${passportValid}`);

        // Additional server-side validation of query results
        if (!isAdult) {
            return NextResponse.json({ error: 'Age verification failed. You must be 18 or older.' }, { status: 400 });
        }

        if (!notSanctioned) {
            return NextResponse.json({ error: 'Nationality verification failed. Users from sanctioned countries cannot be verified.' }, { status: 400 });
        }

        if (!passportValid) {
            return NextResponse.json({ error: 'Your passport appears to be expired. Please use a valid, non-expired document.' }, { status: 400 });
        }

        // Mark identifier as used early to prevent parallel races
        await markIdentifierAsUsed(verifiedUniqueIdentifier, discordUserId);

        // Grant roles and wait for completion
        const rolePromises: Promise<{ success: boolean; roleId: string; error?: string }>[] = [];

        console.log(`[Verification] Starting role grants for user ${discordUserId}, isUS: ${isUS}, isEU: ${isEU}`);
        console.log(`[Verification] Available role IDs - Verified: ${VERIFIED_ROLE_ID}, US: ${US_ROLE_ID}, EU: ${EU_ROLE_ID}`);

        if (VERIFIED_ROLE_ID) {
            rolePromises.push(grantDiscordRole(guildId, discordUserId, VERIFIED_ROLE_ID, 'ZKCord verification successful'));
        } else {
            console.warn('[Verification] DISCORD_VERIFIED_ROLE_ID is not set!');
        }

        // Use server-verified boolean flags
        if (US_ROLE_ID && isUS === true) {
            console.log(`[Verification] Granting US role`);
            rolePromises.push(grantDiscordRole(guildId, discordUserId, US_ROLE_ID, 'ZKCord US citizenship verification'));
        }

        if (EU_ROLE_ID && isEU === true) {
            console.log(`[Verification] Granting EU role`);
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
