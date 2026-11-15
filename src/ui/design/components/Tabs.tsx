import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  /** Nội dung của tab đang chọn. */
  children?: ReactNode;
}

export function Tabs({ tabs, active, onChange, children }: TabsProps) {
  const uid = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(0, tabs.findIndex((t) => t.id === active));
  const tabId = (id: string) => `${uid}-tab-${id}`;
  const panelId = `${uid}-panel`;

  const onKey = (e: KeyboardEvent) => {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="kb-tabs">
      <div className="kb-tabs__list" role="tablist" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={tabId(t.id)}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            aria-controls={panelId}
            tabIndex={i === idx ? 0 : -1}
            className={t.id === active ? 'kb-tab kb-tab--on' : 'kb-tab'}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={panelId} role="tabpanel" aria-labelledby={tabId(tabs[idx]?.id ?? '')} className="kb-tabs__panel">
        {children}
      </div>
    </div>
  );
}
