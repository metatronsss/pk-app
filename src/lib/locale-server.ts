import { cookies, headers } from 'next/headers';
import { getLocaleFromHeader, type Locale } from './i18n';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const manual = cookieStore.get(COOKIE_NAME)?.value;
  if (manual === 'zh' || manual === 'en' || manual === 'ja') {
    return manual;
  }
  const headersList = await headers();
  return getLocaleFromHeader(headersList.get('accept-language'));
}
