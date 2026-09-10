import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Package,
  Eye,
  FileText,
  Sparkles,
  ArrowLeft,
  ArrowUpLeft,
  TrendingUp,
  Upload,
  Plus,
  CalendarDays,
  Search,
  MousePointerClick,
} from 'lucide-react';
import { PageHeader, Notice } from '../components/UI';
import { VisitsChart, CategoryChart } from '../components/Charts';
import { ProductImage } from '../components/ProductCard';
import { useDemo } from '../hooks/useDemo';
import { number, date } from '../utils/format';
import {
  weeklyVisits,
  weeklyLabels,
  monthlyVisits,
  monthlyLabels,
  topProducts,
  sampleSearches,
} from '../data/analytics';
export default function AdminDashboard({ analytics = false }: { analytics?: boolean }) {
  const { state } = useDemo();
  const [period, setPeriod] = useState('week');
  const monthly = period === 'month';
  const values = monthly ? monthlyVisits : weeklyVisits;
  const labels = monthly ? monthlyLabels : weeklyLabels;
  const events = (type: string) => state.events.filter((e) => e.type === type).length;
  const metrics = analytics
    ? [
        {
          label: 'بازدید وب‌سایت',
          value: number(values.reduce((n, v) => n + v, 0)),
          icon: Eye,
          delta: '۱۲.۸٪',
          sub: 'در بازه نمونه',
        },
        {
          label: 'نرخ تبدیل به استعلام',
          value: monthly ? '۱.۴۸٪' : '۱.۵۲٪',
          icon: MousePointerClick,
          delta: '۰.۳٪',
          sub: 'استعلام ÷ بازدید نمونه',
        },
        {
          label: 'گفت‌وگو با دستیار',
          value: number(monthly ? 2140 : 642),
          icon: Sparkles,
          delta: '۲۴.۶٪',
          sub: 'تعامل نمونه',
        },
        {
          label: 'سرنخ فروش ایجادشده',
          value: number(monthly ? 438 : 128),
          icon: FileText,
          delta: '۱۸.۲٪',
          sub: 'درخواست نمونه',
        },
      ]
    : [
        {
          label: 'محصولات کاتالوگ',
          value: number(state.products.length),
          icon: Package,
          delta: null,
          sub: 'محصول در این نسخه',
        },
        {
          label: 'بازدید هفتگی',
          value: '۸٬۴۲۰',
          icon: Eye,
          delta: '۱۲.۸٪',
          sub: 'نسبت به هفته قبل · نمونه',
        },
        {
          label: 'استعلام‌های این مرورگر',
          value: number(state.quotes.length),
          icon: FileText,
          delta: null,
          sub: 'درخواست‌های ثبت‌شده شما',
        },
        {
          label: 'گفت‌وگو با دستیار',
          value: number(events('ai')),
          icon: Sparkles,
          delta: null,
          sub: 'پیام‌های شما در این مرورگر',
        },
      ];
  return (
    <>
      <PageHeader
        eyebrow={analytics ? 'رفتار مشتری، به زبان داده' : 'فضای کاری تجهیزات برق مدار'}
        title={analytics ? 'آمار و تحلیل کسب‌وکار' : 'یک نگاه به نبض کسب‌وکار'}
        description={
          analytics
            ? 'محصولات موردتوجه و مسیر تبدیل بازدید به درخواست را بررسی کنید.'
            : 'از کاتالوگ تا آخرین استعلام؛ هر آنچه برای قدم بعدی نیاز دارید.'
        }
      >
        <div className="header-button-row">
          {analytics ? (
            <label className="period-select">
              <CalendarDays size={17} />
              <select
                aria-label="بازه زمانی آمار"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">این هفته · نمونه</option>
                <option value="month">این ماه · نمونه</option>
              </select>
            </label>
          ) : (
            <>
              <Link to="/admin/import" className="button button-outline button-small">
                <Upload size={16} />
                ورود از Excel
              </Link>
              <Link to="/admin/products?new=1" className="button button-primary button-small">
                <Plus size={17} />
                محصول جدید
              </Link>
            </>
          )}
        </div>
      </PageHeader>
      <div className="dashboard-stat-grid">
        {metrics.map((m) => (
          <article className="stat-card" key={m.label}>
            <div>
              <span>{m.label}</span>
              <m.icon size={19} />
            </div>
            <strong>{m.value}</strong>
            <small>
              {m.delta && (
                <b>
                  <TrendingUp size={13} />
                  {m.delta}
                </b>
              )}
              {m.sub}
            </small>
          </article>
        ))}
      </div>
      <div className="analytics-label">
        <span className="sample-dot" />
        نمودارها و درصد رشد زیر نمونه‌اند؛ شاخص‌های «این مرورگر» از تعاملات شما محاسبه می‌شوند.
      </div>
      <div className="dashboard-chart-grid">
        <section className="panel chart-panel">
          <div className="section-heading">
            <div>
              <h2>روند بازدید وب‌سایت</h2>
              <p>فرصت‌های تازه، با هر بازدید</p>
            </div>
            {!analytics && (
              <label className="period-select">
                <select
                  aria-label="بازه نمودار"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="week">این هفته</option>
                  <option value="month">این ماه</option>
                </select>
              </label>
            )}
            <span className="tag">داده نمونه</span>
          </div>
          <div className="chart-top-number">
            <strong>{number(values.reduce((n, v) => n + v, 0))}</strong>
            <span>
              <TrendingUp size={15} />
              ۱۲.۸٪ رشد نمونه
            </span>
          </div>
          <VisitsChart values={values} labels={labels} />
        </section>
        <section className="panel chart-panel">
          <div className="section-heading">
            <div>
              <h2>محبوب‌ترین دسته‌ها</h2>
              <p>سهم از بازدید محصولات · نمونه</p>
            </div>
          </div>
          <CategoryChart />
        </section>
      </div>
      {analytics ? (
        <>
          <div className="dashboard-detail-grid">
            <section className="panel">
              <div className="section-heading">
                <h2>جست‌وجوهای برتر</h2>
                <Search size={19} />
              </div>
              <div className="search-ranking">
                {sampleSearches.map((s, i) => (
                  <div key={s.term}>
                    <span className="rank-number">{number(i + 1)}</span>
                    <div>
                      <b>{s.term}</b>
                      <span
                        className="search-rank-bar"
                        style={{ width: `${(s.count / 284) * 100}%` }}
                      />
                    </div>
                    <strong>{number(s.count)}</strong>
                    <small>+{number(s.change)}٪</small>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel funnel-panel">
              <div className="section-heading">
                <div>
                  <h2>مسیر تبدیل مشتری</h2>
                  <p>اعداد نمونه یک هفته</p>
                </div>
                <MousePointerClick size={19} />
              </div>
              {[
                ['بازدید وب‌سایت', 8420, 100],
                ['مشاهده محصول', 3120, 76],
                ['تعامل با دستیار', 642, 51],
                ['درخواست استعلام', 128, 28],
              ].map(([label, value, width], i) => (
                <div className="funnel-step" key={label as string}>
                  <div>
                    <span>{label}</span>
                    <b>{number(value as number)}</b>
                  </div>
                  <div style={{ width: `${width}%`, opacity: 1 - i * 0.15 }} />
                </div>
              ))}
              <Notice>
                این اعداد یک سناریوی نمونه‌اند؛ برای تحلیل واقعی، رویدادها باید به ابزار آمار یا API
                شما متصل شوند.
              </Notice>
            </section>
          </div>
          <section className="panel local-activity">
            <div className="section-heading">
              <div>
                <span className="eyebrow">داده واقعی همین دمو</span>
                <h2>تعاملات شما در این مرورگر</h2>
              </div>
              <span className="tag">محلی</span>
            </div>
            <div className="local-metrics">
              <div>
                <Eye />
                <strong>{number(events('view'))}</strong>
                <span>مشاهده محصول</span>
              </div>
              <div>
                <Search />
                <strong>{number(events('search'))}</strong>
                <span>جست‌وجو</span>
              </div>
              <div>
                <Sparkles />
                <strong>{number(events('ai'))}</strong>
                <span>پیام به دستیار</span>
              </div>
              <div>
                <FileText />
                <strong>{number(state.quotes.length)}</strong>
                <span>استعلام ثبت‌شده</span>
              </div>
            </div>
            {state.events.filter((e) => e.type === 'search').length > 0 && (
              <div className="recent-search-chips">
                {state.events
                  .filter((e) => e.type === 'search')
                  .slice(-6)
                  .reverse()
                  .map((e, i) => (
                    <span className="tag" key={i}>
                      {e.value}
                    </span>
                  ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="dashboard-detail-grid">
          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>آخرین درخواست‌ها</h2>
                <p>استعلام‌های ثبت‌شده در همین مرورگر</p>
              </div>
              <Link to="/admin/quotes" className="text-link">
                همه
                <ArrowLeft size={15} />
              </Link>
            </div>
            {state.quotes.length ? (
              <div className="recent-quote-list">
                {state.quotes.slice(0, 4).map((q) => (
                  <Link to="/admin/quotes" key={q.id}>
                    <span className="request-avatar">{q.name.slice(0, 1)}</span>
                    <span>
                      <b>{q.company || q.name}</b>
                      <small>
                        {date(q.createdAt)} · {number(q.items.length)} محصول
                      </small>
                    </span>
                    <span className={`status-pill status-${q.status}`}>
                      {q.status === 'new'
                        ? 'جدید'
                        : q.status === 'reviewed'
                          ? 'در حال بررسی'
                          : 'پاسخ داده شده'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty">
                <FileText size={30} />
                <b>اولین استعلام را ثبت کنید</b>
                <p>مسیر مشتری را تجربه کنید؛ درخواست شما همین‌جا ظاهر می‌شود.</p>
                <Link className="button button-outline button-small" to="/catalog">
                  انتخاب محصول
                  <ArrowLeft size={16} />
                </Link>
              </div>
            )}
          </section>
          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>محصولات پربازدید</h2>
                <p>رتبه‌بندی نمونه</p>
              </div>
              <Link to="/admin/products" className="text-link">
                مدیریت
                <ArrowLeft size={15} />
              </Link>
            </div>
            <div className="top-product-list">
              {topProducts.map((x) => {
                const p = state.products.find((p) => p.id === x.id);
                return (
                  p && (
                    <Link to={`/product/${p.id}`} key={p.id}>
                      <ProductImage category={p.category} />
                      <span>
                        <b>{p.name}</b>
                        <small dir="ltr">{p.model}</small>
                      </span>
                      <div>
                        <strong>{number(x.views)}</strong>
                        <small>بازدید</small>
                      </div>
                    </Link>
                  )
                );
              })}
            </div>
          </section>
        </div>
      )}
      <div className="dashboard-ai-banner">
        <span className="ai-icon">
          <Sparkles size={25} />
        </span>
        <div>
          <h2>یک محصول. شش نوع محتوا.</h2>
          <p>توضیح محصول، محتوای سئو و کپشن را از اطلاعات کاتالوگ بسازید.</p>
        </div>
        <Link to="/admin/content" className="button button-primary">
          تجربه استودیوی محتوا
          <ArrowUpLeft size={17} />
        </Link>
      </div>
    </>
  );
}
