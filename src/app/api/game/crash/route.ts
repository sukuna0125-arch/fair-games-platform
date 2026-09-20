import { createHash, createHmac, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceSupabaseClient } from '@/lib/supabase/service';

function crashMultiplier(serverSeed: string, clientSeed: string, nonce: number): number {
  const digest = createHmac('sha256', serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest('hex');
  const value = Number.parseInt(digest.slice(0, 13), 16);
  const max = 0x1fffffffffffff;
  const unit = value / max;
  const raw = Math.max(1.01, 1 / Math.max(0.000001, 1 - unit));
  return Math.min(1000, Number(raw.toFixed(2)));
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as { betMinor?: unknown; clientSeed?: unknown } | null;
  const betMinor = Number(body?.betMinor);
  const clientSeed = typeof body?.clientSeed === 'string' && body.clientSeed.length <= 128
    ? body.clientSeed
    : 'default-client-seed';

  if (!Number.isSafeInteger(betMinor) || betMinor < 10 || betMinor > 10000) {
    return NextResponse.json({ error: 'bet_must_be_between_10_and_10000_minor_units' }, { status: 400 });
  }

  const serverSeed = randomBytes(32).toString('hex');
  const nonce = Date.now();
  const multiplier = crashMultiplier(serverSeed, clientSeed, nonce);
  const crashed = multiplier >= 2;
  const payoutMinor = crashed ? 0 : Math.floor(betMinor * multiplier);
  const seedHash = createHash('sha256').update(serverSeed).digest('hex');

  const service = createServiceSupabaseClient();
  const { data, error } = await service.rpc('settle_demo_crash_round', {
    p_user_id: user.id,
    p_bet_minor: betMinor,
    p_payout_minor: payoutMinor,
    p_multiplier: multiplier,
    p_crashed: crashed,
    p_server_seed: serverSeed,
    p_client_seed: clientSeed,
    p_seed_hash: seedHash,
    p_nonce: nonce,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
