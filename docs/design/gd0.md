# GĐ0 - Nền móng kỹ thuật

Trạng thái: **đã duyệt 13/11/2026**. Ngày viết: 13/11/2026.

GĐ0 không có kinh tế học thật. Nó dựng khung để GĐ1 trở đi chỉ việc gắn module vào. Để khung có thứ mà chạy, GĐ0 kèm một "nền kinh tế đồ chơi" rất nhỏ (mục 9).

## 1. Stack và lý do

| Thứ | Chọn | Vì sao |
|---|---|---|
| Ngôn ngữ | TypeScript, bật `strict` | Engine nhiều bảng dữ liệu và giao thức; kiểu tĩnh bắt lỗi sớm. Phổ biến nhất cho web |
| Build | Vite | Chuẩn hiện nay, hỗ trợ Web Worker và PWA sẵn |
| UI | React + Zustand | React phổ biến nhất, model nào cũng viết được. Zustand nhỏ, đủ cho state UI |
| Engine | TypeScript thuần, không phụ thuộc thư viện | Chạy được cả trong Worker lẫn Node. Test kiểm định chạy bằng Node, không cần trình duyệt |
| Test | Vitest | Cùng hệ với Vite, chạy file TypeScript trực tiếp |
| Bản đồ isometric | Canvas 2D, phép chiếu và cách đổ bóng lấy từ kit của skill anatomy | Mục 8 giải thích vì sao không dùng SVG cho bản đồ sống |
| Biểu đồ | uPlot | Rất nhẹ, vẽ hàng chục nghìn điểm mượt. Chuỗi thời gian là loại biểu đồ chính |
| Lưu ván | IndexedDB (qua `idb-keyval`) + xuất/nhập file `.kinhbang` | Không cần server. File xuất để sao lưu và chia sẻ |
| Offline | `vite-plugin-pwa` | Cài như app, mở không cần mạng |
| Kiểm tra code | ESLint + Prettier | Có luật ESLint cấm `Math.random` và `Date` trong `src/engine` |

Không dùng: thư viện game engine (Phaser, Pixi) vì bản đồ chỉ cần sprite và hạt, Canvas 2D đủ; WebAssembly vì 5000 hộ mỗi tháng chỉ tốn vài mili giây bằng TypeScript; Comlink vì giao thức tin nhắn tự viết rõ hơn cho người tiếp quản.

## 2. Mô hình thời gian

- Bước cơ sở: **tháng**. Lịch có ngày tháng năm thật để luật đổi đúng ngày hiệu lực.
- Mỗi tháng chạy các **pha** theo thứ tự cố định. Module đăng ký hàm vào pha. Danh sách pha của GĐ1 ở gd1.md mục 3. Thêm pha mới bằng cách chèn tên pha vào danh sách, không sửa vòng lặp.
- Trong pha mua hàng có 4 lượt (4 tuần). Đây là vòng lặp con của module, không phải bước thời gian riêng.
- Tốc độ chơi: tạm dừng, ×1 (một tháng khoảng 3 giây, có hoạt cảnh), ×4, ×16, tối đa (không hoạt cảnh). Engine luôn tính trọn tháng trong một lần; hoạt cảnh là UI phát lại giao dịch của tháng đó.

## 3. Mô hình dữ liệu

### 3.1 World

`World` là toàn bộ trạng thái mô phỏng. Gồm:

- `meta`: phiên bản lược đồ, danh sách module, seed, tháng hiện tại, cờ `modified` (đã sửa luật kinh tế trong Phòng thí nghiệm).
- `tables`: mỗi loại thực thể một bảng dạng mảng cột. Ví dụ bảng `household` có cột `cash: Float64Array`, `bankId: Int32Array`... Dòng thứ i là hộ thứ i.
- Bảng quan hệ cho thứ có số lượng thay đổi: khoản vay, trái phiếu, cổ phần, danh sách người bán quen. Mỗi dòng có khoá ngoại.
- `ledger`: sổ cái (mục 4).
- `causal`: bản ghi quyết định và bảng tổng hợp lý do (mục 5).
- `laws`: ảnh chụp cấu hình luật đang dùng, kể cả các thay đổi do người chơi ban hành.
- `series`: chuỗi thời gian của mọi chỉ số.

Vì sao mảng cột: tuần tự hoá là chép thẳng bộ đệm, nên lưu ván, tách nhánh thế giới và gửi dữ liệu sang UI đều rẻ. Đây là thứ làm cho "thế giới song song" khả thi.

### 3.2 Mã định danh

Mỗi thực thể có `id` nguyên, không tái sử dụng. Doanh nghiệp phá sản thì dòng đánh dấu `dead`, không xoá, để lịch sử và chuỗi nhân quả còn trỏ tới được.

### 3.3 Tiền và số lượng

- Tiền: số nguyên, đơn vị **đồng**, lưu trong `Float64` (chính xác tới 9×10^15). Tham số luật (bậc thuế, ngưỡng doanh thu, lương tối thiểu) dùng đúng con số thật, không quy đổi.
- Khi làm tròn (thuế, lãi): làm tròn xuống, phần lẻ ở lại bên trả.
- Hàng hoá: số thực.
- Nếu mức giá vượt 10^4 lần mức gốc, engine phát sự kiện "đổi tiền" (bỏ bớt số 0) để không tràn số. Việt Nam từng đổi tiền năm 1985 nên đây cũng là chất liệu kịch bản. Cơ chế này thuộc vùng siêu lạm phát, chưa kiểm định.

### 3.4 Ngẫu nhiên

`rand(seed, stream, entityId, tick, k)` là hàm băm trả về số trong [0,1). Không có trạng thái chung.

Lý do: hai thế giới tách từ cùng một điểm (một bên có chính sách, một bên không) sẽ dùng cùng số ngẫu nhiên cho cùng tác nhân, cùng tháng, cùng loại quyết định. Khác biệt giữa hai bên khi đó là do chính sách, không phải do may rủi. Đây là kỹ thuật chạy đôi của Lengnick 2011 (research/abm-models.md mục 2.2), và là nền của so sánh song song.

### 3.5 Lưu và tải

- Bản lưu = đầu mục JSON (phiên bản, module, luật, tháng, seed) + các bộ đệm nối nhau, nén gzip bằng `CompressionStream`.
- Lưu trạng thái đầy đủ, không lưu chuỗi lệnh để phát lại. Vì vậy ván lưu trên trình duyệt này mở được trên trình duyệt khác dù hàm toán học lệch nhau ở chữ số cuối.
- Mỗi module có số phiên bản lược đồ và hàm chuyển đổi từ phiên bản cũ.
- Tự lưu mỗi 12 tháng mô phỏng. Các mốc tự lưu cũng dùng cho tính năng tua lại (nếu duyệt đề xuất S6).

## 4. Sổ cái kế toán kép

### 4.1 Công cụ tài chính

Mỗi công cụ là tài sản của một bên và nợ của bên kia.

| Công cụ | Tài sản của | Nợ của |
|---|---|---|
| Tiền mặt | hộ, doanh nghiệp, ngân hàng | NHNN |
| Tiền gửi | hộ, doanh nghiệp | ngân hàng thương mại |
| Dự trữ | ngân hàng thương mại | NHNN |
| Tài khoản kho bạc | Chính phủ | NHNN |
| Khoản vay | ngân hàng | hộ, doanh nghiệp |
| Tái cấp vốn | NHNN | ngân hàng |
| Trái phiếu chính phủ | ngân hàng, NHNN, hộ | Chính phủ |

Tài sản thực: tồn kho và máy móc, ghi theo giá vốn. Cổ phần doanh nghiệp và ngân hàng ghi trong sổ cổ đông; giá trị là vốn ròng của đơn vị đó chia theo tỷ lệ.

Thêm công cụ mới (ngoại tệ, vàng, cổ phiếu niêm yết) là thêm một dòng vào bảng đăng ký công cụ.

### 4.2 Phép nguyên thuỷ

Chỉ các hàm sau được đổi số dư. Mỗi lần gọi sinh một bút toán có: tháng, loại giao dịch, bên trả, bên nhận, số tiền, công cụ, mã quyết định gây ra nó.

- `transfer(payer, payee, amount, medium, kind, cause)`. Tự lo thanh toán: cùng ngân hàng thì chỉ đổi tên chủ tiền gửi; khác ngân hàng thì dự trữ chuyển theo; trả cho Chính phủ thì tiền gửi và dự trữ cùng giảm, tài khoản kho bạc tăng; tiền mặt thì chuyển tay.
- `createLoan`, `repayLoan`, `writeOffLoan`. Tạo khoản vay sinh ra khoản vay và tiền gửi cùng lúc. Trả gốc huỷ tiền gửi.
- `withdrawCash`, `depositCash`. Rút tiền mặt làm ngân hàng mất dự trữ.
- `issueBond`, `redeemBond`, `payCoupon`.
- `cbLend`, `cbRepay` (tái cấp vốn), `cbBuyBond`, `cbSellBond`.
- `produce`, `sellGoods`, `consumeGoods`, `invest`, `depreciate` cho tài sản thực.
- `issueEquity`, `payDividend`, `liquidate`.

Một phép bị từ chối (trả về lỗi có kiểu) nếu làm số dư âm. Thấu chi chỉ có qua khoản vay tường minh.

### 4.3 Bốn đẳng thức, kiểm mỗi tháng

1. Với mỗi công cụ: tổng bên giữ = tổng bên nợ.
2. Ma trận giao dịch tháng (khu vực × loại giao dịch): mọi hàng và cột cộng bằng 0.
3. Tổng vốn ròng của mọi tác nhân, kể cả Chính phủ và NHNN = tổng giá trị tài sản thực.
4. Bảng cân đối NHNN: trái phiếu NHNN giữ + tái cấp vốn = tiền mặt ngoài NHNN + dự trữ + tài khoản kho bạc + vốn NHNN.

Đẳng thức 4 là bản đầy đủ của mục 5.5 số 2 trong research. Bản trong research thiếu tài khoản kho bạc và vốn NHNN.

Trong test và chế độ phát triển: kiểm mỗi tháng, sai thì ném lỗi. Trong bản phát hành: kiểm mỗi 12 tháng, sai thì báo lên UI.

### 4.4 Giữ bao nhiêu

- Bút toán chi tiết: giữ 24 tháng gần nhất ở mức 5000 hộ, 120 tháng ở mức 500, toàn bộ ở mức 50. Tác nhân đang được soi hoặc đang do người chơi điều khiển thì giữ toàn bộ.
- Ma trận giao dịch tháng và các bảng tổng hợp: giữ mãi. Chúng nhỏ.

## 5. Khung chuỗi nhân quả

Tính năng quan trọng nhất. Thiết kế quanh một nguyên tắc: mắt xích nào cũng phải truy được về dữ liệu đã ghi.

### 5.1 Ba lớp dữ liệu

**Lớp 1 - bút toán.** Từ sổ cái. Trả lời "tiền đi từ đâu tới đâu".

**Lớp 2 - bản ghi quyết định.** Mỗi lần một quy tắc hành vi làm đổi một biến quan trọng (giá, lương chào, kế hoạch sản xuất, tuyển, sa thải, duyệt vay, từ chối vay, ngân sách tiêu dùng), nó ghi:

```
{ tick, agent, rule, variable, before, after,
  parts: [{ reason, amount, ref }] }
```

`parts` chia mức thay đổi theo từng lý do và phải cộng đúng bằng `after - before`. Hàm trợ giúp `explain()` kiểm điều này. Ví dụ một doanh nghiệp tăng giá 3.200 đồng: 2.100 do lương mỗi sản phẩm tăng, 700 do thuế GTGT đổi, 400 do tự nâng biên lãi vì hết hàng.

Mỗi mã lý do đăng ký một lần, gồm: câu mẫu tiếng Việt, và **nguồn ngược dòng** của nó (chỉ số hoặc biến nào, trễ mấy tháng). Ví dụ lý do `unit_wage_cost_up` trỏ ngược tới "lương bình quân ngành". Nguồn ngược dòng là khai báo về cấu trúc của quy tắc (quy tắc này đọc biến nào), không phải khai báo về kết quả.

**Lớp 3 - phân rã chỉ số.** Mỗi chỉ số đăng ký hàm `decompose(t0, t1)` trả về các đóng góp, cộng đúng bằng mức thay đổi. Ví dụ:

- Thay đổi CPI = tổng (trọng số × thay đổi giá từng người bán), gom theo mã lý do của các quyết định giá.
- Thay đổi lượng tiền = khoản vay mới − trả gốc + chi ngân sách − thuế + NHNN mua trái phiếu − ..., lấy thẳng từ sổ cái.
- Thay đổi số người thất nghiệp = bị sa thải (theo lý do) + mất việc do phá sản − được tuyển.

Engine cộng dồn mỗi tháng vào bảng `causalAgg[tháng][chỉ số][lý do]`. Bảng này giữ mãi, nên truy được nhân quả cho bất kỳ khoảng thời gian nào, kể cả khi bút toán chi tiết đã bị dọn.

### 5.2 Dựng chuỗi

`explain(indicator, t0, t1, depth)` trả về một cây:

1. Nút gốc: chỉ số đổi bao nhiêu.
2. Các nhánh: đóng góp theo lý do, xếp theo độ lớn. Đóng góp dưới 10% gom vào "khác".
3. Mỗi nhánh đi tiếp theo nguồn ngược dòng của lý do đó, phân rã chỉ số ngược dòng trong khoảng thời gian tương ứng.
4. Dừng khi gặp: hành động chính sách (của người chơi hoặc kịch bản), cú sốc kịch bản, điều kiện ban đầu, hoặc một nút đã xuất hiện trên đường đi. Trường hợp cuối là **vòng phản hồi** (ví dụ lương đẩy giá, giá đẩy lương) và được hiển thị thành vòng.

Câu chữ sinh từ mẫu, điền số thật. Mẫu nằm ở `src/content/vi/reasons.ts`.

### 5.3 Hai loại câu trả lời, không được lẫn

- **Phân rã** (mặc định, tức thì): "trong mức tăng 4,1% của giá, 2,6 điểm đến từ chi phí lương". Đây là hạch toán nguyên nhân trực tiếp. Nó chính xác về số học nhưng không nói "nếu không có X thì sao".
- **Đối chứng** (bấm nút, mất vài giây): tách một thế giới song song từ thời điểm của nguyên nhân gốc, bỏ nguyên nhân đó, chạy lại tới hiện tại, so chỉ số. Đây mới là câu trả lời nhân quả đúng nghĩa. Dùng cùng cơ chế với Phòng thí nghiệm.

UI ghi nhãn rõ loại nào. Giới hạn cần nói thật với người chơi: khi nhiều nguyên nhân tương tác, phần phân rã chỉ là đóng góp trực tiếp.

### 5.4 Kiểm định khung

- Tổng các đóng góp = mức thay đổi, sai số dưới 1 đồng hoặc 10^-9.
- Trong nền kinh tế đồ chơi, tiêm một chính sách rồi truy chỉ số chịu ảnh hưởng: chuỗi phải kết thúc ở đúng chính sách đó.
- Chạy đối chứng bỏ chính sách: chỉ số quay về quỹ đạo gốc.

## 6. Hệ cấu hình

### 6.1 Tham số luật (`src/config/vn`)

```ts
interface LawParam<T> {
  id: string;                  // 'vat.rate.standard'
  label: string;               // tiếng Việt
  unit: string;
  versions: Array<{
    value: T;
    from: string; to?: string; // ngày hiệu lực, ISO
    source: { doc: string; article?: string; url?: string };
    verification: 'A' | 'B' | 'C';
    chuaXacMinh?: true;        // bắt buộc khi mức C
    simplification?: string;   // mô hình làm khác luật ở chỗ nào
  }>;
}
```

- `law(id, date)` trả về phiên bản đang hiệu lực. Thuế GTGT tự về 10% từ 01/01/2027 nếu không có phiên bản mới.
- Người chơi vai Chính phủ đổi chính sách = thêm một phiên bản, nguồn ghi "Người chơi ban hành, tháng X". Cùng một cơ chế cho luật thật, kịch bản lịch sử, và hành động của người chơi. Mỗi lần đổi là một sự kiện gốc cho chuỗi nhân quả.
- Kịch bản lịch sử nạp bộ phiên bản của thời kỳ đó.
- Test kiểm: tham số nào cũng có nguồn và ngày; mức C phải có `chuaXacMinh`.

### 6.2 Tham số hành vi (`src/config/model`)

Cùng cấu trúc nhưng nguồn là bài báo và phương trình, hoặc "tự thiết kế". Tham số lấy từ mô hình theo quý ghi rõ cách quy đổi sang tháng.

### 6.3 Sổ quy tắc

Mỗi quy tắc hành vi đăng ký: mã, mô tả, nguồn, và các **biến thể** thay thế được. Phòng thí nghiệm là giao diện chọn biến thể. Chọn biến thể khác gốc thì `world.meta.modified = true` và UI hiện dải cảnh báo suốt phiên.

## 7. Giao diện module và giao thức engine-UI

### 7.1 Module

```ts
interface EngineModule {
  id: string; stage: number; dependsOn: string[];
  schema: TableSchema[];          // bảng và cột module thêm vào World
  schemaVersion: number; migrate?(old): void;
  init(world, ctx): void;
  phases: Array<{ phase: PhaseId; order: number; run(world, ctx): void }>;
  indicators?: IndicatorDef[];    // có hàm decompose
  rules?: RuleDef[]; reasons?: ReasonDef[];
  playerActions?: ActionDef[];    // hành động người chơi được làm với tác nhân loại này
}
```

`ctx` cho module: `ledger`, `rand`, `law`, `param`, `causal.record`, `tick`.

### 7.2 Giao thức (`src/protocol`, có số phiên bản)

Lệnh từ UI:

| Lệnh | Nội dung |
|---|---|
| `init` | quy mô, seed, kịch bản hoặc cấu hình sandbox |
| `run` / `pause` / `step` | tốc độ, số tháng |
| `policy` | đổi một tham số luật |
| `possess` | nhận điều khiển một hộ hoặc doanh nghiệp, hoặc thả ra |
| `agentAction` | quyết định của người chơi cho tác nhân đang điều khiển |
| `lab` | chọn biến thể quy tắc |
| `fork` | tách thế giới song song, kèm thay đổi |
| `query` | hỏi theo yêu cầu: chi tiết tác nhân, bảng cân đối, chuỗi nhân quả, lát sổ cái, ma trận dòng tiền, chuỗi thời gian |
| `save` / `load` | |

Tin từ engine:

| Tin | Nội dung |
|---|---|
| `ready` | sổ chỉ số, sổ quy tắc, danh mục luật, hành động khả dụng |
| `tick` | tháng, giá trị mọi chỉ số, khung bản đồ, mẫu giao dịch để vẽ hoạt cảnh, bản tin, yêu cầu quyết định cho tháng tới |
| `queryResult` | |
| `invariantViolation` | |
| `scenarioState` | tiến độ mục tiêu, thắng, thua |

**Khung bản đồ**: các mảng số (vị trí ô, trạng thái, nhóm tài sản của hộ; ô, quy mô, tồn kho, ngành của doanh nghiệp), chuyển quyền sở hữu bộ đệm sang UI, không sao chép.

**Mẫu giao dịch**: tối đa vài trăm bút toán của tháng, lấy mẫu theo số tiền, kèm tổng đúng theo từng loại. Hoạt cảnh vẽ từ mẫu; con số hiển thị lấy từ tổng.

**Người chơi điều khiển tác nhân**: cuối mỗi tháng engine gửi yêu cầu quyết định kèm phương án mà quy tắc tự động sẽ chọn và lý do. Người chơi sửa hoặc chấp nhận. Mỗi loại quyết định có công tắc "tự lái".

Engine cũng xuất `EngineApi` đồng bộ để Node gọi thẳng trong test, không qua tin nhắn.

## 8. Khung UI

### 8.1 Bố cục

- Thanh trên: ngày tháng, tốc độ, nút đổi vai, quy mô, tên kịch bản. Dải cảnh báo khi thế giới đã bị sửa luật.
- Giữa: bản đồ isometric.
- Phải: bảng theo vai. Chính phủ: các đòn bẩy chính sách. Người tham gia: tác nhân của tôi, quyết định tháng này. Quan sát: dashboard, soi tác nhân.
- Dưới: dải chỉ số chính và dòng thời gian có đánh dấu sự kiện. Bấm vào chỉ số nào cũng mở ngăn chuỗi nhân quả.

Đổi vai không dừng mô phỏng. Vai không do người chơi giữ thì chạy bằng quy tắc tự động.

### 8.2 Bản đồ isometric và skill anatomy

Skill anatomy làm figure SVG tĩnh 40-150 chi tiết, mỗi chi tiết một phần tử SVG. Bản đồ sống với hàng nghìn tác nhân và hạt chuyển động mà làm bằng SVG thì không mượt. Cách phát triển từ skill:

- **Lấy phép chiếu và ngôn ngữ hình ảnh**: `fitProjection`, `iso`, `depthOf` từ `iso-kit.ts`; đổ bóng bốn tông theo hướng mặt; tô kín, vẽ từ sau ra trước; một điểm nhấn sáng; chi tiết nhỏ có chủ đích; hai giao diện sáng và tối; chữ nằm ngoài hình.
- **Công trình tĩnh** (nhà, xưởng, chợ, ngân hàng, kho bạc): dựng bằng các khối của kit lúc build, kết xuất thành sprite. Mỗi loại công trình vài mức quy mô.
- **Lớp động** (người, dòng tiền, hàng hoá): Canvas 2D, vẽ theo thứ tự độ sâu. Màu chỉ dùng cho loại dòng tiền (lương, thuế, tín dụng, mua hàng), vì ở đây màu chính là nội dung.
- **Mức chi tiết theo quy mô**: 50 hộ thì mỗi hộ một nhà, mỗi người một hình. 500 và 5000 thì nhà gom thành khối phố, người vẽ theo mẫu; doanh nghiệp vẫn mỗi đơn vị một công trình.
- Ở GĐ1 vị trí chỉ để nhìn. UI nói rõ điều này. Khoảng cách có ý nghĩa kinh tế từ GĐ6.
- Dừng vẽ khi tab ẩn. Tôn trọng `prefers-reduced-motion`.

### 8.3 Phong cách

Chi tiết thiết kế giao diện làm ở bước code UI, theo các skill thiết kế có sẵn. Nguyên tắc: con số nào hiện trên màn hình cũng bấm được để hỏi "vì sao".

## 9. Nền kinh tế đồ chơi

Module `toy`, giữ lại làm đồ gá test sau GĐ0. Hộ nhận lương cố định từ doanh nghiệp, tiêu 90% thu nhập, doanh nghiệp bán giá cố định, một ngân hàng giữ tiền gửi, Chính phủ trả lương công chức và thu thuế phẳng. Đủ để chạy sổ cái, chuỗi nhân quả ("tăng lương công chức → tiêu dùng tăng → doanh thu tăng"), lưu tải, tách nhánh, bản đồ, ba vai.

## 10. Kiểm định GĐ0

GĐ0 xong khi mọi mục dưới đây qua bằng test tự động (trừ mục ghi "đo tay").

| Mã | Sự thật kỹ thuật | Cách kiểm |
|---|---|---|
| K0.1 | Tất định | Cùng seed, cùng lệnh, 120 tháng: mã băm trạng thái trùng nhau, ở cả ba quy mô |
| K0.2 | Worker và Node cho cùng kết quả | So mã băm |
| K0.3 | Lưu rồi tải không đổi tương lai | Lưu ở tháng 60, tải, chạy tới 120: trùng mã băm với lần chạy liền |
| K0.4 | Tách nhánh sạch | Nhánh không can thiệp trùng gốc từng bit. Nhánh có can thiệp: tác nhân không bị ảnh hưởng vẫn rút cùng số ngẫu nhiên |
| K0.5 | Sổ cái không rò | Chạy chuỗi ngẫu nhiên 10^5 phép nguyên thuỷ: bốn đẳng thức luôn đúng, không số dư nào âm |
| K0.6 | Phân rã cộng đủ | Mọi chỉ số, mọi khoảng: tổng đóng góp = mức thay đổi |
| K0.7 | Chuỗi nhân quả tới gốc | Tiêm chính sách vào nền đồ chơi: chuỗi kết thúc ở chính sách đó; đối chứng bỏ chính sách thì chỉ số về quỹ đạo gốc |
| K0.8 | Luật theo ngày | `law('vat.rate.standard')` trả 8% ngày 31/12/2026 và 10% ngày 01/01/2027. Mọi tham số có nguồn, ngày, mức xác minh |
| K0.9 | Module gắn thêm không sửa lõi | Một module giả thêm bảng, pha, chỉ số; test chạy mà không sửa `core` |
| K0.10 | Engine sạch | Không có `import` từ `ui` hay API trình duyệt trong `src/engine`; ESLint cấm `Math.random`, `Date` |
| K0.11 | Cờ sửa luật | Chọn biến thể quy tắc khác gốc thì `modified = true` và không tự tắt |
| K0.12 | Hiệu năng engine | 5000 hộ, một tháng ≤ 30 ms trong Node trên máy phát triển; tin `tick` ≤ 300 KB |
| K0.13 | Hiệu năng UI (đo tay + script) | Bản đồ 5000 hộ ≥ 50 khung/giây ở ×1 |
| K0.14 | Offline (đo tay) | Tắt mạng, mở lại app, tải ván đã lưu |

## 11. Thứ tự làm GĐ0

1. Khung dự án, ESLint, Vitest, cấu trúc thư mục.
2. `core`: World, bảng, rand, lịch, vòng pha, mã băm trạng thái. Test K0.1.
3. `ledger`: công cụ, phép nguyên thuỷ, bốn đẳng thức. Test K0.5.
4. Hệ cấu hình luật, nạp các tham số GĐ1 cần từ research/vn-params.md. Test K0.8.
5. `causal`: bản ghi quyết định, sổ lý do, phân rã, dựng chuỗi. Module `toy`. Test K0.6, K0.7.
6. Lưu tải, tách nhánh, `lab`. Test K0.3, K0.4, K0.11.
7. Giao thức và Worker. Test K0.2, K0.9, K0.10, K0.12.
8. UI: khung ba vai, bản đồ isometric với nền đồ chơi, dải chỉ số, ngăn chuỗi nhân quả, lưu tải, PWA. K0.13, K0.14.

Bước 1-7 là phần khó, làm trước. Bước 8 model khác làm được từ spec này.

## 12. Đơn giản hoá và rủi ro

- Tất định chỉ bảo đảm trong cùng một trình duyệt. Hai trình duyệt khác nhau có thể lệch ở chữ số cuối của hàm mũ. Bản lưu vẫn dùng chung được vì lưu trạng thái.
- Giữ bút toán chi tiết có hạn. Truy tới từng giao dịch chỉ làm được trong cửa sổ gần; xa hơn thì truy ở mức tổng hợp.
- Phân rã là hạch toán trực tiếp, không phải nhân quả đối chứng. Đã tách hai loại ở mục 5.3.
- Rủi ro lớn nhất cho các giai đoạn sau: khung nhân quả đòi mỗi quy tắc tự chia mức thay đổi theo lý do. Quy tắc phi tuyến sẽ khó chia. Cách xử lý: chia theo thứ tự cố định (đổi lần lượt từng đầu vào), ghi rõ thứ tự trong sổ quy tắc.
