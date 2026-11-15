import { useId, type CSSProperties } from 'react';

export interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  /** Mức hiện hành: vẽ một vạch trên rãnh kèm nhãn. */
  current?: number;
  format: (x: number) => string;
  label: string;
}

export function Slider({ value, onChange, min, max, step, current, format, label }: SliderProps) {
  const id = useId();
  const frac = (x: number) => (max > min ? Math.min(1, Math.max(0, (x - min) / (max - min))) : 0);
  const style = { '--kb-frac': frac(value), '--kb-cur': current === undefined ? 0 : frac(current) } as CSSProperties;
  return (
    <div className="kb-slider" style={style}>
      <div className="kb-slider__head">
        <label className="kb-field__label" htmlFor={id}>
          {label}
        </label>
        <output className="kb-slider__value kb-num" htmlFor={id}>
          {format(value)}
        </output>
      </div>
      <div className="kb-slider__track">
        <input
          id={id}
          className="kb-slider__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={format(value)}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {current !== undefined && <span className="kb-slider__mark" aria-hidden="true" />}
      </div>
      {current !== undefined && (
        <div className="kb-slider__cur">
          <span className="kb-slider__cur-label">
            Hiện hành: <span className="kb-num">{format(current)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
