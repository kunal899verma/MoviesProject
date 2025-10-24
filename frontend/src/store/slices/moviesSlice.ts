import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { moviesAPI } from '@/lib/api';

export interface Movie {
  _id: string;
  title: string;
  publishingYear: number;
  poster?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MovieFormData {
  title: string;
  publishingYear: number;
  poster?: string;
}

export interface MoviesQuery {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
}

export interface MoviesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface MoviesState {
  movies: Movie[];
  currentMovie: Movie | null;
  pagination: MoviesPagination | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  query: MoviesQuery;
}

const initialState: MoviesState = {
  movies: [],
  currentMovie: null,
  pagination: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  query: { page: 1, limit: 8 },
};

// Async thunks
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (query: MoviesQuery = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await moviesAPI.getMovies(query);
      return response;
    } catch (error: any) {
      // If 401 error, clear auth state
      if (error.response?.status === 401) {
        // Import logout action dynamically to avoid circular dependency
        const { logout } = await import('./authSlice');
        dispatch(logout());
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch movies';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMovie = createAsyncThunk(
  'movies/fetchMovie',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await moviesAPI.getMovie(id);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData: MovieFormData, { rejectWithValue }) => {
    try {
      const response = await moviesAPI.createMovie(movieData);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, data }: { id: string; data: Partial<MovieFormData> }, { rejectWithValue }) => {
    try {
      const response = await moviesAPI.updateMovie(id, data);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id: string, { rejectWithValue }) => {
    try {
      await moviesAPI.deleteMovie(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete movie';
      return rejectWithValue(errorMessage);
    }
  }
);

export const uploadPoster = createAsyncThunk(
  'movies/uploadPoster',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await moviesAPI.uploadPoster(file);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload poster';
      return rejectWithValue(errorMessage);
    }
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    setQuery: (state, action: PayloadAction<MoviesQuery>) => {
      state.query = { ...state.query, ...action.payload };
    },
    resetMovies: (state) => {
      state.movies = [];
      state.pagination = null;
      state.currentMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.movies = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single movie
      .addCase(fetchMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMovie = action.payload;
        state.error = null;
      })
      .addCase(fetchMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create movie
      .addCase(createMovie.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.isCreating = false;
        state.movies.unshift(action.payload);
        state.error = null;
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      // Update movie
      .addCase(updateMovie.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.movies.findIndex(movie => movie._id === action.payload._id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        if (state.currentMovie && state.currentMovie._id === action.payload._id) {
          state.currentMovie = action.payload;
        }
        state.error = null;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      // Delete movie
      .addCase(deleteMovie.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.movies = state.movies.filter(movie => movie._id !== action.payload);
        if (state.currentMovie && state.currentMovie._id === action.payload) {
          state.currentMovie = null;
        }
        state.error = null;
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentMovie, setQuery, resetMovies } = moviesSlice.actions;
export default moviesSlice.reducer;
