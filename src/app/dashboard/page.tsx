import Link from 'next/link';
import { GameCard } from '@/components/GameCard';
import { featuredGames } from '@/lib/domain';

export default function DashboardPage() {
  return (
    <main className="shell page dashboard-page">
      <div className="topbar-row">
        <div>
          <p className="eyebrow">PLAYER DASHBOARD</p>
          <h1>Welcome back.</h1>
        </div>
        <Link href="/" className="button secondary">Back to home</Link>
      </div>

      <div className="stats-grid">
        <div className="metric-card">
          <p>Wallet</p>
          <strong>5,400</strong>
          <span>Demo credits</span>
        </div>
        <div className="metric-card">
          <p>Active rounds</p>
          <strong>18</strong>
          <span>Last 60 minutes</span>
        </div>
        <div className="metric-card">
          <p>Referrals</p>
          <strong>12</strong>
          <span>Pending review</span>
        </div>
        <div className="metric-card">
          <p>Fairness</p>
          <strong>99.9%</strong>
          <span>Verification ready</span>
        </div>
      </div>

      <div className="dashboard-panels">
        <section className="panel">
          <div className="panel-head">
            <h2>Game lobby</h2>
            <Link href="/games" className="text-link">Open lobby →</Link>
          </div>
          <div className="game-grid compact-grid">
            {featuredGames.map((game) => (
              <GameCard key={game.name} {...game} />
            ))}
          </div>
        </section>

        <aside className="panel side-panel">
          <div className="panel-head">
            <h2>Quick actions</h2>
          </div>
          <div className="quick-list">
            <Link href="/referrals">Referral centre</Link>
            <Link href="/profile">Profile</Link>
            <Link href="/fairness">Fairness rules</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
