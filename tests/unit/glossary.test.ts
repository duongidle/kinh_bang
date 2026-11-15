import { describe, it, expect } from 'vitest';
import { GLOSSARY, term } from '../../src/content/glossary';

describe('bảng thuật ngữ', () => {
  it('id duy nhất và đúng dạng kebab-case không dấu', () => {
    const ids = GLOSSARY.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id, id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it('term duy nhất', () => {
    const terms = GLOSSARY.map((e) => e.term.toLowerCase());
    expect(new Set(terms).size).toBe(terms.length);
  });
  it('def là một câu: kết thúc bằng dấu chấm, không có ". " giữa câu', () => {
    for (const e of GLOSSARY) {
      expect(e.def.endsWith('.'), e.id).toBe(true);
      expect(e.def.endsWith('..'), e.id).toBe(false);
      expect(e.def.slice(0, -1).includes('. '), e.id).toBe(false);
      expect(e.def.slice(0, -1).includes('.'), `${e.id}: dấu chấm giữa câu`).toBe(false);
    }
  });
  it('không mục nào có avoid trùng term hay short của mục khác', () => {
    const used = new Map<string, string>();
    for (const e of GLOSSARY) {
      used.set(e.term.toLowerCase(), e.id);
      if (e.short) used.set(e.short.toLowerCase(), e.id);
    }
    for (const e of GLOSSARY) {
      for (const a of e.avoid ?? []) {
        const owner = used.get(a.toLowerCase());
        expect(owner, `${e.id}: avoid "${a}" trùng term/short của ${owner}`).toBeUndefined();
      }
    }
  });
  it('term() ném lỗi khi không có id, trả đúng mục khi có', () => {
    expect(() => term('khong-co')).toThrow();
    expect(term('du-no').term).toBe('Dư nợ');
  });
});
