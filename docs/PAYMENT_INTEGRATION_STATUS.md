# Payment integration status

Live payment integration is intentionally not implemented or enabled. The project currently supports demo credits only.

## Safe next step

After documented authorization for a permitted jurisdiction, add a provider adapter behind the payment capability boundary. The adapter must be server-only and must support signed webhooks, idempotency, reconciliation, refunds, chargebacks, withdrawal review, and immutable audit records.

Do not add gateway credentials to GitHub. Store approved secrets only in the relevant Vercel/Supabase environment after the compliance gate has passed.
