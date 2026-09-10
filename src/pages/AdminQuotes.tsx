import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Eye, Search } from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { PageHeader, EmptyState, Notice } from '../components/UI';
import { Modal } from '../components/Modal';
import { number, date, normalize } from '../utils/format';
import type { QuoteRequest } from '../types';
const statuses = { new: 'جدید', reviewed: 'در حال بررسی', answered: 'پاسخ داده شده' };
export default function AdminQuotes() {
  const { state, updateQuote } = useDemo();
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [opened, setOpened] = useState<string | null>(null);
  const selected = state.quotes.find((q) => q.id === opened);
  const quotes = state.quotes.filter(
    (q) =>
      (!filter || q.status === filter) &&
      normalize(`${q.name} ${q.company} ${q.id}`).includes(normalize(query)),
  );
  return (
    <>
      <PageHeader
        eyebrow="فرصت‌های فروش در یک نگاه"
        title="درخواست‌های استعلام"
        description="درخواست‌های ثبت‌شده در همین مرورگر را بررسی کنید و وضعیت پیگیری را تغییر دهید."
      >
        <Link className="button button-primary button-small" to="/quote?consultation=1">
          <PlusIcon />
          ثبت درخواست نمونه
        </Link>
      </PageHeader>
      <div className="quote-status-summary">
        {(['new', 'reviewed', 'answered'] as const).map((s) => (
          <button
            className={filter === s ? 'active' : ''}
            key={s}
            onClick={() => setFilter(filter === s ? '' : s)}
          >
            <span className={`status-pill status-${s}`}>{statuses[s]}</span>
            <strong>{number(state.quotes.filter((q) => q.status === s).length)}</strong>
          </button>
        ))}
      </div>
      <div className="panel">
        <div className="management-toolbar">
          <label className="inline-search">
            <Search size={18} />
            <input
              aria-label="جست‌وجوی درخواست‌ها"
              placeholder="نام، شرکت یا کد پیگیری…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            aria-label="وضعیت درخواست"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">همه وضعیت‌ها</option>
            {Object.entries(statuses).map(([k, v]) => (
              <option value={k} key={k}>
                {v}
              </option>
            ))}
          </select>
          <span className="tag">داده محلی</span>
        </div>
        {quotes.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">درخواست‌کننده</th>
                  <th scope="col">کد پیگیری</th>
                  <th scope="col">محصولات</th>
                  <th scope="col">تاریخ</th>
                  <th scope="col">وضعیت</th>
                  <th scope="col">جزئیات</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id}>
                    <td>
                      <b>{q.name}</b>
                      <small className="cell-sub">{q.company || 'درخواست شخصی'}</small>
                    </td>
                    <td dir="ltr">{q.id}</td>
                    <td>{q.items.length ? `${number(q.items.length)} ردیف` : 'مشاوره'}</td>
                    <td>{date(q.createdAt)}</td>
                    <td>
                      <select
                        className={`status-select status-${q.status}`}
                        aria-label={`وضعیت درخواست ${q.id}`}
                        value={q.status}
                        onChange={(e) =>
                          updateQuote(q.id, e.target.value as QuoteRequest['status'])
                        }
                      >
                        {Object.entries(statuses).map(([k, v]) => (
                          <option value={k} key={k}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="icon-button"
                        aria-label={`جزئیات ${q.id}`}
                        onClick={() => setOpened(q.id)}
                      >
                        <Eye size={19} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title={
              state.quotes.length ? 'درخواستی مطابق این فیلتر نیست' : 'هنوز استعلامی ثبت نشده است'
            }
            description="از فروشگاه یک محصول انتخاب و درخواست ثبت کنید تا جریان کامل ورود یک سرنخ را ببینید."
          >
            <Link className="button button-outline" to="/catalog">
              انتخاب محصول
              <ArrowLeft size={16} />
            </Link>
          </EmptyState>
        )}
      </div>
      <Notice>
        تغییر وضعیت فقط در این مرورگر ذخیره می‌شود و هیچ پیام یا ایمیلی برای مشتری ارسال نمی‌کند.
      </Notice>
      {selected && (
        <Modal title={`جزئیات درخواست ${selected.id}`} onClose={() => setOpened(null)}>
          <dl className="spec-table">
            {[
              ['نام', selected.name],
              ['شرکت', selected.company || '—'],
              ['تماس', selected.phone],
              ['ایمیل', selected.email || '—'],
              ['شهر', selected.city],
              ['تاریخ', date(selected.createdAt)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd dir="auto">{v}</dd>
              </div>
            ))}
          </dl>
          <h3>محصولات درخواستی</h3>
          {selected.items.length ? (
            <div className="request-detail-products">
              {selected.items.map((i) => {
                const p = selected.productSnapshot.find((p) => p.id === i.productId);
                return (
                  <div key={i.productId}>
                    <span>
                      {p?.name ?? i.productId}
                      <small dir="ltr">{p?.model}</small>
                    </span>
                    <b>{number(i.quantity)} عدد</b>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>درخواست مشاوره کسب‌وکار</p>
          )}
          <h3>پیام درخواست‌کننده</h3>
          <p className="request-message">{selected.message || 'توضیحی ثبت نشده است.'}</p>
          <label className="field">
            وضعیت پیگیری
            <select
              value={selected.status}
              onChange={(e) => updateQuote(selected.id, e.target.value as QuoteRequest['status'])}
            >
              {Object.entries(statuses).map(([k, v]) => (
                <option value={k} key={k}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <Notice>ثبت «پاسخ داده شده» فقط وضعیت نمایشی را تغییر می‌دهد.</Notice>
        </Modal>
      )}
    </>
  );
}
function PlusIcon() {
  return <FileText size={17} />;
}
