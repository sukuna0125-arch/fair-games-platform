export type Currency = 'USD';

export type WalletEntryType =
  | 'credit'
  | 'debit'
  | 'bonus'
  | 'withdrawal'
  | 'refund'
  | 'adjustment'
  | 'reward';

export type LedgerReason =
  | 'signup_bonus'
  | 'demo_credit'
  | 'bet_placed'
  | 'bet_settled'
  | 'referral_reward'
  | 'manual_adjustment'
  | 'refund';

export type WalletSnapshot = {
  walletId: string;
  userId: string;
  balanceMinor: number;
  currency: Currency;
};

export type LedgerEntry = {
  id: string;
  walletId: string;
  userId: string;
  entryType: WalletEntryType;
  amountMinor: number;
  reason: LedgerReason;
  referenceType?: string;
  referenceId?: string;
  balanceAfterMinor: number;
  createdAt: string;
};

export type ReferralStatus = 'pending' | 'held' | 'approved' | 'rejected' | 'posted';

export type RiskLevel = 'low' | 'medium' | 'high';
