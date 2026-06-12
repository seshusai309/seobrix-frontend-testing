'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cx } from '@/lib/utils';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, footer, width = 460 }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" onClick={onClose} />
      <div
        className={cx('relative bg-surface rounded-card hairline shadow-xl w-full max-h-[90vh] overflow-hidden flex flex-col')}
        style={{ maxWidth: width }}
      >
        <div className="flex items-center justify-between px-5 h-[52px] border-b border-surface-3 shrink-0">
          <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink rounded-btn p-1 hover:bg-surface-2 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-5 py-3 border-t border-surface-3 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
