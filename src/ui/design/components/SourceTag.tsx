import { useEffect, useId, useRef, useState } from 'react';

export interface SourceTagProps {
  /** Văn bản (ví dụ "Nghị định 72/2024/NĐ-CP"). */
  doc: string;
  /** Điều khoản. */
  article: string;
  /** Ngày hiệu lực, chuỗi. */
  effective: string;
  note?: string;
}

/** Thẻ nguồn: dấu nhỏ, bấm mở văn bản, điều khoản, ngày hiệu lực. Không nhận và không hiện mức xác minh. */
export function SourceTag({ doc, article, effective, note }: SourceTagProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <span className="kb-source" ref={root} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button type="button" className="kb-source__btn" aria-expanded={open} aria-controls={id} aria-label="Xem nguồn" onClick={() => setOpen((o) => !o)}>
        nguồn
      </button>
      <span id={id} role="group" aria-label="Nguồn" className="kb-source__pop" hidden={!open}>
        <span className="kb-source__row">
          <span className="kb-source__k">Văn bản</span> {doc}
        </span>
        <span className="kb-source__row">
          <span className="kb-source__k">Điều khoản</span> {article}
        </span>
        <span className="kb-source__row">
          <span className="kb-source__k">Hiệu lực</span> {effective}
        </span>
        {note && <span className="kb-source__note">{note}</span>}
      </span>
    </span>
  );
}
