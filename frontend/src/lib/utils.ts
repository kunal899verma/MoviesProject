import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(year: number): string {
  return year.toString();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function isValidImageFile(file: any): boolean {
  // Check if we're in a browser environment and file is actually a File object
  if (typeof window === 'undefined' || !file || typeof file !== 'object') {
    return false;
  }
  
  // Additional check to ensure it's a File-like object
  if (!file.type || !file.size) {
    return false;
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

export function getImageUrl(path?: string): string {
  if (!path) return '/placeholder-movie.svg';
  if (path.startsWith('http')) return path;
  
  // For uploaded images, use the backend base URL without /api prefix
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  return `${backendBaseUrl}${path}`;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generatePageNumbers(currentPage: number, totalPages: number): number[] {
  const pages: number[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push(-1); // Ellipsis
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(-1); // Ellipsis
      pages.push(totalPages);
    }
  }

  return pages;
}
