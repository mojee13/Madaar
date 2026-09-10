import { initialProducts } from './products';
import type { Product } from '../types';
export const importDemoProducts: Product[] = [
  {
    ...structuredClone(initialProducts[7]),
    id: 'import-breaker-20',
    name: 'کلید مینیاتوری تک‌پل ۲۰ آمپر',
    brand: 'Madar Electric',
    model: 'MD-MCB-20',
    current: 20,
    price: 480000,
    description: 'کلید مینیاتوری نمونه ۲۰ آمپر برای نمایش انتقال اطلاعات از فایل Excel به کاتالوگ.',
    featured: false,
  },
  {
    ...structuredClone(initialProducts[15]),
    id: 'import-power-10',
    name: 'منبع تغذیه صنعتی ۲۴ ولت، ۱۰ آمپر',
    model: 'MD-PS24-10',
    current: 10,
    power: 0.24,
    price: 2480000,
    description:
      'منبع تغذیه نمونه ۲۴ ولت برای بررسی کاربرد در تابلو برق. داده نمایشی انتقال‌یافته از سناریوی Excel.',
    specs: { ورودی: '۲۳۰ ولت AC', خروجی: '۲۴ ولت DC', 'توان خروجی': '۲۴۰ وات', نصب: 'صفحه‌ای' },
    featured: false,
  },
  {
    ...structuredClone(initialProducts[35]),
    id: 'import-sensor-12',
    name: 'سنسور القایی اقتصادی M12',
    model: 'MD-PROX12',
    price: 520000,
    description:
      'سنسور القایی نمونه برای بررسی در پروژه اتوماسیون؛ انتقال و دسته‌بندی در جریان نمایشی Excel.',
    specs: { 'فاصله تشخیص': '۲ میلی‌متر', خروجی: 'PNP NO', بدنه: 'M12 فلزی' },
    featured: false,
  },
];
