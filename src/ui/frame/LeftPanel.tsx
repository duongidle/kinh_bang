// Ngăn trái: tra cứu (chuỗi nhân quả, sổ tác nhân, nguồn tiền, soi tác nhân). Mở chồng lên nhau được, có nút quay lại.
import { SidePanel } from '../design';
import { useStore, type LeftItem } from '../store';
import { Agent } from '../views/Agent';
import { Agents } from '../views/Agents';
import { Causal } from '../views/Causal';
import { Money } from '../views/Money';

const TITLE: Record<LeftItem['kind'], string> = {
  causal: 'Vì sao?',
  agent: 'Sổ sách',
  money: 'Tiền sinh ra và mất đi ở đâu',
  agents: 'Soi tác nhân',
};

export function LeftPanel() {
  const left = useStore((s) => s.left);
  const backLeft = useStore((s) => s.backLeft);
  const closeLeft = useStore((s) => s.closeLeft);
  const item = left[left.length - 1];
  if (!item) return null;
  return (
    <SidePanel side="left" open title={TITLE[item.kind]} onBack={left.length >= 2 ? backLeft : undefined} onClose={closeLeft}>
      {item.kind === 'causal' && <Causal indicator={item.indicator} />}
      {item.kind === 'agent' && <Agent sector={item.sector} id={item.id} />}
      {item.kind === 'money' && <Money />}
      {item.kind === 'agents' && <Agents />}
    </SidePanel>
  );
}
