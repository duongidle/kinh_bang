// Đóng gói một object thuần (có thể chứa TypedArray) thành một khối byte và ngược lại.
// Dùng cho: lưu ván, tách thế giới song song, mã băm trạng thái.

type TA = Float64Array | Int32Array | Uint8Array | Uint32Array;
const TYPES: Record<string, { new (b: ArrayBuffer, o?: number, n?: number): TA; BYTES_PER_ELEMENT: number }> = {
  f64: Float64Array as any,
  i32: Int32Array as any,
  u8: Uint8Array as any,
  u32: Uint32Array as any,
};

function typeName(a: TA): string {
  if (a instanceof Float64Array) return 'f64';
  if (a instanceof Int32Array) return 'i32';
  if (a instanceof Uint32Array) return 'u32';
  return 'u8';
}

const MAGIC = 0x4b42414e; // 'KBAN'

export function pack(obj: unknown): Uint8Array {
  const chunks: Uint8Array[] = [];
  let offset = 0;
  const header = JSON.stringify(obj, (_k, v) => {
    if (ArrayBuffer.isView(v)) {
      const a = v as TA;
      const bytes = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
      const pad = (8 - (offset % 8)) % 8;
      if (pad) {
        chunks.push(new Uint8Array(pad));
        offset += pad;
      }
      const ref = { __ta: typeName(a), o: offset, n: a.length };
      chunks.push(bytes);
      offset += bytes.byteLength;
      return ref;
    }
    return v;
  });
  const head = new TextEncoder().encode(header);
  const headPad = (8 - ((12 + head.byteLength) % 8)) % 8;
  const out = new Uint8Array(12 + head.byteLength + headPad + offset);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, MAGIC);
  dv.setUint32(4, head.byteLength);
  dv.setUint32(8, headPad);
  out.set(head, 12);
  let p = 12 + head.byteLength + headPad;
  for (const c of chunks) {
    out.set(c, p);
    p += c.byteLength;
  }
  return out;
}

export function unpack<T = unknown>(bytes: Uint8Array): T {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (dv.getUint32(0) !== MAGIC) throw new Error('Không phải file Kinh Bang');
  const headLen = dv.getUint32(4);
  const headPad = dv.getUint32(8);
  const head = new TextDecoder().decode(bytes.subarray(12, 12 + headLen));
  const base = 12 + headLen + headPad;
  return JSON.parse(head, (_k, v) => {
    if (v && typeof v === 'object' && typeof v.__ta === 'string') {
      const T = TYPES[v.__ta];
      const len = v.n * T.BYTES_PER_ELEMENT;
      // Chép ra bộ đệm riêng để bản mới không dính bản cũ.
      const buf = bytes.slice(base + v.o, base + v.o + len).buffer;
      return new T(buf, 0, v.n);
    }
    return v;
  }) as T;
}

/** FNV-1a 32 bit trên khối byte, trả về chuỗi hex. */
export function hashBytes(bytes: Uint8Array): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < bytes.length; i++) {
    h1 ^= bytes[i];
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= bytes[i] + i;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}

export function clone<T>(obj: T): T {
  return unpack<T>(pack(obj));
}
