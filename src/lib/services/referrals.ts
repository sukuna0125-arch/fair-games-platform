import type { ReferralStatus } from '@/lib/types';

export type ReferralCampaign = {
  id: string;
  name: string;
  description: string;
  rewardAmountMinor: number;
  qualificationEvent: 'signup' | 'profile_verified' | 'demo_activity';
  qualificationValue: number;
  startsAt: string;
  endsAt?: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'expired';
  maxRewardsPerReferrer: number;
};

export type ReferralRecord = {
  id: string;
  referrerUserId: string;
  referredUserId: string;
  referralCode: string;
  campaignId?: string;
  attributedAt: string;
  status: ReferralStatus;
};

export function generateReferralCode(length = 8): string {
  const pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += pool[Math.floor(Math.random() * pool.length)];
  }
  return code;
}

export function validateReferralEligibility(
  referrerUserId: string,
  referredUserId: string,
  existingReferrals: Array<{ referrerUserId: string; referredUserId: string }>,
): { valid: boolean; reason?: string } {
  if (referrerUserId === referredUserId) {
    return { valid: false, reason: 'self_referral' };
  }

  const alreadyExists = existingReferrals.some(
    (entry) => entry.referrerUserId === referrerUserId && entry.referredUserId === referredUserId,
  );

  if (alreadyExists) {
    return { valid: false, reason: 'duplicate_referral' };
  }

  return { valid: true };
}

export function isReferralCampaignLive(campaign: ReferralCampaign, now = new Date()): boolean {
  const startTime = new Date(campaign.startsAt).getTime();
  const endTime = campaign.endsAt ? new Date(campaign.endsAt).getTime() : Number.POSITIVE_INFINITY;

  return campaign.status === 'active' && now.getTime() >= startTime && now.getTime() <= endTime;
}
