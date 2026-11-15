import type { ButtonHTMLAttributes } from 'react';
import { cx } from './util';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
}

export function Button({ variant = 'secondary', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx('kb-btn', `kb-btn--${variant}`, className)} {...rest} />;
}
