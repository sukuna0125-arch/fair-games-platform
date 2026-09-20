import Link from 'next/link';

export default function FairnessPage() {
  return <main className="shell page"><Link href="/" className="back">← Home</Link><p className="eyebrow">TRANSPARENCY</p><h1>Fairness by design.</h1><p className="lead">The game engine, wallet, and animations are separate. A round stores the exact game-version and entropy inputs used to resolve it, so the result can be checked after completion.</p><div className="steps"><div><b>01</b><h3>Commit</h3><p>A server seed hash is committed before a round.</p></div><div><b>02</b><h3>Resolve</h3><p>The server resolves the round with the published model.</p></div><div><b>03</b><h3>Verify</h3><p>The revealed inputs can reproduce the recorded outcome.</p></div></div></main>;
}
