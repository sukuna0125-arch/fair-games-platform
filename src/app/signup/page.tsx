'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref')?.toUpperCase() ?? '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { referral_code: referralCode || null },
      },
    });

    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setMessage('Check your email to confirm your account, then sign in.');
      setBusy(false);
    }
  }

  return (
    <main className="shell page auth-page">
      <div className="auth-card">
        <p className="eyebrow">JOIN THE PLATFORM</p>
        <h1>Create account.</h1>
        <p className="lead">Start in demo mode with transparent rounds and a non-cash wallet.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input required minLength={6} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <label>Referral code <span className="muted">(optional)</span><input maxLength={32} value={referralCode} onChange={(event) => setReferralCode(event.target.value.toUpperCase())} /></label>
          <button className="button primary" disabled={busy} type="submit">{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        {message && <p className="form-message" role="status">{message}</p>}
        <p className="auth-footer">Already registered? <Link href="/login">Sign in</Link></p>
      </div>
    </main>
  );
}
