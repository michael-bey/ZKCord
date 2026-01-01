const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_PORTAL_CHANNEL_ID = process.env.DISCORD_PORTAL_CHANNEL_ID;

if (!DISCORD_TOKEN || !DISCORD_PORTAL_CHANNEL_ID) {
    console.error('Missing DISCORD_TOKEN or DISCORD_PORTAL_CHANNEL_ID in environment variables');
    process.exit(1);
}

async function postPortalMessage() {
    console.log(`Posting portal message to channel ${DISCORD_PORTAL_CHANNEL_ID}...`);

    const url = `https://discord.com/api/v10/channels/${DISCORD_PORTAL_CHANNEL_ID}/messages`;

    const message = {
        embeds: [
            {
                title: 'Identity Verification Required',
                description: 'This server uses **ZKCord** for privacy-preserving identity verification.\n\n**How it works:**\n• Scan a QR code with the ZKPassport app\n• Your passport is verified locally on your device\n• Only a cryptographic proof is shared — never your actual ID\n\n*Your personal data never leaves your phone.*',
                color: 0x8B5CF6, // Purple to match branding
                thumbnail: {
                    url: 'https://zkcord.vercel.app/logo.png',
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

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (response.ok) {
            console.log('Successfully posted portal message');
            const data = await response.json();
            console.log(data);
        } else {
            const error = await response.text();
            console.error(`Failed to post portal message: ${response.status} ${error}`);
        }
    } catch (err) {
        console.error('Error posting portal message:', err);
    }
}

postPortalMessage();
