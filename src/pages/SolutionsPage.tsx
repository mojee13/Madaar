import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpLeft,
  Check,
  Sparkles,
  FileSpreadsheet,
  Search,
  FileText,
  ShieldCheck,
  LockKeyhole,
  Server,
  BookOpen,
  Globe2,
  Factory,
  Wrench,
  Car,
  Building2,
  FlaskConical,
  Boxes,
  Truck,
  BriefcaseBusiness,
  Database,
  Palette,
  ChevronDown,
} from 'lucide-react';
import { Breadcrumb, SectionHeading, Notice } from '../components/UI';
const outcomes = [
  ['اطلاعات پراکنده در فایل‌ها و پیام‌ها', 'کاتالوگ ساختاریافته، همیشه در دسترس'],
  ['تماس‌های تکراری برای مشخصات و موجودی', 'جست‌وجو و پاسخ‌گویی اولیه در تمام ساعات'],
  ['زمان زیاد برای نوشتن توضیحات محصول', 'پیش‌نویس محتوا از داده‌های فنی، با بازبینی انسانی'],
  ['درخواست‌هایی بدون اطلاعات کافی', 'استعلام منظم با محصول، تعداد و نیاز پروژه'],
  ['تصمیم‌گیری بدون شناخت رفتار مشتری', 'دید روشن‌تر به جست‌وجوها و مسیر ایجاد سرنخ'],
];
const process = [
  'بررسی کسب‌وکار',
  'دریافت کاتالوگ و اطلاعات',
  'طراحی تجربه اختصاصی',
  'انتقال و پاک‌سازی داده',
  'افزودن قابلیت‌های AI',
  'تست و بازبینی',
  'راه‌اندازی سیستم',
  'پشتیبانی و بهبود',
];
export default function SolutionsPage() {
  return (
    <div className="solutions-page">
      <div className="container">
        <Breadcrumb items={[{ label: 'راهکار کسب‌وکار' }]} />
        <section className="solutions-hero">
          <span className="eyebrow">برای کسب‌وکارهایی که آماده قدم بعدی‌اند</span>
          <h1>
            وب‌سایت، نقطه شروع است.
            <br />
            <span>زیرساخت فروش، مقصد ماست.</span>
          </h1>
          <p>
            مدار، اطلاعات محصول، پاسخ‌گویی و پیگیری فروش را به هم متصل می‌کند؛
            <br />
            تا تیم شما روی چیزی تمرکز کند که اهمیت دارد: مشتری.
          </p>
          <div className="hero-actions">
            <Link to="/demo" className="button button-primary">
              تجربه یک نمونه واقعی
              <ArrowLeft size={18} />
            </Link>
            <Link to="/quote?consultation=1" className="button button-outline">
              درخواست مشاوره
              <ArrowUpLeft size={18} />
            </Link>
          </div>
        </section>
        <section className="section">
          <SectionHeading
            eyebrow="مسئله‌ای که حل می‌کنیم"
            title="از محدودیت‌های امروز، به امکانات فردا"
          />
          <div className="before-after">
            <div className="before-after-head">
              <span>در مسیر سنتی فروش</span>
              <span>با سیستم پیشنهادی مدار</span>
            </div>
            {outcomes.map(([a, b]) => (
              <div className="before-after-row" key={a}>
                <span>{a}</span>
                <span>
                  <Check size={18} />
                  {b}
                </span>
              </div>
            ))}
          </div>
          <p className="muted">
            میزان اثرگذاری به کیفیت داده، فرایند فروش، اجرای پروژه و نحوه استفاده تیم بستگی دارد.
          </p>
        </section>
        <section className="section">
          <SectionHeading
            eyebrow="AI دقیقاً کجای کار قرار می‌گیرد؟"
            title="هوش مصنوعی، در خدمت یک کار مشخص"
            description="قابلیت‌هایی با ورودی و خروجی روشن؛ قابل ارزیابی و قابل توسعه."
          />
          <div className="solution-feature-grid">
            {[
              [
                Search,
                'جست‌وجو و کشف محصول',
                'پرسش مشتری به گزینه‌های مرتبط در کاتالوگ تبدیل می‌شود.',
                '/catalog',
              ],
              [
                Sparkles,
                'دستیار کاتالوگ',
                'پاسخ محصول‌محور همراه با ارجاع، مقایسه و معرفی گزینه‌های جایگزین.',
                '/assistant',
              ],
              [
                FileText,
                'تولید پیش‌نویس محتوا',
                'از مشخصات فنی تا معرفی محصول، سئو و کپشن؛ با تأیید مسئول محتوا.',
                '/admin/content',
              ],
              [
                FileSpreadsheet,
                'آماده‌سازی اطلاعات',
                'پاک‌سازی و دسته‌بندی اطلاعات برای انتقال سریع‌تر به کاتالوگ.',
                '/admin/import',
              ],
            ].map(([Icon, title, description, to]) => {
              const I = Icon as typeof Search;
              return (
                <Link className="solution-feature" to={to as string} key={title as string}>
                  <I size={27} />
                  <h3>{title as string}</h3>
                  <p>{description as string}</p>
                  <span className="text-link">
                    تجربه دمو
                    <ArrowLeft size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
          <Notice>
            این نسخه با منطق محلی کار می‌کند. مدل زبانی، پردازش واقعی Excel و سرویس‌های سازمانی در
            دمو فعال نیستند.
          </Notice>
        </section>
        <section className="section">
          <SectionHeading
            eyebrow="هویت شما، فرایند شما"
            title="چه چیزهایی برای شما شخصی‌سازی می‌شود؟"
          />
          <div className="customize-grid">
            {[
              [Palette, 'هویت و تجربه', 'نام، رنگ‌ها، طراحی و مسیرهای مشتری'],
              [Database, 'کاتالوگ و داده', 'دسته‌ها، ویژگی‌ها، قواعد قیمت و ساختار محصول'],
              [BriefcaseBusiness, 'فرایند کسب‌وکار', 'استعلام، نقش‌های تیم، پیگیری و اتصال به CRM'],
              [Globe2, 'زبان و بازار', 'توسعه برای فارسی، ترکی، ایتالیایی و انگلیسی'],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof Palette;
              return (
                <div key={title as string}>
                  <I size={24} />
                  <h3>{title as string}</h3>
                  <p>{description as string}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <section className="private-ai-section" id="private-ai">
        <div className="container private-ai-grid">
          <div>
            <span className="enterprise-badge">
              <ShieldCheck size={17} />
              قابلیت سازمانی · قابل ارائه در پروژه مستقل
            </span>
            <h2>
              هوش مصنوعی خصوصی
              <br />
              برای شرکت شما.
            </h2>
            <p>
              دانش شرکت نباید میان پوشه‌ها و افراد پراکنده بماند. یک دستیار اختصاصی می‌تواند با تکیه
              بر منابع مجاز، به پرسش‌های تیم و مشتریان پاسخ دهد.
            </p>
            <ul className="check-list">
              <li>
                <Check size={16} />
                اسناد شرکت، کاتالوگ‌ها و راهنماهای فنی
              </li>
              <li>
                <Check size={16} />
                بازیابی منابع مرتبط و پاسخ با ارجاع (RAG)
              </li>
              <li>
                <Check size={16} />
                استقرار خصوصی و سطح دسترسی متناسب با نقش‌ها
              </li>
              <li>
                <Check size={16} />
                ارزیابی پاسخ‌ها و ثبت رویدادهای قابل پیگیری
              </li>
            </ul>
            <Link className="button button-lime" to="/quote?consultation=1">
              گفت‌وگو درباره نیاز سازمان
              <ArrowUpLeft size={17} />
            </Link>
          </div>
          <div className="private-ai-diagram">
            <div className="private-boundary-title">
              <LockKeyhole size={16} />
              <span>محیط کنترل‌شده شرکت شما</span>
            </div>
            <div className="private-sources">
              <div>
                <FileText size={24} />
                <span>اسناد شرکت</span>
              </div>
              <div>
                <BookOpen size={24} />
                <span>راهنماهای فنی</span>
              </div>
              <div>
                <Boxes size={24} />
                <span>کاتالوگ</span>
              </div>
            </div>
            <div className="diagram-line" />
            <div className="private-core">
              <span className="ai-icon">
                <Sparkles size={28} />
              </span>
              <b>دستیار دانش سازمانی</b>
              <span>بازیابی منابع مجاز + پاسخ مستند</span>
            </div>
            <div className="diagram-line" />
            <div className="private-access">
              <span>
                <Server size={17} />
                استقرار اختصاصی
              </span>
              <span>
                <ShieldCheck size={17} />
                دسترسی نقش‌محور
              </span>
            </div>
            <p>این بخش معرفی راهکار است؛ در نسخه نمایشی پیاده‌سازی نشده است.</p>
          </div>
        </div>
      </section>
      <div className="container">
        <section className="section">
          <SectionHeading
            eyebrow="تجهیزات برق، فقط یک نقطه شروع است"
            title="یک زیرساخت، متناسب با صنعت شما"
            description="ساختار کاتالوگ و منطق پاسخ‌گویی برای هر کسب‌وکار بازتعریف می‌شود."
          />
          <div className="industry-grid">
            {[
              [Factory, 'تجهیزات صنعتی'],
              [Wrench, 'ابزارآلات'],
              [Car, 'قطعات خودرو'],
              [Building2, 'تجهیزات ساختمانی'],
              [FlaskConical, 'تجهیزات آزمایشگاهی'],
              [Boxes, 'عمده‌فروشی'],
              [Truck, 'توزیع‌کنندگان'],
              [BriefcaseBusiness, 'شرکت‌های B2B'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Factory;
              return (
                <div key={label as string}>
                  <I size={23} strokeWidth={1.5} />
                  <span>{label as string}</span>
                </div>
              );
            })}
          </div>
        </section>
        <section className="section">
          <SectionHeading eyebrow="مسیر اجرای پروژه" title="شفاف، مرحله‌به‌مرحله و متناسب با شما" />
          <ol className="implementation-grid">
            {process.map((s, i) => (
              <li key={s}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <h3>{s}</h3>
              </li>
            ))}
          </ol>
        </section>
        <section className="section">
          <SectionHeading title="پیش از شروع، بدانید" />
          <div className="faq-list">
            {[
              [
                'آیا این سیستم جایگزین تیم فروش می‌شود؟',
                'خیر. هدف، در دسترس قرار دادن اطلاعات و کاهش کارهای تکراری است تا تیم فروش روی مشاوره، مذاکره و پیگیری تمرکز کند.',
              ],
              [
                'آیا از اطلاعات فعلی ما می‌توان استفاده کرد؟',
                'فایل‌های Excel، خروجی ERP، کاتالوگ و اسناد فنی بررسی می‌شوند. کیفیت و ساختار داده، دامنه پاک‌سازی و انتقال را مشخص می‌کند.',
              ],
              [
                'آیا امکان اتصال به نرم‌افزارهای فعلی وجود دارد؟',
                'در صورت وجود API یا راه دسترسی مناسب، اتصال به موجودی، CRM و ERP در دامنه پروژه تعریف می‌شود. این اتصال‌ها در دمو فعال نیستند.',
              ],
              [
                'آیا افزایش فروش تضمین می‌شود؟',
                'خیر. سیستم ابزارهایی برای بهبود دسترسی به اطلاعات، پاسخ‌گویی و پیگیری فراهم می‌کند. نتیجه به عوامل متعدد کسب‌وکار و اجرای درست وابسته است.',
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={17} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="final-cta">
          <div>
            <span className="eyebrow">با یک بررسی کوتاه شروع کنیم</span>
            <h2>اطلاعات شما، چه فرصت‌هایی دارد؟</h2>
            <p>کاتالوگ و فرایند فعلی را بررسی می‌کنیم و یک مسیر اجرایی پیشنهاد می‌دهیم.</p>
          </div>
          <Link className="button button-lime" to="/quote?consultation=1">
            درخواست مشاوره
            <ArrowLeft size={18} />
          </Link>
        </section>
      </div>
    </div>
  );
}
