import { InteractionType, InteractionResponseType } from 'discord-interactions';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    console.warn('⚠️ Missing DISCORD_TOKEN or DISCORD_CLIENT_ID. Skipping slash command registration.');
    process.exit(0);
}

const commands = [
    {
        name: 'verify',
        description: 'Verify your identity with ZKcord',
        type: 1, // CHAT_INPUT
    },
];

async function registerCommands() {
    console.log('Registering slash commands...');

    const url = `https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`;

    try {
        const response = await fetch(url, {
            method: 'PUT', // PUT replaces all commands
            headers: {
                'Authorization': `Bot ${DISCORD_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commands),
        });

        if (response.ok) {
            console.log('Successfully registered commands');
            const data = await response.json();
            console.log(data);
        } else {
            const error = await response.text();
            console.error(`Failed to register commands: ${response.status} ${error}`);
        }
    } catch (err) {
        console.error('Error registering commands:', err);
    }
}

registerCommands();
