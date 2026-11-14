// Kiểm định kịch bản (gd1 mục 16): chạy lời giải mẫu ở nhiều seed; mỗi khẳng định trong lời giải thích phải đúng ở ít nhất 80% số seed.
import { SCENARIOS } from '@/content/scenarios';
import type { ScenarioDef } from '@/engine/scenario/types';
import { Session } from '@/engine/session/session';

export interface ClaimCheck {
  text: string;
  okSeeds: number;
  n: number;
  pass: boolean;
  sample: string;
}

/** Một nhánh của kịch bản có nhiều lựa chọn: khẳng định chung và riêng đo trên nhánh đó, và các cột so sánh qua các seed. */
export interface OptionCheck {
  id: string;
  label: string;
  note: string;
  common: ClaimCheck[];
  claims: ClaimCheck[];
  values: Array<{ mean: number; min: number; max: number; n: number }>;
}

export interface ScenarioCheck {
  id: string;
  title: string;
  claims: ClaimCheck[];
  goals: Array<{ label: string; okSeeds: number; n: number }>;
  /** Có thì kịch bản được kiểm định theo từng nhánh; `claims` và `goals` ở trên để trống. */
  options?: OptionCheck[];
  columns?: Array<{ label: string; kind: 'rel' | 'pt' }>;
  error?: string;
}

const claimOf = (text: string): ClaimCheck => ({ text, okSeeds: 0, n: 0, pass: false, sample: '' });
const tally = (c: ClaimCheck, r: { ok: boolean; detail: string }) => {
  c.n++;
  if (r.ok) c.okSeeds++;
  if (!c.sample) c.sample = r.detail;
};
const passes = (c: ClaimCheck, nSeeds: number) => c.n === nSeeds && c.okSeeds / c.n >= 0.8 - 1e-9;

/**
 * Kịch bản có nhiều lựa chọn: mỗi nhánh chạy từ cùng trạng thái t0 bằng `Session.scenarioOptions()`, đúng đường mà giao diện dùng.
 * Mỗi nhánh áp bước chung `demo` rồi bước riêng của nhánh. Khẳng định chung phải đúng ở mọi nhánh.
 */
function checkWithOptions(def: ScenarioDef, seeds: number[]): ScenarioCheck {
  const opts = def.options!;
  const out: ScenarioCheck = {
    id: def.id,
    title: def.title,
    claims: [],
    goals: [],
    columns: (def.compare ?? []).map((c) => ({ label: c.label, kind: c.kind })),
    options: opts.map((o) => ({ id: o.id, label: o.label, note: o.note, common: def.claims.map((c) => claimOf(c.text)), claims: o.claims.map((c) => claimOf(c.text)), values: (def.compare ?? []).map(() => ({ mean: 0, min: Infinity, max: -Infinity, n: 0 })) })),
  };
  for (const seed of seeds) {
    try {
      const s = new Session(SCENARIOS);
      const m = s.handle({ type: 'init', scale: def.scale, seed, scenario: def.id });
      if (m[0].type === 'error') throw new Error(m[0].message);
      const rep = s.scenarioOptions();
      rep.rows.forEach((row, i) => {
        const o = out.options![i];
        row.common.forEach((r, k) => tally(o.common[k], r));
        row.claims.forEach((r, k) => tally(o.claims[k], r));
        row.values.forEach((v, k) => {
          const a = o.values[k];
          if (!Number.isFinite(v)) return;
          a.mean += v;
          a.min = Math.min(a.min, v);
          a.max = Math.max(a.max, v);
          a.n++;
        });
      });
    } catch (e) {
      out.error = `seed ${seed}: ${(e as Error).message.slice(0, 200)}`;
    }
  }
  for (const o of out.options!) {
    for (const c of [...o.common, ...o.claims]) c.pass = passes(c, seeds.length);
    for (const a of o.values) a.mean = a.n ? a.mean / a.n : NaN;
  }
  return out;
}

/** Mọi khẳng định của một kết quả kiểm định, kể cả của từng nhánh. */
export function allClaims(r: ScenarioCheck): Array<{ where: string; claim: ClaimCheck }> {
  return [...r.claims.map((claim) => ({ where: r.id, claim })), ...(r.options ?? []).flatMap((o) => [...o.common, ...o.claims].map((claim) => ({ where: `${r.id}/${o.id}`, claim })))];
}

export function runScenario(def: ScenarioDef, seed: number) {
  const s = new Session(SCENARIOS);
  const m = s.handle({ type: 'init', scale: def.scale, seed, scenario: def.id });
  if (m[0].type === 'error') throw new Error(m[0].message);
  for (let t = 0; t < def.months; t++) {
    for (const st of def.demo) if (st.at === t) s.act(st);
    const r = s.handle({ type: 'step', months: 1, frame: false });
    if (r[0].type !== 'tick') throw new Error(r[0].type === 'error' ? r[0].message : r[0].type === 'violation' ? r[0].problems.join('; ') : 'lỗi');
  }
  return s.scenarioReport();
}

export function checkScenarios(seeds: number[], only?: string): ScenarioCheck[] {
  return SCENARIOS.filter((d) => !only || d.id === only).map((def) => {
    if (def.options?.length) return checkWithOptions(def, seeds);
    const out: ScenarioCheck = { id: def.id, title: def.title, claims: def.claims.map((c) => ({ text: c.text, okSeeds: 0, n: 0, pass: false, sample: '' })), goals: def.goals.map((g) => ({ label: g.label, okSeeds: 0, n: 0 })) };
    for (const seed of seeds) {
      try {
        const r = runScenario(def, seed);
        r.claims.forEach((c, i) => {
          out.claims[i].n++;
          if (c.ok) out.claims[i].okSeeds++;
          if (!out.claims[i].sample) out.claims[i].sample = c.detail;
        });
        r.goals.forEach((g, i) => {
          out.goals[i].n++;
          if (g.ok) out.goals[i].okSeeds++;
        });
      } catch (e) {
        out.error = `seed ${seed}: ${(e as Error).message.slice(0, 200)}`;
      }
    }
    for (const c of out.claims) c.pass = passes(c, seeds.length);
    return out;
  });
}

export function renderScenarioReport(rows: ScenarioCheck[], nSeeds: number): string {
  const L: string[] = ['# Kiểm định kịch bản GĐ1', '', `Mỗi kịch bản chạy lời giải mẫu ở ${nSeeds} seed. Một khẳng định qua khi đúng ở ít nhất 80% số seed. Cột "mục tiêu" cho biết lời giải mẫu đạt mục tiêu ở bao nhiêu seed (chỉ để tham khảo, không phải điều kiện).`, ''];
  for (const r of rows) {
    L.push(`## ${r.title} (\`${r.id}\`)`, '');
    if (r.error) L.push(`**Lỗi khi chạy**: ${r.error}`, '');
    if (r.options) {
      L.push('Kịch bản có nhiều lựa chọn: mỗi nhánh chạy từ cùng trạng thái xuất phát, và khẳng định chung phải đúng ở mọi nhánh.', '');
      for (const o of r.options) {
        L.push(`### Nhánh: ${o.label} (\`${o.id}\`)`, '', o.note, '', '| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |', '|---|---|---|---|');
        for (const c of o.common) L.push(`| (chung) ${c.text} | ${c.okSeeds}/${c.n} | ${c.pass ? 'QUA' : '**KHÔNG QUA**'} | ${c.sample} |`);
        for (const c of o.claims) L.push(`| ${c.text} | ${c.okSeeds}/${c.n} | ${c.pass ? 'QUA' : '**KHÔNG QUA**'} | ${c.sample} |`);
        L.push('');
      }
      if (r.columns?.length) {
        const f = (kind: 'rel' | 'pt', x: number) => {
          if (!Number.isFinite(x)) return '–';
          const v = x * 100;
          return `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(kind === 'rel' ? 1 : 2).replace('.', ',')}${kind === 'rel' ? '%' : ' điểm'}`;
        };
        L.push('Các cột so sánh, trung bình qua các seed (nhỏ nhất đến lớn nhất):', '', `| Nhánh | ${r.columns.map((c) => c.label).join(' | ')} |`, `|---|${r.columns.map(() => '---').join('|')}|`);
        for (const o of r.options) L.push(`| ${o.label} | ${o.values.map((a, k) => `${f(r.columns![k].kind, a.mean)} (${f(r.columns![k].kind, a.min)} đến ${f(r.columns![k].kind, a.max)})`).join(' | ')} |`);
        L.push('');
      }
      continue;
    }
    L.push('| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |', '|---|---|---|---|');
    for (const c of r.claims) L.push(`| ${c.text} | ${c.okSeeds}/${c.n} | ${c.pass ? 'QUA' : '**KHÔNG QUA**'} | ${c.sample} |`);
    L.push('', ...r.goals.map((g) => `- Mục tiêu "${g.label}": lời giải mẫu đạt ở ${g.okSeeds}/${g.n} seed.`), '');
  }
  return L.join('\n');
}
