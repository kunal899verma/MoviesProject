import axios from 'axios';
import { MovieFormData, MoviesQuery } from '@/store/slices/moviesSlice';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // Use relative URL to leverage Next.js proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token but don't redirect immediately
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      // Let the auth system handle the redirect through ProtectedRoute
    }
    
    // Enhanced error handling for production
    if (error.response?.status >= 500) {
      console.error('Server Error:', error.response?.data?.message || 'Internal Server Error');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: { email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Movies API
export const moviesAPI = {
  getMovies: async (query: MoviesQuery = {}) => {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.year) params.append('year', query.year.toString());

    const response = await api.get(`/movies?${params.toString()}`);
    return response.data;
  },

  getMovie: async (id: string) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  createMovie: async (movieData: MovieFormData) => {
    const response = await api.post('/movies', movieData);
    return response.data;
  },

  updateMovie: async (id: string, movieData: Partial<MovieFormData>) => {
    const response = await api.patch(`/movies/${id}`, movieData);
    return response.data;
  },

  deleteMovie: async (id: string) => {
    const response = await api.delete(`/movies/${id}`);
    return response.data;
  },

  uploadPoster: async (file: File) => {
    const formData = new FormData();
    formData.append('poster', file);

    const response = await api.post('/movies/upload-poster', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
