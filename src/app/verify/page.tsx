'use client';

import '@/lib/buffer-shim'; // Must run before the ZKPassport SDK loads.
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Masthead } from '@/components/Chrome';

type State =
  | { step: 'loading' }
  | { step: 'confirm'; username: string; askGender: boolean }
  | { step: 'scan'; url: string }
  | { step: 'scanned' }
  | { step: 'proving' }
  | { step: 'checking' }
  | { step: 'done'; granted: number; failed: number }
  | { step: 'error'; message: string };

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function Verify() {
  const sessionId = useSearchParams().get('session');
  const [state, setState] = useState<State>({ step: 'loading' });

  useEffect(() => {
    if (!sessionId) {
      setState({ step: 'error', message: 'This link is incomplete. Run /verify in Discord for a new one.' });
      return;
    }
    fetch(`/api/session?id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        const body = await res.json();
        setState(res.ok ? { step: 'confirm', ...body } : { step: 'error', message: body.error });
      })
      .catch(() => setState({ step: 'error', message: "Couldn't reach ZKCord. Check your connection and reload." }));
  }, [sessionId]);

  async function start(askGender: boolean) {
    setState({ step: 'loading' });
    try {
      const { ZKPassport, SANCTIONED_COUNTRIES } = await import('@zkpassport/sdk');
      const zkPassport = new ZKPassport(window.location.host);
      const request = await zkPassport.request({
        name: 'ZKCord',
        logo: `${window.location.origin}/logo.png`,
        purpose: 'Prove your age and nationality to get roles in a Discord server.',
        scope: 'zkcord-verification',
      });

      let query = request
        .gte('age', 18)
        .gte('expiry_date', new Date())
        .out('nationality', SANCTIONED_COUNTRIES)
        .disclose('nationality');
      if (askGender) query = query.disclose('gender');

      const { url, onRequestReceived, onGeneratingProof, onProofGenerated, onReject, onError, onResult } = query.done();
      const proofs: unknown[] = [];

      onRequestReceived(() => setState({ step: 'scanned' }));
      onGeneratingProof(() => setState({ step: 'proving' }));
      onProofGenerated((proof) => proofs.push(proof));
      onReject(() => setState({ step: 'error', message: 'You declined the request in ZKPassport.' }));
      onError((err) => {
        console.error(err);
        setState({ step: 'error', message: 'ZKPassport reported an error. Try again from Discord.' });
      });
      onResult(async ({ verified, result }) => {
        if (!verified) {
          setState({ step: 'error', message: "Your phone couldn't prove the request. Check that your passport hasn't expired." });
          return;
        }
        setState({ step: 'checking' });
        try {
          const res = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: sessionId, proofs, queryResult: result }),
          });
          const body = await res.json();
          setState(res.ok ? { step: 'done', ...body } : { step: 'error', message: body.error });
        } catch {
          setState({ step: 'error', message: "Couldn't reach ZKCord. Run /verify in Discord to try again." });
        }
      });

      setState({ step: 'scan', url });
      if (isMobile()) window.location.href = url;
    } catch (err) {
      console.error(err);
      setState({ step: 'error', message: "ZKPassport didn't load. Reload the page to try again." });
    }
  }

  switch (state.step) {
    case 'loading':
      return <p className="wait">Loading</p>;

    case 'confirm':
      return (
        <>
          <h1>Verify {state.username}</h1>
          <p className="lede">
            This link gives roles to the Discord account <strong>{state.username}</strong>. If that isn&apos;t you,
            close this page.
          </p>
          <p className="quiet notice">
            The server will learn that you&apos;re 18 or older and your nationality
            {state.askGender ? ', plus your passport’s gender marker' : ''}. Not your name, birth date or passport
            number.
          </p>
          <div className="actions">
            <button className="button" onClick={() => start(state.askGender)}>Continue</button>
          </div>
        </>
      );

    case 'scan':
      return (
        <>
          <h1>Scan with ZKPassport</h1>
          <p className="lede">Open the ZKPassport app on your phone and scan this code.</p>
          <div className="qr">
            <QRCodeSVG value={state.url} size={240} level="L" />
          </div>
          <div className="actions">
            <a className="button secondary small" href={state.url}>Open ZKPassport on this device</a>
          </div>
          <p className="quiet notice">
            No app yet? Get it for <a href="https://apps.apple.com/us/app/zkpassport/id6477371975">iPhone</a> or{' '}
            <a href="https://play.google.com/store/apps/details?id=app.zkpassport.zkpassport">Android</a>.
          </p>
        </>
      );

    case 'scanned':
      return (
        <>
          <h1>Continue on your phone</h1>
          <p className="wait">Follow the steps in ZKPassport</p>
        </>
      );

    case 'proving':
      return (
        <>
          <h1>Building your proof</h1>
          <p className="wait">This can take up to a minute</p>
          <p className="quiet notice">Your passport data stays on your phone.</p>
        </>
      );

    case 'checking':
      return (
        <>
          <h1>Checking your proof</h1>
          <p className="wait">Giving you roles in Discord</p>
        </>
      );

    case 'done':
      return (
        <>
          <span className="verified-stamp">Verified</span>
          <h1>You&apos;re verified</h1>
          <p className="lede">
            {state.granted === 1 ? 'Your new role is' : `Your ${state.granted} new roles are`} in Discord now. You can
            close this page.
          </p>
          {state.failed > 0 && (
            <p className="notice bad">
              {state.failed} {state.failed === 1 ? 'role' : 'roles'} couldn&apos;t be given. Ask a server admin to
              check ZKCord&apos;s role position.
            </p>
          )}
        </>
      );

    case 'error':
      return (
        <>
          <h1>Verification didn&apos;t finish</h1>
          <p className="notice bad">{state.message}</p>
        </>
      );
  }
}

export default function VerifyPage() {
  return (
    <div className="verify">
      <Masthead invite={false} />
      <main aria-live="polite">
        <Suspense fallback={<p className="wait">Loading</p>}>
          <Verify />
        </Suspense>
      </main>
    </div>
  );
}
