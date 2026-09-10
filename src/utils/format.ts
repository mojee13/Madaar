import { activeLocale, localeConfig } from '../i18n';
const locale = localeConfig[activeLocale].intl;
export const number = (n: number) => new Intl.NumberFormat(locale).format(n);
export const price = (n: number | null) => (n === null ? 'تماس برای قیمت' : `${number(n)} تومان`);
export const date = (s: string) =>
  new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(s));
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[۰-۹]/g, (c) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c)))
    .replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)))
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[‌\u064B-\u065F]/g, ' ')
    .replace(/٫/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
export const uid = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
