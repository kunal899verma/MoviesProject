import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import moviesSlice from './slices/moviesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    movies: moviesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
