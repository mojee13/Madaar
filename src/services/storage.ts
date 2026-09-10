import type { DemoState, Product, QuoteRequest } from '../types';
import { initialProducts, categories } from '../data/products';
export const STORAGE_KEY = 'madar-demo-v1';
export const freshState = (): DemoState => ({
  version: 1,
  products: structuredClone(initialProducts),
  favorites: [],
  recent: [],
  comparison: [],
  quoteItems: [],
  quotes: [],
  events: [],
});
const isProduct = (p: unknown): p is Product => {
  if (!p || typeof p !== 'object') return false;
  const v = p as Product;
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.model === 'string' &&
    typeof v.brand === 'string' &&
    categories.some((c) => c.id === v.category) &&
    typeof v.description === 'string' &&
    typeof v.application === 'string' &&
    Number.isFinite(v.stock) &&
    (v.power === null || Number.isFinite(v.power)) &&
    Number.isFinite(v.voltage) &&
    Number.isFinite(v.current) &&
    typeof v.specs === 'object' &&
    v.specs !== null &&
    Array.isArray(v.relatedIds) &&
    Array.isArray(v.alternativeIds) &&
    Array.isArray(v.tags) &&
    ['in-stock', 'limited', 'order'].includes(v.availability) &&
    (v.price === null || Number.isFinite(v.price))
  );
};
export function loadState(): DemoState {
  const fallback = freshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const s = JSON.parse(raw) as Partial<DemoState>;
    if (
      s.version !== 1 ||
      !Array.isArray(s.products) ||
      !s.products.length ||
      !s.products.every(isProduct)
    )
      return fallback;
    const ids = new Set(s.products.map((p) => p.id));
    const list = (v: unknown, max = 100): string[] =>
      Array.isArray(v)
        ? [...new Set(v.filter((x): x is string => typeof x === 'string' && ids.has(x)))].slice(
            0,
            max,
          )
        : [];
    const quotes = Array.isArray(s.quotes)
      ? s.quotes
          .filter(
            (q): q is QuoteRequest =>
              !!q &&
              typeof q.id === 'string' &&
              typeof q.name === 'string' &&
              typeof q.phone === 'string' &&
              typeof q.createdAt === 'string' &&
              !Number.isNaN(Date.parse(q.createdAt)) &&
              Array.isArray(q.items) &&
              q.items.every(
                (i) =>
                  typeof i.productId === 'string' && Number.isInteger(i.quantity) && i.quantity > 0,
              ) &&
              Array.isArray(q.productSnapshot) &&
              ['new', 'reviewed', 'answered'].includes(q.status),
          )
          .slice(0, 100)
      : [];
    return {
      version: 1,
      products: s.products,
      favorites: list(s.favorites),
      recent: list(s.recent, 8),
      comparison: list(s.comparison, 4),
      quoteItems: Array.isArray(s.quoteItems)
        ? s.quoteItems.filter(
            (i) =>
              ids.has(i.productId) &&
              Number.isInteger(i.quantity) &&
              i.quantity > 0 &&
              i.quantity <= 9999,
          )
        : [],
      quotes,
      events: Array.isArray(s.events)
        ? s.events
            .filter(
              (e) =>
                e &&
                ['view', 'search', 'ai', 'quote'].includes(e.type) &&
                typeof e.value === 'string' &&
                typeof e.at === 'string',
            )
            .slice(-200)
        : [],
    };
  } catch {
    return fallback;
  }
}
export function saveState(s: DemoState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}
