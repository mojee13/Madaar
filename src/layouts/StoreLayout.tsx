import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowUpLeft,
  ArrowLeft,
  FileText,
  Menu,
  X,
  Sparkles,
  GitCompareArrows,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { Logo } from '../components/UI';
import { SearchBox } from '../components/SearchBox';
import { useDemo } from '../hooks/useDemo';
import { number } from '../utils/format';
import { branding } from '../data/brand';
export default function StoreLayout() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const { state, clearComparison } = useDemo();
  useEffect(() => setMenu(false), [location.pathname]);
  return (
    <div className="store-shell">
      <div className="announcement">
        <div className="container">
          <span>
            یک تجربه واقعی از آینده فروش <span className="announcement-divider">/</span>{' '}
            <b>نسخه نمایشی مدار</b>
          </span>
          <Link to="/admin">
            تجربه پنل کسب‌وکار
            <ArrowUpLeft size={15} />
          </Link>
        </div>
      </div>
      <header className="site-header">
        <div className="container main-nav">
          <Logo />
          <nav className="desktop-nav" aria-label="ناوبری اصلی">
            <NavLink to="/" end>
              خانه
            </NavLink>
            <NavLink to="/catalog">
              محصولات
              <ChevronDown size={13} />
            </NavLink>
            <NavLink to="/assistant">
              دستیار هوشمند
              <Sparkles size={14} />
            </NavLink>
            <NavLink to="/solutions">راهکار کسب‌وکار</NavLink>
          </nav>
          <div className="nav-actions">
            <Link
              to="/catalog?saved=1"
              className="icon-button desktop-only"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart size={20} />
            </Link>
            <Link
              to="/quote"
              className="icon-button quote-nav"
              aria-label={`لیست استعلام، ${number(state.quoteItems.length)} محصول`}
            >
              <FileText size={20} />
              {state.quoteItems.length > 0 && <span>{number(state.quoteItems.length)}</span>}
            </Link>
            <Link className="button button-primary nav-demo" to="/demo">
              مشاهده دمو سیستم
              <ArrowUpLeft size={16} />
            </Link>
            <button
              className="icon-button mobile-menu-button"
              aria-label={menu ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="mobile-nav container" aria-label="منوی موبایل">
            <Link to="/catalog">محصولات</Link>
            <Link to="/assistant">دستیار هوشمند</Link>
            <Link to="/recommend">انتخاب هوشمند محصول</Link>
            <Link to="/solutions">راهکار کسب‌وکار</Link>
            <Link to="/demo">تور دمو</Link>
            <Link to="/admin">ورود آزمایشی به پنل</Link>
            <SearchBox />
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              از اطلاعات پراکنده، تا یک مسیر روشن برای فروش.
              <br />
              مدار، زیرساخت دیجیتال کسب‌وکار شما.
            </p>
            <span className="footer-demo-tag">
              Demo environment <span /> محیط نمایشی
            </span>
          </div>
          <div>
            <h3>تجربه مشتری</h3>
            <Link to="/catalog">کاتالوگ محصولات</Link>
            <Link to="/assistant">دستیار هوشمند</Link>
            <Link to="/compare">مقایسه محصولات</Link>
            <Link to="/quote">درخواست استعلام</Link>
          </div>
          <div>
            <h3>برای کسب‌وکار شما</h3>
            <Link to="/solutions">راهکارهای مدار</Link>
            <Link to="/admin">پنل مدیریت</Link>
            <Link to="/demo">تور پنج‌دقیقه‌ای</Link>
            <Link to="/solutions#private-ai">هوش مصنوعی خصوصی</Link>
          </div>
          <div>
            <h3>گفت‌وگو را شروع کنیم</h3>
            <p>
              {branding.city}
              <br />
              اطلاعات تماس نمونه
            </p>
            <a href={`mailto:${branding.email}`} dir="ltr">
              {branding.email}
            </a>
            <Link to="/quote?consultation=1" className="text-link">
              درخواست مشاوره
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>
            این وب‌سایت نسخه نمایشی است و اطلاعات محصولات و قیمت‌ها صرفاً برای نمایش قابلیت‌های
            سیستم استفاده شده‌اند.
          </p>
          <p>نام برندها برای معرفی نمونه‌ها آمده است؛ هیچ نمایندگی یا همکاری رسمی ادعا نمی‌شود.</p>
          <span>© ۲۰۲۶ مدار · طراحی‌شده برای رشد کسب‌وکار</span>
        </div>
      </footer>
      {location.pathname !== '/assistant' && (
        <Link
          to="/assistant"
          className={`assistant-fab ${state.comparison.length ? 'raised' : ''}`}
          aria-label="گفت‌وگو با دستیار هوشمند"
        >
          <Sparkles size={23} />
          <span>از مدار بپرسید</span>
        </Link>
      )}
      {state.comparison.length > 0 && location.pathname !== '/compare' && (
        <div className="comparison-dock">
          <GitCompareArrows size={20} />
          <span>
            <b>{number(state.comparison.length)} محصول</b> برای مقایسه
          </span>
          <Link className="button button-primary button-small" to="/compare">
            مقایسه
            <ArrowLeft size={16} />
          </Link>
          <button
            className="icon-button"
            onClick={clearComparison}
            aria-label="پاک کردن لیست مقایسه"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
