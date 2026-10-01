import type { Metadata } from 'next';
import { Colophon, Masthead } from '@/components/Chrome';

export const metadata: Metadata = { title: 'ZKCord terms' };

export default function Terms() {
  return (
    <div className="page">
      <Masthead />
      <main className="prose">
        <h1>Terms</h1>
        <p className="lede">Last updated 30 September 2026.</p>

        <h2>Using ZKCord</h2>
        <p>
          ZKCord is provided as is, without warranty. It can be unavailable, and verification can fail. Don&apos;t
          rely on it as your only safeguard where the law requires age or identity checks.
        </p>

        <h2>Members</h2>
        <p>
          Only verify with your own passport. Trying to verify with someone else&apos;s document, or to get around
          the one-passport-per-account rule, can get your roles removed.
        </p>

        <h2>Server admins</h2>
        <p>
          You decide which roles ZKCord gives and what they unlock. You are responsible for following Discord&apos;s
          terms and the laws that apply to your community.
        </p>

        <h2>Changes</h2>
        <p>These terms may change. The date above shows when they last did.</p>
      </main>
      <Colophon />
    </div>
  );
}
