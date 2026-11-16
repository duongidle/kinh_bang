import { describe, expect, it } from 'vitest';
import { SCENARIOS } from '../../src/content/scenarios';
import { learningPath } from '../../src/ui/learningPath';

describe('learningPath', () => {
  it('xếp đủ 15 kịch bản thật, không trùng, bắt đầu từ "Một khoản vay", mỗi kịch bản sau mọi điều kiện của nó', () => {
    const path = learningPath(SCENARIOS);
    expect(path).toHaveLength(15);
    expect(new Set(path).size).toBe(15);
    expect(path[0]).toBe('mot-khoan-vay');
    for (const s of SCENARIOS) {
      const at = path.indexOf(s.id);
      expect(at).toBeGreaterThanOrEqual(0);
      for (const p of s.prereq) expect(path.indexOf(p)).toBeLessThan(at);
    }
  });

  it('giữ thứ tự gốc khi không có ràng buộc', () => {
    expect(learningPath([{ id: 'a', prereq: [] }, { id: 'b', prereq: [] }, { id: 'c', prereq: [] }])).toEqual(['a', 'b', 'c']);
  });

  it('đẩy kịch bản có điều kiện ra sau, ổn định theo thứ tự gốc', () => {
    expect(learningPath([{ id: 'a', prereq: ['c'] }, { id: 'b', prereq: [] }, { id: 'c', prereq: [] }, { id: 'd', prereq: [] }])).toEqual(['b', 'c', 'a', 'd']);
  });

  it('bỏ qua điều kiện không có trong danh sách', () => {
    expect(learningPath([{ id: 'a', prereq: ['không-có'] }, { id: 'b', prereq: ['a'] }])).toEqual(['a', 'b']);
  });

  it('có vòng thì nối phần còn lại theo thứ tự gốc', () => {
    expect(learningPath([{ id: 'x', prereq: [] }, { id: 'a', prereq: ['b'] }, { id: 'b', prereq: ['a'] }, { id: 'c', prereq: ['x'] }])).toEqual(['x', 'c', 'a', 'b']);
  });
});
