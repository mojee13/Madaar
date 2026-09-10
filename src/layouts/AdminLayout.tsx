import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  Sparkles,
  Upload,
  ChartNoAxesCombined,
  ArrowRight,
  RotateCcw,
  Menu,
  X,
  PanelLeftClose,
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from '../components/UI';
import { useDemo } from '../hooks/useDemo';
import { number } from '../utils/format';
const links = [
  ['/admin', 'نمای کلی', LayoutDashboard],
  ['/admin/products', 'مدیریت محصولات', Package],
  ['/admin/quotes', 'درخواست‌های استعلام', FileText],
  ['/admin/analytics', 'آمار و تحلیل', ChartNoAxesCombined],
  ['/admin/content', 'استودیوی محتوای AI', Sparkles],
  ['/admin/import', 'ورود اطلاعات از Excel', Upload],
] as const;
export default function AdminLayout() {
  const { state, reset } = useDemo();
  const [menu, setMenu] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menu ? 'open' : ''}`}>
        <div className="admin-logo">
          <Logo />
          <button
            className="icon-button mobile-only"
            onClick={() => setMenu(false)}
            aria-label="بستن منوی مدیریت"
          >
            <X />
          </button>
        </div>
        <div className="workspace-card">
          <span className="workspace-avatar">م</span>
          <div>
            <b>تجهیزات برق مدار</b>
            <small>فضای کاری نمایشی</small>
          </div>
          <PanelLeftClose size={16} />
        </div>
        <span className="sidebar-label">مدیریت کسب‌وکار</span>
        <nav aria-label="پنل کسب‌وکار">
          {links.map(([to, label, Icon]) => (
            <NavLink end={to === '/admin'} key={to} to={to} onClick={() => setMenu(false)}>
              <Icon size={19} />
              {label}
              {to === '/admin/quotes' && state.quotes.length > 0 && (
                <span className="nav-count">{number(state.quotes.length)}</span>
              )}
              {to === '/admin/content' && <small className="ai-label">AI</small>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={21} />
            <b>کسب‌وکار شما، با مدار</b>
            <p>یک کاتالوگ، یک دستیار و یک مسیر یکپارچه تا فروش.</p>
            <Link to="/demo">
              ادامه تور دمو
              <ArrowRight size={15} />
            </Link>
          </div>
          {confirm ? (
            <div className="reset-confirm">
              <p>محصولات و درخواست‌های محلی پاک شوند؟</p>
              <button
                className="button button-danger button-small"
                onClick={() => {
                  reset();
                  setConfirm(false);
                }}
              >
                بله، بازنشانی
              </button>
              <button
                className="button button-ghost button-small"
                onClick={() => setConfirm(false)}
              >
                انصراف
              </button>
            </div>
          ) : (
            <button className="reset-button" onClick={() => setConfirm(true)}>
              <RotateCcw size={16} />
              بازنشانی داده‌های دمو
            </button>
          )}
          <Link to="/" className="back-to-store">
            <ArrowRight size={17} />
            بازگشت به فروشگاه
          </Link>
        </div>
      </aside>
      {menu && (
        <button
          className="mobile-backdrop"
          aria-label="بستن منوی مدیریت"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <button
              className="icon-button mobile-only"
              onClick={() => setMenu(true)}
              aria-label="باز کردن منوی مدیریت"
            >
              <Menu />
            </button>
            <span className="demo-pill">
              <span />
              حالت نمایشی
            </span>
            <span className="admin-local-label">داده‌ها فقط در این مرورگر ذخیره می‌شوند</span>
          </div>
          <div>
            <Link to="/" className="text-link">
              مشاهده فروشگاه
              <ArrowRight size={15} />
            </Link>
            <span className="admin-user">م</span>
          </div>
        </header>
        <main className="admin-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="admin-footer">
          مدار · پنل نمایشی، بدون احراز هویت واقعی · نمودارها شامل داده‌های نمونه هستند
        </footer>
      </div>
    </div>
  );
}
