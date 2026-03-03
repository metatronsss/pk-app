'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 登入後在背景觸發 penalize，完成後 refresh 取得最新狀態。
 * 避免 penalize 在 server 阻塞導致頁面無法載入。
 */
export default function PenalizeTrigger() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/penalize', { method: 'POST' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data != null) router.refresh();
      })
      .catch(() => {});
  }, [router]);

  return null;
}
