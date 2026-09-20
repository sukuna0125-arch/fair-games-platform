import { createHash, createHmac } from 'node:crypto';

export function verifyCrashOutcome(serverSeed: string, clientSeed: string, nonce: number) {
  const seedHash = createHash('sha256').update(serverSeed).digest('hex');
  const digest = createHmac('sha256', serverSeed).update(`${clientSeed}:${nonce}`).digest('hex');
  const value = Number.parseInt(digest.slice(0, 13), 16);
  const unit = value / 0x1fffffffffffff;
  const multiplier = Math.min(1000, Number(Math.max(1.01, 1 / Math.max(0.000001, 1 - unit)).toFixed(2)));
  return { seedHash, multiplier, crashed: multiplier >= 2 };
}
