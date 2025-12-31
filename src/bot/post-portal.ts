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
                title: '🛡️ ZKCord Verification Portal',
                description: 'To access the rest of the server, you must verify your identity using ZKcord. \n\nClick the button below to start the process. This uses Zero-Knowledge proofs, keeping your personal details private.',
                color: 0x5865F2, // Discord Blurple
                thumbnail: {
                    url: 'https://zkcord.xyz/logo.png', // Assuming logo is at this path or standard
                },
                footer: {
                    text: 'Privacy-Preserving Verification by ZKcord',
                },
            },
        ],
        components: [
            {
                type: 1, // Action Row
                components: [
                    {
                        type: 2, // Button
                        label: 'Verify Now',
                        style: 1, // Primary (Blurple)
                        custom_id: 'start_verification',
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
