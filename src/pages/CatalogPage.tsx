import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  List,
  Heart,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Breadcrumb, EmptyState, PageHeader } from '../components/UI';
import { ProductCard } from '../components/ProductCard';
import { SearchBox } from '../components/SearchBox';
import { useDemo } from '../hooks/useDemo';
import { brands, categories, applications } from '../data/products';
import { searchProducts } from '../services/search';
import { number } from '../utils/format';
export default function CatalogPage() {
  const { state } = useDemo();
  const [params, setParams] = useSearchParams();
  const [mobileFilters, setMobileFilters] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [shown, setShown] = useState(12);
  const set = (key: string, value: string) => {
    const n = new URLSearchParams(params);
    if (value) n.set(key, value);
    else n.delete(key);
    setParams(n, { replace: true });
  };
  const results = useMemo(() => {
    let p = searchProducts(state.products, params.get('q') ?? '');
    p = p.filter(
      (p) =>
        (!params.get('category') || p.category === params.get('category')) &&
        (!params.get('brand') || p.brand === params.get('brand')) &&
        (!params.get('voltage') || p.voltage === Number(params.get('voltage'))) &&
        (!params.get('current') || p.current >= Number(params.get('current'))) &&
        (!params.get('application') || p.application === params.get('application')) &&
        (!params.get('availability') || p.availability === params.get('availability')) &&
        (!params.get('price') || (p.price !== null && p.price <= Number(params.get('price')))) &&
        (!params.get('saved') || state.favorites.includes(p.id)) &&
        (!params.get('recent') || state.recent.includes(p.id)),
    );
    if (params.get('sort') === 'price-asc')
      p.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (params.get('sort') === 'price-desc') p.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    if (params.get('sort') === 'name') p.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
    if (params.get('sort') === 'stock') p.sort((a, b) => b.stock - a.stock);
    return p;
  }, [state.products, state.favorites, state.recent, params]);
  useEffect(() => setShown(12), [params]);
  const filterCount = [...params.keys()].filter((k) => k !== 'sort').length;
  const filters = (
    <>
      <div className="filter-heading">
        <h2>
          <SlidersHorizontal size={18} />
          فیلتر محصولات
        </h2>
        <button className="text-button" onClick={() => setParams({})}>
          پاک کردن
        </button>
        <button
          className="icon-button mobile-only"
          onClick={() => setMobileFilters(false)}
          aria-label="بستن فیلترها"
        >
          <X size={19} />
        </button>
      </div>
      <fieldset>
        <legend>دسته‌بندی</legend>
        <label className="filter-radio">
          <input
            type="radio"
            name="category"
            checked={!params.get('category')}
            onChange={() => set('category', '')}
          />
          همه محصولات<span>{number(state.products.length)}</span>
        </label>
        {categories.map((c) => (
          <label className="filter-radio" key={c.id}>
            <input
              type="radio"
              name="category"
              checked={params.get('category') === c.id}
              onChange={() => set('category', c.id)}
            />
            {c.name}
            <span>{number(state.products.filter((p) => p.category === c.id).length)}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>برند سازنده</legend>
        <select
          aria-label="برند سازنده"
          value={params.get('brand') ?? ''}
          onChange={(e) => set('brand', e.target.value)}
        >
          <option value="">همه برندها</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </fieldset>
      <fieldset className="filter-dual">
        <legend>مشخصات الکتریکی</legend>
        <label>
          ولتاژ
          <select
            value={params.get('voltage') ?? ''}
            onChange={(e) => set('voltage', e.target.value)}
          >
            <option value="">همه</option>
            {[12, 24, 230, 400, 600].map((v) => (
              <option key={v} value={v}>
                {number(v)} ولت
              </option>
            ))}
          </select>
        </label>
        <label>
          حداقل جریان
          <select
            value={params.get('current') ?? ''}
            onChange={(e) => set('current', e.target.value)}
          >
            <option value="">همه</option>
            {[5, 10, 16, 18, 25, 32, 63, 100].map((v) => (
              <option key={v} value={v}>
                {number(v)} آمپر
              </option>
            ))}
          </select>
        </label>
      </fieldset>
      <fieldset>
        <legend>کاربرد</legend>
        <select
          aria-label="کاربرد محصول"
          value={params.get('application') ?? ''}
          onChange={(e) => set('application', e.target.value)}
        >
          <option value="">همه کاربردها</option>
          {applications.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </fieldset>
      <fieldset>
        <legend>وضعیت تأمین</legend>
        <select
          aria-label="وضعیت تأمین"
          value={params.get('availability') ?? ''}
          onChange={(e) => set('availability', e.target.value)}
        >
          <option value="">همه محصولات</option>
          <option value="in-stock">موجود در انبار</option>
          <option value="limited">موجودی محدود</option>
          <option value="order">قابل سفارش</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>حداکثر قیمت نمونه</legend>
        <select
          aria-label="حداکثر قیمت"
          value={params.get('price') ?? ''}
          onChange={(e) => set('price', e.target.value)}
        >
          <option value="">بدون محدودیت</option>
          {[1000000, 3000000, 5000000, 10000000, 30000000].map((v) => (
            <option key={v} value={v}>
              {number(v)} تومان
            </option>
          ))}
        </select>
      </fieldset>
      <Link className="filter-ai" to="/recommend">
        <Sparkles size={21} />
        <b>انتخاب سخت شده؟</b>
        <span>نیاز پروژه را بگویید، گزینه‌های مرتبط را ببینید.</span>
        <span className="text-link">
          انتخاب هوشمند
          <ArrowLeft size={16} />
        </span>
      </Link>
      {mobileFilters && (
        <button
          className="button button-primary full-width"
          onClick={() => setMobileFilters(false)}
        >
          نمایش {number(results.length)} محصول
        </button>
      )}
    </>
  );
  return (
    <div className="container catalog-page">
      <Breadcrumb items={[{ label: 'کاتالوگ محصولات' }]} />
      <PageHeader
        eyebrow="کاتالوگ تجهیزات برق و اتوماسیون"
        title={
          params.get('saved')
            ? 'محصولات ذخیره‌شده'
            : params.get('recent')
              ? 'بازدیدهای اخیر'
              : 'تجهیزات مناسب، برای هر پروژه'
        }
        description="مشخصات را بررسی کنید، گزینه‌ها را مقایسه کنید و یک‌جا استعلام بگیرید."
      >
        <Link to="/recommend" className="button button-outline">
          <Sparkles size={17} />
          انتخاب هوشمند محصول
        </Link>
      </PageHeader>
      <div className="catalog-search">
        <SearchBox key={params.get('q') ?? 'all'} initial={params.get('q') ?? ''} large />
      </div>
      <div className="catalog-layout">
        <aside className={`catalog-filters ${mobileFilters ? 'open' : ''}`}>{filters}</aside>
        {mobileFilters && (
          <button
            className="mobile-backdrop"
            aria-label="بستن فیلترها"
            onClick={() => setMobileFilters(false)}
          />
        )}
        <div className="catalog-results">
          <div className="catalog-toolbar">
            <div>
              <button
                className="button button-outline button-small mobile-only"
                onClick={() => setMobileFilters(true)}
              >
                <SlidersHorizontal size={16} />
                فیلترها{filterCount > 0 && ` (${number(filterCount)})`}
              </button>
              <span>
                <b>{number(results.length)}</b> محصول{params.get('q') && ' مرتبط'}
              </span>
            </div>
            <div>
              <label className="sort-label">
                مرتب‌سازی:
                <select
                  aria-label="مرتب‌سازی محصولات"
                  value={params.get('sort') ?? ''}
                  onChange={(e) => set('sort', e.target.value)}
                >
                  <option value="">مرتبط‌ترین</option>
                  <option value="price-asc">ارزان‌ترین</option>
                  <option value="price-desc">گران‌ترین</option>
                  <option value="stock">بیشترین موجودی</option>
                  <option value="name">نام محصول</option>
                </select>
              </label>
              <div className="view-switch">
                <button
                  className={layout === 'grid' ? 'active' : ''}
                  onClick={() => setLayout('grid')}
                  aria-label="نمایش شبکه‌ای"
                  aria-pressed={layout === 'grid'}
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  className={layout === 'list' ? 'active' : ''}
                  onClick={() => setLayout('list')}
                  aria-label="نمایش فهرستی"
                  aria-pressed={layout === 'list'}
                >
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>
          {filterCount > 0 && (
            <div className="active-filters">
              {[...params.entries()]
                .filter(([k]) => k !== 'sort')
                .map(([k, v]) => (
                  <button key={k} onClick={() => set(k, '')}>
                    {k === 'category' ? (
                      categories.find((c) => c.id === v)?.name
                    ) : k === 'saved' ? (
                      <>
                        <Heart size={13} />
                        علاقه‌مندی‌ها
                      </>
                    ) : k === 'recent' ? (
                      'بازدیدهای اخیر'
                    ) : k === 'availability' ? (
                      { 'in-stock': 'موجود', limited: 'محدود', order: 'سفارشی' }[v]
                    ) : k === 'price' ? (
                      `تا ${number(Number(v))} تومان`
                    ) : k === 'current' ? (
                      `حداقل ${number(Number(v))} آمپر`
                    ) : k === 'voltage' ? (
                      `${number(Number(v))} ولت`
                    ) : (
                      v
                    )}
                    <X size={13} />
                  </button>
                ))}
            </div>
          )}
          {results.length ? (
            <>
              <div
                className={`product-grid catalog-product-grid ${layout === 'list' ? 'list-layout' : ''}`}
              >
                {results.slice(0, shown).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="catalog-pagination">
                <span>
                  نمایش {number(Math.min(shown, results.length))} از {number(results.length)} محصول
                </span>
                {shown < results.length && (
                  <button className="button button-outline" onClick={() => setShown(shown + 12)}>
                    نمایش محصولات بیشتر
                    <ArrowLeft size={16} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              title="محصولی با این مشخصات پیدا نشد"
              description="یکی از فیلترها را حذف کنید یا عبارت دیگری بنویسید."
            >
              <button className="button button-primary" onClick={() => setParams({})}>
                <Search size={17} />
                نمایش همه محصولات
              </button>
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
