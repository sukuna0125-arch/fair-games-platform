import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="shell page">
      <Link href="/dashboard" className="back">← Dashboard</Link>
      <p className="eyebrow">PROFILE</p>
      <h1>Player profile</h1>
      <div className="profile-card panel">
        <div className="avatar">U</div>
        <div>
          <h3>Username</h3>
          <p className="lead">A verified player identity with secure session management and wallet access.</p>
        </div>
      </div>
      <div className="info-grid">
        <div className="panel small-panel">
          <h3>Account</h3>
          <ul>
            <li>Email verified: Yes</li>
            <li>Country: Not set</li>
            <li>2FA: Enabled</li>
          </ul>
        </div>
        <div className="panel small-panel">
          <h3>Limits</h3>
          <ul>
            <li>Daily bet limit: 10,000</li>
            <li>Session loss cap: 2,500</li>
            <li>Responsible play: On</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
