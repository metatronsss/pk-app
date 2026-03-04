'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useRef, useEffect } from 'react';
import { t, mapApiErrorToMessage } from '@/lib/i18n';

type FormData = { title: string; description: string };

export default function GoalEditForm({
  goalId,
  title,
  description,
  locale,
}: {
  goalId: string;
  title: string;
  description: string;
  locale: import('@/lib/i18n').Locale;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () =>
      z.object({
        title: z.string().min(1, t('goals.errTitleRequired', locale)),
        description: z.string().min(1, t('goals.errDescRequired', locale)),
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
    defaultValues: { title, description },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title, description: data.description }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const raw = (j.message as string) || res.statusText;
        throw new Error(mapApiErrorToMessage(raw, locale));
      }
      router.push(`/goals/${goalId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('goals.updateFailed', locale));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
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
      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? t('coach.saving', locale) : t('goals.save', locale)}
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
