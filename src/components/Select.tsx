'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cx } from '@/lib/utils';

export interface Option<T extends string = string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  placeholder?: string;
  className?: string;
}

export function Select<T extends string>({ value, onChange, options, placeholder = 'Select…', className }: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cx('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cx(
          'w-full h-10 px-3 rounded-btn hairline bg-surface text-[14px] text-left flex items-center justify-between gap-2 outline-none transition-shadow',
          open && 'shadow-ring',
          selected ? 'text-ink' : 'text-muted'
        )}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronDown size={15} className={cx('text-muted shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-surface rounded-card hairline shadow-xl overflow-hidden py-1 animate-fadeup">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={cx(
                  'w-full flex items-center justify-between gap-2 px-3 h-9 text-[13.5px] text-left transition-colors',
                  active ? 'text-brand bg-brand/10' : 'text-ink hover:bg-surface-2'
                )}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check size={14} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
