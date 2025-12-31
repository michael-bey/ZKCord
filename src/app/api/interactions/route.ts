import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import { v4 as uuidv4 } from 'uuid';
import { saveNonce } from '@/lib/nonce-store';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

export async function POST(req: NextRequest) {
    const signature = req.headers.get('x-signature-ed25519');
    const timestamp = req.headers.get('x-signature-timestamp');
    const body = await req.text();

    if (!signature || !timestamp || !DISCORD_PUBLIC_KEY) {
        return new NextResponse('Missing signature headers or public key', { status: 401 });
    }

    const isValidRequest = verifyKey(body, signature, timestamp, DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
        return new NextResponse('Invalid request signature', { status: 401 });
    }

    const interaction = JSON.parse(body);

    if (interaction.type === InteractionType.PING) {
        return NextResponse.json({ type: InteractionResponseType.PONG });
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        if (interaction.data.name === 'verify') {
            return handleVerify(interaction);
        }
    }

    if (interaction.type === InteractionType.MESSAGE_COMPONENT) {
        if (interaction.data.custom_id === 'start_verification') {
            return handleVerify(interaction);
        }
    }

    return NextResponse.json({ error: 'Unknown interaction type' }, { status: 400 });
}

async function handleVerify(interaction: any) {
    const nonce = uuidv4();

    // In DMs, member is undefined, use interaction.user instead
    const user = interaction.member?.user || interaction.user;

    if (!user) {
        console.error('Could not find user in interaction:', interaction);
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const discordUserId = user.id;
    const guildId = interaction.guild_id; // Will be undefined in DMs

    await saveNonce(nonce, {
        discordUserId,
        guildId,
        createdAt: Date.now(),
    });

    const verifyUrl = `${APP_URL}/verify?nonce=${nonce}`;

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
}
