/**
 * @fileoverview Redux store configuration for Email Radar
 * @description Configures Redux Toolkit store with middleware and dev tools
 */

import { configureStore } from '@reduxjs/toolkit'

/**
 * @description Redux store configuration with RTK Query and dev tools
 * @returns {Store} Configured Redux store instance
 */
export const store = configureStore({
  reducer: {
    // Feature slices will be added here during MVP phase
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