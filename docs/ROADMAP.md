# Delivery roadmap

## Definition of ready

A phase may start only when its inputs, acceptance criteria, and rollback approach are documented. A game may start implementation only when its mathematical model and UX states are approved.

## Definition of done for a game

- [ ] Game rules written in plain language
- [ ] Theoretical RTP and house edge calculated
- [ ] Math model version recorded
- [ ] Server-side outcome implementation complete
- [ ] Payout and boundary tests complete
- [ ] Simulation report generated
- [ ] Bet limits configured
- [ ] Round and settlement audit records complete
- [ ] Reconnect/idempotency behaviour tested
- [ ] Desktop and mobile UI complete
- [ ] Reduced-motion animation path complete
- [ ] Admin metadata and permissions complete
- [ ] Original/licensed visual assets confirmed
- [ ] QA sign-off recorded

## First implementation order

1. Repository conventions and environment files
2. Supabase migrations and RLS
3. Authentication and role guard
4. Wallet ledger and demo-credit service
5. Game configuration/version model
6. Round and settlement service
7. Fairness commit-reveal service
8. Crash game vertical slice
9. Shared animation/game shell
10. Dice, Limbo, Mines, Plinko, and Wheel
11. Lobby, history, and verification pages
12. Admin console and audit log
13. Remaining games in batches

## Suggested milestones

### Milestone A — Connected shell

Deliver a Vercel preview with Supabase auth, theme, protected dashboard, and health check.

### Milestone B — Safe moneyless core

Deliver demo credits, append-only ledger, round lifecycle, and admin read-only views. Keep real-money payment code out of this milestone.

### Milestone C — Crash vertical slice

Deliver one complete game from bet validation through animation, result, settlement, history, and verification.

### Milestone D — Game framework

Make the next games mostly configuration and isolated model implementations rather than copied bespoke logic.

### Milestone E — Operations

Deliver RBAC, game version publishing, limits, audit exports, alerts, and support tooling.

### Milestone F — Portfolio expansion

Add games in tested batches of five to ten. Do not enable an unfinished game in production.

## Non-negotiable quality gates

- No client-side balance mutation
- No client-side outcome generation
- No direct production database edits
- No changing an active round's model
- No payout without a corresponding ledger event
- No settlement without idempotency protection
- No admin action without an audit event
- No game release without simulation evidence
