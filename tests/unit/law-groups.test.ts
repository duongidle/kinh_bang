// Nhóm luật theo việc (src/ui/lawGroups.ts) kiểm trên danh mục luật thật.
import { describe, expect, it } from 'vitest';
import { Session } from '@/engine/session/session';
import { LAW_GROUP_TABLE, groupCountOf, groupLaws } from '@/ui/lawGroups';
import type { EngineMsg, LawInfo } from '@/protocol';

const laws: LawInfo[] = (() => {
  const s = new Session();
  const m: EngineMsg[] = s.handle({ type: 'init', scale: 'S', seed: 1 });
  const r = m.find((x) => x.type === 'ready') as Extract<EngineMsg, { type: 'ready' }>;
  return r.catalog.laws;
})();

describe('nhóm luật theo việc', () => {
  it('mọi luật trong danh mục có đúng một nhóm', () => {
    for (const l of laws) expect(groupCountOf(l.id), l.id).toBe(1);
  });

  it('mọi mục trong bảng có trong danh mục', () => {
    const ids = new Set(laws.map((l) => l.id));
    for (const g of LAW_GROUP_TABLE)
      for (const s of g.subs)
        for (const m of s.match) {
          if (m.endsWith('*')) expect(laws.some((l) => l.id.startsWith(m.slice(0, -1))), m).toBe(true);
          else expect(ids.has(m), m).toBe(true);
        }
  });

  it('thứ tự nhóm và nhóm con đúng như đã quyết', () => {
    const all = groupLaws(laws, new Set(['fiscal', 'monetary']));
    expect(all.map((g) => g.title)).toEqual(['Thuế', 'Chi tiêu', 'Vay và in tiền', 'Lãi suất', 'Dự trữ', 'Room tín dụng', 'Lương tối thiểu']);
    expect(all[0].sections.map((s) => s.title)).toEqual(['Thuế GTGT', 'Thuế TNCN', 'Thuế TNDN', 'Hộ kinh doanh', 'Thuế và thu khác']);
    const n = all.reduce((a, g) => a + g.sections.reduce((b, s) => b + s.laws.length, 0), 0);
    expect(n).toBe(laws.length);
  });

  it('lọc theo bên giữ: không lẫn luật của bên kia, nhóm rỗng bị bỏ', () => {
    const owner = new Map(laws.map((l) => [l.id, l.owner]));
    const fiscal = groupLaws(laws, new Set(['fiscal']));
    const monetary = groupLaws(laws, new Set(['monetary']));
    for (const g of fiscal) for (const s of g.sections) for (const l of s.laws) expect(owner.get(l.id)).toBe('fiscal');
    for (const g of monetary) for (const s of g.sections) for (const l of s.laws) expect(owner.get(l.id)).toBe('monetary');
    expect(fiscal.map((g) => g.title)).not.toContain('Dự trữ');
    expect(monetary.map((g) => g.title)).not.toContain('Thuế');
    for (const g of [...fiscal, ...monetary]) expect(g.sections.length).toBeGreaterThan(0);
  });

  it('LawInfo có văn bản, điều khoản, ngày hiệu lực ISO', () => {
    for (const l of laws) {
      expect(typeof l.doc).toBe('string');
      expect(typeof l.article).toBe('string');
      expect(l.effective, l.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
