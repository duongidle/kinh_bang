// Mô hình này bỏ qua gì: các ghi chú và danh sách thứ chưa có.
import { NOTES, OMISSIONS } from '../../content/notes';

export function Notes({ focus }: { focus?: string }) {
  return (
    <>
      {NOTES.map((n) => (
        <details key={n.id} open={focus === n.id}>
          <summary>{n.title}</summary>
          {n.body.map((p, k) => (
            <p key={k}>{p}</p>
          ))}
        </details>
      ))}
      <h3>Những thứ mô hình ở giai đoạn này chưa có</h3>
      <ul className="plain">
        {OMISSIONS.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <p className="hint">Mô hình là một cách nghĩ, không phải dự báo. Kết quả ở đây đúng với các quy tắc đã đặt, không chắc đúng với nền kinh tế thật.</p>
    </>
  );
}
