'use client';

import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PrimaryButton } from './PrimaryButton';

export interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'confirmation' | 'form';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className
}: CustomModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-md';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'confirmation':
        return 'bg-card border border-white/10 rounded-lg p-6 shadow-xl';
      case 'form':
        return 'bg-card border border-card-border rounded-lg p-6 shadow-xl';
      default:
        return 'bg-card border border-white/10 rounded-lg p-6 shadow-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal */}
      <div className={cn(
        'relative w-full mx-4',
        getSizeClasses(),
        getVariantClasses(),
        className
      )}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// Specialized Confirmation Modal
export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}: ConfirmationModalProps) {
  const getConfirmVariant = () => {
    switch (variant) {
      case 'danger':
        return 'delete';
      case 'warning':
        return 'update';
      case 'info':
        return 'primary';
      default:
        return 'delete';
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      variant="confirmation"
    >
      <p className="text-text-secondary">{message}</p>
      
      <div className="flex justify-end space-x-3 mt-6">
        <PrimaryButton
          variant="cancel"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </PrimaryButton>
        <PrimaryButton
          variant={getConfirmVariant()}
          onClick={onConfirm}
          disabled={isLoading}
          isLoading={isLoading}
        >
          {isLoading ? 'Processing...' : confirmText}
        </PrimaryButton>
      </div>
    </CustomModal>
  );
}
