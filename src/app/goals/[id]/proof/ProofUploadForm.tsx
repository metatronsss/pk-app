'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProofUploadForm({ goalId }: { goalId: string }) {
  const router = useRouter();
  const [type, setType] = useState<'image' | 'video' | 'file' | 'link'>('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitWithUrl = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId, type, url }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || res.statusText);
      }
      router.push(`/goals/${goalId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  const submitWithFile = async () => {
    if (!file) {
      setError('請選擇檔案');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('goalId', goalId);
      form.append('type', type);
      form.append('file', file);
      const res = await fetch('/api/proofs', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || res.statusText);
      }
      router.push(`/goals/${goalId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '上傳失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'link') {
      if (!url.trim()) {
        setError('請填寫連結');
        return;
      }
      submitWithUrl();
    } else {
      submitWithFile();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">證明類型</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'image' | 'video' | 'file' | 'link')}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="link">連結（社群貼文、雲端連結等）</option>
          <option value="image">圖片</option>
          <option value="video">影片</option>
          <option value="file">檔案</option>
        </select>
      </div>
      {type === 'link' ? (
        <div>
          <label className="block text-sm font-medium text-slate-700">證明連結</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="https://..."
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-slate-700">選擇檔案</label>
          <input
            type="file"
            accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*'}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>
      )}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? '送出中…' : '送出證明'}
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
