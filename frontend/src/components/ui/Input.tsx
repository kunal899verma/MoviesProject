'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <input
          className={cn(
            'flex items-center rounded-lg border border-card-border bg-input text-white text-left font-montserrat font-normal text-sm leading-6 w-[18.75rem] h-[2.8125rem] px-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 placeholder:font-montserrat placeholder:font-normal placeholder:text-sm placeholder:text-white/40 placeholder:text-left',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
