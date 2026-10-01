import type { Metadata } from 'next';
import { Colophon, INVITE_URL, Masthead } from '@/components/Chrome';

export const metadata: Metadata = { title: 'ZKCord setup guide' };

export default function AdminGuide() {
  return (
    <div className="page">
      <Masthead />

      <main className="prose">
        <h1>Set up ZKCord</h1>
        <p className="lede">Takes about five minutes. You need to be an administrator of the server.</p>

        <h2>1. Add the bot</h2>
        <p>
          <a href={INVITE_URL}>Add ZKCord to your server</a>. Then open Server Settings → Roles and drag the
          ZKCord role above every role you want it to hand out. Discord only lets bots give roles that sit
          below their own.
        </p>

        <h2>2. Choose roles</h2>
        <p>Each rule pairs something a passport can prove with a role. A member gets every role they qualify for.</p>
        <dl className="commands">
          <dt><code>/roles verified</code></dt>
          <dd>Everyone who verifies.</dd>
          <dt><code>/roles adult</code></dt>
          <dd>Members proven 18 or older. Today that is everyone who verifies, since ZKCord requires 18+.</dd>
          <dt><code>/roles country</code></dt>
          <dd>A nationality, or a region like EU, Schengen, LATAM or ASEAN. Start typing and pick from the list.</dd>
          <dt><code>/roles gender</code></dt>
          <dd>The passport&apos;s gender marker. Members are only asked for it if you add one of these.</dd>
          <dt><code>/roles list</code></dt>
          <dd>Show your rules.</dd>
          <dt><code>/roles remove</code></dt>
          <dd>Delete a rule. Roles already given stay until you remove them in Discord or run /reset.</dd>
        </dl>

        <h2>3. Post the button</h2>
        <p>
          Run <code>/portal</code> in the channel where new members land, or pass a <code>channel</code>.
          It posts a message with a Start verification button. Members can also run <code>/verify</code> in
          any channel.
        </p>

        <h2>Running a demo</h2>
        <p>
          <code>/reset</code> takes back every role ZKCord has given in this server and forgets which passports
          were used, so you can verify again with the same passport. Your role rules stay.
        </p>
        <p>A typical run:</p>
        <ul>
          <li>Run <code>/reset</code> so your account starts without roles.</li>
          <li>Click Start verification and scan with ZKPassport.</li>
          <li>Show the roles that appeared, and <code>/roles list</code> to explain why.</li>
        </ul>

        <h2>When something goes wrong</h2>
        <h3>&ldquo;Verified, but no roles could be given&rdquo;</h3>
        <p>ZKCord&apos;s role is below the role it tried to give. Move it higher in Server Settings → Roles.</p>
        <h3>&ldquo;This server hasn&apos;t set up any roles yet&rdquo;</h3>
        <p>Add at least <code>/roles verified</code>.</p>
        <h3>&ldquo;This passport already verified a different account&rdquo;</h3>
        <p>Working as intended. For a demo, run <code>/reset</code> first.</p>
      </main>

      <Colophon />
    </div>
  );
}
