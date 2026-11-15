// Kiểm định thống kê GĐ1 (gd1 mục 14): 20 seed x 480 tháng ở 500 hộ, 5 seed ở 5000 hộ, kế toán ở 50 hộ.
// Chạy: npm run validate:gd1. Sinh báo cáo docs/validation/gd1.md.
// Chạy từng phần: KB_PART=M | X | L | S | report. Không đặt thì chạy cả bốn phần rồi report.
// Mỗi phần ghi ngay kết quả ra docs/validation/parts/gd1-<phần>.json; `report` đọc bốn file và dựng báo cáo.
// KB_OUT_DIR đổi thư mục ra (dùng khi chạy thử, mặc định docs/validation).
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { baselineChecks, experimentChecks, renderReport, type Check } from './gd1-lib';

const N = Number(process.env.KB_SEEDS ?? 20);
const NL = Number(process.env.KB_SEEDS_L ?? 5);
const OUT = process.env.KB_OUT_DIR ?? 'docs/validation';
const PART = process.env.KB_PART;
const seeds = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const ACCOUNTING = ['K1.1', 'K1.2', 'K1.3', 'K1.4', 'K1.30'];
const FOUR = ['M', 'X', 'L', 'S'] as const;
type PartId = (typeof FOUR)[number];
const TIMEOUT = 4 * 3_600_000; // thời gian chờ của mỗi phần, không phải ngưỡng kiểm định

interface Stamp {
  /** Mã commit cuối cùng chạm vào src hoặc tests (không dùng HEAD: commit tài liệu không đổi code). Lấy LÚC BẮT ĐẦU chạy. */
  commit: string;
  /** Có thay đổi chưa commit trong src hoặc tests lúc bắt đầu chạy. */
  dirty: boolean;
}
interface PartFile {
  part: PartId;
  nSeeds: number;
  stamp: Stamp;
  checks: Check[];
  table?: string[][];
}

/** Chốt chặn D (chong-va-ngam.md): lấy mã commit và cờ dirty lúc bắt đầu chạy, trước khi mô phỏng. */
function takeStamp(): Stamp {
  try {
    const commit = execSync('git log -1 --format=%h -- src tests', { encoding: 'utf8' }).trim() || 'không rõ';
    const dirty = execSync('git status --porcelain -- src tests', { encoding: 'utf8' }).trim() !== '';
    return { commit, dirty };
  } catch {
    return { commit: 'không đọc được', dirty: true };
  }
}

const partPath = (p: string) => `${OUT}/parts/gd1-${p}.json`;
// NaN và Infinity thành null khi tuần tự hoá; báo cáo không dùng các trường số (chỉ `m`, dùng khi tính qua/không qua).
const json = (v: unknown) => JSON.stringify(v, (_k, x) => (typeof x === 'number' && !Number.isFinite(x) ? null : x), 1);

function savePart(f: PartFile): void {
  // Kiểm tra đọc lại cho ra báo cáo y hệt; không thì dừng, vì báo cáo dựng lại sẽ sai.
  const back = JSON.parse(json(f)) as PartFile;
  const a = renderReport('x', [{ heading: 'x', checks: f.checks, table: f.table }]);
  const b = renderReport('x', [{ heading: 'x', checks: back.checks, table: back.table }]);
  if (a !== b) throw new Error(`Phần ${f.part}: đọc lại từ JSON cho ra báo cáo khác. Cần sửa gd1-lib.ts hoặc cách lưu: dừng, báo người điều phối.`);
  mkdirSync(`${OUT}/parts`, { recursive: true });
  writeFileSync(partPath(f.part), json(f) + '\n');
}

function runPart(part: PartId, build: () => { checks: Check[]; table?: string[][]; nSeeds: number }): void {
  const stamp = takeStamp(); // trước khi mô phỏng
  const r = build();
  savePart({ part, nSeeds: r.nSeeds, stamp, checks: r.checks, table: r.table });
}

describe('Kiểm định GĐ1', () => {
  const on = (p: string) => !PART || PART === p;

  it.skipIf(!on('M'))('phần M: lần chạy gốc, 500 hộ', () => {
    runPart('M', () => ({ ...baselineChecks(seeds(N), 'M'), nSeeds: N }));
  }, TIMEOUT);

  it.skipIf(!on('X'))('phần X: thí nghiệm chạy đôi, 500 hộ', () => {
    runPart('X', () => ({ checks: experimentChecks(seeds(N), 'M'), nSeeds: N }));
  }, TIMEOUT);

  it.skipIf(!on('L'))('phần L: lần chạy gốc, 5000 hộ', () => {
    runPart('L', () => ({ ...baselineChecks(seeds(NL), 'L'), nSeeds: NL }));
  }, TIMEOUT);

  it.skipIf(!on('S'))('phần S: kế toán ở 50 hộ', () => {
    runPart('S', () => {
      const s = baselineChecks(seeds(N), 'S');
      return { checks: s.checks.filter((c) => ACCOUNTING.includes(c.id)), nSeeds: N };
    });
  }, TIMEOUT);

  it.skipIf(!on('report'))('báo cáo: dựng từ bốn phần', () => {
    const problems: string[] = [];
    const parts: Partial<Record<PartId, PartFile>> = {};
    for (const p of FOUR) {
      if (!existsSync(partPath(p))) {
        problems.push(`thiếu phần ${p} (${partPath(p)})`);
        continue;
      }
      parts[p] = JSON.parse(readFileSync(partPath(p), 'utf8')) as PartFile;
    }
    const have = FOUR.filter((p) => parts[p]).map((p) => parts[p]!);
    const commits = [...new Set(have.map((f) => f.stamp.commit))];
    if (commits.length > 1) problems.push(`các phần không cùng mã commit: ${have.map((f) => `${f.part}=${f.stamp.commit}`).join(', ')}`);
    for (const f of have) if (f.stamp.dirty) problems.push(`phần ${f.part} chạy khi src hoặc tests có thay đổi chưa commit`);

    const stampLine =
      `Bản code: commit cuối chạm src hoặc tests: ${commits.map((c) => `\`${c}\``).join(', ') || 'không có phần nào'}.` +
      (problems.length ? ` **KHÔNG GẮN ĐƯỢC VỚI MỘT COMMIT SẠCH: ${problems.join('; ')}.**` : '');

    const M = parts.M;
    const X = parts.X;
    const L = parts.L;
    const S = parts.S;
    const all: Check[] = [...(M?.checks ?? []), ...(X?.checks ?? []), ...(L?.checks ?? []), ...(S?.checks ?? [])];
    const failed = all.filter((c) => !c.pass && !c.infoOnly);
    const md = renderReport('Báo cáo kiểm định GĐ1', [
      {
        heading: `Tóm tắt`,
        intro: `Chạy ${M?.nSeeds ?? '?'} seed x 480 tháng ở 500 hộ, ${L?.nSeeds ?? '?'} seed ở 5000 hộ, ${S?.nSeeds ?? '?'} seed ở 50 hộ (chỉ kế toán). Bỏ 120 tháng đầu. Thí nghiệm chạy đôi tách nhánh ở tháng 240 (trước 15/11/2026: tháng 120; sai-khac.md D16). Một mục qua khi đúng ở ít nhất 80% số seed, hoặc khi khoảng tin cậy 95% của trung bình nằm đúng phía (ghi "theo trung bình"). Mục kế toán phải đúng ở mọi seed.\n\nKhông qua: ${failed.length ? failed.map((c) => (c.known ? `${c.id} (đã biết)` : c.id)).join(', ') : 'không có'}.`,
        checks: [],
      },
      { heading: 'Lần chạy gốc, 500 hộ', checks: M?.checks ?? [], table: M?.table },
      { heading: 'Thí nghiệm chạy đôi, 500 hộ', checks: X?.checks ?? [] },
      { heading: 'Lần chạy gốc, 5000 hộ', checks: L?.checks ?? [], table: L?.table },
      { heading: 'Kế toán ở 50 hộ', checks: S?.checks ?? [] },
    ]);
    mkdirSync(OUT, { recursive: true });
    writeFileSync(`${OUT}/gd1.md`, md.replace('\n', `\n\n${stampLine}\n`) + '\n');
    expect(problems).toEqual([]);
    expect(failed.filter((c) => !c.known).map((c) => `${c.id} (${c.perSeed.filter((p) => p.ok).length}/${c.perSeed.length})`)).toEqual([]);
  }, TIMEOUT);
});
