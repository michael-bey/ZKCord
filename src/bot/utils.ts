const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://zkcord.vercel.app';

export async function postPortalMessage(channelId: string) {
    if (!DISCORD_TOKEN) {
        throw new Error('Missing DISCORD_TOKEN');
    }

    console.log(`Posting portal message to channel ${channelId}...`);

    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

    const message = {
        embeds: [
            {
                title: 'Identity Verification Required',
                description: 'This server uses **ZKCord** for privacy-preserving identity verification.\n\n**How it works:**\n• Scan a QR code with the ZKPassport app\n• Your passport is verified locally on your device\n• Only a cryptographic proof is shared — never your actual ID\n\n*Your personal data never leaves your phone.*',
                color: 0x8B5CF6, // Purple to match branding
                thumbnail: {
                    url: `${APP_URL}/logo.png`,
                },
                fields: [
                    {
                        name: 'Requirements',
                        value: '• Age 18+\n• Valid (non-expired) passport\n• ZKPassport app installed',
                        inline: false,
                    },
                ],
                footer: {
                    text: 'Powered by ZKPassport • Zero-Knowledge Proofs',
                },
            },
        ],
        components: [
            {
                type: 1, // Action Row
                components: [
                    {
                        type: 2, // Button
                        label: 'Start Verification',
                        style: 1, // Primary
                        custom_id: 'start_verification',
                        emoji: {
                            name: '🔐',
                        },
                    },
                ],
            },
        ],
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to post portal message: ${response.status} ${error}`);
    }

    return await response.json();
}
