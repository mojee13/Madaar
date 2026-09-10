import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  GitCompareArrows,
  Sparkles,
  Heart,
  ShieldCheck,
  ZoomIn,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  Breadcrumb,
  AvailabilityBadge,
  EmptyState,
  Notice,
  SectionHeading,
} from '../components/UI';
import { ProductCard, ProductImage } from '../components/ProductCard';
import { useDemo } from '../hooks/useDemo';
import { categoryName } from '../data/products';
import { number, price } from '../utils/format';
const tabs = [
  ['specs', 'مشخصات فنی'],
  ['description', 'توضیحات'],
  ['applications', 'کاربردها'],
  ['related', 'محصولات مشابه'],
  ['faq', 'سوالات متداول'],
] as const;
export default function ProductPage() {
  const { id } = useParams();
  const { state, record, toggleFavorite, toggleComparison, addToQuote } = useDemo();
  const [tab, setTab] = useState('specs');
  const [zoom, setZoom] = useState(false);
  const recorded = useRef<string | null>(null);
  const p = state.products.find((x) => x.id === id);
  useEffect(() => {
    if (p && recorded.current !== p.id) {
      recorded.current = p.id;
      record('view', p.id);
    }
    setTab('specs');
    setZoom(false);
  }, [p?.id, record]);
  if (!p)
    return (
      <div className="container">
        <EmptyState
          title="این محصول پیدا نشد"
          description="ممکن است محصول محلی با بازنشانی دمو حذف شده باشد."
        >
          <Link className="button button-primary" to="/catalog">
            بازگشت به کاتالوگ
          </Link>
        </EmptyState>
      </div>
    );
  const compared = state.comparison.includes(p.id);
  return (
    <div className="container product-page">
      <Breadcrumb
        items={[
          { label: 'محصولات', to: '/catalog' },
          { label: categoryName(p.category), to: `/catalog?category=${p.category}` },
          { label: p.model },
        ]}
      />
      <div className="product-detail-grid">
        <div className="product-gallery">
          <div className={`main-product-image ${zoom ? 'zoomed' : ''}`}>
            <ProductImage category={p.category} label={`تصویر نمایشی دسته ${p.name}`} />
            <span className="image-label">تصویر نمایشی دسته محصول</span>
            <button
              className="icon-button image-zoom"
              aria-label={zoom ? 'اندازه عادی تصویر' : 'بزرگ‌نمایی تصویر'}
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              <ZoomIn size={20} />
            </button>
          </div>
          <p className="gallery-note">
            نمای ظاهری نمونه است و ممکن است با مدل واقعی تفاوت داشته باشد.
          </p>
        </div>
        <div className="product-detail-copy">
          <div className="detail-brand">
            <span dir="ltr">{p.brand}</span>
            <AvailabilityBadge value={p.availability} />
          </div>
          <h1>{p.name}</h1>
          <div className="detail-model">
            <span>کد فنی محصول</span>
            <b dir="ltr">{p.model}</b>
            <button
              className={`icon-button ${state.favorites.includes(p.id) ? 'is-favorite' : ''}`}
              onClick={() => toggleFavorite(p.id)}
              aria-pressed={state.favorites.includes(p.id)}
              aria-label="ذخیره محصول"
            >
              <Heart size={19} />
            </button>
          </div>
          <p>{p.description}</p>
          <div className="quick-specs">
            <div>
              <span>ولتاژ نامی</span>
              <b>
                {number(p.voltage)} <small>ولت</small>
              </b>
            </div>
            <div>
              <span>جریان نامی</span>
              <b>
                {number(p.current)} <small>آمپر</small>
              </b>
            </div>
            <div>
              <span>{p.power ? 'توان نمونه' : 'کاربرد'}</span>
              <b>{p.power ? `${number(p.power)} کیلووات` : p.application}</b>
            </div>
          </div>
          <div className="detail-price">
            <div>
              <small>قیمت تقریبی نمونه</small>
              <strong>{price(p.price)}</strong>
              {p.specs['واحد قیمت'] && <small>{p.specs['واحد قیمت']}</small>}
            </div>
            <span className="tag">استعلام پیش از خرید</span>
          </div>
          <div className="detail-actions">
            <button className="button button-primary" onClick={() => addToQuote(p.id)}>
              <FileText size={19} />
              افزودن به استعلام
            </button>
            <button
              className={`button button-outline ${compared ? 'selected' : ''}`}
              aria-pressed={compared}
              onClick={() => toggleComparison(p.id)}
            >
              {compared ? <Check size={18} /> : <GitCompareArrows size={18} />}مقایسه
            </button>
          </div>
          <Link className="detail-ai-link" to={`/assistant?product=${p.id}`}>
            <span className="ai-icon">
              <Sparkles size={20} />
            </span>
            <span>
              <b>درباره این محصول از مدار بپرسید</b>
              <small>مشخصات، جایگزین‌ها و تجهیزات مکمل</small>
            </span>
            <ArrowLeft size={19} />
          </Link>
          <div className="detail-assurance">
            <ShieldCheck size={16} />
            مشخصات نمونه؛ تأیید نهایی با کارشناس فنی
          </div>
        </div>
      </div>
      <div className="product-tabs" role="tablist" aria-label="اطلاعات محصول">
        {tabs.map(([key, label], i) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-selected={tab === key}
            aria-controls="product-tab-panel"
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === 'ArrowLeft') next = (i + 1) % tabs.length;
              else if (e.key === 'ArrowRight') next = (i - 1 + tabs.length) % tabs.length;
              else if (e.key === 'Home') next = 0;
              else if (e.key === 'End') next = tabs.length - 1;
              else return;
              e.preventDefault();
              setTab(tabs[next][0]);
              document.getElementById(`tab-${tabs[next][0]}`)?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <section
        id="product-tab-panel"
        className="product-tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
      >
        {tab === 'specs' && (
          <>
            <div className="section-heading">
              <h2>مشخصات فنی {p.model}</h2>
              <span className="tag">داده نمونه</span>
            </div>
            <dl className="spec-table">
              {Object.entries({
                برند: p.brand,
                مدل: p.model,
                'ولتاژ نامی': `${number(p.voltage)} ولت`,
                'جریان نامی': `${number(p.current)} آمپر`,
                ...p.specs,
              }).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd dir="auto">{v}</dd>
                </div>
              ))}
            </dl>
            <Notice>
              این داده‌ها جایگزین دیتاشیت سازنده نیستند. لطفاً مشخصات واقعی، استانداردها و شرایط نصب
              را پیش از سفارش تأیید کنید.
            </Notice>
          </>
        )}
        {tab === 'description' && (
          <div className="prose">
            <h2>معرفی محصول</h2>
            <p>{p.description}</p>
            <p>
              برای انتخاب دقیق‌تر، این محصول را با گزینه‌های همین دسته مقایسه کنید. تیم فروش
              می‌تواند در مرحله استعلام، قیمت روز، زمان تحویل و مستندات موردنیاز را بررسی کند.
            </p>
            <div className="tags">
              {p.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {tab === 'applications' && (
          <div className="prose">
            <h2>کاربردهای پیشنهادی برای بررسی</h2>
            <p>
              {p.name} در این کاتالوگ برای کاربرد «{p.application}» دسته‌بندی شده است.
            </p>
            <ul>
              <li>بررسی در طراحی و به‌روزرسانی پروژه‌های {p.application}</li>
              <li>مقایسه فنی با گزینه‌های موجود و تهیه فهرست استعلام</li>
              <li>بررسی به‌عنوان قطعه جایگزین، پس از تأیید تطبیق کامل مشخصات</li>
            </ul>
            <Notice>
              شرایط محیطی، دمای کار، هماهنگی حفاظتی و دستورالعمل نصب باید در انتخاب لحاظ شوند.
            </Notice>
          </div>
        )}
        {tab === 'related' && (
          <>
            <h2>گزینه‌های مشابه برای بررسی</h2>
            <div className="product-grid related-grid">
              {p.alternativeIds
                .map((id) => state.products.find((x) => x.id === id))
                .filter((x) => !!x)
                .map((x) => (
                  <ProductCard key={x.id} product={x} />
                ))}
            </div>
          </>
        )}
        {tab === 'faq' && (
          <div className="faq-list">
            {[
              [
                'آیا قیمت و موجودی به‌روز است؟',
                'خیر. قیمت و موجودی این نسخه، نمونه است و برای نمایش تجربه خرید استفاده می‌شود.',
              ],
              [
                'چطور سفارش عمده یا پروژه‌ای ثبت کنم؟',
                'محصول را به لیست استعلام اضافه کنید، تعداد و اطلاعات شرکت را وارد کنید و درخواست نمایشی را ثبت کنید.',
              ],
              [
                'آیا مدل مشابه، جایگزین مستقیم است؟',
                'خیر. جایگزینی به تطبیق مشخصات الکتریکی، ابعاد، نوع کنترل و شرایط نصب نیاز دارد و باید توسط متخصص تأیید شود.',
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        )}
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="تکمیل فهرست پروژه"
          title="تجهیزات مرتبط"
          description="گزینه‌هایی برای بررسی در کنار این محصول؛ سازگاری فنی باید تأیید شود."
        />
        <div className="product-grid related-grid">
          {p.relatedIds
            .map((id) => state.products.find((x) => x.id === id))
            .filter((x) => !!x)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
