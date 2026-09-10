import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCheck,
  FileText,
  Plus,
  Trash2,
  Building2,
  ShieldCheck,
  Copy,
  Minus,
} from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { Breadcrumb, PageHeader, Notice } from '../components/UI';
import { ProductImage } from '../components/ProductCard';
import { number, normalize, price, uid } from '../utils/format';
import type { QuoteRequest } from '../types';
const blank = { name: '', company: '', phone: '', email: '', city: '', message: '' };
export default function QuotePage() {
  const [params] = useSearchParams();
  const consultation = params.get('consultation') === '1';
  const { state, setQuantity, removeQuoteItem, submitQuote, notify } = useDemo();
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<QuoteRequest | null>(null);
  const lock = useRef(false);
  const [consent, setConsent] = useState(false);
  const fields = (k: keyof typeof blank, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const total = state.quoteItems.reduce(
    (n, i) => n + (state.products.find((p) => p.id === i.productId)?.price ?? 0) * i.quantity,
    0,
  );
  const unknown = state.quoteItems.some(
    (i) => state.products.find((p) => p.id === i.productId)?.price === null,
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    setError('');
    const phone = normalize(form.phone).replace(/[\s()-]/g, '');
    if (!/^(?:\+98|0098|0)\d{10}$/.test(phone)) {
      setError('شماره تماس را با پیش‌شماره وارد کنید؛ مانند ۰۹۱۲۱۲۳۴۵۶۷ یا ۰۲۱۱۲۳۴۵۶۷۸.');
      return;
    }
    if (form.name.trim().length < 2 || form.city.trim().length < 2) {
      setError('نام و شهر را کامل وارد کنید.');
      return;
    }
    if (!consultation && !state.quoteItems.length) {
      setError('حداقل یک محصول را به استعلام اضافه کنید.');
      return;
    }
    if (!consent) {
      setError('ذخیره اطلاعات نمایشی در این مرورگر را تأیید کنید.');
      return;
    }
    lock.current = true;
    const q: QuoteRequest = {
      ...(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])) as typeof blank),
      phone,
      id: `MD-${uid().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: state.quoteItems.map((i) => ({ ...i })),
      productSnapshot: state.quoteItems
        .map((i) => state.products.find((p) => p.id === i.productId)!)
        .filter(Boolean)
        .map((p) => ({ id: p.id, name: p.name, model: p.model })),
      status: 'new',
      message: `${consultation ? '[درخواست مشاوره] ' : ''}${form.message.trim()}`,
    };
    submitQuote(q);
    setSuccess(q);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (success)
    return (
      <div className="container quote-success">
        <div className="success-orbit">
          <Check size={48} />
        </div>
        <span className="eyebrow">درخواست شما در نسخه نمایشی ثبت شد</span>
        <h1>{success.name}، همه‌چیز آماده پیگیری است.</h1>
        <p>
          این درخواست فقط در مرورگر شما ذخیره شده و به فروشنده‌ای ارسال نشده است.
          <br />
          حالا می‌توانید آن را از دید تیم فروش در پنل مدیریت ببینید.
        </p>
        <div className="confirmation-card">
          <div>
            <span>کد پیگیری نمایشی</span>
            <strong dir="ltr">{success.id}</strong>
            <button
              className="icon-button"
              aria-label="کپی کد پیگیری"
              onClick={() =>
                navigator.clipboard
                  ?.writeText(success.id)
                  .then(() => notify('کد پیگیری کپی شد.'))
                  .catch(() => notify('کد را به‌صورت دستی کپی کنید.'))
              }
            >
              <Copy size={18} />
            </button>
          </div>
          <div>
            <span>تعداد ردیف‌ها</span>
            <b>{number(success.items.length)} محصول</b>
          </div>
          <div>
            <span>وضعیت</span>
            <span className="status-pill status-new">جدید · منتظر بررسی نمایشی</span>
          </div>
        </div>
        <div className="success-steps">
          <span>
            <CheckCheck size={20} />
            ثبت درخواست
          </span>
          <ArrowLeft size={16} />
          <span>
            <FileText size={20} />
            بررسی توسط تیم فروش
          </span>
          <ArrowLeft size={16} />
          <span>
            <Building2 size={20} />
            آماده‌سازی پیشنهاد
          </span>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" to="/admin/quotes">
            مشاهده درخواست در پنل مدیریت
            <ArrowLeft size={17} />
          </Link>
          <Link className="button button-outline" to="/catalog">
            بازگشت به محصولات
          </Link>
        </div>
      </div>
    );
  return (
    <div className="container quote-page">
      <Breadcrumb items={[{ label: consultation ? 'درخواست مشاوره' : 'درخواست استعلام' }]} />
      <PageHeader
        eyebrow="یک درخواست، برای تمام نیازهای پروژه"
        title={consultation ? 'درباره کسب‌وکار شما صحبت کنیم' : 'لیست شما آماده استعلام است'}
        description={
          consultation
            ? 'نیاز و اطلاعات شرکت را وارد کنید تا فرایند ثبت یک فرصت فروش را تجربه کنید.'
            : 'تعداد محصولات و اطلاعات تماس را تکمیل کنید. تیم فروش همه جزئیات را یک‌جا خواهد داشت.'
        }
      />
      <div className="quote-progress">
        <span className="done">
          <b>۱</b>انتخاب محصولات
        </span>
        <span className="active">
          <b>۲</b>اطلاعات و درخواست
        </span>
        <span>
          <b>۳</b>ثبت و پیگیری
        </span>
      </div>
      <div className="quote-layout">
        <form className="panel quote-form" onSubmit={submit}>
          <div className="section-heading">
            <h2>اطلاعات درخواست‌کننده</h2>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setForm({
                  name: 'علی رضایی',
                  company: 'شرکت نمونه صنعت‌آرا',
                  phone: '09121234567',
                  email: 'demo@example.com',
                  city: 'تهران',
                  message: 'برای پروژه تابلو برق، قیمت و زمان تحویل نمونه را اعلام کنید.',
                });
                setConsent(true);
              }}
            >
              تکمیل با اطلاعات نمونه
            </button>
          </div>
          <div className="form-grid">
            <label className="field">
              نام و نام خانوادگی <span>*</span>
              <input
                required
                autoComplete="name"
                maxLength={80}
                value={form.name}
                onChange={(e) => fields('name', e.target.value)}
                placeholder="نام شما"
              />
            </label>
            <label className="field">
              نام شرکت
              <input
                autoComplete="organization"
                maxLength={100}
                value={form.company}
                onChange={(e) => fields('company', e.target.value)}
                placeholder="نام کسب‌وکار یا شرکت"
              />
            </label>
            <label className="field">
              شماره تماس <span>*</span>
              <input
                required
                type="tel"
                dir="ltr"
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                value={form.phone}
                onChange={(e) => fields('phone', e.target.value)}
                placeholder="0912 123 4567"
              />
            </label>
            <label className="field">
              ایمیل
              <input
                type="email"
                dir="ltr"
                autoComplete="email"
                maxLength={100}
                value={form.email}
                onChange={(e) => fields('email', e.target.value)}
                placeholder="you@company.com"
              />
            </label>
            <label className="field">
              شهر <span>*</span>
              <input
                required
                autoComplete="address-level2"
                maxLength={80}
                value={form.city}
                onChange={(e) => fields('city', e.target.value)}
                placeholder="شهر محل پروژه"
              />
            </label>
          </div>
          <label className="field">
            توضیحات و نیازهای پروژه
            <textarea
              rows={4}
              maxLength={2000}
              value={form.message}
              onChange={(e) => fields('message', e.target.value)}
              placeholder="زمان تحویل موردنظر، نیاز فنی یا توضیحات تکمیلی…"
            />
          </label>
          <label className="checkbox-label consent-label">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>می‌دانم این درخواست نمایشی است و اطلاعات فقط در این مرورگر ذخیره می‌شود.</span>
          </label>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button
            className="button button-primary full-width"
            type="submit"
            disabled={!consultation && !state.quoteItems.length}
          >
            ثبت {consultation ? 'درخواست مشاوره' : 'استعلام'} نمایشی
            <ArrowLeft size={18} />
          </button>
          <p className="form-footnote">
            <ShieldCheck size={15} />
            بدون پرداخت، بدون ارسال اطلاعات به بیرون
          </p>
        </form>
        <aside className="quote-summary panel">
          <div className="section-heading">
            <h2>لیست استعلام</h2>
            <span className="count-tag">{number(state.quoteItems.length)}</span>
          </div>
          {state.quoteItems.length ? (
            <div className="quote-item-list">
              {state.quoteItems.map((item) => {
                const p = state.products.find((x) => x.id === item.productId);
                if (!p) return null;
                return (
                  <div className="quote-item" key={p.id}>
                    <ProductImage category={p.category} />
                    <div>
                      <Link to={`/product/${p.id}`}>
                        <h3>{p.name}</h3>
                      </Link>
                      <span dir="ltr">{p.model}</span>
                      <small>{price(p.price)}</small>
                      <div className="quote-quantity-row">
                        <div className="quantity-control">
                          <button
                            type="button"
                            onClick={() => setQuantity(p.id, item.quantity + 1)}
                            disabled={item.quantity >= 9999}
                            aria-label={`افزایش تعداد ${p.model}`}
                          >
                            <Plus size={14} />
                          </button>
                          <input
                            aria-label={`تعداد ${p.model}`}
                            type="number"
                            min="1"
                            max="9999"
                            value={item.quantity}
                            onChange={(e) => setQuantity(p.id, Number(e.target.value))}
                          />
                          <button
                            type="button"
                            disabled={item.quantity === 1}
                            onClick={() => setQuantity(p.id, item.quantity - 1)}
                            aria-label={`کاهش تعداد ${p.model}`}
                          >
                            <Minus size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => removeQuoteItem(p.id)}
                          aria-label={`حذف ${p.model} از استعلام`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="quote-empty">
              <FileText size={32} />
              <p>
                {consultation
                  ? 'برای مشاوره، انتخاب محصول لازم نیست.'
                  : 'هنوز محصولی انتخاب نشده است.'}
              </p>
            </div>
          )}
          <Link className="button button-outline full-width button-small" to="/catalog">
            <Plus size={16} />
            افزودن محصول از کاتالوگ
          </Link>
          {state.quoteItems.length > 0 && (
            <div className="quote-total">
              <span>جمع قیمت‌های مشخص نمونه</span>
              <strong>{price(total)}</strong>
              <small>
                {unknown
                  ? 'بعضی ردیف‌ها نیاز به استعلام قیمت دارند.'
                  : 'هزینه ارسال و مالیات در این جمع محاسبه نشده است.'}
              </small>
            </div>
          )}
          <Notice>این مبلغ پیش‌فاکتور یا پیشنهاد فروش واقعی نیست.</Notice>
        </aside>
      </div>
    </div>
  );
}
