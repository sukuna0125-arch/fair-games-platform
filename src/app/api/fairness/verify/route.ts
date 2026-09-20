import { NextResponse } from 'next/server';
import { verifyCrashOutcome } from '@/lib/game/verify';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { serverSeed?: unknown; clientSeed?: unknown; nonce?: unknown } | null;
  const serverSeed = typeof body?.serverSeed === 'string' ? body.serverSeed : '';
  const clientSeed = typeof body?.clientSeed === 'string' ? body.clientSeed : '';
  const nonce = Number(body?.nonce);

  if (!serverSeed || !clientSeed || !Number.isSafeInteger(nonce) || nonce < 0) {
    return NextResponse.json({ error: 'invalid_verification_input' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, ...verifyCrashOutcome(serverSeed, clientSeed, nonce) });
}
