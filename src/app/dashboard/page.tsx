import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import { featuredGames } from '@/lib/domain';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: wallet }, { count: referralCount }] = await Promise.all([
    supabase.from('wallets').select('balance_minor, currency').eq('user_id', user.id).maybeSingle(),
    supabase.from('referral_attributions').select('id', { count: 'exact', head: true }).eq('referrer_user_id', user.id),
  ]);

  const name = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Player';
  return (
    <main className="shell page dashboard-page">
      <div className="topbar-row"><div><p className="eyebrow">PLAYER DASHBOARD</p><h1>Welcome, {name}.</h1></div><Link href="/" className="button secondary">Back to home</Link></div>
      <div className="stats-grid"><div className="metric-card"><p>Wallet</p><strong>{Number(wallet?.balance_minor ?? 0).toLocaleString()}</strong><span>{wallet?.currency ?? 'USD'} demo credits</span></div><div className="metric-card"><p>Active rounds</p><strong>—</strong><span>Round activity coming soon</span></div><div className="metric-card"><p>Referrals</p><strong>{referralCount ?? 0}</strong><span>Attributed accounts</span></div><div className="metric-card"><p>Fairness</p><strong>Ready</strong><span>Verification available</span></div></div>
      <div className="dashboard-panels"><section className="panel"><div className="panel-head"><h2>Game lobby</h2><Link href="/games" className="text-link">Open lobby →</Link></div><div className="game-grid compact-grid">{featuredGames.map((game) => <GameCard key={game.name} {...game} />)}</div></section><aside className="panel side-panel"><div className="panel-head"><h2>Quick actions</h2></div><div className="quick-list"><Link href="/crash">Crash demo</Link><Link href="/referrals">Referral centre</Link><Link href="/profile">Profile</Link><Link href="/fairness">Fairness rules</Link><Link href="/admin">Admin</Link></div></aside></div>
    </main>
  );
}
