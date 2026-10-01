const API = 'https://discord.com/api/v10';

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const errorHints: Record<number, string> = {
  50013: "ZKCord's role must sit above the roles it hands out (Server Settings → Roles).",
  10007: "You're not a member of that server.",
  10011: 'A configured role no longer exists. An admin should run /roles list.',
};

export class DiscordError extends Error {
  constructor(public status: number, public code: number | undefined, message: string) {
    super(code && errorHints[code] ? errorHints[code] : message);
  }
}

export async function discord(path: string, init: RequestInit & { reason?: string } = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bot ${process.env.DISCORD_TOKEN}`);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (init.reason) headers.set('X-Audit-Log-Reason', encodeURIComponent(init.reason));

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(API + path, { ...init, headers });
    if (res.status === 429 && attempt < 3) {
      const { retry_after = 1 } = await res.json().catch(() => ({}));
      await new Promise((r) => setTimeout(r, retry_after * 1000));
      continue;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new DiscordError(res.status, body.code, body.message ?? `Discord API ${res.status}`);
    }
    return res;
  }
}

const memberRole = (guildId: string, userId: string, roleId: string) =>
  `/guilds/${guildId}/members/${userId}/roles/${roleId}`;

export function addRole(guildId: string, userId: string, roleId: string, reason: string) {
  return discord(memberRole(guildId, userId, roleId), { method: 'PUT', reason });
}

export function removeRole(guildId: string, userId: string, roleId: string, reason: string) {
  return discord(memberRole(guildId, userId, roleId), { method: 'DELETE', reason });
}

/** Replaces a deferred interaction response. */
export function editReply(interactionToken: string, content: string) {
  return discord(`/webhooks/${process.env.DISCORD_CLIENT_ID}/${interactionToken}/messages/@original`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  });
}

export function postPortal(channelId: string) {
  return discord(`/channels/${channelId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      embeds: [
        {
          title: 'Verify to get your roles',
          description:
            'Prove your age and nationality with your passport, without showing it to anyone.\n\n' +
            'Your phone reads the passport chip and sends back a zero-knowledge proof. ' +
            'The server learns that you are 18+, your nationality, and your gender only if it uses gender roles. ' +
            'Not your name, photo, or passport number.',
          color: 0xe8e4da,
          fields: [{ name: 'You need', value: 'An NFC passport and the ZKPassport app' }],
        },
      ],
      components: [
        {
          type: 1,
          components: [{ type: 2, style: 1, label: 'Start verification', custom_id: 'start_verification' }],
        },
      ],
    }),
  });
}
