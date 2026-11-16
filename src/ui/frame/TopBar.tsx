// Thanh trên của khung chơi (gd1-5 mục 4.2): về màn hình đầu, tên ván, ngày, tốc độ, ba vai dạng tab, bốn lối tới màn hình tra cứu, menu.
import { useEffect, useRef } from 'react';
import type { Role } from '../../protocol';
import { Button, SegmentedControl, Tabs } from '../design';
import { useStore, type Speed } from '../store';
import { AppMenu } from './AppMenu';
import './frame.css';

const SPEEDS: { value: Speed; label: string }[] = [
  { value: 0, label: 'Dừng' },
  { value: 1, label: '×1' },
  { value: 4, label: '×4' },
  { value: 16, label: '×16' },
  { value: 99, label: 'Tối đa' },
];

type TabId = 'observer' | 'gov' | 'part';
const TAB_LABEL: Record<TabId, string> = { observer: 'Quan sát', gov: 'Chính phủ', part: 'Người tham gia' };
const tabOf = (r: Role): TabId => (r === 'observer' ? 'observer' : r === 'household' || r === 'firm' ? 'part' : 'gov');

export function TopBar() {
  const tick = useStore((s) => s.tick)!;
  const speed = useStore((s) => s.speed);
  const setSpeed = useStore((s) => s.setSpeed);
  const stepOnce = useStore((s) => s.stepOnce);
  const role = useStore((s) => s.role);
  const setRole = useStore((s) => s.setRole);
  const scenario = useStore((s) => s.scenario);
  const toMenu = useStore((s) => s.toMenu);
  const openLeft = useStore((s) => s.openLeft);
  const openScreen = useStore((s) => s.openScreen);

  // Vai gần nhất trong mỗi nhóm, để bấm lại tab thì về đúng vai đã chọn.
  const lastGov = useRef<Role>('government');
  const lastPart = useRef<Role>('household');
  useEffect(() => {
    if (tabOf(role) === 'gov') lastGov.current = role;
    else if (tabOf(role) === 'part') lastPart.current = role;
  }, [role]);

  const tabIds: TabId[] = scenario ? ['observer', ...(scenario.role === 'observer' ? [] : [tabOf(scenario.role)])] : ['observer', 'gov', 'part'];
  const pick = (id: string) => {
    if (id === 'observer') return setRole('observer');
    if (scenario) return setRole(scenario.role);
    setRole(id === 'gov' ? lastGov.current : lastPart.current);
  };

  return (
    <header className="kb-top">
      <Button variant="text" className="kb-top__brand" onClick={toMenu} title="Về màn hình đầu">
        Kinh Bang
      </Button>
      <span className="kb-top__name">{scenario ? scenario.title : 'Ván tự do'}</span>
      <span className="kb-top__date kb-num" title={`Tháng thứ ${tick.tick}`}>
        {tick.tick === 0 ? 'Chưa chạy' : `${String(tick.month).padStart(2, '0')}/${tick.year}`}
      </span>
      <div className="kb-top__speed">
        <SegmentedControl label="Tốc độ" options={SPEEDS} value={speed} onChange={setSpeed} />
        <Button onClick={() => stepOnce(1)} disabled={speed !== 0} title="Chạy một tháng">
          +1 tháng
        </Button>
      </div>
      <nav className="kb-top__roles" aria-label="Vai">
        <Tabs tabs={tabIds.map((id) => ({ id, label: TAB_LABEL[id] }))} active={tabOf(role)} onChange={pick} />
      </nav>
      <nav className="kb-top__tools" aria-label="Công cụ">
        <Button variant="text" onClick={() => openScreen({ kind: 'charts' })}>
          Biểu đồ
        </Button>
        <Button variant="text" onClick={() => openLeft({ kind: 'money' })}>
          Nguồn tiền
        </Button>
        <Button variant="text" onClick={() => openLeft({ kind: 'agents' })}>
          Soi tác nhân
        </Button>
        <Button variant="text" onClick={() => openScreen({ kind: 'lab' })}>
          Phòng thí nghiệm
        </Button>
      </nav>
      <AppMenu />
    </header>
  );
}
