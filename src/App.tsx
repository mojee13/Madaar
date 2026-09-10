import { Component, Suspense, lazy, useEffect } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import StoreLayout from './layouts/StoreLayout';
import HomePage from './pages/HomePage';
import { DemoProvider, useDemo } from './hooks/useDemo';
import { TourProvider } from './hooks/useTour';
import TourDock from './components/TourDock';
import { Spinner } from './components/UI';
const Catalog = lazy(() => import('./pages/CatalogPage'));
const Product = lazy(() => import('./pages/ProductPage'));
const Assistant = lazy(() => import('./pages/AssistantPage'));
const Compare = lazy(() => import('./pages/ComparePage'));
const Quote = lazy(() => import('./pages/QuotePage'));
const Recommend = lazy(() => import('./pages/RecommendPage'));
const Solutions = lazy(() => import('./pages/SolutionsPage'));
const Demo = lazy(() => import('./pages/DemoPage'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminQuotes = lazy(() => import('./pages/AdminQuotes'));
const ContentStudio = lazy(() => import('./pages/ContentStudio'));
const ImportPage = lazy(() => import('./pages/ImportPage'));
const NotFound = lazy(() => import('./pages/NotFoundPage'));
const titles: Record<string, string> = {
  '/': 'زیرساخت فروش هوشمند',
  '/catalog': 'کاتالوگ تجهیزات برق',
  '/assistant': 'دستیار هوشمند انتخاب محصول',
  '/compare': 'مقایسه فنی محصولات',
  '/quote': 'درخواست استعلام',
  '/recommend': 'انتخاب هوشمند محصول',
  '/demo': 'تور پنج‌دقیقه‌ای دمو',
  '/solutions': 'راهکار فروش دیجیتال کسب‌وکار',
  '/admin': 'پنل کسب‌وکار',
  '/admin/products': 'مدیریت محصولات',
  '/admin/quotes': 'درخواست‌های استعلام',
  '/admin/analytics': 'آمار و تحلیل',
  '/admin/content': 'استودیوی محتوای هوشمند',
  '/admin/import': 'ورود محصولات از Excel',
};
function AppEffects() {
  const location = useLocation();
  const { state } = useDemo();
  useEffect(() => {
    const p = location.pathname.startsWith('/product/')
      ? state.products.find((p) => p.id === location.pathname.split('/').pop())
      : undefined;
    const title = p ? `${p.name} | ${p.model}` : (titles[location.pathname] ?? 'صفحه پیدا نشد');
    document.title = `${title} | مدار`;
    const description = p
      ? p.description
      : `${title} در مدار؛ نسخه نمایشی کاتالوگ، دستیار محصول، مقایسه، استعلام و مدیریت فروش تجهیزات برق.`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    if (location.hash) {
      setTimeout(
        () =>
          document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }),
        250,
      );
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('main-content')?.focus({ preventScroll: true });
    }
  }, [location.pathname, location.hash, state.products]);
  return null;
}
function Feedback() {
  const { toast, storageFailed } = useDemo();
  return (
    <>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
        </div>
      )}
      {storageFailed && (
        <div className="storage-warning" role="alert">
          <AlertCircle size={18} />
          ذخیره محلی در دسترس نیست؛ تغییرات فقط تا بستن صفحه باقی می‌مانند.
        </div>
      )}
    </>
  );
}
class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Madar rendering error', error, info.componentStack);
  }
  render() {
    return this.state.error ? (
      <main className="error-screen" dir="rtl">
        <h1>نمایش این صفحه با مشکل روبه‌رو شد</h1>
        <p>صفحه را دوباره بارگذاری کنید. در صورت تکرار، داده‌های دمو را بازنشانی کنید.</p>
        <button className="button button-primary" onClick={() => window.location.reload()}>
          بارگذاری دوباره
        </button>
        <button
          className="button button-outline"
          onClick={() => {
            if (window.confirm('داده‌های محلی دمو، شامل درخواست‌ها و تغییرات محصول، پاک شوند؟')) {
              localStorage.removeItem('madar-demo-v1');
              window.location.hash = '/';
              window.location.reload();
            }
          }}
        >
          بازنشانی داده‌های دمو
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <DemoProvider>
        <TourProvider>
          <HashRouter>
            <a
              className="skip-link"
              href="#main-content"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('main-content')?.focus();
              }}
            >
              رفتن به محتوای اصلی
            </a>
            <AppEffects />
            <Suspense
              fallback={
                <div className="route-loading">
                  <Spinner />
                </div>
              }
            >
              <Routes>
                <Route element={<StoreLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="catalog" element={<Catalog />} />
                  <Route path="product/:id" element={<Product />} />
                  <Route path="assistant" element={<Assistant />} />
                  <Route path="compare" element={<Compare />} />
                  <Route path="quote" element={<Quote />} />
                  <Route path="recommend" element={<Recommend />} />
                  <Route path="solutions" element={<Solutions />} />
                  <Route path="demo" element={<Demo />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="quotes" element={<AdminQuotes />} />
                  <Route path="analytics" element={<AdminDashboard analytics />} />
                  <Route path="content" element={<ContentStudio />} />
                  <Route path="import" element={<ImportPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
            <TourDock />
            <Feedback />
          </HashRouter>
        </TourProvider>
      </DemoProvider>
    </ErrorBoundary>
  );
}
