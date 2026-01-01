import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { InteractionType, InteractionResponseType, verifyKey } from 'discord-interactions';
import { v4 as uuidv4 } from 'uuid';
import { saveNonce } from '@/lib/nonce-store';
import { updateGuildConfig, getGuildConfig } from '@/lib/config-store';
import { postPortalMessage } from '@/bot/utils';

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
        if (interaction.data.name === 'setup') {
            console.log('⚙️ Handling /setup command');
            return handleSetup(interaction);
        }
        if (interaction.data.name === 'portal') {
            console.log('🚪 Handling /portal command');
            return handlePortal(interaction);
        }
        if (interaction.data.name === 'add-country-role') {
            console.log('🌍 Handling /add-country-role');
            return handleAddCountryRole(interaction);
        }
        if (interaction.data.name === 'remove-country-role') {
            console.log('🔥 Handling /remove-country-role');
            return handleRemoveCountryRole(interaction);
        }
        if (interaction.data.name === 'list-roles') {
            console.log('📋 Handling /list-roles');
            return handleListRoles(interaction);
        }
        if (interaction.data.name === 'add-gender-role') {
            return handleAddGenderRole(interaction);
        }
        if (interaction.data.name === 'remove-gender-role') {
            return handleRemoveGenderRole(interaction);
        }
        if (interaction.data.name === 'add-age-role') {
            return handleAddAgeRole(interaction);
        }
        if (interaction.data.name === 'remove-age-role') {
            return handleRemoveAgeRole(interaction);
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

// ... existing country role handlers ...

async function handleListRoles(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const config = await getGuildConfig(guildId);
    const countryRoles = config?.countryRoles || {};
    const genderRoles = config?.genderRoles || {};
    const ageRoles = config?.ageRoles || {};

    let msg = '**🌍 Configured Roles:**\n\n';

    // Countries
    msg += '**Countries/Regions:**\n';
    if (Object.keys(countryRoles).length === 0) {
        msg += '_None configured._\n';
    } else {
        for (const [country, roleId] of Object.entries(countryRoles)) {
            msg += `• **${country}**: <@&${roleId}>\n`;
        }
    }

    // Gender
    msg += '\n**Gender:**\n';
    if (Object.keys(genderRoles).length === 0) {
        msg += '_None configured._\n';
    } else {
        for (const [gender, roleId] of Object.entries(genderRoles)) {
            msg += `• **${gender === 'M' ? 'Male' : 'Female'}**: <@&${roleId}>\n`;
        }
    }

    // Age
    msg += '\n**Age:**\n';
    if (Object.keys(ageRoles).length === 0) {
        msg += '_None configured._\n';
    } else {
        for (const [age, roleId] of Object.entries(ageRoles)) {
            msg += `• **${age}+**: <@&${roleId}>\n`;
        }
    }

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: msg, flags: 64 }
    });
}

async function handleAddCountryRole(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const country = interaction.data.options.find((o: any) => o.name === 'country')?.value;
    const roleId = interaction.data.options.find((o: any) => o.name === 'role')?.value;

    if (!country || !roleId) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: '❌ Missing country or role.', flags: 64 }
        });
    }

    // Normalize country to uppercase
    const normalizedCountry = country.toUpperCase().trim();

    const config = await getGuildConfig(guildId) || {};
    const countryRoles = config.countryRoles || {};
    countryRoles[normalizedCountry] = roleId;

    await updateGuildConfig(guildId, { countryRoles });

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `✅ Linked **${normalizedCountry}** to role <@&${roleId}>.`,
            flags: 64
        }
    });
}

async function handleRemoveCountryRole(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const country = interaction.data.options.find((o: any) => o.name === 'country')?.value;
    if (!country) return NextResponse.json({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ Missing country.', flags: 64 } });

    const normalizedCountry = country.toUpperCase().trim();
    const config = await getGuildConfig(guildId) || {};
    const countryRoles = config.countryRoles || {};

    if (!countryRoles[normalizedCountry]) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `⚠️ No role configured for **${normalizedCountry}**.`, flags: 64 }
        });
    }

    delete countryRoles[normalizedCountry];
    await updateGuildConfig(guildId, { countryRoles });

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `✅ Removed role link for **${normalizedCountry}**.`, flags: 64 }
    });
}

async function handleAddGenderRole(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const gender = interaction.data.options.find((o: any) => o.name === 'gender')?.value;
    const roleId = interaction.data.options.find((o: any) => o.name === 'role')?.value;

    if (!gender || !roleId) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: '❌ Missing gender or role.', flags: 64 }
        });
    }

    const config = await getGuildConfig(guildId) || {};
    const genderRoles = config.genderRoles || {};
    genderRoles[gender] = roleId;

    await updateGuildConfig(guildId, { genderRoles });

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `✅ Linked Gender **${gender === 'M' ? 'Male' : 'Female'}** to role <@&${roleId}>.`,
            flags: 64
        }
    });
}

async function handleRemoveGenderRole(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const gender = interaction.data.options.find((o: any) => o.name === 'gender')?.value;
    if (!gender) return NextResponse.json({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ Missing gender.', flags: 64 } });

    const config = await getGuildConfig(guildId) || {};
    const genderRoles = config.genderRoles || {};

    if (!genderRoles[gender]) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `⚠️ No role configured for **${gender === 'M' ? 'Male' : 'Female'}**.`, flags: 64 }
        });
    }

    delete genderRoles[gender];
    await updateGuildConfig(guildId, { genderRoles });

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `✅ Removed role link for **${gender === 'M' ? 'Male' : 'Female'}**.`, flags: 64 }
    });
}

async function handleAddAgeRole(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const minAge = interaction.data.options.find((o: any) => o.name === 'minimum_age')?.value;
    const roleId = interaction.data.options.find((o: any) => o.name === 'role')?.value;

    if (!minAge || !roleId) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: '❌ Missing age or role.', flags: 64 }
        });
    }

    // Currently only supporting 18+
    if (minAge !== 18) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: '❌ Currently only 18+ age verification is supported.', flags: 64 }
        });
    }

    const config = await getGuildConfig(guildId) || {};
    const ageRoles = config.ageRoles || {};
    ageRoles[minAge.toString()] = roleId;

    await updateGuildConfig(guildId, { ageRoles });

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `✅ Linked Age **${minAge}+** to role <@&${roleId}>.`,
            flags: 64
        }
    });
}

async function handleRemoveAgeRole(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) return serverOnly();

    const minAge = interaction.data.options.find((o: any) => o.name === 'minimum_age')?.value;
    if (!minAge) return NextResponse.json({ type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, data: { content: '❌ Missing age.', flags: 64 } });

    const key = minAge.toString();
    const config = await getGuildConfig(guildId) || {};
    const ageRoles = config.ageRoles || {};

    if (!ageRoles[key]) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `⚠️ No role configured for **${minAge}+**.`, flags: 64 }
        });
    }

    delete ageRoles[key];
    await updateGuildConfig(guildId, { ageRoles });

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: `✅ Removed role link for **${minAge}+**.`, flags: 64 }
    });
}

function serverOnly() {
    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { content: '❌ This command can only be used in a server.', flags: 64 }
    });
}

async function handleSetup(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: '❌ This command can only be used in a server.', flags: 64 }
        });
    }

    // Extract options
    const options = interaction.data.options || [];
    const config: any = {};

    for (const opt of options) {
        if (opt.name === 'verified_role') config.verifiedRoleId = opt.value;
        if (opt.name === 'us_role') config.usRoleId = opt.value;
        if (opt.name === 'eu_role') config.euRoleId = opt.value;
        if (opt.name === 'portal_channel') config.portalChannelId = opt.value;
    }

    if (Object.keys(config).length === 0) {
        // format output
        const currentConfig = await getGuildConfig(guildId);
        let msg = 'Current Configuration:\n';
        if (!currentConfig) {
            msg += 'No configuration found.';
        } else {
            msg += `Verified Role: ${currentConfig.verifiedRoleId ? `<@&${currentConfig.verifiedRoleId}>` : 'Not set'}\n`;
            msg += `US Role: ${currentConfig.usRoleId ? `<@&${currentConfig.usRoleId}>` : 'Not set'}\n`;
            msg += `EU Role: ${currentConfig.euRoleId ? `<@&${currentConfig.euRoleId}>` : 'Not set'}\n`;
            msg += `Portal Channel: ${currentConfig.portalChannelId ? `<#${currentConfig.portalChannelId}>` : 'Not set'}`;
        }

        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: msg, flags: 64 }
        });
    }

    await updateGuildConfig(guildId, config);

    return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: `✅ Configuration updated!\n\n` +
                `Verified Role: ${config.verifiedRoleId ? `<@&${config.verifiedRoleId}>` : '(unchanged)'}\n` +
                `US Role: ${config.usRoleId ? `<@&${config.usRoleId}>` : '(unchanged)'}\n` +
                `EU Role: ${config.euRoleId ? `<@&${config.euRoleId}>` : '(unchanged)'}\n` +
                `Portal Channel: ${config.portalChannelId ? `<#${config.portalChannelId}>` : '(unchanged)'}`,
            flags: 64
        }
    });
}

async function handlePortal(interaction: any) {
    const guildId = interaction.guild_id;
    if (!guildId) {
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: '❌ This command can only be used in a server.', flags: 64 }
        });
    }

    const config = await getGuildConfig(guildId);

    // Fallback to env var if config missing/empty for portal channel, 
    // BUT only if we are in the "default" guild or if we want global fallback.
    // For now, let's strictly use config if present, or fallback to env var ONLY if it matches the current logic?
    // Actually, to assume multi-tenant, we should rely on config. 
    // But for backward compatibility with the demo, if config.portalChannelId is missing, check process.env.DISCORD_PORTAL_CHANNEL_ID

    let channelId = config?.portalChannelId;

    if (!channelId) {
        // Fallback for demo purposes
        if (process.env.DISCORD_PORTAL_CHANNEL_ID) {
            channelId = process.env.DISCORD_PORTAL_CHANNEL_ID;
        } else {
            return NextResponse.json({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: '❌ Portal channel not configured. Please use `/setup` to set a portal channel first.', flags: 64 }
            });
        }
    }

    // Acknowledge the command immediately since the fetch might take time
    // ACTUALLY, we can't easily defer with Next.js Edge functions unless we do weird stuff. 
    // Let's just try to do it and return. Discord has 3s timeout.

    try {
        await postPortalMessage(channelId);
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `✅ Posted verification panel to <#${channelId}>`, flags: 64 }
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `❌ Failed to post message: ${e instanceof Error ? e.message : String(e)}`, flags: 64 }
        });
    }
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
