import type { LedgerEntry, WalletSnapshot, WalletEntryType, LedgerReason } from '@/lib/types';

export type WalletServiceResult = {
  wallet: WalletSnapshot;
  ledgerEntry: LedgerEntry;
};

export async function ensureWallet(userId: string, currency: 'USD' = 'USD') {
  return {
    walletId: `wallet_${userId}`,
    userId,
    balanceMinor: 0,
    currency,
  } satisfies WalletSnapshot;
}

export async function addWalletCredit(
  wallet: WalletSnapshot,
  amountMinor: number,
  reason: LedgerReason,
  referenceType?: string,
  referenceId?: string,
): Promise<WalletServiceResult> {
  if (amountMinor <= 0) {
    throw new Error('amountMinor must be positive');
  }

  const balanceAfterMinor = wallet.balanceMinor + amountMinor;

  const entry: LedgerEntry = {
    id: `ledger_${Date.now()}`,
    walletId: wallet.walletId,
    userId: wallet.userId,
    entryType: 'credit',
    amountMinor,
    reason,
    referenceType,
    referenceId,
    balanceAfterMinor,
    createdAt: new Date().toISOString(),
  };

  return {
    wallet: {
      ...wallet,
      balanceMinor: balanceAfterMinor,
    },
    ledgerEntry: entry,
  };
}

export async function addWalletDebit(
  wallet: WalletSnapshot,
  amountMinor: number,
  reason: LedgerReason,
  referenceType?: string,
  referenceId?: string,
): Promise<WalletServiceResult> {
  if (amountMinor <= 0) {
    throw new Error('amountMinor must be positive');
  }
  if (wallet.balanceMinor < amountMinor) {
    throw new Error('insufficient balance');
  }

  const balanceAfterMinor = wallet.balanceMinor - amountMinor;

  const entry: LedgerEntry = {
    id: `ledger_${Date.now()}`,
    walletId: wallet.walletId,
    userId: wallet.userId,
    entryType: 'debit',
    amountMinor,
    reason,
    referenceType,
    referenceId,
    balanceAfterMinor,
    createdAt: new Date().toISOString(),
  };

  return {
    wallet: {
      ...wallet,
      balanceMinor: balanceAfterMinor,
    },
    ledgerEntry: entry,
  };
}

export function isSupportedEntryType(value: string): value is WalletEntryType {
  return ['credit', 'debit', 'bonus', 'withdrawal', 'refund', 'adjustment', 'reward'].includes(value);
}
