create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  username text unique,
  country text,
  referral_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.game_versions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game_catalog(id) on delete cascade,
  version integer not null,
  rtp_bps integer not null check (rtp_bps between 0 and 10000),
  house_edge_bps integer not null check (house_edge_bps between 0 and 10000),
  min_bet_minor bigint not null default 0 check (min_bet_minor >= 0),
  max_bet_minor bigint not null default 0 check (max_bet_minor >= 0),
  currency text not null default 'USD',
  status text not null default 'draft' check (status in ('draft', 'published', 'paused', 'retired')),
  math_model_version text not null default 'v1',
  rng_algorithm_version text not null default 'v1',
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  unique (game_id, version)
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  balance_minor bigint not null default 0 check (balance_minor >= 0),
  currency text not null default 'USD',
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_type text not null check (entry_type in ('credit', 'debit', 'bonus', 'withdrawal', 'refund', 'adjustment', 'reward')),
  amount_minor bigint not null check (amount_minor != 0),
  balance_after_minor bigint not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.game_rounds (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.game_catalog(id),
  game_version_id uuid not null references public.game_versions(id),
  user_id uuid not null references auth.users(id),
  round_status text not null default 'created' check (round_status in ('created', 'pending', 'resolved', 'settled', 'failed', 'cancelled')),
  bet_minor bigint not null check (bet_minor > 0),
  payout_minor bigint not null default 0 check (payout_minor >= 0),
  outcome_json jsonb not null default '{}'::jsonb,
  seed_hash text,
  server_seed text,
  client_seed text,
  nonce bigint,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  settled_at timestamptz
);

create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  round_id uuid not null unique references public.game_rounds(id) on delete cascade,
  game_id uuid not null references public.game_catalog(id),
  game_version_id uuid not null references public.game_versions(id),
  amount_minor bigint not null check (amount_minor > 0),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'settled', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.referral_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  reward_amount_minor bigint not null check (reward_amount_minor > 0),
  qualification_event text not null check (qualification_event in ('signup', 'profile_verified', 'demo_activity')),
  qualification_value bigint not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'active', 'paused', 'expired')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique references auth.users(id) on delete cascade,
  code text not null unique,
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
  attributed_at timestamptz not null default now()
);

create table if not exists public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  attribution_id uuid not null references public.referral_attributions(id),
  campaign_id uuid not null references public.referral_campaigns(id),
  recipient_user_id uuid not null references auth.users(id),
  amount_minor bigint not null check (amount_minor > 0),
  status text not null default 'pending' check (status in ('pending', 'held', 'approved', 'rejected', 'posted')),
  qualification_snapshot jsonb not null default '{}'::jsonb,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  ledger_entry_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid,
  actor_user_id uuid references auth.users(id),
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_game_versions_game on public.game_versions(game_id);
create index if not exists idx_wallet_ledger_user on public.wallet_ledger(user_id, created_at desc);
create index if not exists idx_game_rounds_user on public.game_rounds(user_id, created_at desc);
create index if not exists idx_referral_rewards_status on public.referral_rewards(status, created_at desc);

alter table public.profiles enable row level security;
alter table public.game_catalog enable row level security;
alter table public.game_versions enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.game_rounds enable row level security;
alter table public.bets enable row level security;
alter table public.referral_campaigns enable row level security;
alter table public.referral_codes enable row level security;
alter table public.referral_attributions enable row level security;
alter table public.referral_rewards enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles are visible to owner" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles can be updated by owner" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "wallets are visible to owner" on public.wallets
  for select using (auth.uid() = user_id);

create policy "wallet ledger visible to owner" on public.wallet_ledger
  for select using (auth.uid() = user_id);

create policy "game catalog readable by everyone" on public.game_catalog
  for select using (true);

create policy "game versions readable by everyone" on public.game_versions
  for select using (true);

create policy "rounds readable by owner" on public.game_rounds
  for select using (auth.uid() = user_id);

create policy "bets readable by owner" on public.bets
  for select using (auth.uid() = user_id);

create policy "referral codes readable by owner" on public.referral_codes
  for select using (auth.uid() = owner_user_id);

create policy "referral attribution readable by party" on public.referral_attributions
  for select using (auth.uid() = referrer_user_id or auth.uid() = referred_user_id);

create policy "referral rewards readable by recipient" on public.referral_rewards
  for select using (auth.uid() = recipient_user_id);

create trigger handle_profile_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger handle_wallet_updated_at
before update on public.wallets
for each row execute procedure public.set_updated_at();
