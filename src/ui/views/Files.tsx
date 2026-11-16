// Lưu, tải, xuất: lưu vào trình duyệt, xuất file ván, xuất CSV, danh sách ván lưu, mở từ file.
import { useEffect, useState } from 'react';
import type { SeriesResult } from '../../protocol';
import { engine } from '../client';
import { monthLabel } from '../format';
import { deleteSave, listSaves, loadSave, saveCurrent } from '../saves';
import { useStore } from '../store';

function download(name: string, data: BlobPart, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function Files() {
  const tick = useStore((s) => s.tick);
  const scenario = useStore((s) => s.scenario);
  const seed = useStore((s) => s.seed);
  const loadBytes = useStore((s) => s.loadBytes);
  const toMenu = useStore((s) => s.toMenu);
  const [saves, setSaves] = useState<string[]>([]);
  const [msg, setMsg] = useState('');
  const refresh = () => void listSaves().then(setSaves);
  useEffect(refresh, []);
  const name = () => `kb:${scenario?.title ?? 'Tự do'} · hạt giống ${seed} · tháng ${tick?.tick ?? 0}`;
  const save = async () => {
    const { bytes } = await engine.save();
    await saveCurrent(name(), bytes);
    setMsg('Đã lưu vào trình duyệt này.');
    refresh();
  };
  const exportFile = async () => {
    const { bytes } = await engine.save();
    download(`kinh-bang-thang-${tick?.tick ?? 0}.kinhbang`, bytes as unknown as BlobPart, 'application/octet-stream');
  };
  const exportCsv = async () => {
    const r = await engine.query<SeriesResult>({ kind: 'series' });
    const lines = [['thang', ...r.ids].join(',')];
    for (let t = 0; t < r.n; t++) lines.push([monthLabel(r.from + t), ...r.ids.map((_, k) => r.data[k * r.n + t])].join(','));
    download(`kinh-bang-chuoi-so-lieu.csv`, lines.join('\n'), 'text/csv');
  };
  return (
    <>
      {tick && (
        <div className="row">
          <button className="primary" onClick={() => void save()}>
            Lưu ván
          </button>
          <button onClick={() => void exportFile()}>Xuất file ván</button>
          <button onClick={() => void exportCsv()}>Xuất CSV mọi chỉ số</button>
        </div>
      )}
      {msg && <p className="hint">{msg}</p>}
      <h3>Ván đã lưu trong trình duyệt</h3>
      {saves.length === 0 && <p className="hint">Chưa có ván nào.</p>}
      <ul className="pick small">
        {saves.map((k) => (
          <li key={k} className="save">
            <button
              onClick={async () => {
                const b = await loadSave(k);
                if (b) loadBytes(b);
              }}
            >
              <strong>{k.slice(3)}</strong>
            </button>
            <button
              onClick={async () => {
                await deleteSave(k);
                refresh();
              }}
              aria-label={`Xoá ${k.slice(3)}`}
            >
              Xoá
            </button>
          </li>
        ))}
      </ul>
      <h3>Mở từ file</h3>
      <input
        type="file"
        accept=".kinhbang"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) loadBytes(new Uint8Array(await f.arrayBuffer()));
        }}
      />
      {!tick && (
        <p>
          <button onClick={toMenu}>Về màn hình đầu</button>
        </p>
      )}
    </>
  );
}
