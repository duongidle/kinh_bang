import { cloneElement, useId, useState, type ReactElement, type ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  /** Một phần tử nhận được focus (hoặc cho phép đặt tabIndex). Tooltip gắn aria-describedby vào nó. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
}

export function Tooltip({ content, children }: TooltipProps) {
  const id = useId();
  const [shown, setShown] = useState(false);
  return (
    <span
      className="kb-tip"
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
      onFocus={() => setShown(true)}
      onBlur={() => setShown(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setShown(false);
      }}
    >
      {cloneElement(children, { 'aria-describedby': id })}
      <span id={id} role="tooltip" className="kb-tip__bubble" data-shown={shown}>
        {content}
      </span>
    </span>
  );
}
