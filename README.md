# ZKCord

A Discord bot that gives roles based on passport age and nationality. Members scan their passport with the
[ZKPassport](https://zkpassport.id) app; ZKCord receives a zero-knowledge proof, checks it on the server, and
assigns roles. It never sees the passport itself.

Live at https://zkcord.vercel.app. Admin docs are at [/admin-guide](https://zkcord.vercel.app/admin-guide).

## Commands

| Command | Who | What it does |
| --- | --- | --- |
| `/verify` | Members | Sends a private verification link |
| `/portal [channel]` | Admins | Posts the Start verification button |
| `/roles verified\|adult\|country\|gender\|list\|remove` | Admins | Maps proven facts to roles |
| `/reset` | Admins | Takes ZKCord roles back from everyone and forgets their passports, for demos |

## Running locally

```bash
npm install
vercel link && vercel env pull   # Discord credentials + KV_REST_API_* for Upstash Redis
npm run dev
```

Point the Discord application's Interactions Endpoint URL at `https://<host>/api/interactions` (use a tunnel
for local work). `npm run build` registers slash commands after building, as does `npm run bot`.

## Environment

| Variable | |
| --- | --- |
| `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_PUBLIC_KEY` | From the Discord developer portal |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Upstash Redis, provisioned through the Vercel Marketplace |
| `NEXT_PUBLIC_APP_URL` | Public URL of the site. Also the domain ZKPassport proofs are bound to |

## How it fits together

- `src/app/api/interactions` handles every Discord interaction. `/reset` replies right away and does the
  work afterwards with `after()`, since Discord allows 3 seconds.
- `src/app/verify` is the page members open. It builds the ZKPassport request in the browser.
- `src/app/api/verify` re-verifies the proofs with the SDK (never trust the browser), enforces one passport
  per account per server, and grants roles.
- `src/lib/store.ts` holds everything kept in Redis: 10-minute sessions, role rules, and verified members.

## Gotchas

- **Buffer.** `@aztec/bb.js` (used by the ZKPassport SDK) calls Node's BigInt `Buffer` methods, which the
  browser `buffer` package lacks. `src/lib/buffer-shim.ts` adds them and must be imported before the SDK.
  Builds use webpack (`next build --webpack`) so `ProvidePlugin` can inject `Buffer`.
- **WASM on Vercel.** `outputFileTracingIncludes` in `next.config.ts` forces `@aztec/bb.js` into the
  function bundle so server-side verification can load it.
- **Nationality format.** The proof discloses an ICAO alpha-3 code (`FRA`, or `D<<` for Germany), not a
  country name. `src/lib/regions.ts` normalizes it.
