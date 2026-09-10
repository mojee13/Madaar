import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { Breadcrumb, PageHeader, Notice, EmptyState } from '../components/UI';
import { ProductCard } from '../components/ProductCard';
import { categories, brands, applications } from '../data/products';
import { useDemo } from '../hooks/useDemo';
import { recommendProducts, specialistNotice } from '../services/demoAI';
import { number } from '../utils/format';
import type { Recommendation, RecommendationInput, CategoryId } from '../types';
const initial: RecommendationInput = {
  project: 'motor',
  category: 'contactor',
  voltage: '400',
  current: '18',
  power: '7.5',
  brand: '',
  budget: '',
  application: 'کنترل موتور',
};
export default function RecommendPage() {
  const { state } = useDemo();
  const [form, setForm] = useState(initial);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const update = (key: keyof RecommendationInput, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setResults(null);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setResults(recommendProducts(state.products, form));
  };
  return (
    <div className="container recommend-page">
      <Breadcrumb items={[{ label: 'انتخاب هوشمند محصول' }]} />
      <PageHeader
        eyebrow="مشاور انتخاب، بر اساس نیاز شما"
        title="پروژه را تعریف کنید. گزینه‌ها را ببینید."
        description="نیاز اولیه را وارد کنید تا محصولاتی که با معیارهای شما هم‌خوان‌اند، پیشنهاد شوند."
      />
      <div className="recommend-layout">
        <form className="panel recommend-form" onSubmit={submit}>
          <h2>
            <SlidersHorizontal size={21} />
            نیازهای پروژه
          </h2>
          <label className="field">
            نوع پروژه
            <select value={form.project} onChange={(e) => update('project', e.target.value)}>
              <option value="motor">راه‌اندازی یا کنترل موتور</option>
              <option value="panel">طراحی تابلو برق</option>
              <option value="building">پروژه ساختمانی</option>
              <option value="automation">اتوماسیون صنعتی</option>
            </select>
          </label>
          <label className="field">
            نوع تجهیز
            <select
              value={form.category}
              onChange={(e) => {
                setForm((f) => ({
                  ...f,
                  category: e.target.value as CategoryId,
                  voltage: '',
                  current: '',
                  power: '',
                }));
                setResults(null);
              }}
            >
              {categories.map((c) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label className="field">
              ولتاژ نامی (ولت)
              <input
                type="number"
                min="0"
                max="10000"
                value={form.voltage}
                onChange={(e) => update('voltage', e.target.value)}
                placeholder="بدون محدودیت"
              />
            </label>
            <label className="field">
              حداقل جریان (آمپر)
              <input
                type="number"
                min="0"
                max="10000"
                step="0.1"
                value={form.current}
                onChange={(e) => update('current', e.target.value)}
                placeholder="بدون محدودیت"
              />
            </label>
          </div>
          <label className="field">
            حداقل توان نامی (کیلووات)
            <input
              type="number"
              min="0"
              step="0.01"
              max="10000"
              value={form.power}
              onChange={(e) => update('power', e.target.value)}
              placeholder="اختیاری"
            />
            <small>توان نمونه محصول؛ تأیید کاربرد واقعی با متخصص است.</small>
          </label>
          <label className="field">
            برند ترجیحی
            <select value={form.brand} onChange={(e) => update('brand', e.target.value)}>
              <option value="">همه برندها</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="field">
            حداکثر بودجه برای هر واحد (تومان)
            <input
              type="number"
              min="0"
              step="1000"
              value={form.budget}
              onChange={(e) => update('budget', e.target.value)}
              placeholder="بدون محدودیت"
            />
          </label>
          <label className="field">
            کاربرد
            <select
              value={form.application}
              onChange={(e) => update('application', e.target.value)}
            >
              {applications.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="button button-primary full-width">
            <Sparkles size={18} />
            دریافت پیشنهادها
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            className="text-button centered"
            onClick={() => {
              setForm(initial);
              setResults(null);
            }}
          >
            <RotateCcw size={14} />
            بارگذاری مثال موتور ۷.۵ کیلووات
          </button>
        </form>
        <div className="recommend-results">
          {results === null ? (
            <div className="recommend-intro">
              <span className="welcome-symbol">
                <Sparkles size={36} />
              </span>
              <h2>از مشخصات، به یک فهرست کوتاه</h2>
              <p>
                یک مثال آماده برای موتور ۷.۵ کیلووات وارد شده است. می‌توانید آن را تغییر دهید یا
                همین حالا پیشنهادها را ببینید.
              </p>
              <div className="recommend-principles">
                <span>
                  <Check size={18} />
                  تطبیق ولتاژ، جریان و توان
                </span>
                <span>
                  <Check size={18} />
                  رعایت بودجه و برند ترجیحی
                </span>
                <span>
                  <Check size={18} />
                  نمایش دلیل پیشنهاد هر محصول
                </span>
              </div>
            </div>
          ) : results.length ? (
            <>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">بررسی محلی کاتالوگ</span>
                  <h2>{number(results.length)} گزینه مطابق معیارهای شما</h2>
                </div>
                <span className="tag">رتبه‌بندی نمایشی</span>
              </div>
              <div className="recommend-product-grid">
                {results.map(({ product, score, reasons }) => (
                  <div className="recommendation-card" key={product.id}>
                    <div className="recommendation-score">
                      <Sparkles size={16} />
                      <b>{number(score)} از ۱۰۰</b>
                      <span>امتیاز تطبیق قواعد</span>
                    </div>
                    <ProductCard product={product} />
                    <ul>
                      {reasons.map((r) => (
                        <li key={r}>
                          <Check size={13} />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="muted">
                امتیاز تطبیق، حاصل قواعد این دمو است و احتمال موفقیت یا تأیید فنی محصول نیست.
              </p>
            </>
          ) : (
            <EmptyState
              title="گزینه‌ای با همه این معیارها پیدا نشد"
              description="بودجه، برند یا مشخصات را تغییر دهید. برای راهنمایی بیشتر از دستیار استفاده کنید."
            >
              <Link className="button button-outline" to="/assistant">
                گفت‌وگو با دستیار
              </Link>
            </EmptyState>
          )}
          <Notice>{specialistNotice}</Notice>
        </div>
      </div>
    </div>
  );
}
