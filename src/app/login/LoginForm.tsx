'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('登入逾時，請檢查網路或稍後再試')), 15000)
      );
      const res = await Promise.race([
        signIn('credentials', { email, password, redirect: false }),
        timeout,
      ]);
      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'Email 或密碼錯誤' : res.error);
        return;
      }
      if (!res?.error && (res?.ok || res?.url)) {
        window.location.href = res?.url || callbackUrl;
        return;
      }
      setError(res?.error || '登入失敗，請稍後再試');
    } catch (e) {
      setError(e instanceof Error ? e.message : '登入失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">密碼</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? '登入中…' : '登入'}
      </button>
    </form>
  );
}
