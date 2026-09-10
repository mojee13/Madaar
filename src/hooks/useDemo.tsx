import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { DemoState, DemoEvent, Product, QuoteRequest } from '../types';
import { freshState, loadState, saveState } from '../services/storage';
interface DemoContext {
  state: DemoState;
  toast: string;
  notify: (text: string) => void;
  storageFailed: boolean;
  toggleFavorite: (id: string) => void;
  toggleComparison: (id: string) => void;
  clearComparison: () => void;
  setComparison: (ids: string[]) => void;
  addToQuote: (id: string) => void;
  setQuantity: (id: string, n: number) => void;
  removeQuoteItem: (id: string) => void;
  submitQuote: (q: QuoteRequest) => void;
  updateQuote: (id: string, status: QuoteRequest['status']) => void;
  upsertProduct: (p: Product) => void;
  importProducts: (p: Product[]) => void;
  record: (type: DemoEvent['type'], value: string) => void;
  reset: () => void;
}
const Context = createContext<DemoContext | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  useEffect(() => {
    setStorageFailed(!saveState(state));
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const notify = useCallback((text: string) => setToast(text), []);
  const record = useCallback(
    (type: DemoEvent['type'], value: string) =>
      setState((s) => ({
        ...s,
        events: [...s.events, { type, value, at: new Date().toISOString() }].slice(-200),
        recent:
          type === 'view'
            ? [value, ...s.recent.filter((id) => id !== value)].slice(0, 8)
            : s.recent,
      })),
    [],
  );
  const value = useMemo<DemoContext>(
    () => ({
      state,
      toast,
      notify,
      storageFailed,
      record,
      toggleFavorite(id) {
        setState((s) => ({
          ...s,
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        }));
      },
      toggleComparison(id) {
        if (!state.comparison.includes(id) && state.comparison.length >= 4) {
          notify('حداکثر ۴ محصول را می‌توانید مقایسه کنید.');
          return;
        }
        setState((s) => ({
          ...s,
          comparison: s.comparison.includes(id)
            ? s.comparison.filter((x) => x !== id)
            : s.comparison.length < 4
              ? [...s.comparison, id]
              : s.comparison,
        }));
      },
      clearComparison() {
        setState((s) => ({ ...s, comparison: [] }));
      },
      setComparison(ids) {
        setState((s) => ({
          ...s,
          comparison: [...new Set(ids)]
            .filter((id) => s.products.some((p) => p.id === id))
            .slice(0, 4),
        }));
      },
      addToQuote(id) {
        setState((s) => ({
          ...s,
          quoteItems: s.quoteItems.some((i) => i.productId === id)
            ? s.quoteItems.map((i) =>
                i.productId === id ? { ...i, quantity: Math.min(9999, i.quantity + 1) } : i,
              )
            : [...s.quoteItems, { productId: id, quantity: 1 }],
        }));
        notify('محصول به لیست استعلام اضافه شد.');
      },
      setQuantity(id, n) {
        if (!Number.isInteger(n) || n < 1 || n > 9999) return;
        setState((s) => ({
          ...s,
          quoteItems: s.quoteItems.map((i) => (i.productId === id ? { ...i, quantity: n } : i)),
        }));
      },
      removeQuoteItem(id) {
        setState((s) => ({ ...s, quoteItems: s.quoteItems.filter((i) => i.productId !== id) }));
      },
      submitQuote(q) {
        setState((s) => ({
          ...s,
          quotes: [q, ...s.quotes].slice(0, 100),
          quoteItems: [],
          events: [...s.events, { type: 'quote' as const, value: q.id, at: q.createdAt }].slice(
            -200,
          ),
        }));
      },
      updateQuote(id, status) {
        setState((s) => ({
          ...s,
          quotes: s.quotes.map((q) => (q.id === id ? { ...q, status } : q)),
        }));
        notify('وضعیت درخواست به‌روز شد.');
      },
      upsertProduct(p) {
        setState((s) => ({
          ...s,
          products: s.products.some((x) => x.id === p.id)
            ? s.products.map((x) => (x.id === p.id ? p : x))
            : [p, ...s.products],
        }));
        notify('تغییرات در نسخه نمایشی ذخیره شد.');
      },
      importProducts(products) {
        setState((s) => ({
          ...s,
          products: [
            ...products.filter((p) => !s.products.some((x) => x.id === p.id)),
            ...s.products,
          ],
        }));
        notify('محصولات نمونه به کاتالوگ اضافه شدند.');
      },
      reset() {
        setState(freshState());
        notify('داده‌های نمایشی به حالت اولیه برگشتند.');
      },
    }),
    [state, toast, notify, storageFailed, record],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDemo() {
  const c = useContext(Context);
  if (!c) throw new Error('DemoProvider is missing');
  return c;
}
