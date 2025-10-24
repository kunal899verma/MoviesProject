'use client';

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'cancel' | 'update' | 'delete' | 'login' | 'logout';
  size?: 'sm' | 'md' | 'lg' | 'login' | 'edit' | 'pagination';
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md',
    isLoading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'login-button';
        case 'secondary':
          return 'edit-cancel-button';
        case 'danger':
          return 'edit-delete-button';
        case 'cancel':
          return 'edit-cancel-button';
        case 'update':
          return 'edit-update-button';
        case 'delete':
          return 'edit-delete-button';
        case 'login':
          return 'login-button';
        case 'logout':
          return 'logout-button';
        default:
          return 'login-button';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return '';
        case 'md':
          return '';
        case 'lg':
          return '';
        case 'login':
          return '';
        case 'edit':
          return '';
        case 'pagination':
          return 'pagination-button';
        default:
          return '';
      }
    };

    const getTextClasses = () => {
      switch (variant) {
        case 'primary':
        case 'login':
          return 'login-button-text';
        case 'secondary':
        case 'cancel':
        case 'update':
        case 'delete':
          return 'edit-button-text';
        case 'logout':
          return '';
        case 'danger':
          return 'edit-button-text';
        default:
          return 'login-button-text';
      }
    };

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return {
            height: '2.25rem',
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
            fontSize: '0.875rem',
          };
        case 'md':
          return {
            height: '3rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            fontSize: '1rem',
          };
        case 'lg':
          return {
            height: '3.5rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            fontSize: '1.125rem',
          };
        case 'login':
          return {
            width: '18.75rem', // 300px
            height: '3.375rem', // 54px
            borderRadius: '0.625rem', // 10px
            paddingTop: '0.9375rem', // 15px
            paddingRight: '1.5rem', // 24px
            paddingBottom: '0.9375rem', // 15px
            paddingLeft: '1.5rem', // 24px
            gap: '0.3125rem', // 5px
          };
        case 'edit':
          return {
            width: '8rem', // 128px
            height: '2.75rem', // 44px
            borderRadius: '0.5rem', // 8px
          };
        case 'pagination':
          return {
            height: '2rem', // 32px
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            fontSize: '1rem',
          };
        default:
          return {};
      }
    };

    const renderContent = () => {
      if (isLoading) {
        return (
          <div className="flex items-center space-x-2">
            <div className="animate-spin border-2 border-white/20 border-t-white rounded-full w-5 h-5" />
            <span>{loadingText || 'Loading...'}</span>
          </div>
        );
      }

      if (icon && iconPosition === 'left') {
        return (
          <>
            {icon}
            <span className={getTextClasses()}>{children}</span>
          </>
        );
      }

      if (icon && iconPosition === 'right') {
        return (
          <>
            <span className={getTextClasses()}>{children}</span>
            {icon}
          </>
        );
      }

      return <span className={getTextClasses()}>{children}</span>;
    };

    return (
      <button
        className={cn(
          getVariantClasses(),
          getSizeClasses(),
          fullWidth && 'w-full',
          isLoading && 'opacity-50 cursor-not-allowed',
          className
        )}
        style={getSizeStyles()}
        disabled={disabled || isLoading}
        ref={ref}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export { PrimaryButton };
