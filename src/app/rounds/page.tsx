import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import styles from './rounds.module.css';

type Outcome = { multiplier?: number; crashed?: boolean };

export default async function RoundsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: rounds } = await supabase
    .from('game_rounds')
    .select('id, round_status, bet_minor, payout_minor, outcome_json, seed_hash, created_at, settled_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <main className="shell page">
      <Link href="/dashboard" className="back">← Dashboard</Link>
      <p className="eyebrow">ROUND HISTORY</p>
      <h1>Auditable rounds.</h1>
      <div className={`panel ${styles.tablePanel}`}>
        <div className={styles.roundList}>
          {(rounds ?? []).length === 0 && <p className="muted">No rounds yet. Start with the Crash demo.</p>}
          {(rounds ?? []).map((round) => {
            const outcome = (round.outcome_json ?? {}) as Outcome;
            return (
              <div className={styles.roundRow} key={round.id}>
                <div><strong>{outcome.multiplier ? `${outcome.multiplier}×` : '—'}</strong><span>{round.round_status} · {new Date(round.created_at).toLocaleString()}</span></div>
                <div><b>{Number(round.payout_minor).toLocaleString()}</b><small>payout</small></div>
                <code>{round.seed_hash?.slice(0, 12) ?? '—'}…</code>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
