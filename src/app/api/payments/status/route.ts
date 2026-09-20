import { NextResponse } from 'next/server';
import { getPaymentCapability } from '@/lib/payments/capability';

export async function GET() {
  const capability = getPaymentCapability();
  return NextResponse.json({
    deposits: capability.enabled,
    withdrawals: capability.enabled,
    mode: capability.mode,
    provider: capability.provider,
  });
}
