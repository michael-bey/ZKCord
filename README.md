# ZKCord

A Discord bot that gives members roles based on their passport (18+, nationality, or a region like the EU)
without anyone seeing the passport.

Members scan their passport chip with the free [ZKPassport](https://zkpassport.id) app. Their phone produces a
zero-knowledge proof of only the facts the server asked for, ZKCord checks the proof, and the roles appear.

**Use it:** [add the hosted bot](https://zkcord.vercel.app) to your server and follow the
[setup guide](https://zkcord.vercel.app/admin-guide). **Run your own:** see [Self-hosting](https://github.com/michael-bey/ZKCord/wiki/Self-hosting).

## What a server learns

| Shared with the server | Never leaves the member's phone |
| --- | --- |
| Holder is 18 or older | Name |
| Nationality | Date of birth |
| Gender marker, only if the server has gender roles | Passport number |
| Whether this passport already verified another account in the server | Photo |

Expired passports and passports from sanctioned countries can't verify. Details, including what ZKCord stores
and what the operator of an instance can see: [How verification works](https://github.com/michael-bey/ZKCord/wiki/How-verification-works).

## Commands

| Command | Who | |
| --- | --- | --- |
| `/verify` | Members | Get a private verification link |
| `/portal [channel]` | Admins | Post a Start verification button |
| `/roles verified\|adult\|country\|gender` | Admins | Choose which role each proven fact gives |
| `/roles list`, `/roles remove` | Admins | See or delete role rules |
| `/reset` | Admins | Take back every ZKCord role and forget passports, for demos |

More in [Commands](https://github.com/michael-bey/ZKCord/wiki/Commands).

## Development

Next.js 16 on Vercel, Upstash Redis for state, the ZKPassport SDK for proofs.

```bash
npm install
vercel link && vercel env pull   # or copy .env.example to .env.local and fill it in
npm run dev
```

Discord has to reach `/api/interactions` over HTTPS, so local bot testing needs a tunnel. `npm run build`
registers the slash commands after building. The [Self-hosting](https://github.com/michael-bey/ZKCord/wiki/Self-hosting)
page covers the Discord application setup and every environment variable.

```
src/app/api/interactions   Discord slash commands, buttons and autocomplete
src/app/api/verify         Checks proofs and gives roles
src/app/verify             The page members open to scan their passport
src/lib/query.ts           What ZKCord asks a passport for (shared by browser and server)
src/lib/store.ts           Everything kept in Redis
src/lib/regions.ts         Countries, regions, and passport code quirks
```

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Report security problems
privately, as described in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
