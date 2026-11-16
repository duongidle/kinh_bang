// Màn hình đầu (gd1-5 mục 4.1): học theo lộ trình, tự do (sandbox), ván đã lưu.
import { useEffect, useMemo, useState } from 'react';
import { SCENARIOS } from '../../content/scenarios';
import type { Role, ScaleId, SetupInfo } from '../../protocol';
import { Button, Card, NumberInput, SegmentedControl, StatusBadge } from '../design';
import { learningPath } from '../learningPath';
import { deleteSave, lastSave, listSaves, loadSave, saveTitle } from '../saves';
import { buildSetup } from '../setup';
import { useStore } from '../store';
import { SetupBlock } from './SetupBlock';
import './screens.css';

export const ROLE_NAME: Record<Role, string> = {
  observer: 'Quan sát',
  government: 'Chính phủ',
  fiscal: 'Chính phủ: Bộ Tài chính',
  monetary: 'Chính phủ: NHNN',
  household: 'Người tham gia: hộ gia đình',
  firm: 'Người tham gia: doanh nghiệp',
};

const SCALE_OPTIONS: { value: ScaleId; label: string }[] = [
  { value: 'S', label: '50 hộ (sa bàn)' },
  { value: 'M', label: '500 hộ' },
  { value: 'L', label: '5.000 hộ' },
];

const duration = (months: number) => (months % 12 === 0 ? `${months / 12} năm` : `${months} tháng`);

function readDone(): Set<string> {
  try {
    const v = JSON.parse(localStorage.getItem('kb.done') ?? '[]');
    return new Set(Array.isArray(v) ? v.map(String) : []);
  } catch {
    return new Set();
  }
}

export function Home() {
  const start = useStore((s) => s.start);
  const loadBytes = useStore((s) => s.loadBytes);
  const [scale, setScale] = useState<ScaleId>('M');
  const [seed, setSeed] = useState(1);
  const [setupInfo, setSetupInfo] = useState<SetupInfo | undefined>();
  const [setupLaws, setSetupLaws] = useState<Record<string, number>>({});
  const [setupVariants, setSetupVariants] = useState<Record<string, string>>({});
  const [saves, setSaves] = useState<string[]>([]);
  const [last, setLast] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  const done = useMemo(readDone, []);
  const path = useMemo(() => learningPath(SCENARIOS), []);
  const byId = useMemo(() => new Map(SCENARIOS.map((s) => [s.id, s])), []);

  const refresh = () => {
    void Promise.all([listSaves(), lastSave()])
      .then(([l, k]) => {
        setSaves(l);
        setLast(k);
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  };
  useEffect(refresh, []);

  const openSave = async (key: string) => {
    const b = await loadSave(key);
    if (b) loadBytes(b);
  };
  // Lần đầu: chưa xong kịch bản nào và chưa có ván lưu gần nhất.
  const firstTime = ready && done.size === 0 && last === undefined;

  return (
    <main className="kb-home">
      <header className="kb-home__head">
        <h1>Kinh Bang</h1>
        <p>Một nền kinh tế nhỏ phỏng theo Việt Nam. Mọi con số sinh ra từ hành vi của từng hộ, từng doanh nghiệp, từng ngân hàng. Bấm vào số nào cũng hỏi được "vì sao".</p>
      </header>

      <section className="kb-home__block" aria-labelledby="home-path">
        <h2 id="home-path">Học theo lộ trình</h2>
        <ol className="kb-path">
          {path.map((id, i) => {
            const s = byId.get(id)!;
            const first = firstTime && i === 0;
            return (
              <li key={id}>
                {first && <p className="kb-path__first">Mới bắt đầu? Chơi kịch bản này trước</p>}
                <button type="button" className={first ? 'kb-path__card kb-path__card--first' : 'kb-path__card'} onClick={() => start({ scale: s.scale, seed, scenario: s.id })}>
                  <span className="kb-path__no kb-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="kb-path__body">
                    <span className="kb-path__title">{s.title}</span>
                    <span className="kb-path__question">{s.question}</span>
                    <span className="kb-path__meta">
                      {ROLE_NAME[s.role]} · {duration(s.months)}
                    </span>
                    {s.prereq.length > 0 && <span className="kb-path__meta">Nên hiểu trước: {s.prereq.map((p) => byId.get(p)?.title ?? p).join(', ')}</span>}
                    {(done.has(s.id) || s.untested) && (
                      <span className="kb-path__badges">
                        {done.has(s.id) && <StatusBadge tone="good">Đã xong</StatusBadge>}
                        {s.untested && <StatusBadge tone="warn">Ngoài vùng đã kiểm định</StatusBadge>}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <details className="kb-home__options">
          <summary>Tuỳ chọn</summary>
          <NumberInput label="Hạt giống" unit="" value={seed} min={1} max={9999} step={1} onChange={setSeed} />
        </details>
      </section>

      <section className="kb-home__block" aria-labelledby="home-free">
        <h2 id="home-free">Tự do (sandbox)</h2>
        <p className="kb-home__sub">Không có câu hỏi sẵn. Bạn tự đặt luật và thử.</p>
        <Card>
          <div className="kb-home__form">
            <div className="kb-field">
              <span className="kb-field__label">
                Quy mô
              </span>
              <SegmentedControl label="Quy mô" options={SCALE_OPTIONS} value={scale} onChange={setScale} />
            </div>
            <NumberInput label="Hạt giống" unit="" value={seed} min={1} max={9999} step={1} onChange={setSeed} />
          </div>
          <SetupBlock info={setupInfo} onInfo={setSetupInfo} laws={setupLaws} setLaws={setSetupLaws} variants={setupVariants} setVariants={setSetupVariants} />
          <div className="kb-home__actions">
            <Button variant="primary" onClick={() => start({ scale, seed, setup: setupInfo ? buildSetup(setupInfo, setupLaws, setupVariants) : undefined })}>
              Bắt đầu
            </Button>
            {last && (
              <Button onClick={() => void openSave(last)}>Tiếp tục ván gần nhất</Button>
            )}
          </div>
        </Card>
        <p className="kb-home__sub kb-home__setupnote">Nền kinh tế được dựng theo luật hiện hành, rồi chuyển sang luật bạn đặt ngay từ tháng đầu. Vài tháng đầu là lúc nền kinh tế thích nghi.</p>
      </section>

      <section className="kb-home__block" aria-labelledby="home-saves">
        <h2 id="home-saves">Ván đã lưu</h2>
        <Card>
          {saves.length === 0 ? (
            <p className="kb-home__empty">Chưa có ván nào.</p>
          ) : (
            <ul className="kb-saves">
              {saves.map((k) => (
                <li key={k}>
                  <button type="button" className="kb-saves__open" onClick={() => void openSave(k)}>
                    {saveTitle(k)}
                  </button>
                  <Button
                    variant="text"
                    aria-label={`Xoá ${saveTitle(k)}`}
                    onClick={() => {
                      void deleteSave(k).then(refresh);
                    }}
                  >
                    Xoá
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="kb-field kb-home__file">
            <label className="kb-field__label" htmlFor="home-file">
              Mở từ file
            </label>
            <input
              id="home-file"
              type="file"
              accept=".kinhbang"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) loadBytes(new Uint8Array(await f.arrayBuffer()));
              }}
            />
          </div>
        </Card>
      </section>
    </main>
  );
}
