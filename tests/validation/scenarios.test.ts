// Chạy: npm run validate:scenarios. Sinh docs/validation/scenarios.md.
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allClaims, checkScenarios, renderScenarioReport } from './scenarios-lib';

const N = Number(process.env.KB_SEEDS ?? 10);
const OUT = process.env.KB_OUT_DIR ?? 'docs/validation'; // đổi khi chạy thử

/** Chốt chặn D (chong-va-ngam.md): mã commit cuối chạm src hoặc tests (không dùng HEAD) và cờ dirty, lấy LÚC BẮT ĐẦU chạy. */
function takeStamp(): string {
  try {
    const hash = execSync('git log -1 --format=%h -- src tests', { encoding: 'utf8' }).trim() || 'không rõ';
    const dirty = execSync('git status --porcelain -- src tests', { encoding: 'utf8' }).trim() !== '';
    return `Bản code: commit cuối chạm src hoặc tests: \`${hash}\`${dirty ? ' **CÓ THAY ĐỔI CHƯA COMMIT trong src hoặc tests: kết quả này không gắn được với một commit**' : ''}.`;
  } catch {
    return 'Bản code: không đọc được mã commit.';
  }
}

describe('Kiểm định kịch bản GĐ1', () => {
  it('mọi khẳng định trong lời giải thích đúng ở ít nhất 80% số seed', () => {
    const stamp = takeStamp(); // trước khi mô phỏng
    const rows = checkScenarios(Array.from({ length: N }, (_, i) => i + 1));
    mkdirSync(OUT, { recursive: true });
    writeFileSync(`${OUT}/scenarios.md`, renderScenarioReport(rows, N).replace('\n', `\n\n${stamp}\n`) + '\n');
    const failed = rows.flatMap((r) => [...(r.error ? [`${r.id}: ${r.error}`] : []), ...allClaims(r).filter((x) => !x.claim.pass).map((x) => `${x.where}: ${x.claim.text} (${x.claim.okSeeds}/${x.claim.n})`)]);
    expect(failed).toEqual([]);
  }, 4 * 3_600_000); // thời gian chờ, không phải ngưỡng kiểm định
});
