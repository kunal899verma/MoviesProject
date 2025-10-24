'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseClasses = 'btn';
    
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
      sm: '', // 2.25rem height, 0.75rem padding, 0.875rem font-size
      md: '', // 3rem height, 1.5rem padding, 1rem font-size  
      lg: '', // 3.5rem height, 2rem padding, 1.125rem font-size
    };

    const sizeStyles = {
      sm: {
        height: '2.25rem', /* 36px ÷ 16 = 2.25rem */
        paddingLeft: '0.75rem', /* 12px ÷ 16 = 0.75rem */
        paddingRight: '0.75rem', /* 12px ÷ 16 = 0.75rem */
        fontSize: '0.875rem', /* 14px ÷ 16 = 0.875rem */
      },
      md: {
        height: '3rem', /* 48px ÷ 16 = 3rem */
        paddingLeft: '1.5rem', /* 24px ÷ 16 = 1.5rem */
        paddingRight: '1.5rem', /* 24px ÷ 16 = 1.5rem */
        fontSize: '1rem', /* 16px ÷ 16 = 1rem */
      },
      lg: {
        height: '3.5rem', /* 56px ÷ 16 = 3.5rem */
        paddingLeft: '2rem', /* 32px ÷ 16 = 2rem */
        paddingRight: '2rem', /* 32px ÷ 16 = 2rem */
        fontSize: '1.125rem', /* 18px ÷ 16 = 1.125rem */
      },
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={sizeStyles[size]}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
