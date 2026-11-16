// Lộ trình học: xếp kịch bản theo "nên hiểu trước", giữ thứ tự gốc khi không bị ràng buộc.

/** Trả danh sách id. Mỗi lượt chọn kịch bản đứng sớm nhất trong danh sách gốc mà mọi `prereq` đã được xếp.
 *  `prereq` không có trong danh sách thì bỏ qua. Nếu có vòng thì nối phần còn lại theo thứ tự gốc. */
export function learningPath(items: ReadonlyArray<{ id: string; prereq: readonly string[] }>): string[] {
  const known = new Set(items.map((s) => s.id));
  const placed = new Set<string>();
  const out: string[] = [];
  let rest = [...items];
  while (rest.length) {
    const next = rest.find((s) => s.prereq.every((p) => !known.has(p) || placed.has(p)));
    if (!next) {
      for (const s of rest) out.push(s.id);
      break;
    }
    out.push(next.id);
    placed.add(next.id);
    rest = rest.filter((s) => s !== next);
  }
  return out;
}
