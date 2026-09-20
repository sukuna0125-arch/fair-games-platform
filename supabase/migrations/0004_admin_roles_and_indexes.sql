create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin','finance_admin','risk_admin','support_admin')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

alter table public.admin_roles enable row level security;

create policy "admins can read own role" on public.admin_roles
  for select using (auth.uid() = user_id);

create index if not exists idx_game_rounds_user_created
  on public.game_rounds(user_id, created_at desc);

create index if not exists idx_audit_events_created
  on public.audit_events(created_at desc);
