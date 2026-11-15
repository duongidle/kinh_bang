import type { ReactNode } from 'react';
import { cx } from './util';

export function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cx('kb-card', className)}>
      {title && <h3 className="kb-card__title">{title}</h3>}
      {children}
    </section>
  );
}
