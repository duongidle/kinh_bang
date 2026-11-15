import type { ReactNode } from 'react';
import { term } from '../../../content/glossary';
import { Tooltip } from './Tooltip';

/** Từ thuật ngữ gạch chân chấm; rê chuột hoặc focus thì hiện định nghĩa lấy từ bảng thuật ngữ. */
export function GlossaryTerm({ id, children }: { id: string; children?: ReactNode }) {
  const e = term(id);
  return (
    <Tooltip content={e.def}>
      <span className="kb-term" tabIndex={0}>
        {children ?? e.term}
      </span>
    </Tooltip>
  );
}
