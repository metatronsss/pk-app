'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Email 或密碼錯誤',
  Callback: '登入失敗，請稍後再試',
  Default: '登入失敗，請稍後再試',
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';
  const errorParam = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setError(ERROR_MESSAGES[errorParam] ?? ERROR_MESSAGES.Default);
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError(res.error === 'CredentialsSignin' ? 'Email 或密碼錯誤' : res.error);
        return;
      }
      if (res?.ok || res?.url) {
        window.location.href = res?.url ?? callbackUrl;
        return;
      }
      setError('登入失敗，請稍後再試');
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
