import type { ReactNode } from 'react';

export type BadgeTone = 'good' | 'bad' | 'warn' | 'neutral';

// Dấu hình đi kèm màu, để trạng thái không chỉ dựa vào màu.
const MARK: Record<BadgeTone, string> = { good: '●', bad: '▲', warn: '■', neutral: '○' };

export function StatusBadge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span className={`kb-badge kb-badge--${tone}`}>
      <span aria-hidden="true">{MARK[tone]}</span>
      <span>{children}</span>
    </span>
  );
}
