import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createServiceSupabaseClient } from '@/lib/supabase/service';
import type { AdminRole } from '@/lib/admin/audit';

const permissions: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  finance_admin: ['read_wallets', 'approve_rewards', 'export_audit'],
  risk_admin: ['read_risk_events', 'hold_rewards', 'reject_rewards'],
  support_admin: ['read_profiles', 'read_rounds', 'open_tickets'],
};

function can(role: AdminRole, permission: string) {
  return permissions[role]?.includes('*') || permissions[role]?.includes(permission);
}

async function getAdmin() {
  const auth = await createServerSupabaseClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) return { user: null, role: null, service: null };

  const service = createServiceSupabaseClient();
  const { data } = await service.from('admin_roles').select('role').eq('user_id', user.id).maybeSingle();
  return { user, role: (data?.role ?? null) as AdminRole | null, service };
}

export async function GET() {
  try {
    const { user, role, service } = await getAdmin();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    if (!role) return NextResponse.json({ error: 'admin_role_required' }, { status: 403 });

    const [{ data: rewards }, { data: riskEvents }, { data: rounds }] = await Promise.all([
      can(role, 'approve_rewards') || can(role, 'reject_rewards')
        ? service!.from('referral_rewards').select('id, recipient_user_id, amount_minor, status, created_at').in('status', ['pending', 'held']).order('created_at', { ascending: false }).limit(50)
        : Promise.resolve({ data: [] }),
      can(role, 'read_risk_events')
        ? service!.from('audit_events').select('id, action, metadata, created_at').ilike('action', '%risk%').order('created_at', { ascending: false }).limit(50)
        : Promise.resolve({ data: [] }),
      can(role, 'read_rounds')
        ? service!.from('game_rounds').select('id, user_id, round_status, bet_minor, payout_minor, created_at').order('created_at', { ascending: false }).limit(50)
        : Promise.resolve({ data: [] }),
    ]);

    return NextResponse.json({ role, rewards: rewards ?? [], riskEvents: riskEvents ?? [], rounds: rounds ?? [] });
  } catch {
    return NextResponse.json({ error: 'admin_unavailable' }, { status: 500 });
  }
}
