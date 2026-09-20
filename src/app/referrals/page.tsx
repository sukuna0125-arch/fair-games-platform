import Link from 'next/link';

export default function ReferralsPage() {
  return (
    <main className="shell page">
      <Link href="/dashboard" className="back">← Dashboard</Link>
      <p className="eyebrow">REFERRAL SYSTEM</p>
      <h1>Invite and earn.</h1>
      <div className="panel referral-box">
        <p className="lead">Share your code and earn pending rewards when the invited user completes the configured qualification criteria.</p>
        <div className="referral-code">FAIR-8Q4M</div>
      </div>
      <div className="info-grid">
        <div className="panel small-panel">
          <h3>Campaign rules</h3>
          <ul>
            <li>Reward type: demo credit</li>
            <li>Qualification: signup + profile verification</li>
            <li>Reward status: pending review</li>
          </ul>
        </div>
        <div className="panel small-panel">
          <h3>Risk controls</h3>
          <ul>
            <li>Self-referral blocked</li>
            <li>Cycle detection active</li>
            <li>Duplicate device checks enabled</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
