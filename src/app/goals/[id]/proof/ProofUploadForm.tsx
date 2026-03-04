'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { t, mapApiErrorToMessage } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB for non-image
const MAX_IMAGE_BEFORE_WARN = 4 * 1024 * 1024; // 4MB - warn if original exceeds
const MAX_IMAGE_DIM = 800;
const IMAGE_QUALITY = 0.72;
const TARGET_MAX_KB = 400; // target max ~400KB after compression

/** 壓縮圖片以降低上傳大小，避免 body 限制 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > MAX_IMAGE_DIM || height > MAX_IMAGE_DIM) {
        if (width > height) {
          height = Math.round((height / width) * MAX_IMAGE_DIM);
          width = MAX_IMAGE_DIM;
        } else {
          width = Math.round((width / height) * MAX_IMAGE_DIM);
          height = MAX_IMAGE_DIM;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      let quality = IMAGE_QUALITY;
      const tryBlob = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            if (blob.size > TARGET_MAX_KB * 1024 && quality > 0.3) {
              quality -= 0.15;
              tryBlob();
              return;
            }
            const name = file.name.replace(/\.[^.]+$/, '.jpg');
            resolve(new File([blob], name, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };
      tryBlob();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

export default function ProofUploadForm({ goalId, locale }: { goalId: string; locale: Locale }) {
  const router = useRouter();
  const [type, setType] = useState<'image' | 'video' | 'file' | 'link'>('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [error]);

  useEffect(() => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [type]);

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
        const raw = (j.message as string) || res.statusText;
        throw new Error(mapApiErrorToMessage(raw, locale));
      }
      router.push(`/goals/${goalId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('goals.uploadFailed', locale));
    } finally {
      setLoading(false);
    }
  };

  const submitWithFile = async () => {
    if (!file) {
      setError(t('goals.pleaseSelectFile', locale));
      return;
    }
    if (type !== 'image' && file.size > MAX_FILE_SIZE) {
      setError(t('goals.uploadTooLarge', locale));
      return;
    }
    if (type === 'image' && file.type.startsWith('image/') && file.size > MAX_IMAGE_BEFORE_WARN) {
      setError(t('goals.uploadImageTooLarge', locale));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      let toUpload = file;
      if (type === 'image' && file.type.startsWith('image/')) {
        toUpload = await compressImage(file);
      }
      const form = new FormData();
      form.append('goalId', goalId);
      form.append('type', type);
      form.append('file', toUpload);
      const res = await fetch('/api/proofs', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const msg =
          res.status === 413
            ? t('goals.uploadTooLarge', locale)
            : mapApiErrorToMessage((j.message as string) || res.statusText, locale);
        throw new Error(msg);
      }
      router.push(`/goals/${goalId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : t('goals.uploadFailed', locale));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'link') {
      if (!url.trim()) {
        setError(t('goals.pleaseEnterLink', locale));
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
        <div ref={errorRef} role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">{t('goals.proofTypeLabel', locale)}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'image' | 'video' | 'file' | 'link')}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
        >
          <option value="link">{t('goals.proofTypeLink', locale)}</option>
          <option value="image">{t('goals.proofTypeImage', locale)}</option>
          <option value="video">{t('goals.proofTypeVideo', locale)}</option>
          <option value="file">{t('goals.proofTypeFile', locale)}</option>
        </select>
      </div>
      {type === 'link' ? (
        <div>
          <label className="block text-sm font-medium text-slate-700">{t('goals.proofLink', locale)}</label>
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
          <label className="block text-sm font-medium text-slate-700">{t('goals.selectFile', locale)}</label>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('goals.selectFile', locale)}
              <input
                type="file"
                accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : '*'}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="sr-only"
                ref={fileInputRef}
              />
            </label>
            {file && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                <span className="truncate max-w-[180px]" title={file.name}>{file.name}</span>
                <button
                  type="button"
                  onClick={() => { setFile(null); const inp = fileInputRef.current; if (inp) inp.value = ''; }}
                  title={t('goals.clearFile', locale)}
                  className="rounded p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                  aria-label={t('goals.clearFile', locale)}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">{t('goals.fileSizeHint', locale)}</p>
        </div>
      )}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? t('goals.submitting', locale) : t('goals.submitProof', locale)}
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
