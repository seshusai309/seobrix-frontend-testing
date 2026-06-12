'use client';
import { cx } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

// ─── Button ───────────────────────────────────────────────────────────────────
interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
  size?: 'sm' | 'md';
  loading?: boolean;
  icon?: React.ReactNode;
  iconR?: React.ReactNode;
}

export function Btn({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  iconR,
  children,
  className,
  disabled,
  ...props
}: BtnProps) {
  const base =
    'inline-flex items-center gap-2 font-medium rounded-btn transition-all select-none';
  const sizes = { sm: 'px-3 h-8 text-[12.5px]', md: 'px-4 h-9 text-[13.5px]' };
  const variants = {
    primary:
      'bg-brand text-white hover:bg-brand-dark disabled:opacity-50',
    secondary:
      'bg-surface-2 text-ink hover:bg-surface-3 hairline disabled:opacity-50',
    ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
    danger: 'bg-red/10 text-red hover:bg-red/20',
    soft: 'bg-brand-soft text-brand-ink hover:bg-brand/20',
  };
  return (
    <button
      className={cx(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
      {iconR}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cx(
        'bg-surface rounded-card hairline',
        hover && 'cursor-pointer hover:bg-surface-2 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cx('block text-[12.5px] font-medium text-ink-2', className)}>
      {children}
    </label>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full h-10 px-3 rounded-btn hairline bg-surface text-[14px] text-ink outline-none',
        'focus:shadow-ring placeholder:text-muted transition-shadow',
        props.className
      )}
      {...props}
    />
  );
}

// ─── Pill / Status badge ───────────────────────────────────────────────────────
const PILL_MAP: Record<string, { bg: string; text: string }> = {
  DRAFT:              { bg: 'rgba(92,95,110,0.2)',   text: 'var(--muted)' },
  IN_REVIEW:          { bg: 'rgba(217,119,6,0.15)',  text: 'var(--amber)' },
  CHANGES_REQUESTED:  { bg: 'rgba(249,115,22,0.15)', text: 'var(--accent)' },
  APPROVED:           { bg: 'rgba(34,197,94,0.15)',  text: 'var(--green-pos)' },
  PUBLISHED:          { bg: 'rgba(39,160,106,0.15)', text: 'var(--brand)' },
  REJECTED:           { bg: 'rgba(239,68,68,0.15)',  text: 'var(--red)' },
  ACTIVE:             { bg: 'rgba(34,197,94,0.15)',  text: 'var(--green-pos)' },
  SUSPENDED:          { bg: 'rgba(239,68,68,0.15)',  text: 'var(--red)' },
  CONNECTED:          { bg: 'rgba(34,197,94,0.15)',  text: 'var(--green-pos)' },
  BROKEN:             { bg: 'rgba(239,68,68,0.15)',  text: 'var(--red)' },
  DISCONNECTED:       { bg: 'rgba(92,95,110,0.2)',   text: 'var(--muted)' },
};

export function Pill({ status, dot, children }: { status?: string; dot?: boolean; children?: React.ReactNode }) {
  const key = status ?? '';
  const style = PILL_MAP[key] ?? { bg: 'rgba(92,95,110,0.2)', text: 'var(--muted)' };
  const label = children ?? key.replace(/_/g, ' ');
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 h-5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
      style={{ background: style.bg, color: style.text }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.text }} />}
      {label}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({
  name,
  mono,
  color = 'var(--brand)',
  size = 32,
}: {
  name?: string;
  mono?: string;
  color?: string;
  size?: number;
}) {
  const initials = mono ?? (name ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?');
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg font-semibold text-white select-none shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.38,
        borderRadius: size * 0.28,
      }}
    >
      {initials}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin text-muted" />;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EmptyState({
  title,
  desc,
  action,
}: {
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <p className="text-[15px] font-semibold text-ink">{title}</p>
      {desc && <p className="text-[13px] text-muted mt-1 max-w-xs">{desc}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Page header ─────────────────────────────────────────────────────────────
export function PageHeader({
  title,
  desc,
  actions,
}: {
  title: React.ReactNode;
  desc?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[20px] font-semibold text-ink tracking-tight">{title}</h1>
        {desc && <p className="text-[13px] text-ink-2 mt-0.5">{desc}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
