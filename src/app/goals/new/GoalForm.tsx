'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { t } from '@/lib/i18n';

const schema = z.object({
  title: z.string().min(1, '請填寫主題'),
  description: z.string().min(1, '請填寫具體描述'),
  dueAt: z.string().min(1, '請選擇截止時間').refine(
    (val) => new Date(val) > new Date(),
    '截止時間不能早於現在'
  ),
  penaltyUsd: z.number().min(5, '至少 $5').max(100, '最多 $100'),
});

type FormData = z.infer<typeof schema>;

export default function GoalForm({ userId }: { userId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      penaltyUsd: 20,
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          dueAt: new Date(data.dueAt).toISOString(),
          penaltyCents: Math.round(data.penaltyUsd * 100),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || res.statusText);
      }
      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '新增失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      <div className="rounded-lg border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        ⚠️ 目標儲存後，截止日期與處罰金額無法調整，請確認後再送出。
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('goals.goalTitle', locale)}</label>
        <input
          {...register('title')}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder={t('goals.placeholderTitle', locale)}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('goals.description', locale)}</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder={t('goals.placeholderDesc', locale)}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('goals.dueDate', locale)}</label>
        <input
          type="datetime-local"
          {...register('dueAt')}
          min={(() => {
            const d = new Date();
            const pad = (n: number) => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
          })()}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        />
        {errors.dueAt && (
          <p className="mt-1 text-sm text-red-600">{errors.dueAt.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('goals.penaltyRange', locale)}</label>
        <input
          type="number"
          {...register('penaltyUsd', { valueAsNumber: true })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          min={5}
          max={100}
          step={5}
        />
        {errors.penaltyUsd && (
          <p className="mt-1 text-sm text-red-600">{errors.penaltyUsd.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? t('goals.submitting', locale) : t('goals.submitCreate', locale)}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          {t('goals.cancel', locale)}
        </button>
      </div>
    </form>
  );
}
