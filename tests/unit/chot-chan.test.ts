// Chốt chặn chống vá ngầm (docs/design/chong-va-ngam.md). Mỗi test ở đây tự động hoá một mục của bảng kiểm.
// Test hỏng nghĩa là có một thay đổi cần người duyệt. Đừng nới test: làm đúng việc mà thông báo lỗi yêu cầu.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GD1_PARAMS } from '@/config/model/gd1';
import { VN_LAWS } from '@/config/vn/laws';
import { gd1Engine, gd1Module } from '@/engine/modules/gd1/index';
import { KNOWN_FAIL } from '../validation/gd1-lib';

const read = (p: string) => readFileSync(p, 'utf8');
const sha = (text: string) => createHash('sha256').update(text).digest('hex').slice(0, 12);
const SAI_KHAC = read('docs/design/sai-khac.md');
/** Mục F của sai-khac.md: nhật ký đổi thước đo và đổi tham số. */
const LOG = SAI_KHAC.slice(SAI_KHAC.indexOf('## F. Nhật ký đổi thước đo'));

/** Dấu vân tay của bộ giá trị tham số hành vi. */
export const paramFingerprint = () => sha(GD1_PARAMS.map((p) => `${p.id}=${p.value}`).sort().join('\n'));

// Số mục còn ghi theo trí nhớ. Chỉ được GIẢM: mở nguồn, đọc, sửa `basis` rồi hạ con số này.
const MAX_TRI_NHO_PARAMS = 12;
const MAX_TRI_NHO_LAWS = 6;

describe('Chốt chặn B: tham số có lý lịch', () => {
  it('mọi tham số hành vi có nguồn; mục ghi theo trí nhớ không tăng', () => {
    for (const p of GD1_PARAMS) {
      expect(p.source.trim().length, `${p.id}: thiếu nguồn`).toBeGreaterThan(2); // ngắn nhất hợp lệ là "TTK"
      if (p.basis !== 'tu-thiet-ke' && p.basis !== 'chuan-hoa') expect(p.source.trim().length, `${p.id}: nguồn quá ngắn để tra lại`).toBeGreaterThan(8);
      expect(p.label.trim().length, `${p.id}: thiếu mô tả`).toBeGreaterThan(3);
      if (p.basis === 'nguon') expect(/^(TTK|tự thiết kế|Giá trị tạm)/i.test(p.source), `${p.id}: ghi là có nguồn nhưng nguồn là tự thiết kế`).toBe(false);
      if (/trí nhớ/.test(p.source.split('note')[0])) expect(p.basis, `${p.id}: nguồn ghi "trí nhớ" thì basis phải là tri-nho`).toBe('tri-nho');
    }
    const n = GD1_PARAMS.filter((p) => p.basis === 'tri-nho').length;
    expect(n, 'Số tham số ghi theo trí nhớ tăng lên. Mở nguồn và đọc trước khi thêm tham số.').toBeLessThanOrEqual(MAX_TRI_NHO_PARAMS);
    expect(new Set(GD1_PARAMS.map((p) => p.id)).size).toBe(GD1_PARAMS.length);
  });

  it('mọi phiên bản luật có văn bản, ngày hiệu lực; mục ghi theo trí nhớ không tăng', () => {
    for (const l of VN_LAWS)
      for (const v of l.versions) {
        expect(v.source.doc.trim().length, `${l.id}: thiếu văn bản nguồn`).toBeGreaterThan(3);
        expect(/^\d{4}-\d{2}-\d{2}$/.test(v.from), `${l.id}: ngày hiệu lực sai dạng`).toBe(true);
      }
    const n = (read('src/config/vn/laws.ts').match(/trí nhớ/g) ?? []).length;
    expect(n, 'Số chỗ ghi "trí nhớ" trong tham số luật tăng lên.').toBeLessThanOrEqual(MAX_TRI_NHO_LAWS);
  });

  it('mọi quy tắc hành vi và mã lý do đã đăng ký đủ', () => {
    for (const r of gd1Module.rules ?? []) {
      expect(r.source.trim().length, `quy tắc ${r.id}: thiếu nguồn`).toBeGreaterThan(3);
      expect(r.variants.length, `quy tắc ${r.id}: thiếu biến thể gốc`).toBeGreaterThan(0);
    }
    const ids = (gd1Module.reasons ?? []).map((r) => r.id);
    expect(new Set(ids).size, 'mã lý do bị trùng').toBe(ids.length);
    for (const r of gd1Module.reasons ?? []) expect(r.label.trim().length, `mã lý do ${r.id}: thiếu mô tả`).toBeGreaterThan(3);
  });

  it('đổi giá trị tham số hành vi thì phải có dòng trong sai-khac.md mục F', () => {
    const fp = paramFingerprint();
    expect(LOG.includes(fp), `Bộ giá trị tham số hành vi đã đổi (dấu vân tay ${fp}). Ghi vào docs/design/sai-khac.md mục F: tham số nào đổi, từ đâu tới đâu, nguồn, ai duyệt, kèm dấu vân tay này. In dấu vân tay: npx tsx scripts/chot-chan.ts`).toBe(true);
  });
});

describe('Chốt chặn C: thước đo không đổi lặng lẽ', () => {
  for (const file of ['tests/validation/gd1-lib.ts', 'tests/validation/scenarios-lib.ts'])
    it(`${file} đổi thì phải có dòng trong sai-khac.md mục F`, () => {
      const fp = sha(read(file));
      expect(LOG.includes(fp), `${file} đã đổi (dấu vân tay ${fp}). Nếu đổi ngưỡng, cửa sổ đo, cách đo hoặc danh sách "đã biết": ghi vào docs/design/sai-khac.md mục F cái gì đổi, số đo theo cách cũ và cách mới, ai duyệt, kèm dấu vân tay này. Nếu chỉ sửa chữ hay dọn code cũng ghi một dòng nói vậy.`).toBe(true);
    });

  it('mọi mục "chưa đạt, đã biết" có trong sai-khac.md và ghi ai quyết hoặc giai đoạn nào sửa', () => {
    for (const [id, text] of Object.entries(KNOWN_FAIL)) {
      expect(SAI_KHAC.includes(id), `${id} nằm trong danh sách đã biết nhưng sai-khac.md không nhắc tới`).toBe(true);
      expect(/Dương|GĐ\d/.test(text), `${id}: lời ghi phải nêu ai quyết hoặc giai đoạn nào sẽ sửa`).toBe(true);
    }
  });
});

describe('Chốt chặn E: phân rã không giấu phần "khác"', () => {
  // Trần cho phần "yếu tố khác" của từng chỉ số có phân rã, tính trên tổng giá trị tuyệt đối các phần.
  // Mặc định 1e-5. Các chỉ số dưới đây đang vượt: đó là NỢ, chỉ được hạ trần, không được nâng.
  const DEBT: Record<string, number> = {
    cpi: 1e-3, // làm tròn giá tới đồng
    'gdp.nominal': 0.15, // nợ: phần GDP chưa gán được cho tiêu dùng, Chính phủ, đầu tư, tồn kho
    'credit.denied': 0.1, // nợ
    'gov.revenue': 0.05, // nợ
    'gov.deficitGdp': 0.005, // nợ nhỏ
    'gov.debtGdp': 0.03, // tạm ứng của NHNN và nợ lương công chức chưa có mã riêng
    'bank.reserves': 0.4, // theo thiết kế: thu chi ngân sách và mua bán trái phiếu với kho bạc chưa tách
  };
  it('phần "khác" của mỗi chỉ số nằm dưới trần', () => {
    const eng = gd1Engine();
    const w = eng.newWorld({ seed: 5, scale: 'S' });
    eng.run(w, 18);
    eng.setLaw(w, 'vat.rate.standard', 0.12, 'test');
    eng.setLaw(w, 'gov.purchase.share', 0.07, 'test');
    eng.run(w, 30);
    for (const ind of eng.indicators) {
      if (!ind.contrib) continue;
      const rows = w.causal.contrib[ind.id] ?? [];
      let other = 0;
      let all = 0;
      for (let t = 1; t < rows.length; t++)
        for (const k in rows[t] ?? {}) {
          all += Math.abs(rows[t][k]);
          if (k === 'other') other += Math.abs(rows[t][k]);
        }
      if (all === 0) continue;
      const cap = DEBT[ind.id] ?? 1e-5;
      expect(other / all, `${ind.id}: phần "yếu tố khác" chiếm ${((other / all) * 100).toFixed(3)}%, vượt trần ${cap * 100}%. Tìm mã lý do còn thiếu; không nâng trần.`).toBeLessThanOrEqual(cap);
    }
  });
});

describe('Chốt chặn H và quy tắc 3', () => {
  it('quy tắc tự động của Nhà nước tắt theo mặc định', () => {
    for (const id of ['gov.autopilot', 'cb.autopilot']) expect(GD1_PARAMS.find((p) => p.id === id)?.value, `${id} phải mặc định tắt: bật lên là che bất ổn của mô hình`).toBe(0);
  });

  it('engine không dùng Math.random, Date hay thời gian thật', () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.ts')) files.push(p);
      }
    };
    walk('src/engine');
    for (const f of files) {
      const code = read(f).replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
      expect(/Math\.random|Date\.now|new Date\(|performance\.now/.test(code), `${f}: dùng số ngẫu nhiên hoặc thời gian thật`).toBe(false);
    }
  });
});
