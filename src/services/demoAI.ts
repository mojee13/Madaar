import type {
  AIReply,
  Product,
  GeneratedContent,
  Recommendation,
  RecommendationInput,
} from '../types';
import { expandedQuery, searchProducts } from './search';
import { number, price, normalize } from '../utils/format';
import { categoryName } from '../data/products';
export const suggestedQuestions = [
  'برای موتور ۷.۵ کیلووات چه کنتاکتوری مناسب است؟',
  'برای تابلو برق صنعتی چه تجهیزاتی نیاز دارم؟',
  'منبع تغذیه ۲۴ ولت صنعتی',
  'بین Schneider و ABB چه گزینه‌هایی دارید؟',
];
export const specialistNotice =
  'دستیار نمایشی است و پاسخ‌ها از داده‌های نمونه ساخته می‌شوند. انتخاب نهایی و تطبیق مشخصات باید توسط متخصص برق تأیید شود.';

/** Adapter boundary: replace this local implementation with a server-side LLM/RAG
 * endpoint. Never put provider keys here. The endpoint should validate input,
 * retrieve authorized catalog records and return this same AIReply contract. */
export function answerQuestion(
  question: string,
  products: Product[],
  contextId?: string,
  comparisonIds: string[] = [],
): AIReply {
  const q = expandedQuery(question);
  const context = products.find((p) => p.id === contextId);
  let result: Product[] = [];
  let text = '';
  let intent = 'جست‌وجو در کاتالوگ';
  const mentioned = products.find((p) => q.includes(p.model.toLowerCase()));
  const selected = mentioned ?? context;
  if (/تفاوت|مقایسه|این دو/.test(q)) {
    intent = 'مقایسه مشخصات';
    result = comparisonIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
    if (result.length < 2) {
      const anchor = selected ?? products.find((p) => p.id === 'p01')!;
      result = [
        anchor,
        ...products.filter((p) => p.category === anchor.category && p.id !== anchor.id).slice(0, 1),
      ];
    }
    text = `مقایسه بر اساس اطلاعات نمونه کاتالوگ:\n${result.map((p) => `• ${p.model}: ${number(p.current)} آمپر، ${number(p.voltage)} ولت، ${price(p.price)}.`).join('\n')}\nتفاوت بوبین، رده کاری، ابعاد و شرایط نصب را هم بررسی کنید؛ برابر بودن جریان به‌تنهایی به معنی جایگزینی نیست.`;
  } else if (/ارزان|اقتصادی|جایگزین/.test(q)) {
    intent = 'پیشنهاد جایگزین';
    const anchor =
      selected ??
      searchProducts(products, q).find((p) => p.brand === 'ABB') ??
      products.find((p) => p.id === 'p01')!;
    result = products
      .filter(
        (p) =>
          p.category === anchor.category &&
          p.id !== anchor.id &&
          p.price !== null &&
          (!/ارزان/.test(q) || anchor.price === null || p.price < anchor.price),
      )
      .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
      .slice(0, 3);
    text = result.length
      ? `این گزینه‌ها در دسته «${categoryName(anchor.category)}» برای بررسی کنار ${anchor.model} قرار می‌گیرند. قیمت نمونه از ${price(result[0].price)} شروع می‌شود. این فهرست معادل فنی تأییدشده نیست؛ به‌ویژه جریان، ولتاژ، بوبین و ابعاد نصب باید تطبیق داده شوند.`
      : 'در همین دسته گزینه ارزان‌تری با قیمت مشخص در داده‌های نمونه پیدا نکردم. می‌توانید قیمت روز و جایگزین فنی را استعلام کنید.';
  } else if (/مکمل|چه کابل|کنارش|همراه/.test(q)) {
    intent = 'تجهیزات مکمل';
    const anchor = selected ?? products.find((p) => p.id === 'p01')!;
    result = anchor.relatedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
    text = `برای تکمیل پروژه مربوط به ${anchor.model}، این دسته از تجهیزات را بررسی کنید. انتخاب کابل به طول مسیر، روش نصب، دما، افت ولتاژ و جریان واقعی وابسته است؛ اعداد نمونه کاتالوگ برای تعیین سطح مقطع کافی نیستند.`;
  } else if (q.includes('تابلو') && /نیاز|تجهیزات|صنعتی/.test(q)) {
    intent = 'فهرست تجهیزات پروژه';
    result = ['p30', 'p11', 'p01', 'p13', 'p26', 'p25']
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
    text =
      'برای یک تابلو صنعتی، معمولاً محفظه، حفاظت ورودی، تجهیزات کنترل موتور، منبع تغذیه، رله‌های فرمان و سیم‌کشی بررسی می‌شوند. این فهرست شروع طراحی است؛ نقشه مدار، بارها، شرایط محیط و هماهنگی حفاظتی، انتخاب نهایی را مشخص می‌کنند.';
  } else if (q.includes('موتور')) {
    intent = 'انتخاب اولیه موتور';
    const match = q.match(/(\d+(?:[./]\d+)?)\s*کیلو/);
    const kw = match ? Number(match[1].replace('/', '.')) : 7.5;
    result = products
      .filter(
        (p) =>
          p.category === (q.includes('کلید') ? 'breaker' : 'contactor') &&
          p.voltage === 400 &&
          p.power !== null &&
          p.power >= kw,
      )
      .sort(
        (a, b) => (a.power ?? 0) - (b.power ?? 0) || (a.price ?? Infinity) - (b.price ?? Infinity),
      )
      .slice(0, 3);
    text = result.length
      ? `با فرض موتور سه‌فاز ۴۰۰ ولت و توان ${number(kw)} کیلووات، این گزینه‌های نمونه در کاتالوگ، توان نامی برابر یا بالاتری دارند. برای انتخاب دقیق، جریان پلاک موتور، ولتاژ بوبین، نوع راه‌اندازی و تعداد قطع‌و‌وصل را اعلام کنید. گزینه‌ها پیشنهاد اولیه‌اند و باید با دیتاشیت واقعی تطبیق داده شوند.`
      : `برای موتور ${number(kw)} کیلووات، گزینه‌ای با توان کافی در این کاتالوگ نمونه پیدا نکردم. لطفاً جریان پلاک و شرایط راه‌اندازی را برای استعلام تخصصی ارائه کنید.`;
  } else if (/schneider/.test(q) && /abb/.test(q)) {
    intent = 'گزینه‌های دو برند';
    result = products
      .filter(
        (p) =>
          (p.brand === 'ABB' || p.brand === 'Schneider Electric') &&
          p.category === (selected?.category ?? 'contactor'),
      )
      .slice(0, 4);
    text =
      'در کاتالوگ نمونه، این گزینه‌ها از Schneider Electric و ABB وجود دارند. برند به‌تنهایی معیار انتخاب نیست؛ جریان کاری، بوبین، لوازم جانبی، موجودی و هزینه را کنار هم مقایسه کنید.';
  } else if (/موجود/.test(q)) {
    intent = 'بررسی موجودی';
    result = (
      selected
        ? [
            selected,
            ...products.filter((p) => p.category === selected.category && p.id !== selected.id),
          ]
        : searchProducts(products, q).length
          ? searchProducts(products, q)
          : products
    )
      .filter((p) => p.availability !== 'order')
      .slice(0, 3);
    text =
      'این گزینه‌ها در موجودی نمونه قابل تأمین هستند. موجودی و قیمت‌ها واقعی و لحظه‌ای نیستند؛ برای دریافت شرایط تأمین، آن‌ها را به استعلام اضافه کنید.';
  } else {
    result = mentioned
      ? [mentioned]
      : context && /مشخصات|این محصول|این مدل/.test(q)
        ? [context]
        : searchProducts(products, q).slice(0, 3);
    text = result.length
      ? `بر اساس کاتالوگ موجود، ${number(result.length)} گزینه مرتبط پیدا شد. ${result[0].name} با مدل ${result[0].model}، برای بررسی در کاربرد «${result[0].application}» ارائه شده است. مشخصات نمونه: ${number(result[0].voltage)} ولت و ${number(result[0].current)} آمپر. می‌توانید جزئیات را ببینید یا درباره جایگزین‌ها بپرسید.`
      : 'برای این پرسش، محصول مرتبطی در کاتالوگ نمونه پیدا نکردم. نوع تجهیز، برند، مدل، ولتاژ یا جریان را بنویسید؛ مثلاً «منبع تغذیه ۲۴ ولت».';
  }
  return {
    text,
    products: result,
    intent,
    followUps: [
      'آیا جایگزین ارزان‌تری دارید؟',
      'تفاوت این دو مدل چیست؟',
      'برای این محصول چه تجهیز مکملی پیشنهاد می‌کنید؟',
    ],
  };
}

export function recommendProducts(
  products: Product[],
  input: RecommendationInput,
): Recommendation[] {
  const v = Number(normalize(input.voltage));
  const a = Number(normalize(input.current));
  const w = Number(normalize(input.power));
  const budget = Number(normalize(input.budget));
  return products
    .filter(
      (p) =>
        p.category === input.category &&
        (!v || p.voltage === v) &&
        (!a || p.current >= a) &&
        (!w || (p.power !== null && p.power >= w)) &&
        (!budget || (p.price !== null && p.price <= budget)) &&
        (!input.brand || p.brand === input.brand),
    )
    .map((product) => {
      const reasons = ['هم‌خوان با نوع تجهیز'];
      let score = 60;
      if (v) {
        score += 10;
        reasons.push(`ولتاژ ${number(v)} ولت`);
      }
      if (a) {
        score += 10;
        reasons.push(`جریان نامی حداقل ${number(a)} آمپر`);
      }
      if (w) {
        score += 5;
        reasons.push('توان نامی کافی در داده نمونه');
      }
      if (input.application === product.application) {
        score += 5;
        reasons.push('کاربرد مرتبط');
      }
      if (product.availability === 'in-stock') {
        score += 5;
        reasons.push('موجود در انبار نمونه');
      }
      if (budget) {
        score += 5;
        reasons.push('در محدوده بودجه');
      }
      if (input.project === 'motor' && product.application === 'کنترل موتور') {
        score += 3;
        reasons.push('مرتبط با پروژه کنترل موتور');
      }
      if (input.project === 'building' && product.application === 'ساختمان') {
        score += 3;
        reasons.push('مرتبط با پروژه ساختمانی');
      }
      return { product, score: Math.min(score, 98), reasons };
    })
    .sort(
      (a, b) => b.score - a.score || (a.product.price ?? Infinity) - (b.product.price ?? Infinity),
    )
    .slice(0, 4);
}
export function generateContent(p: Product): GeneratedContent {
  return {
    title: `${p.name} ${p.brand} | مدل ${p.model}`,
    description: `${p.name} از ${p.brand}، مدل ${p.model}، برای بررسی در پروژه‌های ${p.application} در کاتالوگ قرار گرفته است. ولتاژ نمونه ${number(p.voltage)} ولت و جریان نامی نمونه ${number(p.current)} آمپر است. ${Object.entries(
      p.specs,
    )
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${v}`)
      .join(
        '؛ ',
      )}. پیش از ثبت سفارش، مشخصات فنی را با دیتاشیت سازنده تطبیق دهید و شرایط تأمین را استعلام کنید.`,
    seoTitle: `${p.name} ${p.model} | استعلام قیمت مدار`,
    seoDescription: `مشخصات و مقایسه ${p.model} از ${p.brand}. بررسی کاربرد در ${p.application} و دریافت استعلام قیمت از تجهیزات برق مدار.`,
    instagram: `انتخاب تجهیزات، با اطلاعات روشن‌تر. ⚡\n${p.name}\nمدل: ${p.model}\nکاربرد: ${p.application}\nبرای مشخصات بیشتر و دریافت استعلام، به کاتالوگ مدار مراجعه کنید.\n#تجهیزات_برق #تابلو_برق #مدار\nنمونه محتوا؛ پیش از انتشار بازبینی شود.`,
    technical: `مدل: ${p.model}\nبرند: ${p.brand}\nولتاژ: ${number(p.voltage)} V\nجریان: ${number(p.current)} A\n${Object.entries(
      p.specs,
    )
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')}`,
  };
}
