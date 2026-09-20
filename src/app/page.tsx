import Link from 'next/link';

const games = [
  { name: 'Crash', category: 'Multiplier', icon: '🚀', status: 'Coming next' },
  { name: 'Dice', category: 'Instant', icon: '🎲', status: 'Coming next' },
  { name: 'Mines', category: 'Instant', icon: '💎', status: 'Coming next' },
  { name: 'Plinko', category: 'Arcade', icon: '🔵', status: 'Coming next' },
  { name: 'Wheel', category: 'Instant', icon: '🎡', status: 'Coming next' },
  { name: 'Roulette', category: 'Table', icon: '🎰', status: 'Planned' },
];

export default function HomePage() {
  return (
    <main>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">FAIR PLAY · CLEAR MATH · SMOOTH UX</p>
          <h1>Play the moment.<br /><span>Verify every round.</span></h1>
          <p className="hero-text">A modern games platform built around transparent mathematics, server-authoritative rounds, and a clean experience on every screen.</p>
          <div className="actions"><Link className="button primary" href="/games">Explore games</Link><Link className="button secondary" href="/fairness">How fairness works</Link></div>
          <div className="stats"><div><strong>100%</strong><small>server-authoritative</small></div><div><strong>24/7</strong><small>round history</small></div><div><strong>1</strong><small>fairness promise</small></div></div>
        </div>
        <div className="hero-card"><div className="orb">✦</div><p className="card-label">NEXT ROUND</p><strong className="card-value">Demo mode</strong><div className="card-line"><span>Fairness seed</span><b>Ready to verify</b></div><div className="card-line"><span>Game engine</span><b className="green">Online</b></div></div>
      </section>
      <section className="shell section"><div className="section-heading"><div><p className="eyebrow">GAME LOBBY</p><h2>Start with your favourite</h2></div><Link href="/games" className="text-link">View all games →</Link></div><div className="game-grid">{games.map((game) => <article className="game-card" key={game.name}><div className="game-icon">{game.icon}</div><div><p className="game-category">{game.category}</p><h3>{game.name}</h3><span className="status">{game.status}</span></div></article>)}</div></section>
      <section className="shell trust"><div><p className="eyebrow">BUILT DIFFERENTLY</p><h2>Animation shows the result.<br />It never decides it.</h2></div><p>Every game outcome is resolved on the server using a versioned model. The interface only presents authoritative round events, so a dropped connection or a refresh cannot change the result.</p></section>
    </main>
  );
}
