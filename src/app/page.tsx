import Link from 'next/link';
import { Masthead, Colophon, INVITE_URL } from '@/components/Chrome';

// ICAO 9303 specimen passport (the fictional state of Utopia).
// Segments either stay visible, get blacked out, or get replaced by what the proof shows.
type Segment = [text: string, kind?: 'keep' | 'proved'];
const MRZ: Segment[][] = [
  [['P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<']],
  [['L898902C36'], ['UTO', 'keep'], ['740812', 'proved'], ['2F1204159ZE184226B<<<<<10']],
];

function Mrz() {
  let i = 0;
  return (
    <figure className="mrz">
      <p className="mrz-label">Your member&apos;s phone reads</p>
      <div className="mrz-lines">
        {MRZ.map((line, n) => (
          <div key={n}>{line.map(([text]) => text).join('')}</div>
        ))}
      </div>
      <p className="mrz-label">Your server gets</p>
      <div
        className="mrz-lines"
        role="img"
        aria-label="The same lines with everything blacked out except the nationality, UTO, and a mark showing the holder is 18 or older."
      >
        {MRZ.map((line, n) => (
          <div key={n} aria-hidden="true">
            {line.map(([text, kind]) => (
              <span key={text} className={kind ?? 'hide'} style={{ '--i': i++ } as React.CSSProperties}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
      <figcaption>
        The machine-readable lines from a specimen passport. Nationality and a proof of being 18 or older reach
        your server. Everything else stays on the phone.
      </figcaption>
    </figure>
  );
}

export default function Home() {
  return (
    <div className="page">
      <Masthead />

      <main>
        <h1>Verify members by passport. See only what you need.</h1>
        <p className="lede">
          ZKCord gives Discord roles based on age and nationality. Members scan their passport with the
          ZKPassport app, and your server gets a cryptographic proof instead of a copy of the document.
        </p>
        <div className="actions">
          <a className="button" href={INVITE_URL}>Add to Discord</a>
          <Link className="button secondary" href="/admin-guide">Read the setup guide</Link>
        </div>

        <Mrz />

        <h2>How verification works</h2>
        <ol className="steps">
          <li>
            <h3>A member clicks Start verification in Discord</h3>
            <p className="quiet">They get a private link that only works for their account and expires in 10 minutes.</p>
          </li>
          <li>
            <h3>Their phone reads the passport chip</h3>
            <p className="quiet">
              The ZKPassport app checks the government signature on the chip and builds a proof of only the facts
              your server asks for.
            </p>
          </li>
          <li>
            <h3>ZKCord checks the proof and gives roles</h3>
            <p className="quiet">
              The proof is verified again on our server, so a modified app can&apos;t fake it. Roles appear in
              Discord a few seconds later.
            </p>
          </li>
        </ol>

        <h2>What your server learns</h2>
        <div className="ledger">
          <div>
            <h3>Shared</h3>
            <ul>
              <li>Holder is 18 or older</li>
              <li>Nationality</li>
              <li>Gender marker, only if you set up gender roles</li>
              <li>Whether this passport already verified another account here</li>
            </ul>
          </div>
          <div className="withheld">
            <h3>Never shared</h3>
            <ul>
              <li>Name</li>
              <li>Date of birth</li>
              <li>Passport number</li>
              <li>Photo</li>
            </ul>
          </div>
        </div>

        <h2>One passport, one account</h2>
        <div className="prose">
          <p>
            Each proof carries an identifier that is the same every time a passport verifies with ZKCord, but
            can&apos;t be traced back to the passport. If someone tries to verify a second Discord account with
            the same passport, ZKCord refuses.
          </p>
          <p>
            Passports from sanctioned countries and expired passports can&apos;t verify.
          </p>
        </div>

        <h2>For members</h2>
        <div className="prose">
          <p>
            You need a passport with a chip (look for the chip symbol on the cover) and the free ZKPassport app.
          </p>
          <div className="actions">
            <a className="button secondary small" href="https://apps.apple.com/us/app/zkpassport/id6477371975">ZKPassport for iPhone</a>
            <a className="button secondary small" href="https://play.google.com/store/apps/details?id=app.zkpassport.zkpassport">ZKPassport for Android</a>
          </div>
        </div>
      </main>

      <Colophon />
    </div>
  );
}
