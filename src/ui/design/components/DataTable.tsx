export interface DataColumn {
  key: string;
  label: string;
  align?: 'left' | 'right';
  format?: (v: any) => string;
}

export function DataTable({ columns, rows }: { columns: DataColumn[]; rows: Record<string, unknown>[] }) {
  return (
    <table className="kb-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} scope="col" className={c.align === 'right' ? 'kb-table__r' : undefined}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {columns.map((c) => {
              const v = r[c.key];
              const right = c.align === 'right';
              return (
                <td key={c.key} className={right ? 'kb-table__r kb-num' : undefined}>
                  {c.format ? c.format(v) : String(v ?? '')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
