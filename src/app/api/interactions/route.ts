import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import { v4 as uuidv4 } from 'uuid';
import { saveNonce } from '@/lib/nonce-store';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

export async function POST(req: NextRequest) {
    console.log('--- Incoming Interaction ---');
    const signature = req.headers.get('x-signature-ed25519');
    const timestamp = req.headers.get('x-signature-timestamp');
    const body = await req.text();

    if (!signature || !timestamp || !DISCORD_PUBLIC_KEY) {
        console.error('❌ Missing signature headers or public key');
        return new NextResponse('Missing signature headers or public key', { status: 401 });
    }

    const isValidRequest = await verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
        console.error('❌ Invalid request signature');
        return new NextResponse('Invalid request signature', { status: 401 });
    }

    const interaction = JSON.parse(body);
    console.log(`Interaction Type: ${interaction.type}`);

    if (interaction.type === InteractionType.PING) {
        console.log('✅ PING -> PONG');
        return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        if (interaction.data.name === 'verify') {
            console.log('🚀 Handling /verify command');
            return handleVerify(interaction);
        }
    }

    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
        if (interaction.data.custom_id === 'start_verification') {
            console.log('🚀 Handling start_verification button');
            return handleVerify(interaction);
        }
    }

    console.warn('⚠️ Unknown interaction type or data:', interaction.data);
    return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
}

async function handleVerify(interaction: any) {
    try {
        const nonce = uuidv4();

        // In DMs, member is undefined, use interaction.user instead
        const user = interaction.member?.user || interaction.user;

        if (!user) {
            console.error('❌ User not found in interaction');
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }

        const discordUserId = user.id;
        const username = user.username || user.global_name || 'Unknown User';
        const guildId = interaction.guild_id; // Will be undefined in DMs

        // Rate limit: 5 verification requests per hour
        // TEMPORARILY DISABLED FOR TESTING
        // const { checkRateLimit } = await import('@/lib/rate-limit');
        // const rateLimit = await checkRateLimit(`verify:${discordUserId}`, 5, 3600);
        //
        // if (!rateLimit.allowed) {
        //     console.log(`⚠️ Rate limit exceeded for user ${discordUserId}`);
        //     return NextResponse.json({
        //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        //         data: {
        //             content: `⚠️ Too many verification requests. Please try again in ${Math.ceil(rateLimit.resetInSeconds / 60)} minutes.`,
        //             flags: 64, // Ephemeral
        //         },
        //     });
        // }

        console.log(`📝 Saving nonce for user ${discordUserId} (@${username}) (Guild: ${guildId || 'DM'})`);

        await saveNonce(nonce, {
            discordUserId,
            guildId,
            username,
            createdAt: Date.now(),
        });

        const verifyUrl = `${APP_URL}/verify?nonce=${nonce}`;
        console.log(`✅ Success! Verification URL: ${verifyUrl}`);

        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Click the button below to verify your age and nationality with **ZKcord**. This uses Zero-Knowledge proofs, so your identity remains private.',
                flags: 64, // Ephemeral
                components: [
                    {
                        type: 1, // Action Row
                        components: [
                            {
                                type: 2, // Button
                                label: 'Verify with ZKcord',
                                style: 5, // Link
                                url: verifyUrl,
                            },
                        ],
                    },
                ],
            },
        });
    } catch (err) {
        console.error('❌ Error in handleVerify:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
