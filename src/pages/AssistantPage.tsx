import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowUp,
  Plus,
  BookOpen,
  ArrowLeft,
  Copy,
  CheckCheck,
  MessageSquare,
} from 'lucide-react';
import { useDemo } from '../hooks/useDemo';
import { answerQuestion, specialistNotice, suggestedQuestions } from '../services/demoAI';
import { ProductCard } from '../components/ProductCard';
import { Breadcrumb, Notice } from '../components/UI';
import { number, uid } from '../utils/format';
import type { ChatMessage } from '../types';
export default function AssistantPage() {
  const [params] = useSearchParams();
  const { state, record, notify } = useDemo();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [contextId, setContextId] = useState(params.get('product') ?? undefined);
  const end = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const context = state.products.find((p) => p.id === contextId);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (messages.length) end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy]);
  function send(value: string) {
    if (busy || !value.trim()) return;
    const question = value.trim().slice(0, 1000);
    setInput('');
    setMessages((m) => [...m, { id: uid(), role: 'user', text: question }]);
    setBusy(true);
    record('ai', question);
    timer.current = setTimeout(() => {
      const reply = answerQuestion(question, state.products, contextId, state.comparison);
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          text: reply.text,
          products: reply.products,
          intent: reply.intent,
        },
      ]);
      if (reply.products[0]) setContextId(reply.products[0].id);
      setBusy(false);
      field.current?.focus();
    }, 700);
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }
  function reset() {
    if (timer.current) clearTimeout(timer.current);
    setBusy(false);
    setMessages([]);
    setInput('');
    setContextId(params.get('product') ?? undefined);
    field.current?.focus();
  }
  return (
    <div className="container assistant-page">
      <Breadcrumb items={[{ label: 'دستیار هوشمند' }]} />
      <div className="assistant-workspace">
        <aside className="assistant-sidebar">
          <div className="assistant-side-heading">
            <span className="ai-icon">
              <Sparkles size={23} />
            </span>
            <b>مدار AI</b>
            <span className="tag">دمو</span>
          </div>
          <button className="button button-outline full-width" onClick={reset}>
            <Plus size={18} />
            گفت‌وگوی تازه
          </button>
          <div className="assistant-context-label">یک نقطه شروع خوب</div>
          {suggestedQuestions.map((q) => (
            <button className="sidebar-question" disabled={busy} key={q} onClick={() => send(q)}>
              <MessageSquare size={16} />
              {q}
            </button>
          ))}
          {context && (
            <div className="context-product">
              <span className="eyebrow">محصول در حال بررسی</span>
              <ProductCard compact product={context} />
            </div>
          )}
          <div className="assistant-source">
            <BookOpen size={20} />
            <b>متصل به کاتالوگ نمونه</b>
            <p>{number(state.products.length)} محصول با مشخصات ساختاریافته</p>
            <span>
              <CheckCheck size={14} />
              ارجاع به محصول در هر پاسخ مرتبط
            </span>
            <Link className="text-link" to="/catalog">
              بررسی کاتالوگ
              <ArrowLeft size={15} />
            </Link>
          </div>
        </aside>
        <div className="assistant-chat">
          <header className="assistant-chat-header">
            <div>
              <Sparkles size={19} />
              <b>دستیار انتخاب محصول</b>
              <span className="demo-pill">پاسخ‌های نمایشی</span>
            </div>
            <button className="icon-button" onClick={reset} aria-label="شروع گفت‌وگوی تازه">
              <Plus size={21} />
            </button>
          </header>
          <div className="chat-messages" aria-live="polite" aria-busy={busy}>
            {messages.length === 0 ? (
              <div className="assistant-welcome">
                <div className="welcome-symbol">
                  <Sparkles size={39} strokeWidth={1.4} />
                </div>
                <span className="eyebrow">از نیاز شما، تا انتخاب روشن‌تر</span>
                <h1>
                  برای کدام پروژه
                  <br />
                  کمک می‌خواهید؟
                </h1>
                <p>
                  درباره محصول، مشخصات یا گزینه‌های جایگزین بپرسید.
                  <br />
                  پاسخ‌ها از همین کاتالوگ نمونه می‌آیند.
                </p>
                {context && (
                  <div className="welcome-context">
                    <ProductCard compact product={context} />
                    <button
                      className="button button-primary button-small"
                      onClick={() => send(`مشخصات ${context.model} چیست؟`)}
                    >
                      درباره این محصول بپرس
                    </button>
                  </div>
                )}
                <div className="prompt-grid">
                  {(context
                    ? [
                        `آیا جایگزین ارزان‌تری برای ${context.model} دارید؟`,
                        'برای این محصول چه تجهیز مکملی پیشنهاد می‌کنید؟',
                        `مشخصات ${context.model} چیست؟`,
                        'تفاوت این دو مدل چیست؟',
                      ]
                    : suggestedQuestions
                  ).map((q, i) => (
                    <button key={q} onClick={() => send(q)}>
                      <span className="prompt-number">0{i + 1}</span>
                      {q}
                      <ArrowLeft size={16} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <article key={m.id} className={`chat-message message-${m.role}`}>
                  <div className="message-avatar">
                    {m.role === 'assistant' ? <Sparkles size={19} /> : 'شما'}
                  </div>
                  <div className="message-content">
                    <div className="message-byline">
                      <b>{m.role === 'assistant' ? 'دستیار مدار' : 'شما'}</b>
                      {m.intent && <span>{m.intent}</span>}
                    </div>
                    <p>{m.text}</p>
                    {m.products && m.products.length > 0 && (
                      <>
                        <div className="message-sources">
                          <BookOpen size={14} />
                          منابع پاسخ · {number(m.products.length)} محصول از کاتالوگ
                        </div>
                        <div className="message-product-grid">
                          {m.products.map((p) => (
                            <ProductCard
                              key={p.id}
                              product={state.products.find((x) => x.id === p.id) ?? p}
                              compact
                            />
                          ))}
                        </div>
                        <Link to="/compare" className="text-link">
                          رفتن به صفحه مقایسه
                          <ArrowLeft size={15} />
                        </Link>
                      </>
                    )}
                    {m.role === 'assistant' && (
                      <button
                        className="text-button copy-answer"
                        onClick={() =>
                          navigator.clipboard
                            ?.writeText(m.text)
                            .then(() => notify('متن پاسخ کپی شد.'))
                            .catch(() => notify('امکان کپی خودکار وجود ندارد؛ متن را انتخاب کنید.'))
                        }
                      >
                        <Copy size={14} />
                        کپی پاسخ
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
            {busy && (
              <div className="assistant-thinking" role="status">
                <Sparkles size={19} />
                <span>
                  در حال بررسی کاتالوگ<span className="typing-dots">…</span>
                </span>
              </div>
            )}
            <div ref={end} />
          </div>
          <div className="chat-composer-wrap">
            {messages.length > 0 && !busy && (
              <div className="followup-chips">
                {[
                  'آیا جایگزین ارزان‌تری دارید؟',
                  'تفاوت این دو مدل چیست؟',
                  'کدام مدل موجود است؟',
                ].map((q) => (
                  <button key={q} onClick={() => send(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <form className="chat-composer" onSubmit={submit}>
              <textarea
                ref={field}
                aria-label="پیام شما به دستیار"
                placeholder="مثلاً: برای موتور ۷.۵ کیلووات چه کنتاکتوری مناسب است؟"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={2}
                maxLength={1000}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
              />
              <div>
                <span>
                  <BookOpen size={14} />
                  کاتالوگ تجهیزات برق
                </span>
                <button
                  className="send-button"
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="ارسال پیام"
                >
                  <ArrowUp size={21} />
                </button>
              </div>
            </form>
            <p className="assistant-disclaimer">{specialistNotice}</p>
          </div>
        </div>
      </div>
      <Notice>
        در این دمو، پرسش‌ها به سرویس بیرونی ارسال نمی‌شوند. پاسخ‌ها با جست‌وجوی محلی و قواعد از پیش
        تعریف‌شده ساخته می‌شوند.
      </Notice>
    </div>
  );
}
