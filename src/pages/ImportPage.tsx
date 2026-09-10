import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  FileSpreadsheet,
  Check,
  ArrowLeft,
  Sparkles,
  Database,
  Boxes,
  CheckCheck,
  RotateCcw,
} from 'lucide-react';
import { PageHeader, Notice } from '../components/UI';
import { useDemo } from '../hooks/useDemo';
import { importDemoProducts } from '../data/importDemo';
import { categoryName } from '../data/products';
import { number, price } from '../utils/format';
const steps = [
  ['دریافت فایل', Upload],
  ['تشخیص محصولات', Boxes],
  ['پاک‌سازی اطلاعات', Database],
  ['ساخت توضیحات', Sparkles],
  ['تعیین دسته‌بندی', Boxes],
  ['آماده انتشار', CheckCheck],
] as const;
export default function ImportPage() {
  const { state, importProducts } = useDemo();
  const [file, setFile] = useState('');
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [published, setPublished] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const existing = importDemoProducts.filter((p) =>
    state.products.some((x) => x.id === p.id),
  ).length;
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  function choose(f?: File) {
    if (running || !f) return;
    setError('');
    if (!/\.(xlsx|xls|csv)$/i.test(f.name)) {
      setError('یک فایل با پسوند xlsx، xls یا csv انتخاب کنید.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('برای این تجربه، فایل کوچک‌تر از ۱۰ مگابایت انتخاب کنید.');
      return;
    }
    setFile(f.name);
    setStep(-1);
    setPublished(false);
  }
  function start() {
    if (!file || running) return;
    setRunning(true);
    setStep(0);
    let n = 0;
    timer.current = setInterval(() => {
      n++;
      setStep(n);
      if (n === 5) {
        clearInterval(timer.current!);
        setRunning(false);
      }
    }, 500);
  }
  function reset() {
    if (timer.current) clearInterval(timer.current);
    setRunning(false);
    setStep(-1);
    setFile('');
    setPublished(false);
    setError('');
    if (input.current) input.current.value = '';
  }
  return (
    <>
      <PageHeader
        eyebrow="از فایل‌های پراکنده، به کاتالوگ یکپارچه"
        title="ورود محصولات از Excel"
        description="ببینید انتقال، پاک‌سازی و غنی‌سازی داده چگونه می‌تواند راه‌اندازی کاتالوگ را ساده‌تر کند."
      >
        <button
          className="button button-outline button-small"
          disabled={running}
          onClick={() => {
            setFile('sample-products.xlsx');
            setStep(-1);
            setPublished(false);
            setError('');
          }}
        >
          <FileSpreadsheet size={17} />
          بارگذاری سناریوی نمونه
        </button>
      </PageHeader>
      <Notice>
        شبیه‌سازی فرایند انتقال: فایل انتخابی ارسال یا خوانده نمی‌شود. مراحل و پیش‌نمایش با ۳ ردیف
        نمونه ثابت اجرا می‌شوند.
      </Notice>
      <div className="import-layout">
        <section className="panel import-upload-panel">
          <span className="step-label">مرحله ۰۱</span>
          <h2>فایل کاتالوگ را انتخاب کنید</h2>
          <div
            className={`dropzone ${drag ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              choose(e.dataTransfer.files[0]);
            }}
          >
            <div className="upload-symbol">
              {file ? <FileSpreadsheet size={36} /> : <Upload size={36} />}
            </div>
            <h3>{file || 'فایل Excel را اینجا رها کنید'}</h3>
            <p>{file ? 'فایل انتخاب شد · آماده شروع شبیه‌سازی' : 'یا از دستگاه خود انتخاب کنید'}</p>
            <input
              ref={input}
              type="file"
              accept=".xlsx,.xls,.csv"
              id="excel-file"
              className="sr-only"
              disabled={running}
              onChange={(e) => choose(e.target.files?.[0])}
            />
            <button
              type="button"
              className="button button-outline button-small"
              disabled={running}
              onClick={() => input.current?.click()}
            >
              {file ? 'انتخاب فایل دیگر' : 'انتخاب فایل'}
            </button>
            <small>XLSX, XLS, CSV · حداکثر ۱۰ مگابایت</small>
          </div>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="upload-alternative">
            <span>فایل آماده ندارید؟</span>
            <button
              className="text-button"
              disabled={running}
              onClick={() => {
                setFile('sample-products.xlsx');
                setStep(-1);
                setPublished(false);
                setError('');
              }}
            >
              استفاده از کاتالوگ نمونه
              <ArrowLeft size={15} />
            </button>
          </div>
          <button
            className="button button-primary full-width"
            disabled={!file || running || step === 5}
            onClick={start}
          >
            <Sparkles size={18} />
            {running ? 'در حال اجرای مراحل نمونه…' : 'شروع شبیه‌سازی انتقال'}
          </button>
        </section>
        <section className="panel import-process-panel">
          <span className="step-label">مرحله ۰۲</span>
          <h2>اطلاعات، آماده فروش می‌شوند</h2>
          <p className="muted">از ردیف‌های خام تا محصولی با اطلاعات قابل جست‌وجو.</p>
          <ol className="import-timeline" aria-live="polite">
            {steps.map(([label, Icon], i) => (
              <li key={label} className={step >= i ? 'complete' : ''}>
                <span className="timeline-icon">
                  {step >= i ? <Check size={18} /> : <Icon size={19} />}
                </span>
                <div>
                  <b>{label}</b>
                  <span>
                    {i === 0
                      ? 'انتخاب فایل برای نمایش فرایند'
                      : i === 1
                        ? 'تشخیص ۳ ردیف از سناریوی نمونه'
                        : i === 2
                          ? 'یکسان‌سازی مدل، قیمت و واحدها'
                          : i === 3
                            ? 'ساخت پیش‌نویس از مشخصات کاتالوگ'
                            : i === 4
                              ? 'کلید، منبع تغذیه و سنسور'
                              : 'نمایش پیش‌نمایش برای بازبینی شما'}
                  </span>
                </div>
                {step > i || step === 5 ? (
                  <span className="timeline-status">انجام شد</span>
                ) : step === i ? (
                  <span className="mini-spinner" />
                ) : null}
              </li>
            ))}
          </ol>
          <div
            className="import-progress"
            role="progressbar"
            aria-label="پیشرفت شبیه‌سازی انتقال"
            aria-valuenow={step < 0 ? 0 : Math.round(((step + 1) / 6) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${Math.max(0, ((step + 1) / 6) * 100)}%` }} />
          </div>
        </section>
      </div>
      {step === 5 && (
        <section className="panel import-review">
          <div className="section-heading">
            <div>
              <span className="eyebrow">مرحله ۰۳ · بازبینی قبل از انتشار</span>
              <h2>پیش‌نمایش محصولات نمونه</h2>
            </div>
            <span className="status-pill status-reviewed">{number(3)} ردیف آماده</span>
          </div>
          <div className="import-stats">
            <span>
              <Check size={17} />
              واحدهای قیمت یکسان شد
            </span>
            <span>
              <Check size={17} />
              دسته‌بندی پیشنهاد شد
            </span>
            <span>
              <Check size={17} />
              توضیحات نمونه اضافه شد
            </span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">محصول نمونه</th>
                  <th scope="col">مدل</th>
                  <th scope="col">دسته‌بندی</th>
                  <th scope="col">قیمت نمونه</th>
                  <th scope="col">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {importDemoProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td dir="ltr">{p.model}</td>
                    <td>{categoryName(p.category)}</td>
                    <td>{price(p.price)}</td>
                    <td>
                      <span className="tag">
                        {state.products.some((x) => x.id === p.id)
                          ? 'قبلاً وارد شده'
                          : 'آماده افزودن'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="import-publish-row">
            <p>
              این پیش‌نمایش متعلق به سناریوی نمونه است و از محتوای فایل انتخاب‌شده استخراج نشده است.
            </p>
            {published || existing === 3 ? (
              <Link className="button button-primary" to="/admin/products">
                <CheckCheck size={18} />
                مشاهده محصولات واردشده
              </Link>
            ) : (
              <button
                className="button button-primary"
                onClick={() => {
                  importProducts(importDemoProducts);
                  setPublished(true);
                }}
              >
                افزودن {number(3 - existing)} محصول به دمو
                <ArrowLeft size={17} />
              </button>
            )}
            <button className="icon-button" aria-label="شروع دوباره انتقال" onClick={reset}>
              <RotateCcw size={19} />
            </button>
          </div>
        </section>
      )}
      <div className="import-bottom-note">
        <Database size={22} />
        <div>
          <h3>کاتالوگ بزرگ دارید؟</h3>
          <p>
            در نسخه متصل، نگاشت ستون‌ها، کنترل خطا، تشخیص تکرار و اتصال به ERP متناسب با داده‌های
            شرکت شما پیاده‌سازی می‌شود.
          </p>
        </div>
      </div>
    </>
  );
}
