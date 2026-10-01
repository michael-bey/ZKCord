import type { Metadata } from 'next';
import { Colophon, Masthead } from '@/components/Chrome';

export const metadata: Metadata = { title: 'ZKCord privacy policy' };

export default function PrivacyPolicy() {
  return (
    <div className="page">
      <Masthead />
      <main className="prose">
        <h1>Privacy</h1>
        <p className="lede">Last updated 30 September 2026.</p>

        <h2>What ZKCord never receives</h2>
        <p>
          Your passport is read by the ZKPassport app on your phone. ZKCord never receives your name, date of
          birth, passport number, photo, or a copy of any document.
        </p>

        <h2>What ZKCord receives and keeps</h2>
        <ul>
          <li>
            <strong>While you verify:</strong> your Discord user ID, display name and server ID, deleted after 10
            minutes or as soon as you finish.
          </li>
          <li>
            <strong>From the proof:</strong> that you are 18 or older, your nationality, and your gender marker if
            the server uses gender roles. These are used to pick your roles and are not stored.
          </li>
          <li>
            <strong>After you verify:</strong> a pairing of your Discord user ID with an anonymous passport
            identifier, per server, so one passport can&apos;t verify several accounts. It can&apos;t be traced
            back to your passport. Server admins can erase it with <code>/reset</code>.
          </li>
          <li>
            <strong>Server settings:</strong> which roles a server gives for which rule.
          </li>
        </ul>

        <h2>Who else sees it</h2>
        <p>
          Discord sees the roles you are given. The data above is stored with Upstash (Redis) and the site is
          hosted on Vercel. Nothing is sold or shared for advertising.
        </p>

        <h2>Deleting your data</h2>
        <p>
          Ask an admin of the server to run <code>/reset</code>, or contact the ZKCord maintainers on GitHub.
        </p>
      </main>
      <Colophon />
    </div>
  );
}
