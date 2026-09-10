import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, GitCompareArrows, Plus, Check } from 'lucide-react';
import type { CategoryId, Product } from '../types';
import { asset, number, price } from '../utils/format';
import { useDemo } from '../hooks/useDemo';
import { AvailabilityBadge } from './UI';
const sprite: Record<CategoryId, [number, number]> = {
  breaker: [0, 0],
  contactor: [50, 0],
  power: [100, 0],
  inverter: [0, 50],
  cable: [50, 50],
  relay: [100, 50],
  panel: [0, 100],
  sensor: [50, 100],
  meter: [100, 100],
};
export function ProductImage({
  category,
  className = '',
  label,
}: {
  category: CategoryId;
  className?: string;
  label?: string;
}) {
  const [x, y] = sprite[category];
  return (
    <div
      role="img"
      aria-label={label ?? 'تصویر نمایشی دسته محصول'}
      className={`product-image ${className}`}
      style={{
        backgroundImage: `url(${asset('images/category-grid.webp')})`,
        backgroundPosition: `${x}% ${y}%`,
      }}
    />
  );
}
export function ProductCard({
  product: p,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const { state, toggleFavorite, toggleComparison, addToQuote } = useDemo();
  const compared = state.comparison.includes(p.id);
  if (compact)
    return (
      <Link className="product-mini" to={`/product/${p.id}`}>
        <ProductImage category={p.category} label={p.name} />
        <span>
          <b>{p.name}</b>
          <small dir="ltr">{p.model}</small>
          <span className="mini-price">{price(p.price)}</span>
        </span>
        <ArrowLeft size={17} />
      </Link>
    );
  return (
    <article className="product-card">
      <div className="product-visual">
        <Link to={`/product/${p.id}`} aria-label={`مشاهده ${p.name}`}>
          <ProductImage category={p.category} label={`تصویر نمایشی ${p.name}`} />
        </Link>
        <span className="product-brand" dir="ltr">
          {p.brand === 'Schneider Electric'
            ? 'Schneider'
            : p.brand === 'Madar Electric'
              ? 'MADAR'
              : p.brand}
        </span>
        <button
          className={`icon-button favorite ${state.favorites.includes(p.id) ? 'is-favorite' : ''}`}
          onClick={() => toggleFavorite(p.id)}
          aria-label={
            state.favorites.includes(p.id) ? `حذف ${p.name} از علاقه‌مندی‌ها` : `ذخیره ${p.name}`
          }
          aria-pressed={state.favorites.includes(p.id)}
        >
          <Heart size={18} />
        </button>
      </div>
      <div className="product-body">
        <div className="product-model" dir="ltr">
          {p.model}
        </div>
        <Link to={`/product/${p.id}`}>
          <h3>{p.name}</h3>
        </Link>
        <div className="product-meta">
          <span>{number(p.voltage)} ولت</span>
          <span>{number(p.current)} آمپر</span>
          <span>{p.specs['تعداد پل'] ?? p.specs['نصب'] ?? p.application}</span>
        </div>
        <AvailabilityBadge value={p.availability} />
        <div className="product-bottom">
          <div className="product-price">
            {p.price === null ? (
              'تماس برای قیمت'
            ) : (
              <>
                <b>{number(p.price)}</b>
                <small>تومان</small>
              </>
            )}
          </div>
          <button
            className={`icon-button compare-button ${compared ? 'selected' : ''}`}
            aria-label={`مقایسه ${p.name}`}
            aria-pressed={compared}
            onClick={() => toggleComparison(p.id)}
          >
            {compared ? <Check size={18} /> : <GitCompareArrows size={18} />}
          </button>
        </div>
        <button className="product-quote" onClick={() => addToQuote(p.id)}>
          افزودن به استعلام
          <Plus size={16} />
        </button>
      </div>
    </article>
  );
}
