'use client';

import Image from 'next/image';
import { Edit } from 'lucide-react';
import { Movie } from '@/store/slices/moviesSlice';
import { getImageUrl, truncateText } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  onEdit: () => void;
}

export function MovieCard({ movie, onEdit }: MovieCardProps) {
  return (
    <article className="movie-card group" role="article" aria-label={`Movie: ${movie.title}`}>
      {/* Movie Poster */}
      <div className="relative">
        <Image
          src={getImageUrl(movie.poster)}
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
          aria-label={`Edit ${movie.title}`}
        >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-heading-5 text-white overflow-hidden text-ellipsis whitespace-nowrap" title={movie.title}>
          {truncateText(movie.title, 40)}
        </h3>
        <p className="text-body-small text-text-secondary" aria-label={`Released in ${movie.publishingYear}`}>
          {movie.publishingYear}
        </p>
      </div>
    </article>
  );
}
