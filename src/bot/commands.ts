export const commands = [
    {
        name: 'verify',
        description: 'Privately verify your age & nationality using ZK proofs — no ID upload required',
        type: 1, // CHAT_INPUT
    },
    {
        name: 'setup',
        description: 'Configure ZKCord roles and channel (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'verified_role',
                description: 'Role to give after verification',
                type: 8, // ROLE
                required: false,
            },
            {
                name: 'us_role',
                description: 'Role to give for US citizens',
                type: 8, // ROLE
                required: false,
            },
            {
                name: 'eu_role',
                description: 'Role to give for EU citizens',
                type: 8, // ROLE
                required: false,
            },
            {
                name: 'portal_channel',
                description: 'Channel to post the verify button',
                type: 7, // CHANNEL
                channel_types: [0], // GUILD_TEXT
                required: false,
            },
        ],
    },
    {
        name: 'portal',
        description: 'Post the verification panel to the configured channel (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
    },
];
