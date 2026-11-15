import { useId, type ReactNode } from 'react';
import { Button } from './Button';

export interface SidePanelProps {
  side: 'left' | 'right';
  open: boolean;
  onClose: () => void;
  title: string;
  onBack?: () => void;
  children: ReactNode;
}

/** Ngăn bên: chỉ là khung, định vị tuyệt đối trong phần tử cha có `position: relative`. Không có logic đẩy bản đồ. */
export function SidePanel({ side, open, onClose, title, onBack, children }: SidePanelProps) {
  const titleId = useId();
  return (
    <aside className={`kb-side kb-side--${side}`} data-open={open} aria-labelledby={titleId} aria-hidden={!open} inert={!open}>
      <div className="kb-side__head">
        {onBack && (
          <Button variant="text" onClick={onBack}>
            Quay lại
          </Button>
        )}
        <h2 id={titleId} className="kb-side__title">
          {title}
        </h2>
        <Button variant="text" onClick={onClose}>
          Đóng
        </Button>
      </div>
      <div className="kb-side__body">{children}</div>
    </aside>
  );
}
