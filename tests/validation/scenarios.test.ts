// Chạy: npm run validate:scenarios. Sinh docs/validation/scenarios.md.
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allClaims, checkScenarios, renderScenarioReport } from './scenarios-lib';

const N = Number(process.env.KB_SEEDS ?? 10);

/** Chốt chặn D (chong-va-ngam.md): báo cáo ghi mã commit đã chạy, và báo nếu cây mã có thay đổi chưa commit. */
function stamp(): string {
  try {
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    const dirty = execSync('git status --porcelain -- src tests', { encoding: 'utf8' }).trim() !== '';
    return `Bản code: commit \`${hash}\`${dirty ? ' **CÓ THAY ĐỔI CHƯA COMMIT trong src hoặc tests: kết quả này không gắn được với một commit**' : ''}.`;
  } catch {
    return 'Bản code: không đọc được mã commit.';
  }
}

describe('Kiểm định kịch bản GĐ1', () => {
  it('mọi khẳng định trong lời giải thích đúng ở ít nhất 80% số seed', () => {
    const rows = checkScenarios(Array.from({ length: N }, (_, i) => i + 1));
    writeFileSync('docs/validation/scenarios.md', renderScenarioReport(rows, N).replace('\n', `\n\n${stamp()}\n`) + '\n');
    const failed = rows.flatMap((r) => [...(r.error ? [`${r.id}: ${r.error}`] : []), ...allClaims(r).filter((x) => !x.claim.pass).map((x) => `${x.where}: ${x.claim.text} (${x.claim.okSeeds}/${x.claim.n})`)]);
    expect(failed).toEqual([]);
  }, 3_600_000);
});
