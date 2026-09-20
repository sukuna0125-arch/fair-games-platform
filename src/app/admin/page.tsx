import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: role } = await supabase.from('admin_roles').select('role').eq('user_id', user.id).maybeSingle();
  if (!role) {
    return <main className="shell page"><Link href="/dashboard" className="back">← Dashboard</Link><p className="eyebrow">ADMIN</p><h1>Access restricted.</h1><p className="lead">This area is available only to assigned platform operators.</p></main>;
  }

  return <main className="shell page"><Link href="/dashboard" className="back">← Dashboard</Link><p className="eyebrow">ADMIN · {role.role.toUpperCase()}</p><h1>Operations and controls.</h1><div className="info-grid admin-grid"><div className="panel small-panel"><h3>Game controls</h3><ul><li>Crash: enabled</li><li>Dice: draft</li><li>Mines: draft</li><li>Payments: disabled</li></ul></div><div className="panel small-panel"><h3>Review queue</h3><ul><li>Rewards: API protected</li><li>Risk events: API protected</li><li>Audit trail: enabled</li></ul></div><div className="panel small-panel"><h3>System health</h3><ul><li>Supabase: connected</li><li>Rounds: persisted</li><li>Ledger: atomic RPC</li></ul></div></div><div className="panel admin-link-panel"><Link className="button primary" href="/rounds">Open round history</Link></div></main>;
}
