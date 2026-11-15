import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Hàng nút ở chân hộp thoại. */
  actions?: ReactNode;
}

/** Dùng <dialog> gốc: showModal() lo bẫy focus, Esc đóng, lớp nền. */
export function Dialog({ open, onClose, title, children, actions }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="kb-dialog"
      aria-labelledby={titleId}
      onClose={() => {
        if (open) onClose();
      }}
      // Bấm vào lớp nền (chính phần tử dialog, ngoài khung nội dung) thì đóng.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="kb-dialog__box">
        <div className="kb-dialog__head">
          <h2 id={titleId} className="kb-dialog__title">
            {title}
          </h2>
          <Button variant="text" onClick={onClose}>
            Đóng
          </Button>
        </div>
        <div className="kb-dialog__body">{children}</div>
        {actions && <div className="kb-dialog__actions">{actions}</div>}
      </div>
    </dialog>
  );
}
