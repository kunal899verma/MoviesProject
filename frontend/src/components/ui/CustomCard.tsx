'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface CustomCardProps {
  children: ReactNode;
  variant?: 'movie' | 'modal' | 'form' | 'default';
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function CustomCard({ 
  children, 
  variant = 'default',
  className,
  hover = false,
  clickable = false,
  onClick
}: CustomCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'movie':
        return 'movie-card group';
      case 'modal':
        return 'bg-card border border-white/10 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl';
      case 'form':
        return 'bg-card border border-card-border rounded-lg p-6';
      default:
        return 'bg-card border border-card-border rounded-lg p-4';
    }
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    return 'hover:shadow-lg transition-shadow duration-200';
  };

  const getClickableClasses = () => {
    if (!clickable) return '';
    return 'cursor-pointer hover:scale-105 transition-transform duration-200';
  };

  return (
    <div
      className={cn(
        getVariantClasses(),
        getHoverClasses(),
        getClickableClasses(),
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export interface MovieCardProps {
  movie: {
    _id: string;
    title: string;
    publishingYear: number;
    poster?: string;
  };
  onEdit: () => void;
  className?: string;
}

export function MovieCard({ movie, onEdit, className }: MovieCardProps) {
  return (
    <CustomCard variant="movie" className={className}>
      {/* Movie Poster */}
      <div className="relative">
        <Image
          src={movie.poster || '/placeholder-movie.svg'}
          alt={movie.title}
          width={300}
          height={400}
          className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/placeholder-movie.svg') {
              target.src = '/placeholder-movie.svg';
            }
          }}
        />
        
        {/* Edit Button - appears on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-heading-5 text-white overflow-hidden text-ellipsis whitespace-nowrap" title={movie.title}>
          {movie.title.length > 40 ? `${movie.title.substring(0, 40)}...` : movie.title}
        </h3>
        <p className="text-body-small text-text-secondary">{movie.publishingYear}</p>
      </div>
    </CustomCard>
  );
}
