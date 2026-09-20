# Payment readiness (disabled by default)

This project deliberately does **not** process real-money gambling deposits or withdrawals. The payment boundary is documented so that a properly licensed operator can complete a separate legal, compliance, and provider review before any activation.

## Current state

- Payment mode: `disabled`
- No provider SDK or gateway credentials are included
- No deposit or withdrawal endpoint is enabled
- Demo credits remain non-cash and cannot be redeemed
- Admin cannot activate payments from the UI

## Activation gate

Live payments require all of the following outside the codebase:

1. Written legal opinion and an applicable gambling licence for each target market.
2. Written approval from a payment provider that permits the intended gaming activity.
3. KYC, age verification, AML, sanctions screening, geolocation, and responsible-play controls.
4. Independent game/RNG/RTP audit and a tested dispute/complaints process.
5. Provider webhook signing, idempotency, reconciliation, refunds, chargeback handling, and withdrawal review.
6. Security review, secret rotation, monitoring, incident response, and backup/restore tests.
7. A controlled release approval by legal, compliance, finance, and engineering owners.

An offshore provider, crypto rail, or gateway switch does not replace local legal authorization and must not be used to bypass restrictions.

## Intended future boundary

If the activation gate is satisfied for a permitted jurisdiction, payments should be implemented as a server-only adapter:

- `PaymentProvider` interface for create-intent, verify-webhook, refund, and withdrawal-status operations.
- Provider-specific implementations isolated from wallet and game code.
- Signed webhooks with replay protection and idempotency keys.
- A payment intent reconciled to the append-only wallet ledger only after verified provider confirmation.
- Withdrawals reviewed through KYC/risk/finance workflows; never client-authorized.
- No payment operation may influence a game outcome or RTP.

Until then, keep `PAYMENTS_ENABLED=false` in every environment.
