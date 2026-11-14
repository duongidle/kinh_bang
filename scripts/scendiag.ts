// Soi một kịch bản: chạy lời giải mẫu ở nhiều seed, in hiệu (ván - đối chứng) của các chỉ số theo năm, trung bình kèm khoảng tin cậy 95%.
// Dùng: npx tsx scripts/scendiag.ts <mã kịch bản> [số seed] <chỉ số[:rel|pt]> ...
import { SCENARIOS } from '../src/content/scenarios';
import { Session } from '../src/engine/session/session';
const id = process.argv[2];
const N = Number(process.argv[3] ?? 10);
const specs = process.argv.slice(4).map((s) => {
  const [ind, kind = 'rel'] = s.split(':');
  return { ind, kind };
});
const def = SCENARIOS.find((d) => d.id === id)!;
const Y = Math.ceil(def.months / 12);
const acc: Record<string, number[][]> = {};
for (let seed = 1; seed <= N; seed++) {
  const s = new Session(SCENARIOS);
  s.handle({ type: 'init', scale: def.scale, seed, scenario: def.id });
  for (let t = 0; t < def.months; t++) {
    for (const st of def.demo) if (st.at === t) s.act(st);
    s.handle({ type: 'step', months: 1, frame: false });
  }
  const x = s as any;
  const origin = def.control === 'shock' ? 'shock' : 'player';
  const base = x.replay((e: { origin: string }) => e.origin === origin).w;
  for (const { ind, kind } of specs) {
    const row: number[] = [];
    for (let y = 0; y < Y; y++) {
      const a = x.t0 + y * 12;
      const b = a + 12;
      const m = (w: unknown) => {
        const v = x.eng.seriesOf(w, ind, a, b) as Float64Array;
        let sum = 0;
        for (const q of v) sum += q;
        return sum / v.length;
      };
      row.push(kind === 'rel' ? (m(x.w) / m(base) - 1) * 100 : (m(x.w) - m(base)) * 100);
    }
    (acc[`${ind}:${kind}`] ??= []).push(row);
  }
}
console.log(''.padEnd(26), Array.from({ length: Y }, (_, y) => `năm ${y + 1}`.padStart(14)).join(''));
for (const k in acc) {
  let line = k.padEnd(26);
  for (let y = 0; y < Y; y++) {
    const v = acc[k].map((r) => r[y]);
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const sd = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, v.length - 1));
    line += `${m.toFixed(2)}±${((1.96 * sd) / Math.sqrt(v.length)).toFixed(2)}`.padStart(14);
  }
  console.log(line);
  console.log(''.padEnd(26), acc[k].map((r) => r.slice(0, Y).map((q) => q.toFixed(1)).join(' ')).join(' | '));
}
