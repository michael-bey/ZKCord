# ZKCord

**Privacy-Preserving Discord Verification Powered by ZKPassport**

ZKCord is a secure, privacy-first solution for Discord communities that need to verify members' age or nationality without asking them to share sensitive identity documents.

## Features

- **🛡️ 100% Privacy**: Uses Zero-Knowledge proofs. No passports or IDs are ever uploaded to our servers.
- **✅ Age Verification**: Ensure your members are adults (18+).
- **🌍 Nationality Checks**: Grant access to specific channels based on a user's citizenship.
- **🤖 Discord Bot Integration**: Seamless /verify slash command for users.
- **🔒 Sybil Protection**: Prevents one passport from being used to verify multiple Discord accounts.
- **⏰ Passport Expiry Checks**: Automatically rejects expired passports.
- **🚫 Sanctions Compliance**: Excludes users from sanctioned countries.

## How it Works

1. **Invoke**: A user runs the `/verify` command in Discord.
2. **Scan**: The user scans a QR code with the ZKPassport mobile app.
3. **Verify**: ZKPassport generates a ZK proof of the user's identity attributes (age, nationality).
4. **Grant**: ZKCord verifies the proof and automatically grants the appropriate roles in Discord.

---

## Getting Started

### Prerequisites

- [ZKPassport Mobile App](https://zkpassport.id)
- Discord Bot Token & Client ID
- Upstash Redis for session storage

### Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Discord bot credentials and role IDs.

### Server Admin Quickstart

Once the bot is invited to your server:

1.  **Configure Roles**: Run `/setup` to link the bot to your server's roles.
    ```
    /setup verified_role:@Verified us_role:@Citizen eu_role:@European portal_channel:#verify
    ```
2.  **Post Portal**: Run `/portal` to post the verification panel to the channel you configured.
    ```
    /portal
    ```
3.  **Add Country Rules (Optional)**: Link specific countries or regions to roles.
    ```
    /add-country-role country:Brazil role:@Brazilian
    /add-country-role country:ASIA role:@Asia Team
    ```
4.  **Done!** Users can now verify themselves.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the web server:
   ```bash
   npm run dev
   ```
3. Register the Discord bot commands:
   ```bash
   npm run bot
   ```
   ```
4. Post the verification portal message:
   ```bash
   # Use the slash command in Discord:
   /portal
   ```

---

## Important Learnings & Technical Notes

### Buffer Polyfill for ZKPassport SDK

The `@zkpassport/sdk` relies on `@aztec/bb.js` which uses Node.js-specific `Buffer` BigInt methods (`writeBigUInt64BE`, `readBigUInt64LE`, etc.) that are **not available** in the browser's `buffer` package polyfill.

**Solution**: Custom `buffer-shim.ts` must:
1. Import before any ZKPassport SDK usage
2. Patch `Buffer.prototype` with BigInt methods
3. Expose globally via `window.Buffer`, `globalThis.Buffer`, and `global.Buffer`

```typescript
// src/lib/buffer-shim.ts - patch BEFORE importing @zkpassport/sdk
import '@/lib/buffer-shim';
```

### Webpack Configuration

The Next.js build **must use Webpack** (not Turbopack) for production to correctly handle the Buffer polyfill:

```bash
npm run build  # Uses --webpack flag
```

Key `next.config.ts` settings:
- `serverExternalPackages`: Externalize heavy ZKPassport packages from server bundles
- `webpack.ProvidePlugin`: Inject Buffer globally
- `resolve.fallback.buffer`: Point to `buffer/` package

### Security Best Practices

1. **Server-Side Proof Verification**: Never trust client-side verification alone. Always verify proofs on the backend.
2. **Passport Expiry**: Use `.gte('expiry_date', new Date())` to reject expired passports.
3. **Sanctions Compliance**: Use `.out('nationality', SANCTIONED_COUNTRIES)` to exclude sanctioned countries.
4. **Rate Limiting**: Implement rate limiting to prevent abuse (5 requests/hour recommended).
5. **Ephemeral Messages**: Discord verification messages should use `flags: 64` for privacy.

### ZKPassport SDK Usage

```typescript
const { ZKPassport, EU_COUNTRIES, SANCTIONED_COUNTRIES } = await import('@zkpassport/sdk');
const zkPassport = new ZKPassport();

const queryBuilder = await zkPassport.request({
  name: 'ZKCord',
  logo: 'https://your-domain.com/logo.png',
  purpose: 'Verify your age and nationality privately.',
  scope: 'zkcord-verification',
});

const { url, onResult, onError } = queryBuilder
  .gte('age', 18)                           // Must be 18+
  .gte('expiry_date', new Date())           // Not expired
  .out('nationality', SANCTIONED_COUNTRIES) // Exclude sanctioned
  .disclose('nationality')                  // For role assignment
  .done();
```

**Important**: The `.in()` method is for **requirements** (must pass). For nationality-based role assignment, use `.disclose('nationality')` and check the result on the backend.

### Discord Bot Architecture

- **Interactions Endpoint**: `/api/interactions` handles Discord interaction webhooks
- **Nonce-Based Sessions**: UUID nonces link Discord users to verification sessions
- **Redis Storage**: Upstash Redis stores session data with TTL

### Build & Deployment

Production builds can take ~10 minutes due to WASM processing. To optimize:
- Use `serverExternalPackages` to externalize heavy packages
- Enable `asyncWebAssembly` in webpack experiments
- Leverage Vercel's build cache

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **ZK Proofs**: ZKPassport SDK
- **Bot**: Discord Interactions API
- **Storage**: Upstash Redis
- **Hosting**: Vercel

## License

Built for the ZKPassport Ecosystem. Experimental PoC.
