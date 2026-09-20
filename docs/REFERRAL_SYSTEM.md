# Referral and growth system

The referral feature is a transparent acquisition program, not a way to alter game outcomes. It is implemented independently from the game engine and wallet settlement rules.

## User flow

1. A new user opens a referral URL or enters a referral code.
2. The server stores attribution in a signed, short-lived cookie and an attribution record.
3. During signup, the code is validated and attached to the new account.
4. The referred account receives only the publicly documented welcome benefit, if enabled.
5. The referrer receives a pending reward only after the referred account meets the active campaign qualification rules.
6. A review job either approves, rejects, or holds the reward for fraud review.
7. Approved rewards are posted as ledger entries with a referral reward reference.

## Campaign controls

Each campaign is versioned and immutable after publication. Future campaigns can configure:

- campaign name and public description
- reward type and amount in demo-credit minor units
- qualification event and minimum activity
- pending period
- maximum rewards per referrer and per day
- campaign start/end time
- allowed jurisdictions or environments
- status: draft, scheduled, active, paused, expired

The UI must display the actual qualification rules and reward status. No reward may depend on a hidden player-specific game outcome.

## Abuse controls

- One direct referrer per account; cycles are rejected.
- Referral codes are generated with cryptographically secure randomness.
- Rate-limit code validation, signup attribution, and reward claims.
- Record coarse risk signals without exposing them to other users.
- Flag repeated device fingerprints, IP clusters, disposable email patterns, velocity spikes, and linked payment identifiers when real-money payments are ever enabled.
- Never permanently ban solely on an automated signal; route suspicious cases to review.
- Do not reward self-referrals or incentivize harmful/high-frequency play.

## Data model

- `referral_codes`: owner and public code
- `referral_attributions`: first-touch attribution and referred account
- `referral_campaigns`: versioned campaign rules
- `referral_rewards`: pending/approved/rejected/held reward decisions
- `referral_risk_events`: review signals and decisions

## Admin permissions

- Growth admin: create and schedule campaign versions
- Risk admin: hold/reject rewards and review risk events
- Finance admin: approve reward ledger posting
- Auditor: read-only access to attribution, decisions, and ledger references

No role can edit a completed reward record. Corrections must be compensating events with a reason and audit entry.
