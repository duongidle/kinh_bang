import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './index';
import './preview.css';
import {
  Button,
  Card,
  DataTable,
  Dialog,
  GlossaryTerm,
  NumberInput,
  SegmentedControl,
  SidePanel,
  Slider,
  SourceTag,
  StatTile,
  StatusBadge,
  TAccount,
  Tabs,
  Tooltip,
  WarningBanner,
} from './index';
import { colorVars, constants, themes, type ThemeColors } from './tokens';
import { GLOSSARY } from '../../content/glossary';
import { fmt, money } from '../format';

type ThemeChoice = 'auto' | 'light' | 'dark';

function applyTheme(choice: ThemeChoice) {
  const el = document.documentElement;
  if (choice === 'auto') el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', choice);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="kb-pv__section">
      <h2 className="kb-pv__h2">{title}</h2>
      {children}
    </section>
  );
}

// Đường mẫu cố định (không ngẫu nhiên) để xem hình.
const SERIES_A = Array.from({ length: 24 }, (_, i) => 0.027 + 0.004 * Math.sin(i / 3) + i * 0.00015);
const SERIES_B = Array.from({ length: 24 }, (_, i) => 1.18e12 + i * 2.6e9 + 1.5e10 * Math.cos(i / 4));
const SERIES_C = Array.from({ length: 24 }, (_, i) => 0.064 - i * 0.00025 + 0.002 * Math.sin(i / 2));
const SERIES_D = Array.from({ length: 24 }, (_, i) => 2.9e12 + i * 1.1e10);

function Swatch({ k, resolved }: { k: keyof ThemeColors; resolved: 'light' | 'dark' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState('');
  useLayoutEffect(() => {
    if (ref.current) setHex(getComputedStyle(ref.current).getPropertyValue(colorVars[k]).trim());
  }, [k, resolved]);
  return (
    <div className="kb-pv__swatch" ref={ref}>
      <div className="kb-pv__chip" style={{ background: `var(${colorVars[k]})` }} />
      <div className="kb-pv__swatch-text">
        <div className="kb-pv__swatch-name">{k}</div>
        <div className="kb-pv__swatch-hex">
          {colorVars[k]} · {hex || themes[resolved][k]}
        </div>
      </div>
    </div>
  );
}

/** Đo bề rộng "1111" và "8888" ở ba độ đậm: Inter (lớp kb-num) là phép đo chính, Be Vietnam Pro để đối chiếu. */
function TabularCheck() {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const [res, setRes] = useState<string[]>(['Đang đo…']);
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const fams = ['Inter', 'Be Vietnam Pro'];
        await Promise.all(fams.flatMap((f) => ['400', '500', '600'].map((w) => document.fonts.load(`${w} 20px "${f}"`, '18'))));
        await document.fonts.ready;
        const [ia, ib, ba, bb] = refs.current;
        if (dead || !ia || !ib || !ba || !bb) return;
        const lines: string[] = [];
        let ok = true;
        const pairs: [string, HTMLSpanElement, HTMLSpanElement][] = [
          ['Inter', ia, ib],
          ['Be Vietnam Pro', ba, bb],
        ];
        for (const [name, x, y] of pairs) {
          const loaded = document.fonts.check(`400 20px "${name}"`, '18');
          const parts: string[] = [];
          for (const w of ['400', '500', '600']) {
            x.style.fontWeight = w;
            y.style.fontWeight = w;
            const wx = x.getBoundingClientRect().width;
            const wy = y.getBoundingClientRect().width;
            if (name === 'Inter' && Math.abs(wx - wy) > 0.01) ok = false;
            parts.push(`đậm ${w}: "1111" = ${wx.toFixed(3)}, "8888" = ${wy.toFixed(3)}`);
          }
          if (name === 'Inter' && !loaded) ok = false;
          lines.push(`${name}${loaded ? '' : ' (CHƯA NẠP)'}: ${parts.join('; ')}`);
        }
        document.documentElement.setAttribute('data-tabular-result', `${ok ? 'ok' : 'fail'} | ${lines.join(' | ')}`);
        setRes([ok ? 'Đạt: Inter có hai chuỗi bằng nhau ở cả ba độ đậm.' : 'KHÔNG đạt: Inter có hai chuỗi khác nhau hoặc chưa nạp.', ...lines]);
      } catch (e) {
        setRes([`Lỗi khi đo: ${String(e)}`]);
      }
    })();
    return () => {
      dead = true;
    };
  }, []);
  const set = (i: number) => (el: HTMLSpanElement | null) => {
    refs.current[i] = el;
  };
  return (
    <div className="kb-pv__col">
      <div className="kb-pv__tab-measure">
        <span className="kb-num" ref={set(0)}>
          1111
        </span>{' '}
        <span className="kb-num" ref={set(1)}>
          8888
        </span>
        {'   '}
        <span style={{ fontFamily: 'var(--font-sans)' }} ref={set(2)}>
          1111
        </span>{' '}
        <span style={{ fontFamily: 'var(--font-sans)' }} ref={set(3)}>
          8888
        </span>
      </div>
      {res.map((l, i) => (
        <p key={i} className="kb-pv__note">
          {l}
        </p>
      ))}
    </div>
  );
}

export function Preview() {
  const [choice, setChoice] = useState<ThemeChoice>('auto');
  const [sysDark, setSysDark] = useState(() => matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const on = () => setSysDark(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  useEffect(() => () => applyTheme('auto'), []);
  const resolved: 'light' | 'dark' = choice === 'auto' ? (sysDark ? 'dark' : 'light') : choice;

  const [seg, setSeg] = useState<'cham' | 'vua' | 'nhanh'>('vua');
  const [rate, setRate] = useState(4.5);
  const [slide, setSlide] = useState(0.06);
  const [tab, setTab] = useState('tong-quan');
  const [dlg, setDlg] = useState(false);
  const [side, setSide] = useState<'left' | 'right' | null>(null);
  const [sub, setSub] = useState(false);
  const [explained, setExplained] = useState('');

  return (
    <div className="kb-design">
      <div className="kb-pv__top">
        <h1 className="kb-pv__h1">Hệ thiết kế</h1>
        <SegmentedControl<ThemeChoice>
          label="Giao diện"
          value={choice}
          options={[
            { value: 'auto', label: 'Theo máy' },
            { value: 'light', label: 'Sáng' },
            { value: 'dark', label: 'Tối' },
          ]}
          onChange={(c) => {
            applyTheme(c);
            setChoice(c);
          }}
        />
      </div>

      <Section title="Bảng màu">
        <div className="kb-pv__swatches" key={resolved}>
          {(Object.keys(colorVars) as (keyof ThemeColors)[]).map((k) => (
            <Swatch key={k} k={k} resolved={resolved} />
          ))}
        </div>
      </Section>

      <Section title="Thang chữ">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div className="kb-pv__type" key={n}>
            <span className="kb-pv__type-name">
              Bậc {n} · {constants[`--font-size-${n}`]} / {constants[`--line-height-${n}`]}
            </span>
            <span style={{ fontSize: `var(--font-size-${n})`, lineHeight: `var(--line-height-${n})` }}>Giá cả tăng chậm lại trong quý này</span>
          </div>
        ))}
        <p className="kb-pv__note">Độ đậm: 400 thường, 500 vừa, 600 đậm.</p>
        <div className="kb-pv__row">
          <span style={{ fontWeight: 400 }}>Thường 400</span>
          <span style={{ fontWeight: 500 }}>Vừa 500</span>
          <span style={{ fontWeight: 600 }}>Đậm 600</span>
        </div>
      </Section>

      <Section title="Kiểm số đều bề rộng">
        <TabularCheck />
      </Section>

      <Section title="Thang khoảng cách">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div className="kb-pv__space" key={n}>
            <span className="kb-pv__space-name">
              Bậc {n} · {constants[`--space-${n}`]}
            </span>
            <span className="kb-pv__space-bar" style={{ width: `var(--space-${n})` }} />
          </div>
        ))}
      </Section>

      <Section title="Nút">
        <div className="kb-pv__row">
          <Button variant="primary">Lưu ván</Button>
          <Button variant="secondary">Chạy đối chứng</Button>
          <Button variant="text">Xem thay đổi</Button>
          <Button variant="primary" disabled>
            Lưu ván
          </Button>
          <Button variant="secondary" disabled>
            Chạy đối chứng
          </Button>
          <Button variant="text" disabled>
            Xem thay đổi
          </Button>
        </div>
      </Section>

      <Section title="Nhóm nút chọn một">
        <SegmentedControl
          label="Tốc độ"
          value={seg}
          options={[
            { value: 'cham', label: 'Chậm' },
            { value: 'vua', label: 'Vừa' },
            { value: 'nhanh', label: 'Nhanh' },
          ]}
          onChange={setSeg}
        />
      </Section>

      <Section title="Ô nhập số có đơn vị">
        <div className="kb-pv__row">
          <NumberInput label="Lãi suất tái cấp vốn" unit="%/năm" value={rate} onChange={setRate} min={0} max={20} step={0.25} />
          <NumberInput label="Số hộ" unit="hộ" value={5000} onChange={() => {}} min={50} max={5000} step={1} />
        </div>
        <p className="kb-pv__note">Gõ dấu phẩy cho phần thập phân, ví dụ 4,75. Mũi tên lên xuống đổi một bước.</p>
      </Section>

      <Section title="Thanh kéo có mốc hiện hành">
        <Slider label="Dự trữ bắt buộc" value={slide} onChange={setSlide} min={0} max={0.2} step={0.005} current={0.08} format={(x) => fmt(x, '%')} />
      </Section>

      <Section title="Ô số">
        <div className="kb-pv__row">
          <StatTile label="Lạm phát" value={0.031} unit="%" delta12={0.004} deltaKind="abs" goodWhen="down" series={SERIES_A} onExplain={() => setExplained('Lạm phát')} />
          <StatTile label="GDP thực" value={1.24e12} unit="đồng" delta12={0.018} deltaKind="rel" goodWhen="up" series={SERIES_B} onExplain={() => setExplained('GDP thực')} />
          <StatTile label="Tỷ lệ thất nghiệp" value={0.058} unit="%" delta12={-0.006} deltaKind="abs" goodWhen="down" series={SERIES_C} />
          <StatTile label="Dư nợ" value={3.15e12} unit="đồng" delta12={0.072} deltaKind="rel" series={SERIES_D} />
          <StatTile label="Số hộ" value={5000} unit="hộ" />
        </div>
        <p className="kb-pv__note">{explained ? `Bạn vừa bấm ô ${explained}.` : 'Ô có viền mờ khi rê chuột là ô bấm được. Hai ô cuối không bấm được.'}</p>
      </Section>

      <Section title="Thẻ">
        <div className="kb-pv__row">
          <Card title="Thế giới gốc">Chưa sửa quy luật nào.</Card>
          <Card>Thẻ không có tiêu đề.</Card>
        </div>
      </Section>

      <Section title="Bảng số">
        <DataTable
          columns={[
            { key: 'nganh', label: 'Ngành' },
            { key: 'doanhNghiep', label: 'Doanh nghiệp', align: 'right' },
            { key: 'von', label: 'Vốn', align: 'right', format: (v) => money(v) },
            { key: 'bienLai', label: 'Biên lãi', align: 'right', format: (v) => fmt(v, '%') },
          ]}
          rows={[
            { nganh: 'Nông nghiệp', doanhNghiep: 120, von: 45e9, bienLai: 0.082 },
            { nganh: 'Công nghiệp', doanhNghiep: 310, von: 1.2e12, bienLai: 0.064 },
            { nganh: 'Dịch vụ', doanhNghiep: 570, von: 820e9, bienLai: 0.071 },
          ]}
        />
      </Section>

      <Section title="Bảng chữ T">
        <TAccount
          title="Ngân hàng A"
          assets={[
            { label: 'Cho vay', value: 820e9 },
            { label: 'Dự trữ ở NHNN', value: 95e9 },
            { label: 'Trái phiếu Chính phủ', value: 140e9 },
          ]}
          liabilities={[
            { label: 'Tiền gửi', value: 960e9 },
            { label: 'Vốn', value: 95e9 },
          ]}
        />
      </Section>

      <Section title="Nhãn trạng thái">
        <div className="kb-pv__row">
          <StatusBadge tone="good">Sổ cân</StatusBadge>
          <StatusBadge tone="bad">Sổ lệch</StatusBadge>
          <StatusBadge tone="warn">Ngoài vùng đã kiểm định</StatusBadge>
          <StatusBadge tone="neutral">Thế giới gốc</StatusBadge>
        </div>
      </Section>

      <Section title="Màu dòng tiền và ngành">
        <div className="kb-pv__flows">
          <span style={{ color: 'var(--color-flow-wage)' }}>● Lương</span>
          <span style={{ color: 'var(--color-flow-buy)' }}>● Mua hàng</span>
          <span style={{ color: 'var(--color-flow-tax)' }}>● Thuế</span>
          <span style={{ color: 'var(--color-flow-credit)' }}>● Tín dụng</span>
          <span style={{ color: 'var(--color-flow-gov)' }}>● Ngân sách</span>
          <span style={{ color: 'var(--color-sector-agri)' }}>▲ Nông nghiệp</span>
          <span style={{ color: 'var(--color-sector-manu)' }}>■ Công nghiệp</span>
          <span style={{ color: 'var(--color-sector-serv)' }}>◆ Dịch vụ</span>
        </div>
        <p className="kb-pv__note">Màu luôn đi kèm chữ và hình, không đứng một mình.</p>
      </Section>

      <Section title="Dải cảnh báo">
        <div className="kb-pv__col">
          <WarningBanner tone="warn" action={<Button variant="secondary">Xem thay đổi</Button>}>
            Thế giới này đã sửa quy luật. Kết quả không còn là mô hình đã kiểm định.
          </WarningBanner>
          <WarningBanner tone="info">Vị trí trên bản đồ chỉ để nhìn, không ảnh hưởng tới kinh tế.</WarningBanner>
        </div>
      </Section>

      <Section title="Hộp thoại">
        <Button variant="secondary" onClick={() => setDlg(true)}>
          Mở hộp thoại
        </Button>
        <Dialog
          open={dlg}
          onClose={() => setDlg(false)}
          title="Lưu ván"
          actions={
            <>
              <Button variant="secondary" onClick={() => setDlg(false)}>
                Huỷ
              </Button>
              <Button variant="primary" onClick={() => setDlg(false)}>
                Lưu ván
              </Button>
            </>
          }
        >
          Ván sẽ lưu trong trình duyệt này. Bạn có thể xuất ra file để mở ở máy khác.
        </Dialog>
      </Section>

      <Section title="Ngăn bên">
        <div className="kb-pv__row">
          <Button variant="secondary" onClick={() => setSide(side === 'left' ? null : 'left')}>
            Ngăn bên trái
          </Button>
          <Button variant="secondary" onClick={() => setSide(side === 'right' ? null : 'right')}>
            Ngăn bên phải
          </Button>
          <Button variant="secondary" onClick={() => setSub(!sub)}>
            {sub ? 'Bỏ nút Quay lại' : 'Thêm nút Quay lại'}
          </Button>
        </div>
        <div className="kb-pv__stage">
          <div className="kb-pv__stage-text">Vùng giả lập bản đồ. Ngăn bên trượt vào từ mép.</div>
          <SidePanel side="left" open={side === 'left'} onClose={() => setSide(null)} title="Ngân hàng A" onBack={sub ? () => setSub(false) : undefined}>
            Thông tin chi tiết hiện ở đây.
          </SidePanel>
          <SidePanel side="right" open={side === 'right'} onClose={() => setSide(null)} title="Chuỗi nhân quả" onBack={sub ? () => setSub(false) : undefined}>
            Thông tin chi tiết hiện ở đây.
          </SidePanel>
        </div>
      </Section>

      <Section title="Tab">
        <Tabs
          tabs={[
            { id: 'tong-quan', label: 'Tổng quan' },
            { id: 'tien-te', label: 'Tiền tệ' },
            { id: 'ngan-sach', label: 'Ngân sách' },
          ]}
          active={tab}
          onChange={setTab}
        >
          Nội dung của tab {tab}.
        </Tabs>
      </Section>

      <Section title="Chú thích khi rê chuột">
        <Tooltip content="Chú thích hiện khi rê chuột hoặc khi chọn bằng bàn phím.">
          <Button variant="secondary">Rê chuột vào đây</Button>
        </Tooltip>
      </Section>

      <Section title="Thuật ngữ">
        <p>
          <GlossaryTerm id="room-tin-dung" /> giới hạn mức tăng <GlossaryTerm id="du-no">dư nợ</GlossaryTerm> của mỗi ngân hàng.
        </p>
        <DataTable
          columns={[
            { key: 'term', label: 'Từ dùng' },
            { key: 'short', label: 'Viết tắt' },
            { key: 'def', label: 'Định nghĩa' },
            { key: 'avoid', label: 'Không dùng', format: (v: string[] | undefined) => (v ? v.join(', ') : '') },
          ]}
          rows={GLOSSARY.map((e) => ({ ...e }))}
        />
      </Section>

      <Section title="Thẻ nguồn">
        <span>
          Thuế GTGT phổ thông
          <SourceTag doc="Nghị định 72/2024/NĐ-CP" article="Điều 1" effective="01/07/2024 đến 31/12/2024" note="Giảm thuế GTGT từ 10% xuống 8% cho phần lớn hàng hoá." />
        </span>
      </Section>
    </div>
  );
}
