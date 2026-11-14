// Vì sao thất nghiệp 6-7% và lạm phát gần 0: phân rã bằng số liệu của chính mô hình, năm 11-40.
// Dùng: npx tsx scripts/demand.ts [số seed] [S|M|L] [k=v ...]
import { gd1Engine } from '../src/engine/modules/gd1/index';
const N = Number(process.argv[2] ?? 5);
const scale = (process.argv[3] ?? 'M') as 'S' | 'M' | 'L';
const T0 = 120, T1 = 480;
const acc: Record<string, number[]> = {};
const put = (k: string, v: number) => (acc[k] ??= []).push(v);
for (let seed = 1; seed <= N; seed++) {
  const eng = gd1Engine(); eng.checkEvery = 0;
  const params: Record<string, number> = {}; const laws: Record<string, number> = {};
  for (const a of process.argv.slice(4)) { const [k, v] = a.split('='); if (eng.laws.has(k)) laws[k] = Number(v); else params[k] = Number(v); }
  const w = eng.newWorld({ seed, scale, params, laws });
  eng.run(w, T1);
  const n = w.tables.hh.n;
  const S = (id: string) => eng.seriesOf(w, id, T0, T1);
  const mean = (x: ArrayLike<number>) => { let s = 0; for (let i = 0; i < x.length; i++) s += x[i]; return s / x.length; };
  const sum = (x: ArrayLike<number>) => mean(x) * x.length;
  const years = (T1 - T0) / 12;
  const C = (id: string) => { const out: Record<string, number> = {}; const rows = w.causal.contrib[id] ?? []; for (let t = T0; t < T1; t++) for (const k in rows[t] ?? {}) out[k] = (out[k] ?? 0) + rows[t][k]; return out; };
  // --- thị trường lao động
  const u = mean(S('unemployment'));
  put('1 thất nghiệp %', u * 100);
  put('1 chỗ trống đang tuyển, % số hộ', (mean(S('vacancies')) / n) * 100);
  const uc = C('unemployment');
  let inflow = 0;
  for (const k in uc) { put(`2 thất nghiệp đổi vì ${k}, điểm/năm`, (uc[k] / years) * 100); if (uc[k] > 0) inflow += uc[k]; }
  put('1 người mất việc mỗi tháng, % số hộ', (inflow / (T1 - T0)) * 100);
  put('1 thời gian thất nghiệp bình quân, tháng', u / (inflow / (T1 - T0)));
  put('1 sử dụng công suất máy %', mean(S('utilisation')) * 100);
  // --- cầu
  const gdp = sum(S('gdp.nominal'));
  put('3 tiêu dùng / GDP %', (sum(S('consumption')) / gdp) * 100);
  put('3 đầu tư / GDP %', (sum(S('investment')) / gdp) * 100);
  put('3 chi ngân sách / GDP %', (sum(S('gov.spending')) / gdp) * 100);
  put('3 thu ngân sách / GDP %', (sum(S('gov.revenue')) / gdp) * 100);
  put('3 bội chi / GDP %', ((sum(S('gov.spending')) - sum(S('gov.revenue'))) / gdp) * 100);
  put('3 nhu cầu mua không được đáp ứng / tiêu dùng %', (sum(S('unmet')) / sum(S('consumption'))) * 100);
  put('3 phần lương trong GDP %', mean(S('wage.share')) * 100);
  put('3 tăng trưởng GDP thực %/năm', (Math.pow(mean(eng.seriesOf(w, 'gdp.real', T1 - 12, T1)) / mean(eng.seriesOf(w, 'gdp.real', T0, T0 + 12)), 1 / (years - 1)) - 1) * 100);
  // --- tiền
  const m2 = S('money.m2');
  put('4 tăng tiền M2 %/năm', (Math.pow(m2[m2.length - 1] / m2[0], 1 / years) - 1) * 100);
  const mc = C('money.m2'); const mAvg = mean(m2);
  for (const k in mc) put(`4 tiền đổi vì ${k}, % M2/năm`, (mc[k] / years / mAvg) * 100);
  put('4 tăng dư nợ %/năm', (Math.pow(eng.value(w, 'credit', T1 - 1) / eng.value(w, 'credit', T0), 1 / years) - 1) * 100);
  put('4 nợ công / GDP năm, cuối kỳ %', eng.value(w, 'gov.debtGdp', T1 - 1) * 100);
  // --- giá và lương
  const cpi = S('cpi');
  put('5 lạm phát %/năm', (Math.pow(cpi[cpi.length - 1] / cpi[0], 1 / years) - 1) * 100);
  const pc = C('cpi'); const cAvg = mean(cpi);
  for (const k in pc) put(`5 CPI đổi vì ${k}, điểm %/năm`, (pc[k] / years / cAvg) * 100);
  const rw = C('wage.real'); const rAvg = mean(S('wage.real'));
  for (const k in rw) put(`6 lương thực đổi vì ${k}, %/năm`, (rw[k] / years / rAvg) * 100);
  // --- tiêu dùng theo lý do
  const cc = C('consumption'); const cons = mean(S('consumption'));
  for (const k in cc) put(`7 tiêu dùng đổi vì ${k}, %/năm`, (cc[k] / years / cons) * 100);
}
for (const k of Object.keys(acc).sort()) {
  const v = acc[k]; const m = v.reduce((a, b) => a + b, 0) / v.length;
  if (Math.abs(m) < 0.005 && !k.startsWith('1')) continue;
  console.log(`${k.padEnd(62)} ${m.toFixed(2).padStart(8)}   [${Math.min(...v).toFixed(2)}; ${Math.max(...v).toFixed(2)}]`);
}
