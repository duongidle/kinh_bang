// Kiểm định thống kê GĐ1 (gd1 mục 14): 20 seed x 480 tháng ở 500 hộ, 5 seed ở 5000 hộ, kế toán ở 50 hộ.
// Chạy: npm run validate:gd1. Sinh báo cáo docs/validation/gd1.md.
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { baselineChecks, experimentChecks, renderReport, type Check } from './gd1-lib';

const N = Number(process.env.KB_SEEDS ?? 20);
const NL = Number(process.env.KB_SEEDS_L ?? 5);
const seeds = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const ACCOUNTING = ['K1.1', 'K1.2', 'K1.3', 'K1.4', 'K1.30'];

describe('Kiểm định GĐ1', () => {
  it('toàn bộ danh sách', () => {
    const m = baselineChecks(seeds(N), 'M');
    const x = experimentChecks(seeds(N), 'M');
    const l = baselineChecks(seeds(NL), 'L');
    const s = baselineChecks(seeds(N), 'S');
    const sAcc = s.checks.filter((c) => ACCOUNTING.includes(c.id));
    const all: Check[] = [...m.checks, ...x, ...l.checks, ...sAcc];
    const failed = all.filter((c) => !c.pass);
    const md = renderReport('Báo cáo kiểm định GĐ1', [
      {
        heading: `Tóm tắt`,
        intro: `Chạy ${N} seed x 480 tháng ở 500 hộ, ${NL} seed ở 5000 hộ, ${N} seed ở 50 hộ (chỉ kế toán). Bỏ 120 tháng đầu. Một mục qua khi đúng ở ít nhất 80% số seed, hoặc khi khoảng tin cậy 95% của trung bình nằm đúng phía (ghi "theo trung bình"). Mục kế toán phải đúng ở mọi seed.\n\nKhông qua: ${failed.length ? failed.map((c) => c.id).join(', ') : 'không có'}.`,
        checks: [],
      },
      { heading: 'Lần chạy gốc, 500 hộ', checks: m.checks, table: m.table },
      { heading: 'Thí nghiệm chạy đôi, 500 hộ', checks: x },
      { heading: 'Lần chạy gốc, 5000 hộ', checks: l.checks, table: l.table },
      { heading: 'Kế toán ở 50 hộ', checks: sAcc },
    ]);
    writeFileSync('docs/validation/gd1.md', md + '\n');
    expect(failed.map((c) => `${c.id} (${c.perSeed.filter((p) => p.ok).length}/${c.perSeed.length})`)).toEqual([]);
  }, 3_600_000);
});
