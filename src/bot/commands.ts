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
    {
        name: 'add-country-role',
        description: 'Link a specific country to a role (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'country',
                description: 'Country name (e.g. "France", "Brazil")',
                type: 3, // STRING
                required: true,
            },
            {
                name: 'role',
                description: 'Role to assign',
                type: 8, // ROLE
                required: true,
            },
        ],
    },
    {
        name: 'remove-country-role',
        description: 'Remove a country-role link (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'country',
                description: 'Country name to remove',
                type: 3, // STRING
                required: true,
            },
        ],
    },
    {
        name: 'list-roles',
        description: 'List all configured country, gender, and age roles (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
    },
    {
        name: 'add-gender-role',
        description: 'Link a gender to a role (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'gender',
                description: 'Gender to check',
                type: 3, // STRING
                required: true,
                choices: [
                    { name: 'Male', value: 'M' },
                    { name: 'Female', value: 'F' },
                ],
            },
            {
                name: 'role',
                description: 'Role to assign',
                type: 8, // ROLE
                required: true,
            },
        ],
    },
    {
        name: 'remove-gender-role',
        description: 'Remove a gender-role link (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'gender',
                description: 'Gender to remove',
                type: 3, // STRING
                required: true,
                choices: [
                    { name: 'Male', value: 'M' },
                    { name: 'Female', value: 'F' },
                ],
            },
        ],
    },
    {
        name: 'add-age-role',
        description: 'Link minimum age to a role (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'minimum_age',
                description: 'Minimum age required',
                type: 4, // INTEGER
                required: true,
                choices: [
                    { name: '18+', value: 18 },
                ],
            },
            {
                name: 'role',
                description: 'Role to assign',
                type: 8, // ROLE
                required: true,
            },
        ],
    },
    {
        name: 'remove-age-role',
        description: 'Remove an age-role link (Admin only)',
        type: 1, // CHAT_INPUT
        default_member_permissions: '8', // ADMINISTRATOR
        options: [
            {
                name: 'minimum_age',
                description: 'Minimum age to remove',
                type: 4, // INTEGER
                required: true,
                choices: [
                    { name: '18+', value: 18 },
                ],
            },
        ],
    },
];
