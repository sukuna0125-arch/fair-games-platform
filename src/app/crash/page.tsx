'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Wallet = { balanceMinor: number; currency: string };
type CrashResult = {
  ok?: boolean;
  roundId?: string;
  multiplier?: number;
  crashed?: boolean;
  payoutMinor?: number;
  finalBalance?: number;
  seedHash?: string;
  serverSeed?: string;
  clientSeed?: string;
  nonce?: number;
  error?: string;
};

export default function CrashPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [betMinor, setBetMinor] = useState(50);
  const [result, setResult] = useState<CrashResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function loadWallet() {
    const response = await fetch('/api/wallet', { cache: 'no-store' });
    if (response.ok) setWallet(await response.json());
  }

  async function addDemoCredit() {
    setMessage('');
    const response = await fetch('/api/wallet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountMinor: 500 }),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error ?? 'Unable to add demo credit.');
    setMessage('500 demo credits added.');
    await loadWallet();
  }

  async function placeBet() {
    setBusy(true);
    setMessage('');
    setResult(null);
    const response = await fetch('/api/game/crash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betMinor, clientSeed: crypto.randomUUID() }),
    });
    const data = await response.json();
    setResult(data);
    if (!response.ok) setMessage(data.error ?? 'Round could not be settled.');
    await loadWallet();
    setBusy(false);
  }

  useEffect(() => { void loadWallet(); }, []);

  return (
    <main className="shell page">
      <Link href="/dashboard" className="back">← Dashboard</Link>
      <p className="eyebrow">CRASH · DEMO MODE</p>
      <h1>Transparent multiplier rounds.</h1>
      <p className="lead">The animation is only presentation. The server resolves and records every round.</p>
      <div className="game-layout">
        <section className="panel">
          <div className="crash-stage"><span className="crash-orb">✦</span><strong>{result?.multiplier ? `${result.multiplier}×` : 'Ready'}</strong><small>{result?.crashed ? 'Round crashed' : 'Awaiting round'}</small></div>
          <div className="bet-box">
            <label>Demo bet<input type="number" min={10} max={10000} step={10} value={betMinor} onChange={(event) => setBetMinor(Number(event.target.value))} /></label>
            <div className="button-row"><button className="button primary" disabled={busy} onClick={placeBet}>{busy ? 'Resolving…' : 'Place demo bet'}</button><button className="button secondary" disabled={busy} onClick={addDemoCredit}>Add 500 credits</button></div>
          </div>
          {message && <p className="form-message" role="status">{message}</p>}
          {result?.ok && <div className="result-box"><p>Round settled: <strong>{result.roundId}</strong></p><p>Payout: <strong>{result.payoutMinor?.toLocaleString()} credits</strong></p><p>Seed hash: <code>{result.seedHash}</code></p></div>}
        </section>
        <aside className="panel"><p className="eyebrow">DEMO WALLET</p><p className="wallet-value">{wallet?.balanceMinor?.toLocaleString() ?? '—'}</p><p className="muted">{wallet?.currency ?? 'USD'} credits · non-cash</p><Link href="/fairness" className="text-link">Read fairness rules →</Link></aside>
      </div>
    </main>
  );
}
