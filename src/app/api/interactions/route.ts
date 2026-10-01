import { NextRequest, NextResponse, after } from 'next/server';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { APP_URL, DiscordError, editReply, postPortal, removeRole } from '@/lib/discord';
import { COUNTRIES, REGIONS, describePlace } from '@/lib/regions';
import {
  createSession,
  forgetVerifiedMembers,
  getRoleRules,
  getVerifiedMembers,
  rateLimit,
  removeRoleRule,
  setRoleRule,
} from '@/lib/store';

export const dynamic = 'force-dynamic';

type Option = { name: string; type: number; value?: string; focused?: boolean; options?: Option[] };

interface Interaction {
  type: number;
  token: string;
  guild_id?: string;
  channel_id?: string;
  member?: { user: { id: string; username: string; global_name?: string } };
  data: { name?: string; custom_id?: string; options?: Option[] };
}

const EPHEMERAL = 64;

function reply(content: string, components?: unknown[]) {
  return NextResponse.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content, components, flags: EPHEMERAL },
  });
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature-ed25519');
  const timestamp = req.headers.get('x-signature-timestamp');
  const body = await req.text();
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!signature || !timestamp || !publicKey || !(await verifyKey(body, signature, timestamp, publicKey))) {
    return new NextResponse('Bad signature', { status: 401 });
  }

  const interaction: Interaction = JSON.parse(body);

  try {
    switch (interaction.type) {
      case InteractionType.PING:
        return NextResponse.json({ type: InteractionResponseType.PONG });
      case InteractionType.MESSAGE_COMPONENT:
        if (interaction.data.custom_id === 'start_verification') return await verify(interaction);
        break;
      case InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE:
        return await autocomplete(interaction);
      case InteractionType.APPLICATION_COMMAND:
        switch (interaction.data.name) {
          case 'verify': return await verify(interaction);
          case 'portal': return await portal(interaction);
          case 'roles': return await roles(interaction);
          case 'reset': return reset(interaction);
        }
    }
  } catch (err) {
    console.error(`Interaction ${interaction.data.name ?? interaction.data.custom_id} failed:`, err);
    return reply('Something went wrong on our side. Try again in a minute.');
  }

  return new NextResponse('Unknown interaction', { status: 400 });
}

async function verify(interaction: Interaction) {
  const user = interaction.member?.user;
  if (!interaction.guild_id || !user) return reply('Run this inside a server.');

  const wait = await rateLimit(`verify:${user.id}`, 5, 60);
  if (wait) return reply(`Too many attempts. Try again in ${wait}s.`);

  const sessionId = crypto.randomUUID();
  await createSession(sessionId, {
    userId: user.id,
    guildId: interaction.guild_id,
    username: user.global_name ?? user.username,
  });

  return reply('Open this link to verify. It expires in 10 minutes and only works for you.', [
    { type: 1, components: [{ type: 2, style: 5, label: 'Verify with passport', url: `${APP_URL}/verify?session=${sessionId}` }] },
  ]);
}

async function portal(interaction: Interaction) {
  const channelId = interaction.data.options?.find((o) => o.name === 'channel')?.value ?? interaction.channel_id!;
  try {
    await postPortal(channelId);
  } catch (err) {
    if (err instanceof DiscordError) return reply(`Couldn't post in <#${channelId}>: ${err.message}`);
    throw err;
  }
  return reply(`Posted the verification button in <#${channelId}>.`);
}

function describeRule(rule: string): string {
  if (rule === 'verified') return 'Everyone verified';
  if (rule === 'adult') return '18+';
  if (rule === 'gender:F') return 'Female';
  if (rule === 'gender:M') return 'Male';
  return describePlace(rule);
}

async function roles(interaction: Interaction) {
  const guildId = interaction.guild_id!;
  const sub = interaction.data.options![0];
  const arg = (name: string) => sub.options?.find((o) => o.name === name)?.value as string;

  if (sub.name === 'list') {
    const rules = await getRoleRules(guildId);
    const lines = Object.entries(rules).map(([rule, roleId]) => `${describeRule(rule)} → <@&${roleId}>`);
    return reply(lines.length ? lines.join('\n') : 'No role rules yet. Start with `/roles verified`.');
  }

  if (sub.name === 'remove') {
    const rule = arg('rule');
    const removed = await removeRoleRule(guildId, rule);
    return reply(removed ? `Removed the ${describeRule(rule)} rule.` : `There's no ${describeRule(rule)} rule.`);
  }

  let rule: string;
  if (sub.name === 'country') {
    rule = arg('place');
    if (!/^(country|region):/.test(rule) || describePlace(rule) === rule.split(':')[1]) {
      return reply(`Pick a country or region from the list instead of typing "${rule}".`);
    }
  } else if (sub.name === 'gender') {
    rule = `gender:${arg('gender')}`;
  } else {
    rule = sub.name;
  }

  const roleId = arg('role');
  await setRoleRule(guildId, rule, roleId);
  return reply(`${describeRule(rule)} → <@&${roleId}>`);
}

async function autocomplete(interaction: Interaction) {
  const focused = interaction.data.options?.[0]?.options?.find((o) => o.focused);
  const query = (focused?.value ?? '').toLowerCase();

  let choices: { name: string; value: string }[];
  if (focused?.name === 'rule') {
    const rules = await getRoleRules(interaction.guild_id!);
    choices = Object.keys(rules).map((rule) => ({ name: describeRule(rule), value: rule }));
  } else {
    choices = [
      ...Object.entries(REGIONS).map(([key, r]) => ({ name: `${r.label} (region)`, value: `region:${key}` })),
      ...Object.entries(COUNTRIES).map(([code, name]) => ({ name, value: `country:${code}` })),
    ];
  }

  return NextResponse.json({
    type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
    data: { choices: choices.filter((c) => c.name.toLowerCase().includes(query)).slice(0, 25) },
  });
}

/**
 * Takes every ZKCord role back from members who verified, and forgets which passports they used,
 * so the same passport can verify again. Role rules stay. Runs after the 3s interaction deadline.
 */
function reset(interaction: Interaction) {
  const guildId = interaction.guild_id!;

  after(async () => {
    try {
      const [members, rules] = await Promise.all([getVerifiedMembers(guildId), getRoleRules(guildId)]);
      const roleIds = [...new Set(Object.values(rules))];
      let failures = 0;

      for (const userId of members) {
        for (const roleId of roleIds) {
          try {
            await removeRole(guildId, userId, roleId, 'ZKCord reset');
          } catch (err) {
            // The member may have left or never had this role.
            if (!(err instanceof DiscordError && err.status === 404)) failures++;
          }
        }
      }
      await forgetVerifiedMembers(guildId);

      const summary = `Reset ${members.length} member${members.length === 1 ? '' : 's'}. Their passports can verify again.`;
      await editReply(interaction.token, failures ? `${summary}\n${failures} role removals failed; check ZKCord's role position.` : summary);
    } catch (err) {
      console.error('Reset failed:', err);
      await editReply(interaction.token, 'Reset failed partway. Run /reset again.').catch(() => {});
    }
  });

  return NextResponse.json({
    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    data: { flags: EPHEMERAL },
  });
}
