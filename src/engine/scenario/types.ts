// Kịch bản: điều kiện đầu, cú sốc theo lịch, mục tiêu, và các khẳng định trong lời giải thích.
// Mỗi khẳng định là một phép đo trên hai thế giới: thế giới của người chơi và thế giới đối chứng.
// Kiểm định kịch bản (gd1 mục 16) chạy "lời giải mẫu" ở nhiều seed và đòi mỗi khẳng định đúng ở ít nhất 80% số seed.

import type { Engine } from '../core/engine';
import type { World } from '../core/world';
import type { Intervention, PlayerOrders, Role, ScaleId } from '../../protocol';

export interface Ctx {
  eng: Engine;
  /** Thế giới của người chơi (hoặc của lời giải mẫu). */
  w: World;
  /** Thế giới đối chứng: cùng seed, không có hành động của người chơi (hoặc không có cú sốc, tuỳ kịch bản). */
  base: World;
  /** Tháng người chơi nhận quyền điều khiển. */
  t0: number;
  /** Tháng hiện tại (số tháng đã chạy xong). */
  t1: number;
}

export interface Step extends Intervention {
  /** Số tháng tính từ lúc người chơi nhận quyền. */
  at: number;
  label?: string;
  orders?: Partial<PlayerOrders>;
  /** Giá trị phụ thuộc trạng thái lúc đó (ví dụ sàn lương theo lương bình quân). */
  dynamic?: (eng: Engine, w: World) => Intervention;
}

export interface GoalDef {
  id: string;
  label: string;
  test(c: Ctx): { ok: boolean; value: string };
}

export interface ClaimDef {
  text: string;
  test(c: Ctx): { ok: boolean; detail: string };
}

export interface ScenarioDef {
  id: string;
  title: string;
  role: Role;
  scale: ScaleId;
  question: string;
  intro: string;
  prereq: string[];
  /** Số tháng chạy trước khi người chơi nhận quyền, để nền kinh tế vào nhịp. */
  warmup: number;
  months: number;
  startYear?: number;
  /** Điều kiện của kịch bản, áp ngay đầu ván (trước giai đoạn chạy trước). Có ở cả thế giới đối chứng. */
  setup?: Intervention;
  /** Cú sốc theo lịch. */
  shocks?: Step[];
  /** Tác nhân có tên mà người chơi điều khiển. */
  possess?: { sector: 'hh' | 'firm'; name: string };
  goals: GoalDef[];
  predict: Array<{ indicator: string; question: string }>;
  /** Lời giải mẫu dùng cho kiểm định: các hành động một người chơi hiểu cơ chế sẽ làm. */
  demo: Step[];
  /** Thế giới đối chứng bỏ gì: hành động của người chơi (mặc định) hay cú sốc của kịch bản. */
  control?: 'player' | 'shock';
  claims: ClaimDef[];
  explanation: string;
  history?: string;
  simplifications: string[];
  untested?: boolean;
}
