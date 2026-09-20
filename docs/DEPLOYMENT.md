# Fair Games — demo deployment

This repository currently runs a non-cash demo-credit platform. Deposits, withdrawals, and live payment gateways are disabled.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run typecheck
npm run build
npm run dev
```

Set the Supabase URL and anon key in `.env.local`. The service-role key is server-only and must never be prefixed with `NEXT_PUBLIC_`.

## Supabase migration order

Run these files in order in the Supabase SQL editor or through the Supabase CLI:

1. `supabase/migrations/0001_core_schema.sql`
2. `supabase/migrations/0002_auth_bootstrap.sql`
3. `supabase/migrations/0003_demo_wallet_and_crash.sql`
4. `supabase/migrations/0004_admin_roles_and_indexes.sql`

After creating your account, assign an operator role only to an approved account:

```sql
insert into public.admin_roles (user_id, role)
values ('YOUR_AUTH_USER_UUID', 'super_admin');
```

## Routes

- `/login` and `/signup` — Supabase email authentication
- `/dashboard` — authenticated demo wallet and lobby
- `/crash` — server-settled demo round
- `/rounds` — authenticated round history
- `/fairness` — verification explanation
- `/admin` — assigned admin roles only
- `/api/fairness/verify` — deterministic result verification
- `/api/payments/status` — confirms payments remain disabled

## Vercel

Add the variables from `.env.example` to the appropriate Vercel environment. Keep `SUPABASE_SERVICE_ROLE_KEY` available only to server-side functions. Do not add gateway credentials: live payments are not implemented or enabled.

Before promoting a deployment, run:

```bash
npm run typecheck
npm run build
```

Then smoke-test `/api/health`, `/api/payments/status`, sign-up, sign-in, demo credit, one crash round, round history, and logout.
