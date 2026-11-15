import type { ReactNode } from 'react';

export function WarningBanner({ tone = 'warn', children, action }: { tone?: 'warn' | 'info'; children: ReactNode; action?: ReactNode }) {
  return (
    <div className={`kb-banner kb-banner--${tone}`} role="status">
      <span className="kb-banner__icon" aria-hidden="true">
        {tone === 'warn' ? '⚠︎' : 'ⓘ'}
      </span>
      <span className="kb-banner__text">{children}</span>
      {action && <span className="kb-banner__action">{action}</span>}
    </div>
  );
}
