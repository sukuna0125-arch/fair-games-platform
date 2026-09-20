create extension if not exists pgcrypto;

create table if not exists public.referral_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  reward_amount_minor bigint not null check (reward_amount_minor >= 0),
  referred_reward_amount_minor bigint not null default 0 check (referred_reward_amount_minor >= 0),
  qualification_event text not null check (qualification_event in ('signup', 'profile_verified', 'demo_activity')),
  qualification_value bigint not null default 0 check (qualification_value >= 0),
  max_rewards_per_referrer integer not null default 20 check (max_rewards_per_referrer > 0),
  pending_days integer not null default 7 check (pending_days >= 0),
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'active', 'paused', 'expired')),
  version integer not null default 1,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique references auth.users(id) on delete cascade,
  code text not null unique check (code = upper(code) and length(code) between 6 and 32),
  created_at timestamptz not null default now(),
  disabled_at timestamptz
);

create table if not exists public.referral_attributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.referral_campaigns(id),
  referral_code_id uuid not null references public.referral_codes(id),
  referrer_user_id uuid not null references auth.users(id),
  referred_user_id uuid not null unique references auth.users(id) on delete cascade,
  source text,
  attributed_at timestamptz not null default now(),
  check (referrer_user_id <> referred_user_id)
);

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  attribution_id uuid not null references public.referral_attributions(id),
  campaign_id uuid not null references public.referral_campaigns(id),
  recipient_user_id uuid not null references auth.users(id),
  amount_minor bigint not null check (amount_minor > 0),
  status text not null default 'pending' check (status in ('pending', 'held', 'approved', 'rejected', 'posted')),
  qualification_snapshot jsonb not null default '{}'::jsonb,
  ledger_entry_id uuid,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  posted_at timestamptz
);

create table if not exists public.referral_risk_events (
  id uuid primary key default gen_random_uuid(),
  attribution_id uuid references public.referral_attributions(id),
  reward_id uuid references public.referral_rewards(id),
  event_type text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  evidence jsonb not null default '{}'::jsonb,
  decision text check (decision in ('open', 'cleared', 'held', 'rejected')),
  reviewed_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists referral_attributions_referrer_idx on public.referral_attributions(referrer_user_id);
create index if not exists referral_rewards_recipient_status_idx on public.referral_rewards(recipient_user_id, status);
create index if not exists referral_risk_events_decision_idx on public.referral_risk_events(decision);

alter table public.referral_campaigns enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referral_attributions enable row level security;
alter table public.referral_rewards enable row level security;
alter table public.referral_risk_events enable row level security;

create policy "users can read their own referral code"
  on public.referral_codes for select
  using (owner_user_id = auth.uid());

create policy "users can read their own referral relationships"
  on public.referral_attributions for select
  using (referrer_user_id = auth.uid() or referred_user_id = auth.uid());

create policy "users can read their own referral rewards"
  on public.referral_rewards for select
  using (recipient_user_id = auth.uid());

-- Inserts, reward transitions, risk decisions, and campaign changes must go
-- through server-side functions with explicit authorization and audit events.
