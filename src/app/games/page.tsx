import Link from 'next/link';

export default function GamesPage() {
  return <main className="shell page"><Link href="/" className="back">← Home</Link><p className="eyebrow">GAME LOBBY</p><h1>Games are being prepared.</h1><p className="lead">The first playable vertical slice will be Crash in demo mode, followed by Dice, Mines, Plinko, and Wheel. Each game will ship with its rules, mathematical model, history, and verification flow.</p><div className="notice"><strong>Coming in the first release</strong><ul><li>Server-authoritative demo rounds</li><li>Transparent RTP and house-edge configuration</li><li>Round history and fairness verification</li><li>Responsive animations with reduced-motion support</li></ul></div></main>;
}
