'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { t, mapApiErrorToMessage } from '@/lib/i18n';

type FormData = { title: string; description: string; dueAt: string; penaltyUsd: number };

export default function GoalForm({ userId }: { userId: string }) {
  const router = useRouter();
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, t('goals.errTitleRequired', locale)),
        description: z.string().min(1, t('goals.errDescRequired', locale)),
        dueAt: z
          .string()
          .min(1, t('goals.errDueRequired', locale))
          .refine((val) => new Date(val) > new Date(), t('goals.errDuePast', locale)),
        penaltyUsd: z
          .number()
          .min(5, t('goals.errPenaltyMin', locale))
          .max(100, t('goals.errPenaltyMax', locale)),
      }),
    [locale]
  );

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [error]);

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
        const raw = (j.message as string) || res.statusText;
        throw new Error(mapApiErrorToMessage(raw, locale));
      }
      router.push('/dashboard');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('goals.createFailed', locale));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      <div className="rounded-lg border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        ⚠️ {t('goals.createWarning', locale)}
      </div>
      {error && (
        <div ref={errorRef} role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
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
