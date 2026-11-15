// Token của hệ thiết kế GĐ1.5 (U1). Đây là nguồn số liệu; tokens.css khai đúng cùng giá trị (test so khớp).
// Màu "mua hàng" đổi từ hổ phách sang xanh mòng két để hổ phách chỉ còn là màu nhấn (spec 3.1);
// "thuế" đổi sang hồng để khác "xấu". Bản đồ và biểu đồ cũ vẫn dùng màu cũ cho tới U2 và U4.

export interface ThemeColors {
  bg: string;
  surface: string;
  raised: string;
  line: string;
  text: string;
  text2: string;
  text3: string;
  accent: string;
  onAccent: string;
  good: string;
  bad: string;
  warn: string;
  flowWage: string;
  flowBuy: string;
  flowTax: string;
  flowCredit: string;
  flowGov: string;
  sectorAgri: string;
  sectorManu: string;
  sectorServ: string;
}

export const themes: { light: ThemeColors; dark: ThemeColors } = {
  light: {
    bg: '#f4f5f2',
    surface: '#ffffff',
    raised: '#f0f2ee',
    line: '#d9ddd6',
    text: '#1b1f22',
    text2: '#4a545b',
    text3: '#5f6a72',
    accent: '#8f5b04',
    onAccent: '#ffffff',
    good: '#1d7a4c',
    bad: '#b42318',
    warn: '#9c4d08',
    flowWage: '#2a6fa3',
    flowBuy: '#0d7366',
    flowTax: '#a8325c',
    flowCredit: '#4f7210',
    flowGov: '#7a48b3',
    sectorAgri: '#477233',
    sectorManu: '#53677a',
    sectorServ: '#9a5434',
  },
  dark: {
    bg: '#0f1113',
    surface: '#171b1e',
    raised: '#1e2327',
    line: '#2a3136',
    text: '#e6e9eb',
    text2: '#a3aeb5',
    text3: '#8b979f',
    accent: '#e8b04a',
    onAccent: '#1a1408',
    good: '#7fd1a3',
    bad: '#f2685f',
    warn: '#f59a4a',
    flowWage: '#6fb1e0',
    flowBuy: '#4cc7b4',
    flowTax: '#ee8aaa',
    flowCredit: '#b5d36a',
    flowGov: '#c79be8',
    sectorAgri: '#8fbf78',
    sectorManu: '#9fb3c5',
    sectorServ: '#d79c7b',
  },
};

/** Khoá TS của màu -> tên biến CSS. */
export const colorVars: Record<keyof ThemeColors, string> = {
  bg: '--color-bg',
  surface: '--color-surface',
  raised: '--color-raised',
  line: '--color-line',
  text: '--color-text',
  text2: '--color-text-2',
  text3: '--color-text-3',
  accent: '--color-accent',
  onAccent: '--color-on-accent',
  good: '--color-good',
  bad: '--color-bad',
  warn: '--color-warn',
  flowWage: '--color-flow-wage',
  flowBuy: '--color-flow-buy',
  flowTax: '--color-flow-tax',
  flowCredit: '--color-flow-credit',
  flowGov: '--color-flow-gov',
  sectorAgri: '--color-sector-agri',
  sectorManu: '--color-sector-manu',
  sectorServ: '--color-sector-serv',
};

/** Hằng không đổi theo theme. Khoá là tên biến CSS. */
export const constants: Record<string, string> = {
  '--space-1': '4px',
  '--space-2': '8px',
  '--space-3': '12px',
  '--space-4': '16px',
  '--space-5': '24px',
  '--space-6': '32px',
  '--space-7': '48px',
  '--radius-s': '4px',
  '--radius-m': '8px',
  '--font-size-1': '12px',
  '--font-size-2': '13px',
  '--font-size-3': '14px',
  '--font-size-4': '16px',
  '--font-size-5': '20px',
  '--font-size-6': '28px',
  '--line-height-1': '16px',
  '--line-height-2': '18px',
  '--line-height-3': '20px',
  '--line-height-4': '24px',
  '--line-height-5': '28px',
  '--line-height-6': '36px',
  '--font-weight-regular': '400',
  '--font-weight-medium': '500',
  '--font-weight-semibold': '600',
  '--font-sans': "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  '--font-num': "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  '--dur-fast': '120ms',
  '--dur-mid': '200ms',
  '--dur-slow': '320ms',
  '--ease': 'cubic-bezier(0.2, 0, 0, 1)',
};
