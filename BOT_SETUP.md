# ZKCord Bot Descriptions

Use these when configuring your bot in the Discord Developer Portal.

---

## Application Name
```
ZKCord
```

## Short Description (max 60 characters)
```
Privacy-first identity verification using ZK proofs
```

## Description (About Me / Bot Bio - max 190 characters)
```
Verify age & nationality privately with ZK proofs. Your passport never leaves your phone — only cryptographic proof is shared. Powered by ZKPassport.
```

## Tags
- verification
- privacy
- security
- age-verification
- identity

---

## OAuth2 Scopes Required
- `bot`
- `applications.commands`

## Bot Permissions Required
- Manage Roles
- Send Messages
- Embed Links
- Use Slash Commands

## Interactions Endpoint URL
```
https://your-app.vercel.app/api/interactions
```

---

## Invite URL Template
Replace `YOUR_CLIENT_ID` with your Discord application client ID:
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot%20applications.commands
```

---

## Server Setup Checklist

1. **Create Roles** (in order from top to bottom):
   - `Verified` - Base role for all verified members
   - `US Citizen` - For US nationality (optional)
   - `EU Citizen` - For EU nationality (optional)

2. **Configure Bot**:
   - Bot role must be ABOVE the roles it assigns
   - Enable "Interactions Endpoint URL" in Developer Portal

3. **Create Verification Channel**:
   - Create a `#verify` channel
   - Only allow @everyone to view (no send messages)
   - Run `npm run portal` to post the verification embed

4. **Lock Other Channels**:
   - Remove @everyone permissions from other channels
   - Add `Verified` role with view permissions
