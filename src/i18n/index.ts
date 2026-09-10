export type Locale = 'fa' | 'tr' | 'it' | 'en';
export const localeConfig: Record<Locale, { dir: 'rtl' | 'ltr'; intl: string; label: string }> = {
  fa: { dir: 'rtl', intl: 'fa-IR', label: 'فارسی' },
  tr: { dir: 'ltr', intl: 'tr-TR', label: 'Türkçe' },
  it: { dir: 'ltr', intl: 'it-IT', label: 'Italiano' },
  en: { dir: 'ltr', intl: 'en-GB', label: 'English' },
};
export const activeLocale: Locale = 'fa';
export const fa = {
  nav: {
    home: 'خانه',
    catalog: 'محصولات',
    assistant: 'دستیار هوشمند',
    solutions: 'راهکار کسب‌وکار',
    demo: 'تور دمو',
    dashboard: 'پنل مدیریت',
    quote: 'درخواست استعلام',
  },
  availability: { 'in-stock': 'موجود در انبار', limited: 'موجودی محدود', order: 'قابل سفارش' },
  common: {
    compare: 'مقایسه',
    quote: 'افزودن به استعلام',
    more: 'مشاهده جزئیات',
    sample: 'اطلاعات نمونه',
    demo: 'نسخه نمایشی',
    price: 'تومان',
    contact: 'تماس برای قیمت',
  },
};
// Add fully translated dictionaries and catalog content before exposing another
// locale. UI uses logical CSS properties and Intl; no incomplete locale switcher.
export const t = fa;
