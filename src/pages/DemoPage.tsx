import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpLeft,
  Play,
  Clock3,
  Check,
  LayoutDashboard,
  Sparkles,
  Presentation,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { Breadcrumb, Notice } from '../components/UI';
import { useTour } from '../hooks/useTour';
import { useDemo } from '../hooks/useDemo';
import { tourSteps } from '../data/tour';
export default function DemoPage() {
  const { setStep } = useTour();
  const { state, setComparison, addToQuote } = useDemo();
  const navigate = useNavigate();
  const go = (i: number) => {
    if (i === 4) {
      setComparison(['p01', 'p03']);
    }
    if (i === 5 && !state.quoteItems.length) addToQuote('p01');
    setStep(i);
    navigate(tourSteps[i].path);
  };
  return (
    <div className="container demo-page">
      <Breadcrumb items={[{ label: 'تور دمو' }]} />
      <section className="demo-hero">
        <span className="demo-hero-icon">
          <Presentation size={34} strokeWidth={1.5} />
        </span>
        <span className="eyebrow">یک تجربه کامل، در پنج دقیقه</span>
        <h1>
          فروش هوشمند را
          <br />
          <span>از نزدیک تجربه کنید.</span>
        </h1>
        <p>
          از اولین جست‌وجوی مشتری تا میز کار تیم فروش.
          <br />
          این تور، ارزش یک سیستم یکپارچه را مرحله‌به‌مرحله نشان می‌دهد.
        </p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => go(0)}>
            <Play size={18} />
            شروع تور راهنما
            <ArrowLeft size={18} />
          </button>
          <Link to="/admin" className="button button-outline">
            <LayoutDashboard size={18} />
            ورود آزمایشی به پنل
          </Link>
        </div>
        <div className="demo-hero-meta">
          <span>
            <Clock3 size={15} />
            حدود ۵ دقیقه
          </span>
          <span>
            <Check size={15} />
            بدون ثبت‌نام
          </span>
          <span>
            <ShieldCheck size={15} />
            بدون ارسال داده به بیرون
          </span>
        </div>
      </section>
      <div className="demo-two-views">
        <Link to="/catalog">
          <Store size={27} />
          <div>
            <span className="eyebrow">از دید مشتری</span>
            <h2>پیدا کنید. مقایسه کنید. استعلام بگیرید.</h2>
            <p>یک تجربه روان برای خرید تخصصی و پروژه‌ای.</p>
          </div>
          <ArrowUpLeft size={25} />
        </Link>
        <Link to="/admin">
          <LayoutDashboard size={27} />
          <div>
            <span className="eyebrow">از دید کسب‌وکار</span>
            <h2>مدیریت کنید. محتوا بسازید. پیگیری کنید.</h2>
            <p>ابزارهایی که به اطلاعات شما، کاربرد می‌دهند.</p>
          </div>
          <ArrowUpLeft size={25} />
        </Link>
      </div>
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">مسیر پیشنهادی ارائه به مشتری</span>
            <h2>هر مرحله، یک ارزش مشخص</h2>
          </div>
          <Link to="/solutions" className="text-link">
            صفحه معرفی تجاری
            <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="tour-grid">
          {tourSteps.map((s, i) => (
            <button className="tour-step-card" key={s.title} onClick={() => go(i)}>
              <div>
                <span className="tour-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="tour-time">
                  <Clock3 size={13} />
                  {s.time}
                </span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <span className="text-link">
                شروع این مرحله
                <ArrowLeft size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>
      <div className="demo-presenter-note">
        <Sparkles size={26} />
        <div>
          <h2>برای ارائه مؤثرتر</h2>
          <p>
            تور را شروع کنید؛ نوار راهنما در همه صفحات همراه شما می‌ماند. «نکته ارائه» را باز کنید
            تا پیام اصلی هر مرحله را ببینید. در مرحله مقایسه و استعلام، محصولات نمونه برایتان آماده
            می‌شوند.
          </p>
        </div>
      </div>
      <Notice>
        این نسخه یک محصول نمایشی است: پاسخ‌های AI محلی‌اند، پردازش Excel شبیه‌سازی می‌شود و نمودارها
        داده نمونه دارند. استقرار خصوصی سازمانی، اتصال به ERP و مدل زبانی در این نسخه فعال نیستند.
      </Notice>
    </div>
  );
}
