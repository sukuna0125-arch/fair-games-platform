import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="shell page auth-page">
      <div className="auth-card">
        <p className="eyebrow">ACCESS</p>
        <h1>Welcome back.</h1>
        <p className="lead">Use Supabase Auth and a secure server-side session flow for sign-in, sign-up, and protected routes.</p>
        <div className="auth-actions">
          <button className="button primary" type="button">Continue with email</button>
          <Link className="button secondary" href="/">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
