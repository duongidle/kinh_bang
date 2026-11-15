import { money } from '../../format';

export interface TAccountLine {
  label: string;
  /** Đồng. */
  value: number;
}

/** Bảng chữ T. Không tự cân: hai tổng khác nhau thì hiện cả hai như nhận. */
export function TAccount({ title, assets, liabilities }: { title: string; assets: TAccountLine[]; liabilities: TAccountLine[] }) {
  const side = (heading: string, lines: TAccountLine[], right: boolean) => (
    <div className={right ? 'kb-t__side kb-t__side--right' : 'kb-t__side'}>
      <div className="kb-t__head">{heading}</div>
      {lines.map((l, i) => (
        <div key={i} className="kb-t__row">
          <span>{l.label}</span>
          <span className="kb-num">{money(l.value)}</span>
        </div>
      ))}
      <div className="kb-t__row kb-t__total">
        <span>Tổng</span>
        <span className="kb-num">{money(lines.reduce((s, l) => s + l.value, 0))}</span>
      </div>
    </div>
  );
  return (
    <section className="kb-t" aria-label={title}>
      <h3 className="kb-t__title">{title}</h3>
      <div className="kb-t__body">
        {side('Tài sản', assets, false)}
        {side('Nợ và vốn', liabilities, true)}
      </div>
    </section>
  );
}
