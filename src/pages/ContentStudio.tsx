import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  CheckCheck,
  FileText,
  Search,
  Instagram,
  Type,
  AlignRight,
  ArrowLeft,
  RefreshCw,
  Check,
} from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { PageHeader, Notice, Spinner } from '../components/UI';
import { ProductImage } from '../components/ProductCard';
import { generateContent } from '../services/demoAI';
import { number } from '../utils/format';
import type { GeneratedContent } from '../types';
const fields = [
  ['title', 'عنوان محصول', Type, 'عنوان روشن و قابل جست‌وجو'],
  ['description', 'توضیحات محصول', FileText, 'معرفی کاربرد و مشخصات'],
  ['seoTitle', 'عنوان سئو', Search, 'عنوان پیشنهادی برای موتور جست‌وجو'],
  ['seoDescription', 'توضیحات سئو', AlignRight, 'خلاصه‌ای برای نتایج جست‌وجو'],
  ['instagram', 'کپشن اینستاگرام', Instagram, 'محتوای آماده بازبینی برای شبکه اجتماعی'],
  ['technical', 'خلاصه فنی', FileText, 'مشخصات ساختاریافته محصول'],
] as const;
export default function ContentStudio() {
  const [params] = useSearchParams();
  const { state, upsertProduct, notify } = useDemo();
  const [id, setId] = useState(params.get('product') ?? state.products[0].id);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const p = state.products.find((p) => p.id === id) ?? state.products[0];
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  function generate() {
    setBusy(true);
    setContent(null);
    setApplied(false);
    timer.current = setTimeout(() => {
      setContent(generateContent(p));
      setBusy(false);
    }, 1000);
  }
  const copy = async (s: string) => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(s);
      notify('محتوا کپی شد.');
    } catch {
      notify('کپی خودکار در دسترس نیست؛ متن را انتخاب کنید.');
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="استودیوی محتوای مدار"
        title="از مشخصات فنی، به محتوای آماده بررسی"
        description="یک محصول انتخاب کنید؛ شش خروجی هماهنگ برای کاتالوگ، سئو و شبکه‌های اجتماعی بسازید."
      >
        <span className="studio-badge">
          <Sparkles size={18} />
          AI CONTENT STUDIO
        </span>
      </PageHeader>
      <div className="studio-layout">
        <aside className="panel studio-source">
          <h2>
            <FileText size={20} />
            منبع محتوا
          </h2>
          <label className="field">
            محصول کاتالوگ
            <select
              disabled={busy}
              value={p.id}
              onChange={(e) => {
                setId(e.target.value);
                setContent(null);
                setApplied(false);
              }}
            >
              {state.products.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.model} — {p.name}
                </option>
              ))}
            </select>
          </label>
          <div className="studio-product-image">
            <ProductImage category={p.category} />
          </div>
          <span className="product-model" dir="ltr">
            {p.brand} · {p.model}
          </span>
          <h3>{p.name}</h3>
          <dl className="studio-specs">
            <div>
              <dt>ولتاژ</dt>
              <dd>{number(p.voltage)} ولت</dd>
            </div>
            <div>
              <dt>جریان</dt>
              <dd>{number(p.current)} آمپر</dd>
            </div>
            <div>
              <dt>کاربرد</dt>
              <dd>{p.application}</dd>
            </div>
          </dl>
          <div className="content-source-check">
            <CheckCheck size={17} />
            اطلاعات از کاتالوگ محلی خوانده می‌شود
          </div>
          <button className="button button-primary full-width" disabled={busy} onClick={generate}>
            {content ? <RefreshCw size={17} /> : <Sparkles size={18} />}{' '}
            {busy
              ? 'در حال ساخت محتوا…'
              : content
                ? 'تولید دوباره محتوا'
                : 'تولید محتوا با هوش مصنوعی'}
          </button>
          <small className="studio-local-note">
            در این دمو، محتوا با قالب‌های محلی ساخته می‌شود؛ اتصال به مدل زبانی در مرحله بعد
            امکان‌پذیر است.
          </small>
        </aside>
        <div className="studio-results">
          {busy ? (
            <div className="panel content-generating">
              <span className="welcome-symbol">
                <Sparkles size={42} />
              </span>
              <h2>اطلاعات محصول، در حال تبدیل به محتواست</h2>
              <Spinner label="ساخت عنوان، توضیحات، سئو و کپشن…" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
            </div>
          ) : content ? (
            <>
              <div className="studio-result-toolbar">
                <span>
                  <CheckCheck size={18} />
                  {number(6)} خروجی آماده بازبینی
                </span>
                <button
                  className="text-button"
                  onClick={() =>
                    copy(fields.map(([k, label]) => `${label}\n${content[k]}`).join('\n\n'))
                  }
                >
                  <Copy size={15} />
                  کپی همه
                </button>
              </div>
              <div className="content-output-grid">
                {fields.map(([key, label, Icon, subtitle]) => (
                  <section className={`panel content-output output-${key}`} key={key}>
                    <div className="content-output-header">
                      <Icon size={18} />
                      <div>
                        <h2>{label}</h2>
                        <small>{subtitle}</small>
                      </div>
                      <button
                        className="icon-button"
                        aria-label={`کپی ${label}`}
                        onClick={() => copy(content[key])}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <textarea
                      aria-label={`ویرایش ${label}`}
                      rows={
                        key === 'description'
                          ? 6
                          : key === 'instagram' || key === 'technical'
                            ? 7
                            : key === 'seoDescription'
                              ? 3
                              : 2
                      }
                      value={content[key]}
                      onChange={(e) => setContent({ ...content, [key]: e.target.value })}
                    />
                    <div className="output-meta">
                      <span>پیش‌نویس · قابل ویرایش</span>
                      <span>{number(content[key].length)} نویسه</span>
                    </div>
                  </section>
                ))}
              </div>
              <div className="content-apply-bar">
                <div>
                  <b>بازبینی انجام شد؟</b>
                  <span>
                    فقط عنوان و توضیحات در محصول ذخیره می‌شوند. سایر خروجی‌ها قابل کپی‌اند.
                  </span>
                </div>
                <button
                  className="button button-primary"
                  disabled={applied || !content.title.trim() || !content.description.trim()}
                  onClick={() => {
                    upsertProduct({
                      ...p,
                      name: content.title.trim(),
                      description: content.description.trim(),
                    });
                    setApplied(true);
                  }}
                >
                  {applied ? <Check size={18} /> : <CheckCheck size={18} />}{' '}
                  {applied ? 'در محصول ذخیره شد' : 'اعمال عنوان و توضیحات'}
                </button>
              </div>
            </>
          ) : (
            <div className="panel studio-empty">
              <span className="welcome-symbol">
                <Sparkles size={39} strokeWidth={1.4} />
              </span>
              <span className="eyebrow">یک منبع، خروجی‌های هماهنگ</span>
              <h2>
                برای هر محصول،
                <br />
                از صفر شروع نکنید.
              </h2>
              <p>
                مشخصات محصول، پایه همه خروجی‌هاست.
                <br />
                محتوا را تولید کنید، بازبینی کنید و در کاتالوگ به کار ببرید.
              </p>
              <div className="output-preview-grid">
                {fields.map(([key, label, Icon]) => (
                  <span key={key}>
                    <Icon size={20} />
                    {label}
                  </span>
                ))}
              </div>
              <button className="text-link" onClick={generate}>
                اولین محتوا را بسازید
                <ArrowLeft size={17} />
              </button>
            </div>
          )}
          <Notice>
            خروجی‌ها پیش‌نویس هستند. مشخصات فنی، ادعاها و لحن متن باید پیش از انتشار توسط مسئول
            محتوا بررسی شوند.
          </Notice>
        </div>
      </div>
    </>
  );
}
