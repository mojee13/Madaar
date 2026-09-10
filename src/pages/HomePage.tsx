import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpLeft,
  Sparkles,
  Check,
  FileSpreadsheet,
  Database,
  FileText,
  ChartNoAxesCombined,
  Clock3,
  ShieldCheck,
  SlidersHorizontal,
  Boxes,
  MoveUpRight,
  Play,
  CheckCheck,
  Headphones,
  Globe2,
} from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { ProductCard } from '../components/ProductCard';
import { categoryIcons, SectionHeading } from '../components/UI';
import { SearchBox } from '../components/SearchBox';
import { categories } from '../data/products';
import { asset, number } from '../utils/format';
export default function HomePage() {
  const { state } = useDemo();
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <span /> نسل تازه تجارت دیجیتال <span className="eyebrow-line" />
            </span>
            <h1>
              تجهیزات حرفه‌ای.
              <br />
              انتخاب <span>هوشمندانه.</span>
            </h1>
            <p className="hero-lead">فروش سنتی خود را به یک سیستم فروش هوشمند تبدیل کنید.</p>
            <p className="hero-description">
              از پیدا کردن قطعه مناسب تا دریافت استعلام؛ کاتالوگ دیجیتال، دستیار هوشمند و ابزارهای
              فروش، در یک مسیر یکپارچه.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="button button-primary">
                مشاهده محصولات
                <ArrowLeft size={19} />
              </Link>
              <Link to="/assistant" className="button button-outline">
                <Sparkles size={18} />
                تجربه دستیار هوشمند
              </Link>
            </div>
            <div className="hero-assurance">
              <span>
                <Check size={15} />
                بدون نیاز به ثبت‌نام
              </span>
              <span>
                <Check size={15} />
                آماده برای کسب‌وکار شما
              </span>
            </div>
            <div className="hero-mini-stat">
              <div className="mini-stat-icon">
                <Boxes size={22} />
              </div>
              <div>
                <strong>{number(state.products.length)} محصول تخصصی</strong>
                <span>در {number(categories.length)} دسته تجهیزات برق و اتوماسیون</span>
              </div>
              <Link to="/demo" aria-label="شروع تور دمو">
                <ArrowUpLeft size={22} />
              </Link>
            </div>
          </div>
          <div className="hero-art">
            <img
              src={asset('images/industrial-hero.webp')}
              alt="تصویر نمایشی کلید حفاظتی، کنتاکتور و منبع تغذیه صنعتی روی سکوهای سبز"
              width="1448"
              height="1086"
              fetchPriority="high"
            />
            <div className="hero-art-label">
              <span className="tiny-cross">+</span>
              <span>POWERING SMARTER COMMERCE</span>
              <span>01 / 09</span>
            </div>
            <span className="art-chip">
              <ShieldCheck size={17} />
              اطلاعات فنی، در یک نگاه
            </span>
            <div className="hero-ai-card">
              <div className="ai-icon">
                <Sparkles size={21} />
              </div>
              <div>
                <b>محصول مناسب، سریع‌تر پیدا می‌شود.</b>
                <span>نیازتان را بگویید؛ مدار پیشنهاد می‌دهد.</span>
              </div>
              <Link to="/recommend" aria-label="پیشنهاد هوشمند محصول">
                <ArrowUpLeft size={20} />
              </Link>
            </div>
            <span className="art-caption">تصویر نمایشی تجهیزات</span>
          </div>
        </div>
      </section>
      <section className="brand-strip container" aria-label="برندهای کاتالوگ نمونه">
        <span>
          یک کاتالوگ.
          <br />
          <b>انتخاب‌های حرفه‌ای.</b>
        </span>
        <div className="brand-wordmarks" dir="ltr">
          <b className="schneider">
            Schneider<span>Electric</span>
          </b>
          <b className="abb">ABB</b>
          <b className="siemens">SIEMENS</b>
          <b className="ls">
            LS <small>ELECTRIC</small>
          </b>
          <b className="omron">OMRON</b>
        </div>
        <small>برندهای حاضر در داده‌های نمونه</small>
      </section>
      <section className="catalog-discovery section">
        <div className="container">
          <div className="discovery-top">
            <div>
              <span className="eyebrow">از نیاز شما شروع می‌کنیم</span>
              <h2>دقیقاً دنبال چه تجهیزی هستید؟</h2>
            </div>
            <Link to="/recommend" className="text-link">
              <SlidersHorizontal size={17} />
              برای انتخاب کمک می‌خواهم
              <ArrowLeft size={16} />
            </Link>
          </div>
          <SearchBox large />
          <div className="search-examples">
            <span>مثلاً:</span>
            {['کنتاکتور ۲۵ آمپر اشنایدر', 'کلید مناسب موتور سه فاز', 'منبع تغذیه ۲۴ ولت صنعتی'].map(
              (q) => (
                <Link key={q} to={`/catalog?q=${encodeURIComponent(q)}`}>
                  {q}
                </Link>
              ),
            )}
          </div>
          <div className="category-grid">
            {categories.map((c) => {
              const Icon = categoryIcons[c.id];
              return (
                <Link key={c.id} to={`/catalog?category=${c.id}`} className="category-card">
                  <Icon strokeWidth={1.5} size={27} />
                  <strong>{c.name}</strong>
                  <span>
                    {number(state.products.filter((p) => p.category === c.id).length)} محصول
                    <ArrowUpLeft size={13} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="section container featured-section">
        <SectionHeading
          eyebrow="منتخب کاتالوگ"
          title="برای پروژه بعدی شما"
          description="تجهیزات پرکاربرد با مشخصات روشن و امکان مقایسه."
          link="مشاهده همه محصولات"
          to="/catalog"
        />
        <div className="product-grid">
          {state.products
            .filter((p) => p.featured)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
        <div className="sample-price-note">
          قیمت‌ها نمونه و به تومان هستند؛ شرایط نهایی تأمین در استعلام مشخص می‌شود.
        </div>
      </section>
      <section className="section container">
        <div className="ai-showcase">
          <div className="ai-showcase-copy">
            <span className="eyebrow light-eyebrow">
              <Sparkles size={16} />
              یک همکار آگاه، همیشه در دسترس
            </span>
            <h2>
              فقط جست‌وجو نکنید.
              <br />
              گفت‌وگو کنید.
            </h2>
            <p>
              دستیار مدار نیاز شما را به زبان خودتان می‌شنود، در کاتالوگ جست‌وجو می‌کند و گزینه‌ها
              را با مشخصاتشان کنار هم می‌گذارد.
            </p>
            <ul className="check-list">
              <li>
                <Check size={16} />
                پاسخ متصل به محصولات کاتالوگ
              </li>
              <li>
                <Check size={16} />
                مقایسه و پیشنهاد گزینه‌های جایگزین
              </li>
              <li>
                <Check size={16} />
                یک قدم تا استعلام محصول پیشنهادی
              </li>
            </ul>
            <Link className="button button-lime" to="/assistant">
              از مدار بپرسید
              <ArrowUpLeft size={18} />
            </Link>
            <small className="ai-showcase-note">
              تجربه نمایشی با پاسخ‌های محلی، بدون اتصال به مدل زبانی
            </small>
          </div>
          <div className="chat-preview">
            <div className="chat-preview-head">
              <div className="ai-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <b>دستیار هوشمند مدار</b>
                <span>پاسخ از کاتالوگ تجهیزات برق</span>
              </div>
              <span className="tag">DEMO AI</span>
            </div>
            <div className="preview-question">برای موتور ۷.۵ کیلووات چه کنتاکتوری دارید؟</div>
            <div className="preview-response">
              <span className="ai-small-mark">
                <Sparkles size={16} />
              </span>
              <p>
                با فرض موتور سه‌فاز ۴۰۰ ولت، این گزینه از کاتالوگ نمونه برای بررسی اولیه در دسترس
                است:
              </p>
            </div>
            {state.products.find((p) => p.id === 'p02') && (
              <ProductCard compact product={state.products.find((p) => p.id === 'p02')!} />
            )}
            <div className="reference-line">
              <CheckCheck size={15} />
              مرجع: مشخصات محصول در کاتالوگ
            </div>
            <p className="preview-disclaimer">تطبیق با جریان پلاک و تأیید متخصص ضروری است.</p>
            <Link className="preview-input" to="/assistant">
              <span>سؤال بعدی شما چیست؟</span>
              <span className="send-square">
                <ArrowLeft size={17} />
              </span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="یک مسیر، از اطلاعات تا فرصت فروش"
          title="کسب‌وکار شما چطور هوشمند می‌شود؟"
          description="اطلاعاتی که امروز دارید، نقطه شروع سیستم فروش فردای شماست."
        />
        <div className="pipeline">
          <div className="pipeline-source">
            <FileSpreadsheet size={29} />
            <b>اطلاعات فعلی شرکت</b>
            <span>Excel / ERP / Catalog</span>
          </div>
          <span className="pipeline-connector">
            <ArrowLeft />
          </span>
          <div className="pipeline-middle">
            <div>
              <Database size={23} />
              <b>پردازش و ساختاردهی</b>
              <small>دسته‌بندی، یکپارچه‌سازی، محتوا</small>
            </div>
            <div>
              <Boxes size={23} />
              <b>سیستم فروش دیجیتال</b>
              <small>کاتالوگ و تجربه اختصاصی شما</small>
            </div>
            <div className="pipeline-ai">
              <Sparkles size={23} />
              <b>جست‌وجو و دستیار AI</b>
              <small>پاسخ مرتبط، انتخاب آگاهانه</small>
            </div>
          </div>
          <span className="pipeline-connector">
            <ArrowLeft />
          </span>
          <div className="pipeline-outcomes">
            <div>
              <FileText size={23} />
              <b>سرنخ و استعلام</b>
            </div>
            <div>
              <ChartNoAxesCombined size={23} />
              <b>تحلیل و بهبود</b>
            </div>
          </div>
        </div>
        <Link className="text-link pipeline-link" to="/admin/import">
          انتقال کاتالوگ از Excel را تجربه کنید
          <ArrowLeft size={17} />
        </Link>
      </section>
      <section className="benefits-section section">
        <div className="container">
          <SectionHeading
            eyebrow="فراتر از یک وب‌سایت"
            title="ابزاری برای کار کمتر و فروش بهتر"
            description="سیستمی که به تیم شما زمان می‌دهد و به مشتری شما، پاسخ."
            link="راهکارهای مدار"
            to="/solutions"
          />
          <div className="benefit-grid">
            {[
              [
                Clock3,
                'پاسخ‌گویی، بدون محدودیت ساعت',
                'مشتری هر زمان که بخواهد، مشخصات و گزینه‌های مرتبط را بررسی می‌کند.',
              ],
              [
                Headphones,
                'تماس‌های تکراری کمتر',
                'اطلاعات محصول یک‌جا در دسترس است؛ تیم فروش روی درخواست‌های جدی تمرکز می‌کند.',
              ],
              [
                MoveUpRight,
                'فرصت‌های فروش قابل پیگیری',
                'هر استعلام با محصولات و اطلاعات موردنیاز، وارد مسیر پیگیری می‌شود.',
              ],
              [
                Globe2,
                'یک زیرساخت، بازارهای بیشتر',
                'هویت، کاتالوگ و زبان متناسب با صنعت و بازار هدف شما قابل توسعه است.',
              ],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof Clock3;
              return (
                <article className="benefit-card" key={title as string}>
                  <I size={25} strokeWidth={1.5} />
                  <h3>{title as string}</h3>
                  <p>{description as string}</p>
                </article>
              );
            })}
          </div>
          <div className="metrics-preview">
            <div>
              <span className="tag">نمونه داشبورد کسب‌وکار</span>
              <h3>تصمیم بعدی را با داده بگیرید.</h3>
              <Link to="/admin/analytics" className="text-link">
                مشاهده تحلیل‌ها
                <ArrowLeft size={16} />
              </Link>
            </div>
            <div>
              <strong>۸٬۴۲۰</strong>
              <span>بازدید هفتگی</span>
            </div>
            <div>
              <strong>۱۲۸</strong>
              <span>درخواست استعلام</span>
            </div>
            <div>
              <strong>۶۴۲</strong>
              <span>گفت‌وگو با دستیار</span>
            </div>
            <small>اعداد صرفاً نمایشی‌اند و نتیجه تضمین‌شده نیستند.</small>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="enterprise-teaser">
          <div className="enterprise-icon">
            <ShieldCheck size={35} strokeWidth={1.4} />
          </div>
          <div>
            <span className="eyebrow">راهکار قابل ارائه برای سازمان‌ها</span>
            <h2>دانش شرکت شما. دستیار اختصاصی شما.</h2>
            <p>
              اتصال امن به اسناد، کاتالوگ‌ها و راهنماهای فنی؛ با استقرار خصوصی و دسترسی کنترل‌شده،
              در یک پروژه سازمانی مستقل.
            </p>
          </div>
          <Link to="/solutions#private-ai" className="button button-outline">
            هوش مصنوعی خصوصی
            <ArrowUpLeft size={17} />
          </Link>
        </div>
      </section>
      <section className="container final-cta">
        <div>
          <span className="eyebrow">سیستم بعدی، می‌تواند متعلق به شما باشد.</span>
          <h2>برای فروش هوشمندتر آماده‌اید؟</h2>
          <p>در پنج دقیقه، مسیر کامل یک مشتری و ابزارهای تیم فروش را تجربه کنید.</p>
        </div>
        <div className="cta-buttons">
          <Link to="/demo" className="button button-lime">
            <Play size={17} />
            شروع تور دمو
          </Link>
          <Link to="/quote?consultation=1" className="button button-dark-outline">
            درخواست مشاوره
            <ArrowLeft size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
