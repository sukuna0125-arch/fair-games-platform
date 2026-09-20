import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceSupabaseClient } from '@/lib/supabase/service';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const service = createServiceSupabaseClient();
  const { data, error } = await service.rpc('get_demo_wallet', { p_user_id: user.id });

  if (error) return NextResponse.json({ error: 'wallet_unavailable' }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null) as { amountMinor?: unknown } | null;
  const amountMinor = Number(body?.amountMinor);

  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0 || amountMinor > 100000) {
    return NextResponse.json({ error: 'invalid_demo_amount' }, { status: 400 });
  }

  const service = createServiceSupabaseClient();
  const { data, error } = await service.rpc('credit_demo_wallet', {
    p_user_id: user.id,
    p_amount_minor: amountMinor,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
