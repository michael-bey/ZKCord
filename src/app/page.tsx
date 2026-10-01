import Link from 'next/link';
import { Colophon, INVITE_URL, Masthead } from '@/components/Chrome';
import { Mark } from '@/components/Mark';
import './landing.css';

// Rows of a passport data page. Hidden rows get blacked out; the rest become Discord roles.
const DATA_PAGE = [
  { label: 'Name', value: 'Anna Eriksson' },
  { label: 'Date of birth', value: '12.08.1974' },
  { label: 'Passport number', value: 'L898902C3' },
  { label: 'Nationality', role: 'France', color: 'var(--role-green)' },
  { label: 'Age', role: '18+', color: 'var(--role-gold)' },
];

function RolePill({ name, color }: { name: string; color: string }) {
  return (
    <span className="role" style={{ '--role': color } as React.CSSProperties}>
      {name}
    </span>
  );
}

function DataPage() {
  return (
    <>
      <p className="sr-only">
        A passport data page where the name, date of birth and passport number are blacked out. Only the
        nationality, France, and the age, 18 or older, come through, as Discord roles.
      </p>
      <dl className="datapage" aria-hidden="true">
        {DATA_PAGE.map((row, i) => (
          <div key={row.label} className="datapage-row" style={{ '--i': i } as React.CSSProperties}>
            <dt>{row.label}</dt>
            <dd>
              {row.role ? <RolePill name={row.role} color={row.color} /> : <span className="redacted">{row.value}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function DiscordScene() {
  return (
    <div className="scene discord" aria-hidden="true">
      <div className="discord-author">
        <span className="discord-avatar"><Mark size={18} /></span>
        <strong>ZKCord</strong>
        <span className="discord-tag">App</span>
      </div>
      <div className="discord-embed">
        <strong>Verify to get your roles</strong>
        <p>Prove your age and nationality with your passport, without showing it to anyone.</p>
      </div>
      <span className="discord-button">Start verification</span>
    </div>
  );
}

function PhoneScene() {
  return (
    <div className="scene phone" aria-hidden="true">
      <div className="phone-screen">
        <p className="phone-title">ZKCord asks for</p>
        <ul>
          <li className="ok">You are 18 or older</li>
          <li className="ok">Your nationality</li>
          <li className="no">Your name</li>
          <li className="no">Your photo</li>
        </ul>
        <span className="phone-button">Share proof</span>
      </div>
    </div>
  );
}

function ProfileScene() {
  return (
    <div className="scene discord profile" aria-hidden="true">
      <span className="profile-avatar" />
      <strong className="profile-name">anna</strong>
      <p className="profile-label">Roles</p>
      <div className="profile-roles">
        <RolePill name="Verified" color="var(--blurple)" />
        <RolePill name="France" color="var(--role-green)" />
        <RolePill name="18+" color="var(--role-gold)" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="landing">
      <section className="cover">
        <div className="wrap">
          <Masthead />
          <h1 className="cover-title">Discord roles from a passport. Without the passport.</h1>
          <DataPage />
          <div className="actions">
            <a className="button" href={INVITE_URL}>Add to Discord</a>
            <a className="button secondary" href="#how">See how it works</a>
          </div>
        </div>
      </section>

      <section className="how wrap" id="how">
        <h2>Three steps, about a minute</h2>
        <ol className="scenes">
          <li>
            <DiscordScene />
            <h3>Click Start verification in Discord</h3>
            <p>Members get a private link that only works for their account.</p>
          </li>
          <li>
            <PhoneScene />
            <h3>Scan the passport chip in ZKPassport</h3>
            <p>The phone checks the government signature and proves only what the server asks for.</p>
          </li>
          <li>
            <ProfileScene />
            <h3>Roles show up</h3>
            <p>ZKCord checks the proof again on its server, then gives the roles you picked.</p>
          </li>
        </ol>
      </section>

      <section className="statement">
        <div className="wrap">
          <p className="statement-title">One passport. One account.</p>
          <div className="statement-body">
            <p>
              Every proof carries an anonymous identifier that stays the same for the same passport. If someone
              tries to verify a second account in your server with it, ZKCord says no.
            </p>
            <p>Expired passports and passports from sanctioned countries can&apos;t verify.</p>
          </div>
        </div>
      </section>

      <section className="closer wrap">
        <h2 className="closer-title">Add ZKCord to your server.</h2>
        <div className="actions">
          <a className="button" href={INVITE_URL}>Add to Discord</a>
          <Link className="button secondary" href="/admin-guide">Read the setup guide</Link>
        </div>
        <p className="quiet closer-note">
          Members need a chipped passport and the free ZKPassport app for{' '}
          <a href="https://apps.apple.com/us/app/zkpassport/id6477371975">iPhone</a> or{' '}
          <a href="https://play.google.com/store/apps/details?id=app.zkpassport.zkpassport">Android</a>.
        </p>
        <Colophon />
      </section>
    </div>
  );
}
