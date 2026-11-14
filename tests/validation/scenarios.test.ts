// Chạy: npm run validate:scenarios. Sinh docs/validation/scenarios.md.
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allClaims, checkScenarios, renderScenarioReport } from './scenarios-lib';

const N = Number(process.env.KB_SEEDS ?? 10);

describe('Kiểm định kịch bản GĐ1', () => {
  it('mọi khẳng định trong lời giải thích đúng ở ít nhất 80% số seed', () => {
    const rows = checkScenarios(Array.from({ length: N }, (_, i) => i + 1));
    writeFileSync('docs/validation/scenarios.md', renderScenarioReport(rows, N) + '\n');
    const failed = rows.flatMap((r) => [...(r.error ? [`${r.id}: ${r.error}`] : []), ...allClaims(r).filter((x) => !x.claim.pass).map((x) => `${x.where}: ${x.claim.text} (${x.claim.okSeeds}/${x.claim.n})`)]);
    expect(failed).toEqual([]);
  }, 3_600_000);
});
