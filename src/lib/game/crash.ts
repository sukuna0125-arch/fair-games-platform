export type GameModelConfig = {
  gameId: string;
  version: number;
  rtpBps: number;
  houseEdgeBps: number;
  minBetMinor: number;
  maxBetMinor: number;
  currency: 'USD';
  rngAlgorithm: 'sha256_commit_reveal';
  status: 'draft' | 'published' | 'paused' | 'retired';
};

export type CrashRoundInput = {
  userId: string;
  betMinor: number;
  seedHash: string;
  clientSeed: string;
  serverSeed: string;
  nonce: number;
};

export type CrashRoundResult = {
  roundId: string;
  multiplier: number;
  crashed: boolean;
  payoutMinor: number;
  outcomeJson: {
    multiplier: number;
    crashed: boolean;
    payoutMinor: number;
  };
};

export function calculateCrashMultiplierFromSeed(seed: string, nonce: number): number {
  const hashValue = Array.from(seed + ':' + nonce).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const raw = ((hashValue % 1000000) / 1000000) * 2.5 + 1.01;
  return Number(raw.toFixed(4));
}

export function resolveCrashResult(input: CrashRoundInput): CrashRoundResult {
  const multiplier = calculateCrashMultiplierFromSeed(input.serverSeed + input.clientSeed, input.nonce);
  const crashed = multiplier > 1.7;
  const payoutMinor = crashed ? 0 : Math.round(input.betMinor * multiplier);

  return {
    roundId: `crash_${Date.now()}`,
    multiplier,
    crashed,
    payoutMinor,
    outcomeJson: {
      multiplier,
      crashed,
      payoutMinor,
    },
  };
}

export function getCrashConfig(gameId: string, version: number): GameModelConfig {
  return {
    gameId,
    version,
    rtpBps: 9650,
    houseEdgeBps: 350,
    minBetMinor: 10,
    maxBetMinor: 10000,
    currency: 'USD',
    rngAlgorithm: 'sha256_commit_reveal',
    status: 'published',
  };
}
