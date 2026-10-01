import { NextRequest, NextResponse } from 'next/server';
import { ZKPassport, type ProofResult, type QueryResult } from '@zkpassport/sdk';
import { APP_URL, DiscordError, addRole } from '@/lib/discord';
import { normalizeCountryCode, regionsFor } from '@/lib/regions';
import { SCOPE, zkcordQuery } from '@/lib/query';
import { claimPassport, consumeSession, getRoleRules, rateLimit } from '@/lib/store';

export const dynamic = 'force-dynamic';

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: NextRequest) {
  const appHost = new URL(APP_URL).host;
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== appHost) return fail('Wrong origin.', 403);

  const { session: sessionId, proofs, queryResult, expiryAfter, askGender } = (await req.json().catch(() => ({}))) as {
    session?: string;
    proofs?: ProofResult[];
    queryResult?: QueryResult;
    expiryAfter?: string;
    askGender?: boolean;
  };
  if (!sessionId || !proofs?.length || !queryResult || !expiryAfter) return fail('Incomplete request.');

  // The expiry cutoff is part of the query, so the browser tells us which one it used.
  // Only accept a recent one, so an old request can't be replayed against an expired passport.
  const cutoff = new Date(expiryAfter);
  const age = Date.now() - cutoff.getTime();
  if (Number.isNaN(age) || age < -5 * 60_000 || age > 24 * 3600_000) return fail('This request is too old. Start again from Discord.');

  const session = await consumeSession(sessionId);
  if (!session) return fail('This link has expired. Run /verify in Discord for a new one.');
  const { userId, guildId } = session;

  const wait = await rateLimit(`verify-proof:${userId}`, 5, 3600);
  if (wait) return fail(`Too many attempts. Try again in ${Math.ceil(wait / 60)} minutes.`, 429);

  // Never trust the browser's verdict: check the proofs here.
  const zkPassport = new ZKPassport(appHost);
  const originalQuery = zkcordQuery(zkPassport.createQuery(), { expiryAfter: cutoff, askGender: !!askGender }).done().query;
  const { verified, uniqueIdentifier, queryResultErrors } = await zkPassport.verify({
    proofs,
    originalQuery,
    queryResult,
    scope: SCOPE,
    writingDirectory: '/tmp',
  });
  if (!verified || !uniqueIdentifier) {
    console.warn('Proof rejected', queryResultErrors);
    return fail("Your proof didn't check out. Try again from Discord.");
  }

  if (queryResult.age?.gte?.result !== true) return fail('You must be 18 or older.');
  if (queryResult.expiry_date?.gte?.result !== true) return fail('Your passport has expired.');
  if (queryResult.nationality?.out?.result !== true) return fail("ZKCord can't verify passports from sanctioned countries.");

  const owner = await claimPassport(guildId, uniqueIdentifier, userId);
  if (owner) return fail('This passport already verified a different account in this server.');

  const country = normalizeCountryCode(String(queryResult.nationality?.disclose?.result ?? ''));
  const gender = queryResult.gender?.disclose?.result;
  const earned = [
    'verified',
    'adult',
    `country:${country}`,
    ...regionsFor(country).map((r) => `region:${r}`),
    ...(gender ? [`gender:${gender}`] : []),
  ];

  const rules = await getRoleRules(guildId);
  const roleIds = [...new Set(earned.map((rule) => rules[rule]).filter(Boolean))];
  if (!roleIds.length) return fail("You're verified, but this server hasn't set up any roles yet. Ask an admin to run /roles.");

  const results = await Promise.allSettled(roleIds.map((roleId) => addRole(guildId, userId, roleId, 'ZKCord verification')));
  const errors = results.flatMap((r) => (r.status === 'rejected' ? [r.reason] : []));
  errors.forEach((e) => console.error('Role grant failed:', e));

  if (errors.length === roleIds.length) {
    const reason = errors[0] instanceof DiscordError ? errors[0].message : 'Discord rejected the request.';
    return fail(`Verified, but no roles could be given. ${reason}`, 502);
  }
  return NextResponse.json({ granted: roleIds.length - errors.length, failed: errors.length });
}
