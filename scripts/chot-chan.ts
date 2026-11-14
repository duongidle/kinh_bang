// In các dấu vân tay mà tests/unit/chot-chan.test.ts đòi có trong docs/design/sai-khac.md mục F.
// Dùng: npx tsx scripts/chot-chan.ts
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { GD1_PARAMS } from '../src/config/model/gd1';
const sha = (t: string) => createHash('sha256').update(t).digest('hex').slice(0, 12);
console.log('tham số hành vi          ', sha(GD1_PARAMS.map((p) => `${p.id}=${p.value}`).sort().join('\n')));
for (const f of ['tests/validation/gd1-lib.ts', 'tests/validation/scenarios-lib.ts']) console.log(f.padEnd(25), sha(readFileSync(f, 'utf8')));
