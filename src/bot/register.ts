// Registers slash commands with Discord. Runs after `next build`.
import { commands } from './commands';

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

async function main() {
  if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    console.warn('DISCORD_TOKEN or DISCORD_CLIENT_ID not set; skipping command registration.');
    return;
  }

  const res = await fetch(`https://discord.com/api/v10/applications/${DISCORD_CLIENT_ID}/commands`, {
    method: 'PUT',
    headers: { Authorization: `Bot ${DISCORD_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    console.error(`Command registration failed: ${res.status} ${await res.text()}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Registered ${commands.length} commands.`);
}

main();
