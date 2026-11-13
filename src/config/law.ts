// Hệ tham số luật: mỗi tham số có nhiều phiên bản theo ngày hiệu lực, kèm nguồn và mức xác minh.
// Xem docs/design/gd0.md mục 6.1.

export type Verification = 'A' | 'B' | 'C';

export interface LawVersion {
  value: number;
  from: string; // ISO yyyy-mm-dd
  to?: string; // hết hiệu lực sau ngày này
  source: { doc: string; article?: string; url?: string };
  verification: Verification;
  chuaXacMinh?: true; // bắt buộc khi mức C
  simplification?: string;
}

export interface LawParam {
  id: string;
  label: string;
  unit: 'tỷ lệ' | 'đồng/tháng' | 'đồng/năm' | 'bật/tắt' | '%/năm';
  group: 'Thuế GTGT' | 'Thuế TNCN' | 'Thuế TNDN' | 'Hộ kinh doanh' | 'Lương' | 'NHNN' | 'Ngân hàng' | 'Ngân sách';
  /** Ai được đổi trong vai Chính phủ: Bộ Tài chính hay NHNN. */
  owner: 'fiscal' | 'monetary';
  min?: number;
  max?: number;
  step?: number;
  note?: string; // ghi chú luật thật hiển thị cạnh nút
  versions: LawVersion[];
}

export function resolveVersion(p: LawParam, iso: string): LawVersion {
  let best: LawVersion | undefined;
  for (const v of p.versions) {
    if (v.from <= iso && (!v.to || iso <= v.to)) {
      if (!best || v.from >= best.from) best = v;
    }
  }
  if (!best) {
    // Trước phiên bản đầu tiên: dùng phiên bản sớm nhất.
    best = p.versions.reduce((a, b) => (a.from <= b.from ? a : b));
  }
  return best;
}
