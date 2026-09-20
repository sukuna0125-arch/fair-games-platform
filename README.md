# Fair Games Platform

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` when Supabase features are enabled. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

The current web shell is a demo-mode foundation. Game outcomes, wallet mutations, and rewards will be implemented server-side before any real-money or production operation.
