import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts } from '../data/products';
import { searchProducts } from './search';
import { answerQuestion, recommendProducts, generateContent } from './demoAI';
import { normalize } from '../utils/format';
import { freshState, loadState, saveState, STORAGE_KEY } from './storage';

test('catalog has unique IDs and valid relationships', () => {
  const ids = new Set(initialProducts.map((p) => p.id));
  assert.ok(ids.size >= 30);
  assert.equal(ids.size, initialProducts.length);
  for (const p of initialProducts) {
    assert.ok(p.name && p.model && p.description);
    for (const id of [...p.relatedIds, ...p.alternativeIds])
      assert.ok(ids.has(id), `${p.id} references ${id}`);
  }
});
test('Persian and Arabic digits and letters normalize', () => {
  assert.equal(normalize('۲۵ آمپر اشنایدر'), '25 آمپر اشنایدر');
  assert.equal(normalize('كليد ٢٤'), 'کلید 24');
});
test('smart search honors category, brand and electrical constraints', () => {
  assert.deepEqual(
    searchProducts(initialProducts, 'کنتاکتور ۲۵ آمپر اشنایدر').map((p) => p.id),
    ['p01'],
  );
  const supplies = searchProducts(initialProducts, 'منبع تغذیه ۲۴ ولت صنعتی');
  assert.ok(supplies.length >= 3);
  assert.ok(supplies.every((p) => p.category === 'power' && p.voltage === 24));
  assert.equal(searchProducts(initialProducts, 'کلید مناسب موتور سه فاز')[0].id, 'p10');
  assert.equal(searchProducts(initialProducts, 'xyz-no-such-product').length, 0);
  assert.equal(searchProducts(initialProducts, 'LC1D25M7')[0].id, 'p01');
});
test('motor assistant references real local IDs and includes verification caveat', () => {
  const a = answerQuestion('برای موتور ۷.۵ کیلووات چه کنتاکتوری مناسب است؟', initialProducts);
  assert.ok(a.products.length);
  assert.ok(
    a.products.every(
      (p) => p.category === 'contactor' && p.voltage === 400 && p.power !== null && p.power >= 7.5,
    ),
  );
  assert.match(a.text, /تطبیق|تأیید/);
  const none = answerQuestion('برای موتور ۹۰۰ کیلووات چه کنتاکتوری دارید؟', initialProducts);
  assert.equal(none.products.length, 0);
  assert.match(none.text, /پیدا نکردم/);
});
test('cheaper options obey reference category and price; new subject changes retrieval', () => {
  const a = answerQuestion('آیا جایگزین ارزان‌تری دارید؟', initialProducts, 'p01');
  assert.ok(a.products.length);
  assert.ok(
    a.products.every((p) => p.category === 'contactor' && p.price !== null && p.price < 3850000),
  );
  const b = answerQuestion('منبع تغذیه ۲۴ ولت صنعتی', initialProducts, 'p01');
  assert.ok(b.products.every((p) => p.category === 'power'));
});
test('comparison uses exactly selected products', () => {
  const a = answerQuestion('تفاوت این دو مدل چیست؟', initialProducts, undefined, ['p01', 'p03']);
  assert.deepEqual(
    a.products.map((p) => p.id),
    ['p01', 'p03'],
  );
});
test('recommendation applies all hard constraints and returns empty for impossible brief', () => {
  const input = {
    project: 'motor',
    category: 'contactor' as const,
    voltage: '400',
    current: '18',
    power: '7.5',
    brand: 'LS Electric',
    budget: '3000000',
    application: 'کنترل موتور',
  };
  const r = recommendProducts(initialProducts, input);
  assert.ok(r.length);
  assert.ok(
    r.every(
      ({ product: p }) =>
        p.brand === 'LS Electric' && p.current >= 18 && p.price !== null && p.price <= 3000000,
    ),
  );
  assert.equal(recommendProducts(initialProducts, { ...input, budget: '1' }).length, 0);
});
test('generated content uses edited catalog values', () => {
  const p = { ...initialProducts[0], name: 'محصول ویرایش‌شده', current: 42 };
  const c = generateContent(p);
  assert.equal(Object.keys(c).length, 6);
  assert.match(c.title, /محصول ویرایش‌شده/);
  assert.match(c.technical, /۴۲/);
});
test('local storage recovers from malformed data and enforces valid selections', () => {
  let value: string | null = null;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => value,
      setItem: (_key: string, v: string) => {
        value = v;
      },
    },
  });
  value = '{invalid';
  assert.equal(loadState().products.length, 39);
  const s = freshState();
  s.comparison = ['p01', 'p02', 'p03', 'p04', 'p05', 'bad'];
  saveState(s);
  assert.equal(loadState().comparison.length, 4);
  s.quoteItems = [{ productId: 'p01', quantity: -1 }];
  saveState(s);
  assert.equal(loadState().quoteItems.length, 0);
  assert.equal(STORAGE_KEY, 'madar-demo-v1');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    },
  });
  assert.equal(loadState().products.length, 39);
  assert.equal(saveState(s), false);
});
