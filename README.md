# ZKcord

**Privacy-Preserving Discord Verification Powered by ZkPassport**

ZKcord is a secure, privacy-first solution for Discord communities that need to verify members' age or nationality without asking them to share sensitive identity documents.

## Features

- **🛡️ 100% Privacy**: Uses Zero-Knowledge proofs. No passports or IDs are ever uploaded to our servers.
- **✅ Age Verification**: Ensure your members are adults (18+).
- **🌍 Nationality Checks**: Grant access to specific channels based on a user's citizenship.
- **🤖 Discord Bot Integration**: Seamless /verify slash command for users.
- **🔒 Sybil Protection**: Prevents one passport from being used to verify multiple Discord accounts.

## How it Works

1. **Invoke**: A user runs the `/verify` command in Discord.
2. **Scan**: The user scans a QR code with the ZkPassport mobile app.
3. **Verify**: ZkPassport generates a ZK proof of the user's identity attributes (age, nationality).
4. **Grant**: ZKcord verifies the proof and automatically grants the appropriate roles in Discord.

## Getting Started

### Prerequisites

- [ZkPassport Mobile App](https://zkpassport.id)
- Discord Bot Token & Client ID

### Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Discord bot credentials and role IDs.

### Running the App

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the web server:
   ```bash
   npm run dev
   ```
3. Start the Discord bot:
   ```bash
   npm run bot
   ```

## License

Built for the ZkPassport Ecosystem. Experimental PoC.
