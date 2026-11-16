// Dải cảnh báo ngay dưới thanh trên. Hiện suốt ván (gd1-5 mục 13 dòng 6).
import { Button, WarningBanner } from '../design';
import { useStore } from '../store';

export function Banners() {
  const modified = useStore((s) => s.tick?.modified);
  const scenario = useStore((s) => s.scenario);
  const whatIf = useStore((s) => s.whatIf);
  if (!modified && !scenario?.untested) return null;
  return (
    <div className="kb-banners">
      {modified && (
        <WarningBanner
          action={
            <Button onClick={() => void whatIf('lab')}>So với thế giới gốc</Button>
          }
        >
          Thế giới này đã bị sửa quy luật kinh tế trong Phòng thí nghiệm. Kết quả không còn là của mô hình gốc.
        </WarningBanner>
      )}
      {scenario?.untested && <WarningBanner tone="info">Kịch bản này nằm ngoài vùng đã kiểm định. Coi kết quả là gợi ý, không phải dự báo.</WarningBanner>}
    </div>
  );
}
