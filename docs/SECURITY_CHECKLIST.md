# Security checklist

- [ ] `.env.local` is ignored and no secret appears in Git history.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- [ ] Payment flags remain `false` / `disabled`.
- [ ] Supabase RLS is enabled on user data tables.
- [ ] Admin roles are assigned manually to known accounts.
- [ ] Demo credits are clearly labelled non-cash.
- [ ] No deposit, withdrawal, or redemption route is exposed.
- [ ] Round settlement uses the atomic database function.
- [ ] Fairness verification can reproduce a stored outcome.
- [ ] Build and typecheck pass before deployment.
