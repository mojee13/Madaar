import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CircuitBoard,
  Cpu,
  PlugZap,
  Zap,
  Cable,
  ToggleLeft,
  PanelsTopLeft,
  Radio,
  Gauge,
  PackageSearch,
  CheckCircle2,
  Info,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Availability, CategoryId } from '../types';
import { t } from '../i18n';
import { branding } from '../data/brand';
export const categoryIcons: Record<CategoryId, LucideIcon> = {
  breaker: Zap,
  contactor: CircuitBoard,
  power: PlugZap,
  inverter: Cpu,
  cable: Cable,
  relay: ToggleLeft,
  panel: PanelsTopLeft,
  sensor: Radio,
  meter: Gauge,
};
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className={`brand ${light ? 'brand-light' : ''}`} to="/" aria-label="مدار، صفحه اصلی">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <path d="M3 24V8h7l6 10 6-10h7v16h-7v-7l-6 10-6-10v7z" fill="currentColor" />
        </svg>
      </span>
      <span>
        <strong>
          {branding.name}
          <span className="brand-dot">.</span>
        </strong>
        <small>{branding.tagline}</small>
      </span>
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  to,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: string;
  to?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {link && to && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowLeft size={17} />
        </Link>
      )}
    </div>
  );
}
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="مسیر صفحه" className="breadcrumb">
      <Link to="/">خانه</Link>
      {items.map((x, i) => (
        <span key={i}>
          <span className="separator">/</span>
          {x.to ? <Link to={x.to}>{x.label}</Link> : <span aria-current="page">{x.label}</span>}
        </span>
      ))}
    </nav>
  );
}
export function AvailabilityBadge({ value }: { value: Availability }) {
  return (
    <span className={`stock stock-${value}`}>
      <span />
      {t.availability[value]}
    </span>
  );
}
export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <PackageSearch size={42} strokeWidth={1.2} />
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
export function Notice({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: 'info' | 'success' | 'warning';
}) {
  const Icon = tone === 'success' ? CheckCircle2 : Info;
  return (
    <div className={`notice notice-${tone}`}>
      <Icon size={18} />
      <div>{children}</div>
    </div>
  );
}
export function Spinner({ label = 'در حال آماده‌سازی…' }: { label?: string }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" />
      {label}
    </div>
  );
}
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  );
}
