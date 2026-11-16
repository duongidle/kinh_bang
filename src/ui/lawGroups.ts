// Nhóm luật theo việc người chơi muốn làm (gd1-5 mục 4.3). Bảng hằng, không đổi `group` trong config.
// Mỗi mục là một id, hoặc tiền tố kết thúc bằng "*". Thứ tự nhóm và nhóm con là thứ tự hiện trên màn hình.
import type { LawInfo } from '../protocol';

export type LawOwner = 'fiscal' | 'monetary';

interface SubDef {
  title?: string;
  match: string[];
}
interface GroupDef {
  title: string;
  subs: SubDef[];
}

export const LAW_GROUP_TABLE: GroupDef[] = [
  {
    title: 'Thuế',
    subs: [
      { title: 'Thuế GTGT', match: ['vat.rate.standard', 'vat.rate.agri'] },
      { title: 'Thuế TNCN', match: ['pit.*'] },
      { title: 'Thuế TNDN', match: ['cit.*'] },
      { title: 'Hộ kinh doanh', match: ['hkd.*'] },
      { title: 'Thuế và thu khác', match: ['tax.indirect.other', 'gov.fees.rate'] },
    ],
  },
  { title: 'Chi tiêu', subs: [{ match: ['gov.purchase.share', 'gov.public.share', 'gov.wage.premium', 'gov.transfer.unemployed', 'gov.transfer.universal'] }] },
  { title: 'Vay và in tiền', subs: [{ match: ['gov.deficit.target', 'gov.debt.ceiling', 'gov.bond.spread', 'cb.monetize', 'cb.omo.auto'] }] },
  { title: 'Lãi suất', subs: [{ match: ['cb.rate.refinancing', 'cb.deposit.cap', 'cb.inflation.target'] }] },
  { title: 'Dự trữ', subs: [{ match: ['cb.reserve.ratio', 'cb.reserve.interest', 'bank.car.min'] }] },
  { title: 'Room tín dụng', subs: [{ match: ['cb.room.enabled', 'cb.credit.room'] }] },
  { title: 'Lương tối thiểu', subs: [{ match: ['minwage.zone.1', 'minwage.zone.2', 'minwage.zone.3', 'minwage.zone.4'] }] },
];

export interface LawSection<T extends LawInfo> {
  title?: string;
  laws: T[];
}
export interface LawGroupView<T extends LawInfo> {
  title: string;
  sections: LawSection<T>[];
}

const matches = (pattern: string, id: string) => (pattern.endsWith('*') ? id.startsWith(pattern.slice(0, -1)) : pattern === id);

/** Số nhóm con trong bảng chứa luật này. Hợp lệ khi đúng một. */
export function groupCountOf(id: string): number {
  return LAW_GROUP_TABLE.reduce((n, g) => n + g.subs.filter((s) => s.match.some((m) => matches(m, id))).length, 0);
}

/** Luật nhóm theo việc, chỉ giữ luật của bên được chọn; nhóm rỗng bị bỏ. Trong mỗi nhóm con giữ thứ tự của danh mục. */
export function groupLaws<T extends LawInfo>(laws: T[], owners: Set<LawOwner>): LawGroupView<T>[] {
  const mine = laws.filter((l) => owners.has(l.owner));
  const out: LawGroupView<T>[] = [];
  for (const g of LAW_GROUP_TABLE) {
    const sections: LawSection<T>[] = [];
    for (const s of g.subs) {
      const list = mine.filter((l) => s.match.some((m) => matches(m, l.id)));
      if (list.length) sections.push({ title: s.title, laws: list });
    }
    if (sections.length) out.push({ title: g.title, sections });
  }
  return out;
}
