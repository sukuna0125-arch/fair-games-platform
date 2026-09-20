# Architecture

## Services

### Web application

Next.js handles the lobby, game pages, account pages, admin UI, and public verification pages. It may animate server events, but it cannot resolve a round.

### Game command API

Receives authenticated commands such as `placeBet`, `cashOut`, and `revealSeed`. It validates session, game status, limits, idempotency key, and available demo balance before calling the game model.

### Game model layer

Each game implements a common interface:

- `validateBet(input, config)`
- `openRound(command)`
- `resolveRound(round, entropy)`
- `calculatePayout(bet, result, config)`
- `verificationData(round)`

Models are pure functions wherever possible. Database access and wallet writes remain outside the model.

### Wallet and settlement

Settlement runs in a database transaction:

1. Lock the round and verify it is unsettled.
2. Verify the bet and idempotency key.
3. Resolve or load the immutable outcome.
4. Write payout and ledger entries.
5. Mark the round settled.
6. Emit a realtime event after commit.

### Admin configuration

Configuration is published as a new immutable version. A round references the exact `game_version_id` used at creation. A later admin change affects only future rounds.

## Core data ownership

- `profiles`: user identity and public preferences
- `roles` / `role_permissions`: authorization
- `games`: catalogue metadata
- `game_versions`: mathematical and operational configuration
- `game_rounds`: immutable round lifecycle and outcome commitment
- `bets`: user stake and action history
- `wallets`: current projection only
- `ledger_entries`: append-only source of truth for balance movements
- `admin_actions`: privileged activity
- `audit_events`: system and security events

## Animation contract

Animation receives an event stream, not an outcome request. The UI states are:

```text
IDLE -> BETTING -> RUNNING -> RESULT -> SETTLED -> HISTORY
```

If the connection drops, the client shows a reconnect state and reloads authoritative round state. It does not guess the result. Respect `prefers-reduced-motion` and provide an accessible result summary.

## House-edge configuration

A game version may expose:

- `rtp_bps` — theoretical RTP in basis points
- `house_edge_bps` — theoretical edge in basis points
- `min_bet_minor`
- `max_bet_minor`
- `currency`
- `math_model_version`
- `rng_algorithm_version`
- `published_at`
- `status`

The API validates that RTP and edge are mathematically consistent for the model. The values are not a mechanism for changing individual results.

## Security boundaries

- Browser: presentation and authenticated commands only
- Next.js server: session validation and API orchestration
- Supabase Edge Functions/database: privileged game and ledger operations
- Admin: permissioned configuration and support workflows
- Service role key: server-only, never shipped to the browser
