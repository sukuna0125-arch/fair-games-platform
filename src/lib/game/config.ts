export type GameModelConfig = {
  minBetMinor: number;
  maxBetMinor: number;
  rtpBps: number;
  houseEdgeBps: number;
};

export const gameConfigBySlug: Record<string, GameModelConfig> = {
  crash: {
    minBetMinor: 10,
    maxBetMinor: 10000,
    rtpBps: 9650,
    houseEdgeBps: 350,
  },
  dice: {
    minBetMinor: 10,
    maxBetMinor: 5000,
    rtpBps: 9600,
    houseEdgeBps: 400,
  },
  mines: {
    minBetMinor: 10,
    maxBetMinor: 4000,
    rtpBps: 9700,
    houseEdgeBps: 300,
  },
  plinko: {
    minBetMinor: 10,
    maxBetMinor: 3000,
    rtpBps: 9680,
    houseEdgeBps: 320,
  },
  wheel: {
    minBetMinor: 10,
    maxBetMinor: 6000,
    rtpBps: 9620,
    houseEdgeBps: 380,
  },
};

export function assertGameConfigValid(config: GameModelConfig) {
  if (config.minBetMinor <= 0) {
    throw new Error('minBetMinor must be positive');
  }
  if (config.maxBetMinor < config.minBetMinor) {
    throw new Error('maxBetMinor cannot be smaller than minBetMinor');
  }
  if (config.rtpBps + config.houseEdgeBps !== 10000) {
    throw new Error('RTP and house edge values must sum to 10000 basis points');
  }
}
