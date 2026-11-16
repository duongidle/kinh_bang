// Ván lưu trong trình duyệt (IndexedDB, khoá tiền tố `kb:`). `kb.last` ở localStorage nhớ khoá vừa lưu, để màn hình đầu có nút "Tiếp tục ván gần nhất".
import { del, get as idbGet, keys as idbKeys, set as idbSet } from 'idb-keyval';

const PREFIX = 'kb:';
const LAST = 'kb.last';

const withPrefix = (name: string) => (name.startsWith(PREFIX) ? name : PREFIX + name);

/** Tên ván (bỏ tiền tố) để hiện cho người chơi. */
export const saveTitle = (key: string): string => (key.startsWith(PREFIX) ? key.slice(PREFIX.length) : key);

/** Khoá các ván đã lưu, xếp theo chữ, đảo ngược. */
export async function listSaves(): Promise<string[]> {
  const k = await idbKeys();
  return k
    .map(String)
    .filter((x) => x.startsWith(PREFIX))
    .sort()
    .reverse();
}

export async function loadSave(key: string): Promise<Uint8Array | undefined> {
  const b = await idbGet<Uint8Array>(key);
  return b ? new Uint8Array(b) : undefined;
}

export async function deleteSave(key: string): Promise<void> {
  await del(key);
}

/** Ghi ván vào IndexedDB và nhớ khoá làm "ván gần nhất". Trả khoá. */
export async function saveCurrent(name: string, bytes: Uint8Array): Promise<string> {
  const key = withPrefix(name);
  await idbSet(key, bytes);
  try {
    localStorage.setItem(LAST, key);
  } catch {
    /* không có localStorage: bỏ qua */
  }
  return key;
}

/** Khoá `kb.last` nếu khoá đó còn trong IndexedDB, không thì undefined. */
export async function lastSave(): Promise<string | undefined> {
  let key: string | null = null;
  try {
    key = localStorage.getItem(LAST);
  } catch {
    /* bỏ qua */
  }
  if (!key) return undefined;
  return (await listSaves()).includes(key) ? key : undefined;
}
