import { NextRequest, NextResponse } from 'next/server';
import { getNonce } from '@/lib/nonce-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const nonce = req.nextUrl.searchParams.get('nonce');

    if (!nonce) {
        return NextResponse.json({ error: 'Missing nonce parameter' }, { status: 400 });
    }

    try {
        const nonceData = await getNonce(nonce);

        if (!nonceData) {
            return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 404 });
        }

        // Only return non-sensitive info (username, not userId)
        return NextResponse.json({
            username: nonceData.username || 'Unknown User',
            valid: true,
        });
    } catch (error) {
        console.error('Error fetching nonce info:', error);
        return NextResponse.json({ error: 'Failed to fetch nonce info' }, { status: 500 });
    }
}
