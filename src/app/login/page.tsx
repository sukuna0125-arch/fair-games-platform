'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="shell page auth-page">
      <div className="auth-card">
        <p className="eyebrow">ACCESS</p>
        <h1>Welcome back.</h1>
        <p className="lead">Sign in to access your demo wallet, games, and referral centre.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input required minLength={6} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="button primary" disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        {message && <p className="form-message" role="alert">{message}</p>}
        <p className="auth-footer">New here? <Link href="/signup">Create an account</Link></p>
        <Link className="button secondary" href="/">Back to home</Link>
      </div>
    </main>
  );
}
