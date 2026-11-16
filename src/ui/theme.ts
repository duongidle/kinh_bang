// Chế độ sáng/tối: 'system' theo máy, hoặc ép 'light'/'dark' bằng thuộc tính data-theme trên <html> (tokens.css đọc nó).
// Lựa chọn lưu ở localStorage `kb.theme` (chỉ là tiện lợi của từng trình duyệt, đọc ghi bọc try/catch).

export type ThemePref = 'system' | 'light' | 'dark';

const KEY = 'kb.theme';
const listeners = new Set<() => void>();

export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* không có localStorage: dùng mặc định */
  }
  return 'system';
}

export function setThemePref(p: ThemePref): void {
  try {
    if (p === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, p);
  } catch {
    /* bỏ qua */
  }
  if (p === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = p;
  for (const cb of [...listeners]) cb();
}

export function resolvedTheme(): 'light' | 'dark' {
  const t = document.documentElement.dataset.theme;
  if (t === 'light' || t === 'dark') return t;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Gọi `cb` khi lựa chọn đổi hoặc khi máy đổi chế độ. Trả hàm huỷ. */
export function onThemeChange(cb: () => void): () => void {
  listeners.add(cb);
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener('change', cb);
  };
}
