'use client';

import { InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ className, onChange, checked, ...props }: CheckboxProps) {
  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        {...props}
      />
      <div
        className={cn(
          'border-0 bg-input flex items-center justify-center cursor-pointer transition-all w-[1.125rem] h-[1.0625rem] rounded-[0.3125rem]',
          checked ? 'bg-primary border-primary' : 'hover:bg-input-hover',
          className
        )}
        onClick={() => onChange?.(!checked)}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </div>
  );
}
