import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'fair-games-platform',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
