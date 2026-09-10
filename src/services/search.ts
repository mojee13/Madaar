import type { Product, CategoryId } from '../types';
import { normalize } from '../utils/format';
const aliases: Record<string, string> = {
  اشنایدر: 'schneider electric',
  شنایدر: 'schneider electric',
  زیمنس: 'siemens',
  'ای بی بی': 'abb',
  'ال اس': 'ls electric',
  امرون: 'omron',
  اُمرون: 'omron',
  پاور: 'منبع تغذیه',
  برکر: 'کلید',
  درایو: 'اینورتر',
};
export function expandedQuery(query: string) {
  let q = normalize(query);
  for (const [a, b] of Object.entries(aliases)) q = q.replaceAll(a, b);
  return q;
}
const categoryIntents: [RegExp, CategoryId][] = [
  [/منبع تغذیه/, 'power'],
  [/کنتاکتور/, 'contactor'],
  [/کلید|مینیاتوری/, 'breaker'],
  [/اینورتر/, 'inverter'],
  [/سنسور/, 'sensor'],
  [/رله|تایمر/, 'relay'],
  [/کابل|سیم افشان/, 'cable'],
  [/مولتی متر|کلمپ|پاورمتر/, 'meter'],
];
export function searchProducts(products: Product[], query: string): Product[] {
  const q = expandedQuery(query);
  if (!q) return products;
  const tokens = q
    .split(/[\s،؟!?]+/)
    .filter(
      (x) =>
        x.length > 1 &&
        ![
          'برای',
          'مناسب',
          'چه',
          'یک',
          'این',
          'مدل',
          'دارید',
          'است',
          'من',
          'می',
          'خواهم',
          'چیست',
          'به',
          'از',
        ].includes(x),
    );
  const amp = q.match(/(\d+(?:\.\d+)?)\s*آمپر/);
  const volt = q.match(/(\d+)\s*ولت/);
  const category = categoryIntents.find(([r]) => r.test(q))?.[1];
  const requestedBrands = [
    'schneider electric',
    'abb',
    'siemens',
    'ls electric',
    'omron',
    'madar electric',
  ].filter((b) => q.includes(b));
  const candidates = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!requestedBrands.length || requestedBrands.includes(p.brand.toLowerCase())) &&
      (!amp || p.current === Number(amp[1])) &&
      (!volt || p.voltage === Number(volt[1])),
  );
  return candidates
    .map((p) => {
      const hay = normalize(
        `${p.name} ${p.brand} ${p.model} ${p.application} ${p.description} ${p.tags.join(' ')}`,
      );
      let score = tokens.reduce((n, x) => n + (hay.includes(x) ? (x.length > 3 ? 3 : 1) : 0), 0);
      if (normalize(p.model) === q) score += 50;
      if (q.includes('موتور') && p.application === 'کنترل موتور') score += 8;
      if (q.includes('موتور') && q.includes('کلید') && p.id === 'p10') score += 12;
      if (p.availability === 'in-stock') score += 0.15;
      return { p, score };
    })
    .filter((x) => x.score >= 1)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);
}
