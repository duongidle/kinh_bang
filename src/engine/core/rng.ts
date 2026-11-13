// Số ngẫu nhiên không trạng thái: hàm băm của (seed, luồng, tác nhân, tháng, lượt).
// Hai thế giới song song gọi cùng bộ tham số sẽ nhận cùng một số (gd0 mục 3.4).

function fmix(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h;
}

function mix(h: number, k: number): number {
  k = Math.imul(k | 0, 0xcc9e2d51);
  k = (k << 15) | (k >>> 17);
  k = Math.imul(k, 0x1b873593);
  h ^= k;
  h = (h << 13) | (h >>> 19);
  return (Math.imul(h, 5) + 0xe6546b64) | 0;
}

/** Số trong [0, 1). */
export function rand(seed: number, stream: number, entity: number, tick: number, k = 0): number {
  let h = mix(0x9747b28c, seed);
  h = mix(h, stream);
  h = mix(h, entity);
  h = mix(h, tick);
  h = mix(h, k);
  return (fmix(h ^ 20) >>> 0) / 4294967296;
}

/** Số nguyên trong [0, n). */
export function randInt(n: number, seed: number, stream: number, entity: number, tick: number, k = 0): number {
  return Math.min(n - 1, Math.floor(rand(seed, stream, entity, tick, k) * n));
}

/** Chuẩn tắc N(0,1), Box-Muller, dùng hai lượt k và k+1. */
export function randNormal(seed: number, stream: number, entity: number, tick: number, k = 0): number {
  const u1 = Math.max(1e-12, rand(seed, stream, entity, tick, k));
  const u2 = rand(seed, stream, entity, tick, k + 1);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** Luồng ngẫu nhiên: mỗi loại quyết định một số, để đổi quyết định này không làm lệch quyết định kia. */
let nextStream = 1;
const streams = new Map<string, number>();
export function streamId(name: string): number {
  // Băm tên thay vì đếm, để thứ tự nạp module không ảnh hưởng.
  let s = streams.get(name);
  if (s === undefined) {
    let h = 0x811c9dc5;
    for (let i = 0; i < name.length; i++) {
      h ^= name.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    s = h | 0;
    streams.set(name, s);
    nextStream++;
  }
  return s;
}
