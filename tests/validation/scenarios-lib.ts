// Kiểm định kịch bản (gd1 mục 16): chạy lời giải mẫu ở nhiều seed; mỗi khẳng định trong lời giải thích phải đúng ở ít nhất 80% số seed.
import { SCENARIOS } from '@/content/scenarios';
import type { ScenarioDef } from '@/engine/scenario/types';
import { Session } from '@/engine/session/session';

export interface ScenarioCheck {
  id: string;
  title: string;
  claims: Array<{ text: string; okSeeds: number; n: number; pass: boolean; sample: string }>;
  goals: Array<{ label: string; okSeeds: number; n: number }>;
  error?: string;
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
    for (const c of out.claims) c.pass = c.n === seeds.length && c.okSeeds / c.n >= 0.8 - 1e-9;
    return out;
  });
}

export function renderScenarioReport(rows: ScenarioCheck[], nSeeds: number): string {
  const L: string[] = ['# Kiểm định kịch bản GĐ1', '', `Mỗi kịch bản chạy lời giải mẫu ở ${nSeeds} seed. Một khẳng định qua khi đúng ở ít nhất 80% số seed. Cột "mục tiêu" cho biết lời giải mẫu đạt mục tiêu ở bao nhiêu seed (chỉ để tham khảo, không phải điều kiện).`, ''];
  for (const r of rows) {
    L.push(`## ${r.title} (\`${r.id}\`)`, '');
    if (r.error) L.push(`**Lỗi khi chạy**: ${r.error}`, '');
    L.push('| Khẳng định | Số seed đúng | Kết quả | Số đo ở seed đầu |', '|---|---|---|---|');
    for (const c of r.claims) L.push(`| ${c.text} | ${c.okSeeds}/${c.n} | ${c.pass ? 'QUA' : '**KHÔNG QUA**'} | ${c.sample} |`);
    L.push('', ...r.goals.map((g) => `- Mục tiêu "${g.label}": lời giải mẫu đạt ở ${g.okSeeds}/${g.n} seed.`), '');
  }
  return L.join('\n');
}
