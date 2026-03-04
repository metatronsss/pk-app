'use client';

import { useRouter } from 'next/navigation';
import { LOCALES, LOCALE_NAMES, type Locale } from '@/lib/i18n';

const COOKIE_NAME = 'NEXT_LOCALE';

function setLocaleCookie(locale: Locale) {
  document.cookie = `${COOKIE_NAME}=${locale};path=/;max-age=31536000`;
}

export default function LanguageSwitch({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value as Locale;
    setLocaleCookie(locale);
    router.refresh();
  };

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      className="shrink-0 text-sm border border-slate-200 rounded px-2 py-1 bg-white text-slate-700"
      aria-label="選擇語言"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_NAMES[l]}
        </option>
      ))}
    </select>
  );
}
