// Cài đặt ban đầu của ván tự do (gd1-5 mục 4.4): chỉ gửi những mục khác mức hiện hành.
import type { Intervention, SetupInfo } from '../protocol';

const EPS = 1e-12;

/** Luật khác mặc định và quy luật khác biến thể đầu thì đưa vào. Không có gì khác thì trả undefined để lệnh `init` giữ nguyên. */
export function buildSetup(info: SetupInfo, laws: Record<string, number>, variants: Record<string, string>): Intervention | undefined {
  const outLaws: Record<string, number> = {};
  for (const l of info.laws) {
    const v = laws[l.id];
    if (v !== undefined && Math.abs(v - l.value) > EPS) outLaws[l.id] = v;
  }
  const outVariants: Record<string, string> = {};
  for (const r of info.rules) {
    const v = variants[r.id];
    if (v !== undefined && r.variants.length > 0 && v !== r.variants[0].id) outVariants[r.id] = v;
  }
  const hasLaws = Object.keys(outLaws).length > 0;
  const hasVariants = Object.keys(outVariants).length > 0;
  if (!hasLaws && !hasVariants) return undefined;
  return { ...(hasLaws ? { laws: outLaws } : {}), ...(hasVariants ? { variants: outVariants } : {}) };
}

/** Số mục đã đổi, để ghi lên tiêu đề khối. */
export function changedCount(setup: Intervention | undefined): number {
  return Object.keys(setup?.laws ?? {}).length + Object.keys(setup?.variants ?? {}).length;
}
