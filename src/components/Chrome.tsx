import Link from 'next/link';
import { Mark } from './Mark';

// Bot + slash commands, with Manage Roles (268435456), the only permission ZKCord needs.
export const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=268435456&scope=bot+applications.commands`;

export function Masthead({ invite = true }: { invite?: boolean }) {
  return (
    <header className="masthead">
      <Link href="/" className="wordmark">
        <Mark />
        ZKCord
      </Link>
      {invite && <a className="button small" href={INVITE_URL}>Add to Discord</a>}
    </header>
  );
}

export function Colophon() {
  return (
    <footer className="colophon">
      <Link href="/admin-guide">Setup guide</Link>
      <Link href="/privacy-policy">Privacy</Link>
      <Link href="/terms-of-service">Terms</Link>
      <a href="https://zkpassport.id">Built on ZKPassport</a>
    </footer>
  );
}
