import { useId, useMemo, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Sparkles } from 'lucide-react';
import { searchProducts } from '../services/search';
import { useDemo } from '../hooks/useDemo';
import { ProductImage } from './ProductCard';
export function SearchBox({ large = false, initial = '' }: { large?: boolean; initial?: string }) {
  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const navigate = useNavigate();
  const { state, record } = useDemo();
  const results = useMemo(
    () => (q.trim() ? searchProducts(state.products, q).slice(0, 5) : []),
    [q, state.products],
  );
  const go = (value: string) => {
    setOpen(false);
    record('search', q);
    navigate(value);
  };
  function submit(e: FormEvent) {
    e.preventDefault();
    if (q.trim()) go(`/catalog?q=${encodeURIComponent(q)}`);
  }
  function key(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(results.length - 1, a + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    }
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Enter' && open && active >= 0 && results[active]) {
      e.preventDefault();
      go(`/product/${results[active].id}`);
    }
  }
  return (
    <div className={`search-box ${large ? 'search-large' : ''}`}>
      <form role="search" onSubmit={submit}>
        <Search size={20} />
        <input
          role="combobox"
          aria-label="جست‌وجوی محصول، مدل یا نیاز شما"
          aria-autocomplete="list"
          aria-expanded={open && !!q}
          aria-controls={`${id}-results`}
          aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          onKeyDown={key}
          placeholder="نام محصول، مدل یا نیازتان را بنویسید…"
          autoComplete="off"
        />
        <button type="submit" aria-label="جست‌وجو">
          {large ? (
            <>
              <span>جست‌وجو</span>
              <ArrowLeft size={18} />
            </>
          ) : (
            <kbd>↵</kbd>
          )}
        </button>
      </form>
      {open && q && (
        <div
          className="search-results"
          id={`${id}-results`}
          role="listbox"
          aria-label="پیشنهادهای جست‌وجو"
        >
          <div className="search-caption">
            <Sparkles size={14} /> پیشنهادهای هوشمند کاتالوگ
          </div>
          {results.length ? (
            results.map((p, i) => (
              <button
                role="option"
                aria-selected={active === i}
                id={`${id}-${i}`}
                key={p.id}
                className={active === i ? 'active' : ''}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(`/product/${p.id}`)}
              >
                <ProductImage category={p.category} />
                <span>
                  {p.name}
                  <small dir="ltr">
                    {p.brand} · {p.model}
                  </small>
                </span>
                <ArrowLeft size={15} />
              </button>
            ))
          ) : (
            <p className="no-results">محصولی پیدا نشد. نام برند یا نوع تجهیز را امتحان کنید.</p>
          )}
          <button
            role="option"
            aria-selected={false}
            className="search-all"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => go(`/catalog?q=${encodeURIComponent(q)}`)}
          >
            مشاهده همه نتایج
            <ArrowLeft size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
