import { useId, useState, type KeyboardEvent } from 'react';
import { num } from '../../format';
import { decimalsOf, parseViNumber } from './util';

export interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  unit: string;
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ value, onChange, unit, label, min, max, step = 1 }: NumberInputProps) {
  const id = useId();
  const decimals = decimalsOf(step);
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (v: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, v));
  const commit = () => {
    if (draft === null) return;
    const v = parseViNumber(draft);
    if (Number.isFinite(v)) onChange(clamp(v));
    setDraft(null);
  };
  const bump = (dir: 1 | -1) => {
    const base = draft !== null && Number.isFinite(parseViNumber(draft)) ? parseViNumber(draft) : value;
    const v = clamp(Math.round((base + dir * step) * 10 ** decimals) / 10 ** decimals);
    onChange(v);
    setDraft(num(v, decimals));
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      bump(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      bump(-1);
    } else if (e.key === 'Escape') setDraft(null);
  };

  return (
    <div className="kb-field">
      <label className="kb-field__label" htmlFor={id}>
        {label}
      </label>
      <span className="kb-numinput">
        <input
          id={id}
          className="kb-numinput__input"
          type="text"
          inputMode="decimal"
          aria-describedby={`${id}-unit`}
          value={draft ?? num(value, decimals)}
          onFocus={() => setDraft(num(value, decimals))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={onKey}
        />
        <span id={`${id}-unit`} className="kb-numinput__unit">
          {unit}
        </span>
      </span>
    </div>
  );
}
