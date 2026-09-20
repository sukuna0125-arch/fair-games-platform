import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Fair Games', description: 'Transparent, auditable games platform' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="nav shell"><a className="brand" href="/">fair<span>games</span></a><nav><a href="/games">Games</a><a href="/fairness">Fairness</a><a href="#referrals">Referrals</a></nav><a className="button small" href="/login">Sign in</a></header>{children}<footer className="shell footer"><span>Fair Games · Demo platform</span><span>Transparent by design</span></footer></body></html>;
}
