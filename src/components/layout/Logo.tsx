import { cx } from '@/lib/utils';

export function Logo({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[12px] font-bold shrink-0"
        style={{ background: 'var(--brand)' }}
      >
        SB
      </span>
      {!collapsed && (
        <span className="text-[15px] font-semibold text-ink tracking-tight">SEO Brix</span>
      )}
    </div>
  );
}
