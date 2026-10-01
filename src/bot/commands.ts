// Discord option types
const SUB_COMMAND = 1;
const STRING = 3;
const CHANNEL = 7;
const ROLE = 8;

const ADMIN = '8';
const GUILD_ONLY = [0];

const roleOption = { name: 'role', description: 'Role to give', type: ROLE, required: true };

export const commands = [
  {
    name: 'verify',
    description: 'Verify your age and nationality with your passport',
    contexts: GUILD_ONLY,
  },
  {
    name: 'portal',
    description: 'Post the verification button',
    default_member_permissions: ADMIN,
    contexts: GUILD_ONLY,
    options: [
      { name: 'channel', description: 'Where to post it (defaults to this channel)', type: CHANNEL, channel_types: [0] },
    ],
  },
  {
    name: 'roles',
    description: 'Choose which roles verified members get',
    default_member_permissions: ADMIN,
    contexts: GUILD_ONLY,
    options: [
      { name: 'list', description: 'Show role rules', type: SUB_COMMAND },
      { name: 'verified', description: 'Role for everyone who verifies', type: SUB_COMMAND, options: [roleOption] },
      { name: 'adult', description: 'Role for members proven 18+', type: SUB_COMMAND, options: [roleOption] },
      {
        name: 'country',
        description: 'Role for a nationality or region (EU, LATAM, ...)',
        type: SUB_COMMAND,
        options: [
          { name: 'place', description: 'Country or region', type: STRING, required: true, autocomplete: true },
          roleOption,
        ],
      },
      {
        name: 'gender',
        description: 'Role by passport gender marker',
        type: SUB_COMMAND,
        options: [
          {
            name: 'gender',
            description: 'Gender marker',
            type: STRING,
            required: true,
            choices: [
              { name: 'Female', value: 'F' },
              { name: 'Male', value: 'M' },
            ],
          },
          roleOption,
        ],
      },
      {
        name: 'remove',
        description: 'Remove a role rule',
        type: SUB_COMMAND,
        options: [{ name: 'rule', description: 'Rule to remove', type: STRING, required: true, autocomplete: true }],
      },
    ],
  },
  {
    name: 'reset',
    description: 'Take ZKCord roles back from everyone and forget their passports (for demos)',
    default_member_permissions: ADMIN,
    contexts: GUILD_ONLY,
  },
];
