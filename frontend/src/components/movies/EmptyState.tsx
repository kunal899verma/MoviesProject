'use client';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddMovie: () => void;
}

export function EmptyState({ onAddMovie }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-heading-2 text-center text-white mb-8">
        Your movie list is empty
      </h2>
      
      <PrimaryButton
        onClick={onAddMovie}
        variant="login"
        size="login"
        icon={<Plus className="w-5 h-5" />}
        iconPosition="left"
      >
        Add a new movie
      </PrimaryButton>
    </div>
  );
}
