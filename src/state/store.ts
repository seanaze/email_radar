/**
 * @fileoverview
 * Redux store configuration for Email Radar.
 * Manages application state for auth and future features.
 */

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

/**
 * @description Redux store instance with auth slice
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 