# Fair Games Platform

A production-oriented, fair, auditable games platform built with Next.js, Supabase, and Vercel.

## Product direction

The platform will begin with a polished, responsive game lobby and a server-authoritative game engine. Every game will use versioned mathematical models, transparent RTP/house-edge configuration, immutable round records, and independently verifiable outcomes where the game type supports a commit-reveal model.

The initial release is designed to be deployable to Vercel from day one and connected to Supabase for authentication, PostgreSQL data, realtime events, and storage.

## Stack

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Next.js server actions/API routes and Supabase Edge Functions for isolated game operations
- **Data:** Supabase PostgreSQL, Row Level Security, Realtime, Storage
- **Deployment:** Vercel for the web application; Supabase for database/auth/functions
- **Validation:** Zod, TypeScript strict mode, Vitest, Playwright
- **Observability:** structured audit events, error tracking, health checks, and deployment logs

## Product principles

1. The server is authoritative for balances, bets, rounds, outcomes, and settlements.
2. The client only displays state and sends authenticated commands.
3. Game mathematics is versioned, tested, and never changed mid-round.
4. Admin configuration is permissioned, validated, and fully audited.
5. Wallet movement uses an append-only double-entry ledger.
6. Retries are safe through idempotency keys.
7. Animations are presentation only; they never decide outcomes.
8. Original game themes and assets are used, or properly licensed integrations are added.

## Delivery phases

### Phase 0 — Day-1 foundation

**Goal:** a deployable shell that proves Vercel and Supabase connectivity.

- Next.js application shell and responsive layout
- Supabase environment configuration
- Auth callback and protected routes
- Design tokens, dark gaming UI, navigation, loading/error states
- Health-check page for Vercel and Supabase
- CI checks for typecheck, lint, unit tests, and build
- Environment variable documentation

**Exit criteria:** the app deploys on Vercel, users can authenticate, and the dashboard reads a test record from Supabase.

### Phase 1 — Core platform and data model

**Goal:** establish production-safe domain foundations before adding games.

- Users, profiles, roles, permissions, and admin access
- Game catalogue and game-version tables
- Game configuration schema with RTP, edge, limits, currency, and status
- Round lifecycle and immutable round results
- Append-only wallet ledger with balance projections
- Idempotency keys and request audit events
- RLS policies and server-only privileged operations
- Seed data for development and staging

**Exit criteria:** migrations run cleanly, RLS tests pass, and a test user can receive demo credits through an audited ledger transaction.

### Phase 2 — Fair game engine

**Goal:** implement a reusable engine that all games use.

- Authenticated command validation
- Server-side random generation abstraction
- Commit-reveal/provably-fair module for supported games
- Game model interface: validate bet, create round, resolve outcome, calculate payout
- Versioned math configuration
- Settlement worker and retry handling
- Round history and verification endpoint
- Simulation scripts for RTP and house-edge testing

**Exit criteria:** every result is reproducible from its recorded inputs, settlement is idempotent, and simulations match the configured theoretical model.

### Phase 3 — First playable game set

**Goal:** ship a complete, polished vertical slice rather than unfinished 50 games.

1. Crash-style multiplier game with original branding
2. Dice high/low
3. Limbo
4. Mines
5. Plinko
6. Wheel
7. European roulette
8. Blackjack
9. Baccarat
10. Scratch card

For every game:

- Rules and help screen
- Bet panel with limits and validation
- Smooth animation states: waiting, active, result, history
- Mobile-first responsive layout
- Server-authoritative outcome
- Round history
- Fairness verification where applicable
- Unit tests for edge cases and payout calculations

**Exit criteria:** ten games are playable in demo mode, have consistent UX, and pass automated settlement and animation smoke tests.

### Phase 4 — Product UX and performance

**Goal:** make the product feel ready for real users.

- Lobby categories, search, favourites, and recently played
- Reusable game shell and animation system
- WebSocket/ Supabase Realtime event handling
- Optimistic UI only for non-authoritative presentation
- Offline/reconnect states and duplicate-click protection
- Accessibility, reduced-motion mode, keyboard support
- Performance budgets for mobile and low-bandwidth connections
- Analytics events without exposing sensitive data

**Exit criteria:** Lighthouse and Playwright checks meet the project performance budget, and reconnecting during a round never produces an inconsistent balance or result.

### Phase 5 — Admin and operations

**Goal:** give operators safe, explainable controls.

- Admin dashboard with RBAC
- Game enable/disable and maintenance mode
- Versioned RTP/edge configuration for future rounds only
- Minimum/maximum bet controls
- Exposure and liability limits
- Jackpot configuration as a separate audited module
- User support view with read-only round and ledger history
- Refund workflow requiring reason and approval
- Immutable admin action log
- CSV/JSON audit exports

Admin must not be able to set an individual player's hidden outcome, alter a completed round, or silently change a game's model.

**Exit criteria:** every privileged action is permission-checked, logged, reversible through a new compensating event, and covered by audit tests.

### Phase 6 — Expand to 50 games

**Goal:** add breadth only after the engine is stable.

- 15 original slots
- 5 additional crash/instant games
- 8 additional table games
- 5 video-poker/card variants
- 5 bingo/keno/lottery-style games
- 5 virtual-sports simulations
- 7 additional original specialty games

Each game must be delivered as a complete package: math model, configuration, rules, artwork, animation states, API contract, tests, verification behaviour, and admin metadata.

**Exit criteria:** no game is enabled unless it has a versioned model, automated simulation results, QA sign-off, and a rollback plan.

### Phase 7 — Hardening and release

**Goal:** make the platform operationally reliable.

- Threat model and security review
- Dependency and secret scanning
- Load and soak tests for concurrent rounds
- Database backup/restore drill
- Rate limits and abuse controls
- Incident runbooks
- Production monitoring and alerts
- Staging-to-production promotion process
- Release checklist and rollback procedure

**Exit criteria:** production release candidate passes security, reliability, data-integrity, and disaster-recovery checks.

## Vercel deployment model

- `main`: production deployment
- `staging`: preview/staging deployment
- feature branches: automatic Vercel preview deployments
- Supabase projects: separate development, staging, and production projects
- Secrets are stored in Vercel Environment Variables, never committed
- Database migrations run through a reviewed migration pipeline

## Supabase rules

- Enable RLS on every user-facing table.
- Keep service-role keys server-side only.
- Never trust a client-provided payout, balance, outcome, or user role.
- Use database transactions for ledger and settlement operations.
- Store all timestamps in UTC.
- Use `numeric`/integer minor units for money; never JavaScript floating point for balances.

## Local development

```bash
npm install
npm run dev
```

Required environment variables are documented in `.env.example`. Do not commit real Supabase or Vercel secrets.

## Current status

- Repository created
- Product plan captured
- Supabase/Vercel architecture selected
- Implementation starts with Phase 0 and Phase 1
