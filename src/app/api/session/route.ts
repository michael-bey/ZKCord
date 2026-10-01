import { NextRequest, NextResponse } from 'next/server';
import { getRoleRules, getSession } from '@/lib/store';

export const dynamic = 'force-dynamic';

/** What the verify page needs before it builds the passport request. */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  const session = id ? await getSession(id) : null;
  if (!session) {
    return NextResponse.json({ error: 'This link has expired. Run /verify in Discord for a new one.' }, { status: 404 });
  }

  const rules = await getRoleRules(session.guildId);
  return NextResponse.json({
    username: session.username,
    // Only ask the passport for gender when the server actually hands out gender roles.
    askGender: Object.keys(rules).some((rule) => rule.startsWith('gender:')),
  });
}
