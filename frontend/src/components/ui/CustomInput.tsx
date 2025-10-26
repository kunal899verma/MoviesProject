'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'search' | 'password' | 'edit-large' | 'edit-small';
  showPasswordToggle?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
  searchIcon?: boolean;
  containerClassName?: string;
  'aria-label'?: string;
  'aria-required'?: boolean;
  'aria-describedby'?: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ 
    className, 
    label, 
    error, 
    variant = 'default',
    showPasswordToggle = false,
    showClearButton = false,
    onClear,
    searchIcon = false,
    containerClassName,
    type,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    const inputValue = value !== undefined ? value : internalValue;

    const handleClear = () => {
      if (value !== undefined) {
        onClear?.();
      } else {
        setInternalValue('');
        onClear?.();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value !== undefined) {
        onChange?.(e);
      } else {
        setInternalValue(e.target.value);
        onChange?.(e);
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case 'search':
          return 'search-field';
        case 'edit-large':
          return 'edit-form-input';
        case 'edit-small':
          return 'edit-form-input-small';
        case 'password':
          return 'input';
        default:
          return 'input';
      }
    };

    const getContainerClasses = () => {
      switch (variant) {
        case 'search':
          return 'search-input-wrapper';
        case 'password':
          return 'form-group';
        default:
          return 'form-group';
      }
    };

    const inputType = variant === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    return (
      <div className={cn(getContainerClasses(), containerClassName)}>
        {label && <label className="text-sm font-medium text-white">{label}</label>}
        
        <div className="relative">
          {/* Search Icon */}
          {searchIcon && (
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/50 z-10" />
          )}
          
          <input
            className={cn(
              getVariantClasses(),
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            type={inputType}
            value={inputValue}
            onChange={handleChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
            {...props}
          />
          
          {/* Password Toggle */}
          {showPasswordToggle && variant === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 cursor-pointer text-white/40 transition-colors hover:text-white z-10"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
          
          {/* Clear Button */}
          {showClearButton && inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 cursor-pointer transition-colors z-10 flex items-center justify-center p-1 hover:text-white/80"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {error && <p id={`${props.id || 'input'}-error`} className="text-sm text-error" role="alert">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export { CustomInput };
