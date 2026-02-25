'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(1, '請填寫主題'),
  description: z.string().min(1, '請填寫具體描述'),
});

type FormData = z.infer<typeof schema>;

export default function GoalEditForm({
  goalId,
  title,
  description,
}: {
  goalId: string;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(j.message || res.statusText);
      }
      router.push(`/goals/${goalId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '更新失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">目標主題</label>
        <input
          {...register('title')}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="例：每週運動 3 次"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">具體描述（如何證明完成）</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          placeholder="例：健身房或跑步，每次至少 30 分鐘，上傳運動紀錄截圖"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? '儲存中…' : '儲存'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          取消
        </button>
      </div>
    </form>
  );
}
