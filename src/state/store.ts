/**
 * @fileoverview Redux store configuration for Email Radar
 * @description Configures Redux Toolkit store with middleware and dev tools
 */

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import inboxReducer from '../features/inbox/inboxSlice'

/**
 * @description Redux store configuration with feature slices
 * @returns {Store} Configured Redux store instance
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    inbox: inboxReducer,
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