import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, SquarePen, Upload, Sparkles, ArrowUpLeft } from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { PageHeader, AvailabilityBadge, EmptyState } from '../components/UI';
import { Modal } from '../components/Modal';
import { ProductImage } from '../components/ProductCard';
import { categories, brands, applications, categoryName } from '../data/products';
import { searchProducts } from '../services/search';
import type { Product, Brand, CategoryId, Availability } from '../types';
import { number, price, uid } from '../utils/format';
function newProduct(): Product {
  return {
    id: `local-${uid().slice(0, 8)}`,
    name: '',
    model: '',
    brand: 'Madar Electric',
    category: 'breaker',
    voltage: 230,
    current: 16,
    power: null,
    price: null,
    availability: 'in-stock',
    stock: 10,
    application: 'توزیع برق',
    description: '',
    specs: { نصب: 'ریل DIN' },
    tags: [],
    relatedIds: [],
    alternativeIds: [],
    featured: false,
  };
}
export default function AdminProducts() {
  const { state, upsertProduct } = useDemo();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [edit, setEdit] = useState<Product | null>(() =>
    params.get('new') === '1' ? newProduct() : null,
  );
  const [error, setError] = useState('');
  const filtered = searchProducts(state.products, query).filter(
    (p) => !category || p.category === category,
  );
  const close = () => {
    setEdit(null);
    setError('');
    if (params.has('new')) setParams({}, { replace: true });
  };
  const patch = (p: Partial<Product>) => setEdit((s) => (s ? { ...s, ...p } : s));
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!edit) return;
    if (edit.name.trim().length < 3 || !edit.model.trim()) {
      setError('نام محصول و مدل را کامل وارد کنید.');
      return;
    }
    if (
      state.products.some(
        (p) => p.id !== edit.id && p.model.toLowerCase() === edit.model.trim().toLowerCase(),
      )
    ) {
      setError('این کد مدل قبلاً در کاتالوگ وجود دارد.');
      return;
    }
    upsertProduct({
      ...edit,
      name: edit.name.trim(),
      model: edit.model.trim(),
      description:
        edit.description.trim() ||
        `${edit.name} برای کاربرد ${edit.application} در کاتالوگ نمونه ثبت شده است.`,
      stock: edit.availability === 'order' ? 0 : edit.stock,
      tags: [edit.application, edit.brand, categoryName(edit.category)],
      alternativeIds: state.products
        .filter((p) => p.category === edit.category && p.id !== edit.id)
        .slice(0, 3)
        .map((p) => p.id),
    });
    close();
  }
  return (
    <>
      <PageHeader
        eyebrow="کاتالوگ یکپارچه شما"
        title="مدیریت محصولات"
        description="قیمت، موجودی و اطلاعات فنی را به‌روز کنید؛ تغییرات در فروشگاه هم دیده می‌شوند."
      >
        <div className="header-button-row">
          <Link className="button button-outline button-small" to="/admin/import">
            <Upload size={16} />
            ورود از Excel
          </Link>
          <button
            className="button button-primary button-small"
            onClick={() => setEdit(newProduct())}
          >
            <Plus size={18} />
            افزودن محصول
          </button>
        </div>
      </PageHeader>
      <div className="panel">
        <div className="management-toolbar">
          <label className="inline-search">
            <Search size={18} />
            <input
              aria-label="جست‌وجوی محصولات مدیریت"
              placeholder="جست‌وجو بر اساس نام یا مدل…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="دسته‌بندی محصولات مدیریت"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">همه دسته‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="tag">{number(filtered.length)} محصول</span>
        </div>
        {filtered.length ? (
          <div className="table-scroll">
            <table className="data-table product-management-table">
              <thead>
                <tr>
                  <th scope="col">محصول</th>
                  <th scope="col">دسته‌بندی</th>
                  <th scope="col">قیمت نمونه</th>
                  <th scope="col">موجودی</th>
                  <th scope="col">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-product">
                        <ProductImage category={p.category} />
                        <div>
                          <Link to={`/product/${p.id}`}>{p.name}</Link>
                          <small dir="ltr">
                            {p.brand} · {p.model}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{categoryName(p.category)}</td>
                    <td>{price(p.price)}</td>
                    <td>
                      <AvailabilityBadge value={p.availability} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-button"
                          aria-label={`ویرایش ${p.model}`}
                          onClick={() => setEdit(structuredClone(p))}
                        >
                          <SquarePen size={18} />
                        </button>
                        <Link
                          className="icon-button"
                          aria-label={`تولید محتوا برای ${p.model}`}
                          to={`/admin/content?product=${p.id}`}
                        >
                          <Sparkles size={18} />
                        </Link>
                        <Link
                          className="icon-button"
                          aria-label={`مشاهده ${p.model}`}
                          to={`/product/${p.id}`}
                        >
                          <ArrowUpLeft size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="محصولی پیدا نشد" description="عبارت یا دسته‌بندی را تغییر دهید." />
        )}
      </div>
      {edit && (
        <Modal
          title={
            state.products.some((p) => p.id === edit.id) ? 'ویرایش محصول' : 'افزودن محصول جدید'
          }
          onClose={close}
        >
          <form onSubmit={submit}>
            <label className="field">
              نام محصول *
              <input
                autoFocus
                required
                minLength={3}
                maxLength={140}
                value={edit.name}
                onChange={(e) => patch({ name: e.target.value })}
              />
            </label>
            <div className="form-grid">
              <label className="field">
                مدل / کد فنی *
                <input
                  required
                  dir="ltr"
                  maxLength={60}
                  value={edit.model}
                  onChange={(e) => patch({ model: e.target.value })}
                />
              </label>
              <label className="field">
                برند
                <select
                  value={edit.brand}
                  onChange={(e) => patch({ brand: e.target.value as Brand })}
                >
                  {brands.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                دسته‌بندی
                <select
                  value={edit.category}
                  onChange={(e) => patch({ category: e.target.value as CategoryId })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                کاربرد
                <select
                  value={edit.application}
                  onChange={(e) => patch({ application: e.target.value })}
                >
                  {applications.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                ولتاژ (ولت)
                <input
                  required
                  type="number"
                  min="0"
                  max="100000"
                  step="0.1"
                  value={edit.voltage}
                  onChange={(e) => patch({ voltage: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                جریان (آمپر)
                <input
                  required
                  type="number"
                  min="0"
                  max="100000"
                  step="0.01"
                  value={edit.current}
                  onChange={(e) => patch({ current: Number(e.target.value) })}
                />
              </label>
              <label className="field">
                توان (کیلووات، اختیاری)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={edit.power ?? ''}
                  onChange={(e) => patch({ power: e.target.value ? Number(e.target.value) : null })}
                />
              </label>
              <label className="field">
                قیمت نمونه (تومان)
                <input
                  type="number"
                  min="0"
                  max="1000000000000"
                  value={edit.price ?? ''}
                  placeholder="خالی = تماس برای قیمت"
                  onChange={(e) => patch({ price: e.target.value ? Number(e.target.value) : null })}
                />
              </label>
              <label className="field">
                وضعیت موجودی
                <select
                  value={edit.availability}
                  onChange={(e) => patch({ availability: e.target.value as Availability })}
                >
                  <option value="in-stock">موجود در انبار</option>
                  <option value="limited">موجودی محدود</option>
                  <option value="order">قابل سفارش</option>
                </select>
              </label>
              <label className="field">
                تعداد موجودی
                <input
                  type="number"
                  min="0"
                  max="100000"
                  disabled={edit.availability === 'order'}
                  value={edit.stock}
                  onChange={(e) => patch({ stock: Number(e.target.value) })}
                />
              </label>
            </div>
            <label className="field">
              توضیحات
              <textarea
                rows={3}
                maxLength={3000}
                value={edit.description}
                onChange={(e) => patch({ description: e.target.value })}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <div className="modal-actions">
              <button type="submit" className="button button-primary">
                ذخیره در نسخه نمایشی
              </button>
              <button type="button" className="button button-outline" onClick={close}>
                انصراف
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
