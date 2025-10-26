export const APP_CONFIG = {
  name: 'Movie Management',
  description: 'Manage your favorite movies with ease',
  version: '1.0.0',
  author: 'Kunal Verma',
  repository: 'https://github.com/kunal899verma/MoviesProject',
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    me: '/auth/me',
  },
  movies: {
    list: '/movies',
    create: '/movies',
    update: (id: string) => `/movies/${id}`,
    delete: (id: string) => `/movies/${id}`,
    uploadPoster: '/movies/upload-poster',
    stats: '/movies/stats',
  },
} as const;

export const PAGINATION = {
  defaultLimit: 8,
  maxLimit: 50,
  minLimit: 1,
} as const;

export const FILE_UPLOAD = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

export const MOVIE_VALIDATION = {
  title: {
    minLength: 1,
    maxLength: 200,
  },
  publishingYear: {
    min: 1888,
    max: new Date().getFullYear() + 10,
  },
} as const;

export const UI = {
  toastDuration: 5000,
  loadingDelay: 300,
  debounceDelay: 500,
} as const;
