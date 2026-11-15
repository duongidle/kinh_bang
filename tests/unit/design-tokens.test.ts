import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { themes, colorVars, constants, type ThemeColors } from '../../src/ui/design/tokens';

const css = readFileSync(new URL('../../src/ui/design/tokens.css', import.meta.url), 'utf8');

// Độ chói tương đối và tương phản theo WCAG 2.x.
function lum(hex: string): number {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const textKeys: (keyof ThemeColors)[] = ['text', 'text2', 'text3', 'accent', 'good', 'bad', 'warn', 'flowWage', 'flowBuy', 'flowTax', 'flowCredit', 'flowGov', 'sectorAgri', 'sectorManu', 'sectorServ'];
const flowKeys: (keyof ThemeColors)[] = ['flowWage', 'flowBuy', 'flowTax', 'flowCredit', 'flowGov'];
const bgKeys: (keyof ThemeColors)[] = ['bg', 'surface', 'raised'];
const names = ['light', 'dark'] as const;

describe('token: tương phản', () => {
  for (const n of names) {
    it(`${n}: chữ và màu nghĩa đạt 4,5:1 trên ba mức nền`, () => {
      const t = themes[n];
      const bad: string[] = [];
      for (const k of textKeys) for (const b of bgKeys) {
        const r = contrast(t[k], t[b]);
        if (r < 4.5) bad.push(`${k} trên ${b}: ${r.toFixed(2)}`);
      }
      expect(bad).toEqual([]);
    });
    it(`${n}: onAccent trên accent đạt 4,5:1`, () => {
      expect(contrast(themes[n].onAccent, themes[n].accent)).toBeGreaterThanOrEqual(4.5);
    });
    it(`${n}: năm màu dòng tiền khác nhau từng đôi và khác accent`, () => {
      const t = themes[n];
      const vals = [...flowKeys.map((k) => t[k]), t.accent];
      expect(new Set(vals).size).toBe(vals.length);
    });
  }
});

/** Lấy các khai báo biến `--x: v;` trong thân một khối CSS bắt đầu bằng `header {`. */
function declsOf(header: string): Record<string, string> {
  const i = css.indexOf(header);
  expect(i, `không thấy khối ${header}`).toBeGreaterThanOrEqual(0);
  const start = css.indexOf('{', i) + 1;
  const end = css.indexOf('}', start);
  const out: Record<string, string> = {};
  for (const m of css.slice(start, end).matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}

describe('token: tokens.ts khớp tokens.css', () => {
  const light = declsOf(':root {');
  const darkMedia = declsOf(":root:not([data-theme='light']) {");
  const darkAttr = declsOf(":root[data-theme='dark'] {");

  it('khối sáng: mọi màu và hằng có đúng một biến cùng giá trị', () => {
    for (const [k, v] of Object.entries(colorVars)) expect(light[v], v).toBe(themes.light[k as keyof ThemeColors]);
    for (const [v, val] of Object.entries(constants)) expect(light[v], v).toBe(val);
    expect(Object.keys(light).length).toBe(Object.keys(colorVars).length + Object.keys(constants).length);
  });
  it('hai khối tối khớp tokens.ts và giống hệt nhau', () => {
    for (const d of [darkMedia, darkAttr]) {
      for (const [k, v] of Object.entries(colorVars)) expect(d[v], v).toBe(themes.dark[k as keyof ThemeColors]);
      expect(Object.keys(d).length).toBe(Object.keys(colorVars).length);
    }
    expect(darkMedia).toEqual(darkAttr);
  });
  it('mỗi khoá màu của hai theme giống nhau', () => {
    expect(Object.keys(themes.light)).toEqual(Object.keys(themes.dark));
    expect(Object.keys(themes.light).sort()).toEqual(Object.keys(colorVars).sort());
  });
});
