// Menu của thanh trên: lưu ván, lưu/tải/xuất, ghi chú mô hình, giao diện sáng/tối, về màn hình đầu.
import { useEffect, useRef, useState } from 'react';
import type { ScaleId } from '../../protocol';
import { engine } from '../client';
import { Button, SegmentedControl } from '../design';
import { saveCurrent } from '../saves';
import { useStore } from '../store';
import { getThemePref, setThemePref, type ThemePref } from '../theme';

const SCALE_LABEL: Record<ScaleId, string> = { S: '50 hộ (sa bàn)', M: '500 hộ', L: '5.000 hộ' };
const THEME_OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'system', label: 'Theo máy' },
  { value: 'light', label: 'Sáng' },
  { value: 'dark', label: 'Tối' },
];

export function AppMenu() {
  const tick = useStore((s) => s.tick)!;
  const scenario = useStore((s) => s.scenario);
  const scale = useStore((s) => s.scale);
  const seed = useStore((s) => s.seed);
  const toMenu = useStore((s) => s.toMenu);
  const openDialog = useStore((s) => s.openDialog);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePref>(getThemePref);
  const [note, setNote] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    root.current?.querySelector<HTMLButtonElement>('.kb-menu__item')?.focus();
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  useEffect(() => () => clearTimeout(noteTimer.current), []);

  const close = () => setOpen(false);
  const save = async () => {
    close();
    try {
      const { bytes } = await engine.save();
      await saveCurrent(`${scenario?.title ?? 'Tự do'} · hạt giống ${seed} · tháng ${tick.tick}`, bytes);
      setNote('Đã lưu vào trình duyệt này.');
    } catch (e) {
      setNote(`Không lưu được: ${(e as Error).message}`);
    }
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), 4000);
  };

  return (
    <div
      className="kb-menu"
      ref={root}
      onKeyDown={(e) => {
        if (open && e.key === 'Escape') {
          // Chỉ đóng menu, không để phím Esc đi tiếp tới bộ xử lý đóng ngăn của cả app.
          e.stopPropagation();
          setOpen(false);
          root.current?.querySelector<HTMLButtonElement>('.kb-menu__trigger')?.focus();
        }
      }}
    >
      <Button className="kb-menu__trigger" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
        Menu
      </Button>
      {note && (
        <span className="kb-menu__note" role="status">
          {note}
        </span>
      )}
      {open && (
        <div className="kb-menu__panel" aria-label="Menu">
          <Button variant="text" className="kb-menu__item" onClick={() => void save()}>
            Lưu ván
          </Button>
          <Button
            variant="text"
            className="kb-menu__item"
            onClick={() => {
              close();
              openDialog({ kind: 'file' });
            }}
          >
            Lưu, tải, xuất
          </Button>
          <Button
            variant="text"
            className="kb-menu__item"
            onClick={() => {
              close();
              openDialog({ kind: 'notes' });
            }}
          >
            Mô hình bỏ qua gì
          </Button>
          <div className="kb-menu__row">
            <span className="kb-menu__label">Giao diện</span>
            <SegmentedControl
              label="Giao diện"
              options={THEME_OPTIONS}
              value={theme}
              onChange={(v) => {
                setTheme(v);
                setThemePref(v);
              }}
            />
          </div>
          <p className="kb-menu__meta kb-num">
            {SCALE_LABEL[scale]} · hạt giống {seed} · {tick.ms.toFixed(0)} ms mỗi tháng
          </p>
          <Button
            variant="text"
            className="kb-menu__item"
            onClick={() => {
              close();
              toMenu();
            }}
          >
            Về màn hình đầu
          </Button>
        </div>
      )}
    </div>
  );
}
