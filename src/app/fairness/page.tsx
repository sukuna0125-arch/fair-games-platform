import Link from 'next/link';

export default function FairnessPage() {
  return (
    <main className="shell page">
      <Link href="/" className="back">← Home</Link>
      <p className="eyebrow">TRANSPARENCY</p>
      <h1>Fairness by design.</h1>
      <p className="lead">Crash outcomes are resolved server-side with HMAC-SHA256. The server publishes a hash before settlement, and the revealed seed can be independently verified.</p>
      <div className="steps">
        <div><b>01 · Commit</b><h3>Seed hash</h3><p>A SHA-256 hash commits the server seed before the round result is recorded.</p></div>
        <div><b>02 · Resolve</b><h3>Deterministic result</h3><p>The server combines the server seed, client seed, and nonce to produce the multiplier.</p></div>
        <div><b>03 · Verify</b><h3>Public check</h3><p>Use the recorded values to reproduce the hash and multiplier without trusting the client.</p></div>
      </div>
      <div className="notice"><strong>Demo mode only.</strong><p>This platform uses non-cash demo credits. Payment and withdrawal functionality is disabled.</p></div>
    </main>
  );
}
