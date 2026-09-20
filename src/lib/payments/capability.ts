export type PaymentMode = 'disabled' | 'licensed_test' | 'licensed_production';

export type PaymentCapability = {
  enabled: boolean;
  mode: PaymentMode;
  provider: 'none' | string;
};

export function getPaymentCapability(): PaymentCapability {
  const enabled = process.env.PAYMENTS_ENABLED === 'true';
  const mode = (process.env.PAYMENT_MODE ?? 'disabled') as PaymentMode;
  const provider = process.env.PAYMENT_PROVIDER ?? 'none';

  // Production payment activation is intentionally blocked in this foundation.
  // A licensed deployment must add an approved provider adapter and compliance gate.
  return {
    enabled: false,
    mode: mode === 'disabled' ? 'disabled' : mode,
    provider,
  };
}

export function assertPaymentsDisabled(): never {
  throw new Error('Live payments are disabled until the licensed compliance gate is completed.');
}
