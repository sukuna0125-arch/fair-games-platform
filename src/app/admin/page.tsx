import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="shell page">
      <Link href="/dashboard" className="back">← Dashboard</Link>
      <p className="eyebrow">ADMIN</p>
      <h1>Operations and controls.</h1>
      <div className="info-grid admin-grid">
        <div className="panel small-panel">
          <h3>Game controls</h3>
          <ul>
            <li>Crash: enabled</li>
            <li>Dice: draft</li>
            <li>Mines: draft</li>
            <li>Roulette: locked</li>
          </ul>
        </div>
        <div className="panel small-panel">
          <h3>Risk review</h3>
          <ul>
            <li>User risk queue: 3</li>
            <li>Reward approvals: 2 pending</li>
            <li>Audit export: ready</li>
          </ul>
        </div>
        <div className="panel small-panel">
          <h3>System health</h3>
          <ul>
            <li>Supabase: connected</li>
            <li>Rounds: live</li>
            <li>Wallet ledger: healthy</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
