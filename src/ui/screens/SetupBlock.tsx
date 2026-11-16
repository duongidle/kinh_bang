// Khối "Cài đặt ban đầu" của ván tự do (gd1-5 mục 4.4): luật lúc đầu và quy luật hành vi.
// Giữ giá trị ở nơi gọi (Home) để nút "Bắt đầu" gửi đúng những mục đã đổi.
import { useState } from 'react';
import type { SetupInfo } from '../../protocol';
import { engine } from '../client';
import { Button, SegmentedControl } from '../design';
import { LawInput, LawSource, lawValueText } from '../LawField';
import { groupLaws } from '../lawGroups';
import { changedCount, buildSetup } from '../setup';

// Danh mục chỉ cần hỏi một lần cho cả phiên của trang.
let infoPromise: Promise<SetupInfo> | undefined;
export function loadSetupInfo(): Promise<SetupInfo> {
  infoPromise ??= engine.query<SetupInfo>({ kind: 'setupInfo' }).catch((e: unknown) => {
    infoPromise = undefined;
    throw e;
  });
  return infoPromise;
}

const BOTH = new Set<'fiscal' | 'monetary'>(['fiscal', 'monetary']);

interface Props {
  info: SetupInfo | undefined;
  onInfo: (i: SetupInfo) => void;
  laws: Record<string, number>;
  setLaws: (l: Record<string, number>) => void;
  variants: Record<string, string>;
  setVariants: (v: Record<string, string>) => void;
}

export function SetupBlock({ info, onInfo, laws, setLaws, variants, setVariants }: Props) {
  const [error, setError] = useState<string | null>(null);
  const changed = info ? changedCount(buildSetup(info, laws, variants)) : 0;

  const onToggle = (open: boolean) => {
    if (!open || info) return;
    setError(null);
    loadSetupInfo().then(onInfo, (e: Error) => setError(e.message));
  };

  const setLaw = (id: string, def: number, v: number) => {
    const next = { ...laws };
    if (Math.abs(v - def) <= 1e-12) delete next[id];
    else next[id] = v;
    setLaws(next);
  };

  return (
    <details className="kb-setup" onToggle={(e) => onToggle(e.currentTarget.open)}>
      <summary>{changed > 0 ? `Cài đặt ban đầu (đã đổi ${changed} mục)` : 'Cài đặt ban đầu'}</summary>
      {error && <p className="error">{error}</p>}
      {!info && !error && <p className="kb-law__note">Đang tải…</p>}
      {info && (
        <>
          <h3 className="kb-setup__title">Luật</h3>
          {groupLaws(info.laws, BOTH).map((g) => (
            <details key={g.title} className="kb-setup__group">
              <summary>{g.title}</summary>
              {g.sections.map((sec) => (
                <div key={sec.title ?? g.title}>
                  {sec.title && <h4 className="kb-lawsub">{sec.title}</h4>}
                  {sec.laws.map((l) => {
                    const cur = laws[l.id] ?? l.value;
                    const isChanged = laws[l.id] !== undefined;
                    return (
                      <div key={l.id} className="kb-law">
                        <div className="kb-law__row">
                          <LawInput law={l} value={cur} onChange={(v) => setLaw(l.id, l.value, v)} />
                          {isChanged && (
                            <Button variant="text" onClick={() => setLaw(l.id, l.value, l.value)}>
                              Về mức hiện hành
                            </Button>
                          )}
                        </div>
                        <p className="kb-law__meta">
                          Mức hiện hành: {lawValueText(l, l.value)}
                          <LawSource law={l} />
                        </p>
                        {l.note && <p className="kb-law__note">{l.note}</p>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </details>
          ))}
          <h3 className="kb-setup__title">Quy luật</h3>
          <p className="kb-law__meta">Đổi quy luật thì thế giới bị gắn nhãn &quot;đã sửa quy luật&quot; suốt ván.</p>
          {info.rules.map((r) => (
            <div key={r.id} className="kb-field kb-setup__rule">
              <span className="kb-field__label">{r.label}</span>
              <SegmentedControl
                label={r.label}
                options={r.variants.map((v, i) => ({ value: v.id, label: i === 0 ? `${v.label} (gốc)` : v.label }))}
                value={variants[r.id] ?? r.variants[0].id}
                onChange={(v) => {
                  const next = { ...variants };
                  if (v === r.variants[0].id) delete next[r.id];
                  else next[r.id] = v;
                  setVariants(next);
                }}
              />
            </div>
          ))}
        </>
      )}
    </details>
  );
}
