import Link from 'next/link';
import { Mark } from './Mark';

export const INVITE_URL =
  'https://discord.com/api/oauth2/authorize?client_id=1456016871017943112&permissions=268435456&scope=bot%20applications.commands';

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
