# Contributing to ZKCord

Thanks for helping. Bug reports, fixes, docs and new role types are all welcome.

## Before you start

For anything bigger than a small fix, open an issue first so we can agree on the approach. Changes to proof
verification (`src/app/api/verify`, `src/lib/query.ts`) get extra scrutiny, since a mistake there lets people
get roles they haven't proven.

## Setup

Follow the development section of the [README](README.md). You need your own Discord application and Upstash
Redis database to run the bot end to end; the [Self-hosting](https://github.com/michael-bey/ZKCord/wiki/Self-hosting)
wiki page walks through both.

## Checks

There's no automated test suite yet. Before opening a pull request, run:

```bash
npx tsc --noEmit
npm run lint
npx next build --webpack
```

and describe how you tested the change. Useful approaches:

- **Bot commands:** set `DISCORD_PUBLIC_KEY` to a key pair you generate, then send signed requests to
  `/api/interactions` locally.
- **Verification flow:** a real scan needs a passport, the ZKPassport app and an HTTPS URL the phone can
  reach (a tunnel works). Say in the pull request if you couldn't test this part.
- **UI:** include screenshots in light and dark mode, and at phone width.

## Style

- Match the surrounding code. TypeScript, no `any`, small modules in `src/lib`.
- Interface text is plain and specific: sentence case, active voice, errors that say how to fix the problem.
- Design direction for the site lives in [`.impeccable.md`](.impeccable.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
