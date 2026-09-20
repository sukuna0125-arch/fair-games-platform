import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function ReferralsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from('profiles').select('referral_code').eq('id', user.id).maybeSingle(),
    supabase.from('referral_attributions').select('id', { count: 'exact', head: true }).eq('referrer_user_id', user.id),
  ]);
  return <main className="shell page"><Link href="/dashboard" className="back">← Dashboard</Link><p className="eyebrow">REFERRAL SYSTEM</p><h1>Invite and earn.</h1><div className="panel referral-box"><p className="lead">Share your code and earn demo-credit rewards when an invited account qualifies.</p><div className="referral-code">{profile?.referral_code ?? 'Preparing…'}</div><p className="muted">Attributed accounts: {count ?? 0}</p></div><div className="info-grid"><div className="panel small-panel"><h3>Campaign rules</h3><ul><li>Reward type: demo credit</li><li>Qualification rules are shown before attribution</li><li>Rewards remain pending until review</li></ul></div><div className="panel small-panel"><h3>Protection</h3><ul><li>Self-referrals blocked</li><li>Duplicate attribution prevented</li><li>All rewards use the ledger</li></ul></div></div></main>;
}
