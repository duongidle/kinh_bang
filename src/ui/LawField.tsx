// Phần dùng chung của một luật trên màn hình: ô nhập đúng đơn vị, dòng "hiện hành", thẻ nguồn.
// Bảng Chính phủ (RolePanel) và Cài đặt ban đầu (Home) cùng dùng, để hai nơi không lệch nhau.
import type { LawInfo } from '../protocol';
import { NumberInput, SegmentedControl, SourceTag } from './design';
import { fmt, num } from './format';
import './law.css';

const isRate = (law: LawInfo) => law.unit === 'tỷ lệ' || law.unit === '%/năm';
const isMoney = (law: LawInfo) => law.unit.startsWith('đồng');
export const isToggle = (law: LawInfo) => law.unit === 'bật/tắt';

/** Quy đổi giữa giá trị thật của luật và giá trị hiện trên ô: tỷ lệ theo %, tiền theo triệu đồng. */
export function lawDisplay(law: LawInfo) {
  const scale = isRate(law) ? 100 : isMoney(law) ? 1e-6 : 1;
  const unit = isRate(law) ? '%' : isMoney(law) ? law.unit.replace('đồng', 'triệu đồng') : law.unit;
  const step = law.step ? law.step * scale : isRate(law) ? 0.01 : 1;
  const decimals = Math.min(3, Math.max(0, Math.ceil(-Math.log10(step) - 1e-9)));
  return {
    scale,
    unit,
    step: Number(step.toPrecision(12)),
    decimals,
    min: law.min === undefined ? undefined : Number((law.min * scale).toPrecision(12)),
    max: law.max === undefined ? undefined : Number((law.max * scale).toPrecision(12)),
    toRaw: (v: number) => Number((v / scale).toPrecision(12)),
    toShown: (v: number) => Number((v * scale).toPrecision(12)),
  };
}

/** "Hiện hành: ..." theo đơn vị của luật. Tiền hiện theo triệu đồng như ô nhập, để hai số khớp nhau. */
export function lawValueText(law: LawInfo, value: number): string {
  if (isMoney(law)) {
    const d = lawDisplay(law);
    const per = law.unit.includes('/') ? law.unit.slice(law.unit.indexOf('/')) : '';
    return `${num(d.toShown(value), d.decimals)} triệu đồng${per}`;
  }
  return fmt(value, law.unit);
}

const isoToVi = (iso: string) => iso.split('-').reverse().join('/');

export function LawSource({ law }: { law: LawInfo }) {
  return <SourceTag doc={law.doc} article={law.article || '–'} effective={isoToVi(law.effective)} note={law.note} />;
}

interface LawInputProps {
  law: LawInfo;
  /** Giá trị thật của luật (không phải giá trị trên ô). */
  value: number;
  onChange: (raw: number) => void;
}

/** Ô nhập một luật: số có đơn vị, hoặc nhóm Bật / Tắt. Kẹp theo min và max của luật. */
export function LawInput({ law, value, onChange }: LawInputProps) {
  if (isToggle(law))
    return (
      <div className="kb-field">
        <span className="kb-field__label">{law.label}</span>
        <SegmentedControl
          label={law.label}
          options={[
            { value: 1, label: 'Bật' },
            { value: 0, label: 'Tắt' },
          ]}
          value={value >= 0.5 ? 1 : 0}
          onChange={onChange}
        />
      </div>
    );
  const d = lawDisplay(law);
  const factor = 10 ** d.decimals;
  const round = (x: number) => Math.round(x * factor) / factor;
  return (
    <NumberInput
      label={law.label}
      unit={d.unit}
      value={d.toShown(value)}
      min={d.min}
      max={d.max}
      step={d.step}
      onChange={(v) => {
        // Ô chỉ hiện đến số chữ số của bước nhảy. Rời ô mà không sửa thì không coi là đổi giá trị.
        if (round(v) === round(d.toShown(value))) return;
        onChange(d.toRaw(v));
      }}
    />
  );
}
