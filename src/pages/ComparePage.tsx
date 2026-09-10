import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, X, GitCompareArrows, FileText, ArrowLeft, Sparkles } from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { Breadcrumb, PageHeader, EmptyState, AvailabilityBadge, Notice } from '../components/UI';
import { ProductImage } from '../components/ProductCard';
import { number, price } from '../utils/format';
import type { Product } from '../types';
export default function ComparePage() {
  const { state, toggleComparison, clearComparison, addToQuote } = useDemo();
  const [onlyDiff, setOnlyDiff] = useState(false);
  const products = state.comparison
    .map((id) => state.products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);
  const rows: [string, (p: Product) => string][] = [
    ['برند', (p) => p.brand],
    ['مدل', (p) => p.model],
    ['ولتاژ', (p) => `${number(p.voltage)} ولت`],
    ['جریان', (p) => `${number(p.current)} آمپر`],
    ['توان نمونه', (p) => (p.power ? `${number(p.power)} کیلووات` : 'ذکر نشده')],
    ['ولتاژ بوبین', (p) => p.specs['ولتاژ بوبین'] ?? p.specs['بوبین'] ?? '—'],
    [
      'ویژگی‌ها',
      (p) =>
        Object.entries(p.specs)
          .slice(0, 3)
          .map(([k, v]) => `${k}: ${v}`)
          .join(' · '),
    ],
    ['کاربرد', (p) => p.application],
    [
      'موجودی',
      (p) =>
        ({ 'in-stock': 'موجود در انبار', limited: 'محدود', order: 'قابل سفارش' })[p.availability],
    ],
    ['قیمت تقریبی', (p) => price(p.price)],
    ['مناسب برای بررسی در', (p) => p.application],
  ];
  return (
    <div className="container compare-page">
      <Breadcrumb items={[{ label: 'مقایسه محصولات' }]} />
      <PageHeader
        eyebrow="کنار هم، روشن‌تر ببینید"
        title="مقایسه فنی محصولات"
        description="۲ تا ۴ محصول را انتخاب کنید و تفاوت‌های مهم را در یک نگاه ببینید."
      >
        <Link to="/catalog" className="button button-outline">
          <Plus size={17} />
          افزودن محصول
        </Link>
      </PageHeader>
      {products.length < 2 ? (
        <EmptyState
          title={products.length ? 'یک محصول دیگر انتخاب کنید' : 'چه محصولاتی را مقایسه کنیم؟'}
          description="در کاتالوگ، دکمه مقایسه روی کارت محصولات را بزنید."
        >
          <Link className="button button-primary" to="/catalog">
            <GitCompareArrows size={18} />
            انتخاب از کاتالوگ
          </Link>
          <div className="comparison-quick-add">
            {state.products
              .filter(
                (p) =>
                  p.category === (products[0]?.category ?? 'contactor') &&
                  !state.comparison.includes(p.id),
              )
              .slice(0, 3)
              .map((p) => (
                <button
                  className="button button-outline button-small"
                  key={p.id}
                  onClick={() => toggleComparison(p.id)}
                >
                  + {p.model}
                </button>
              ))}
          </div>
        </EmptyState>
      ) : (
        <>
          <div className="compare-toolbar">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={onlyDiff}
                onChange={(e) => setOnlyDiff(e.target.checked)}
              />
              فقط تفاوت‌ها
            </label>
            <span className="difference-key">
              <span />
              ردیف‌های دارای تفاوت
            </span>
            <button className="text-button" onClick={clearComparison}>
              پاک کردن مقایسه
            </button>
          </div>
          {new Set(products.map((p) => p.category)).size > 1 && (
            <Notice tone="warning">
              محصولات انتخابی از دسته‌های متفاوت‌اند؛ مقایسه مستقیم آن‌ها به معنی قابلیت جایگزینی
              نیست.
            </Notice>
          )}
          <div className="table-scroll comparison-table-wrap">
            <table className="comparison-table">
              <caption className="sr-only">
                مقایسه مشخصات فنی {products.map((p) => p.model).join('، ')}
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    <GitCompareArrows size={30} />
                    <span>{number(products.length)} محصول</span>
                  </th>
                  {products.map((p) => (
                    <th scope="col" key={p.id}>
                      <button
                        className="icon-button compare-remove"
                        onClick={() => toggleComparison(p.id)}
                        aria-label={`حذف ${p.model} از مقایسه`}
                      >
                        <X size={17} />
                      </button>
                      <Link to={`/product/${p.id}`}>
                        <ProductImage category={p.category} />
                        <h2>{p.name}</h2>
                        <span dir="ltr">{p.model}</span>
                      </Link>
                      <AvailabilityBadge value={p.availability} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, get]) => {
                  const diff = new Set(products.map(get)).size > 1;
                  if (onlyDiff && !diff) return null;
                  return (
                    <tr className={diff ? 'different' : ''} key={label}>
                      <th scope="row">{label}</th>
                      {products.map((p) => (
                        <td key={p.id} dir="auto">
                          {get(p)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr>
                  <th scope="row">قدم بعدی</th>
                  {products.map((p) => (
                    <td key={p.id}>
                      <button
                        className="button button-primary button-small full-width"
                        onClick={() => addToQuote(p.id)}
                      >
                        <FileText size={15} />
                        افزودن به استعلام
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="compare-footer">
            <Notice>
              مشخصات و قیمت‌ها نمونه هستند. تطبیق فنی و انتخاب نهایی با متخصص برق است.
            </Notice>
            <Link className="button button-outline" to="/assistant">
              <Sparkles size={17} />
              تفاوت‌ها را از مدار بپرسید
              <ArrowLeft size={16} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
