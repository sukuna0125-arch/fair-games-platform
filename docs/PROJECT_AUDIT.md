# Project audit and completion plan

## Current repository state

The repository currently contains product documentation only. It has no Next.js application, package manifest, Supabase migrations, API routes, game models, tests, or Vercel configuration yet. Supabase and Vercel authorization alone does not create those files or expose project secrets to this repository.

## Gaps found

- [ ] Next.js App Router application
- [ ] TypeScript and package scripts
- [ ] Supabase browser/server clients
- [ ] Auth callback and protected routes
- [ ] Database migrations and RLS policies
- [ ] Wallet/ledger domain
- [ ] Game and round domain
- [ ] Fairness commit/reveal implementation
- [ ] Referral domain and abuse controls
- [ ] Admin RBAC and audit log
- [ ] Game UI and animation system
- [ ] Unit, integration, and end-to-end tests
- [ ] CI checks and Vercel deployment configuration
- [ ] Monitoring, rate limits, and operational runbooks

## Build order

1. Create the Next.js shell and strict TypeScript setup.
2. Add Supabase clients and authentication.
3. Apply the initial schema and RLS policies in a development Supabase project.
4. Implement an append-only demo-credit ledger.
5. Implement game configuration, rounds, bets, and idempotent settlement.
6. Implement the fairness verifier and the first complete crash-game vertical slice.
7. Add shared animation states and lobby UX.
8. Add referrals with pending rewards, qualification rules, caps, and fraud review.
9. Add admin RBAC, configuration publishing, and audit exports.
10. Add the remaining games in tested batches.
11. Connect Vercel preview/staging/production environments.
12. Run security, load, accessibility, and recovery checks before any production release.

## Environment boundary

The repository must never contain Supabase service-role keys, Vercel tokens, payment credentials, or other secrets. The owner must provide project URL/key values through local `.env.local` and Vercel Environment Variables. Preview and production should use separate Supabase projects or clearly separated environments.

## Referral completion criteria

- Referral codes are unique, non-guessable, and case-normalized.
- A user can have only one direct referrer.
- Self-referrals, cycles, duplicate devices, suspicious IP clusters, and rapid multi-account patterns are flagged.
- Rewards are pending until the referred account passes the configured qualification rules.
- Rewards are issued through the ledger, never by directly changing a balance.
- Admins can pause campaigns and adjust future campaign versions, but cannot rewrite historical awards.
- Every referral mutation and reward decision is auditable.
- Referral attribution is first-party and does not expose private user data.
