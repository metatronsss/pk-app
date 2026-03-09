import Link from 'next/link';
import { t } from '@/lib/i18n';
import { getLocale } from '@/lib/locale-server';

/** 除錯頁：測試 OpenAI 連線。先登入後訪問 /coach/test-openai */
export default async function CoachTestOpenAIPage() {
  const locale = await getLocale();
  const host = process.env.VERCEL_URL || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/coach/test-openai`;

  return (
    <div className="card max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-slate-800">{t('coach.testOpenAITitle', locale)}</h1>
      <p className="text-sm text-slate-600">{t('coach.testOpenAIDesc', locale)}</p>
      <p className="rounded bg-slate-100 p-2 font-mono text-xs break-all">{apiUrl}</p>
      <TestOpenAIClient apiUrl={apiUrl} />
      <Link href="/coach" className="block text-sm text-teal-600 hover:underline">
        ← {t('coach.backCoach', locale)}
      </Link>
    </div>
  );
}

async function TestOpenAIClient({ apiUrl }: { apiUrl: string }) {
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 font-medium">
          {data.ok ? '✅ 連線成功' : data.hasKey === false ? '❌ API Key 未設定' : '❌ API 呼叫失敗'}
        </p>
        <pre className="overflow-auto rounded bg-white p-2 text-xs">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (e) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="font-medium text-red-800">請求失敗</p>
        <pre className="mt-2 text-xs text-red-700">{(e instanceof Error ? e.message : String(e))}</pre>
      </div>
    );
  }
}
