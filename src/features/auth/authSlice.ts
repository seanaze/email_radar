/**
 * @fileoverview Redux slice for authentication state management
 * @description Handles user authentication, Firebase tokens, and user settings state
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { User, UserSettings } from '../../types/database';
import {
  createUser,
  getUser,
  updateUserTokens,
  createUserSettings,
  getUserSettings,
  updateUserSettings,
} from '../../utils/firestore';

/**
 * @description Authentication state interface
 */
interface AuthState {
  user: User | null;
  settings: UserSettings | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * @description Initial authentication state
 */
const initialState: AuthState = {
  user: null,
  settings: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * @description Async thunk to create a new user after OAuth
 * @param {Object} payload - User creation payload
 * @param {string} payload.uid - Firebase Auth UID
 * @param {User} payload.userData - User data from OAuth
 */
export const createUserThunk = createAsyncThunk(
  'auth/createUser',
  async ({ uid, userData }: { uid: string; userData: User }) => {
    await createUser(uid, userData);
    
    // Create default settings for new user
    const defaultSettings: UserSettings = {
      suggestion_aggressiveness: 3,
      language: 'en-US',
      ai_features_enabled: true,
    };
    await createUserSettings(uid, defaultSettings);
    
    return { user: userData, settings: defaultSettings };
  }
);

/**
 * @description Async thunk to load user data and settings
 * @param {string} uid - Firebase Auth UID
 */
export const loadUserThunk = createAsyncThunk(
  'auth/loadUser',
  async (uid: string) => {
    const [user, settings] = await Promise.all([
      getUser(uid),
      getUserSettings(uid),
    ]);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { user, settings };
  }
);

/**
 * @description Async thunk to refresh user tokens
 * @param {Object} payload - Token refresh payload
 * @param {string} payload.uid - Firebase Auth UID
 * @param {string} payload.accessToken - New access token
 * @param {string} payload.refreshToken - New refresh token
 */
export const refreshTokensThunk = createAsyncThunk(
  'auth/refreshTokens',
  async ({ uid, accessToken, refreshToken }: {
    uid: string;
    accessToken: string;
    refreshToken: string;
  }) => {
    await updateUserTokens(uid, accessToken, refreshToken);
    return { accessToken, refreshToken };
  }
);

/**
 * @description Async thunk to update user settings
 * @param {Object} payload - Settings update payload
 * @param {string} payload.uid - Firebase Auth UID
 * @param {Partial<UserSettings>} payload.updates - Settings to update
 */
export const updateSettingsThunk = createAsyncThunk(
  'auth/updateSettings',
  async ({ uid, updates }: { uid: string; updates: Partial<UserSettings> }) => {
    await updateUserSettings(uid, updates);
    return updates;
  }
);

/**
 * @description Authentication Redux slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * @description Clears authentication state on logout
     */
    logout: (state) => {
      state.user = null;
      state.settings = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    /**
     * @description Clears any authentication errors
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create user cases
      .addCase(createUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.settings = action.payload.settings;
        state.isAuthenticated = true;
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create user';
      })
      
      // Load user cases
      .addCase(loadUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.settings = action.payload.settings;
        state.isAuthenticated = true;
      })
      .addCase(loadUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load user';
      })
      
      // Refresh tokens cases
      .addCase(refreshTokensThunk.fulfilled, (state, action) => {
        if (state.user) {
          state.user.access_token = action.payload.accessToken;
          state.user.refresh_token = action.payload.refreshToken;
        }
      })
      .addCase(refreshTokensThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to refresh tokens';
      })
      
      // Update settings cases
      .addCase(updateSettingsThunk.fulfilled, (state, action) => {
        if (state.settings) {
          state.settings = { ...state.settings, ...action.payload };
        }
      })
      .addCase(updateSettingsThunk.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update settings';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

/**
 * @description Selectors for authentication state
 */
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserSettings = (state: { auth: AuthState }) => state.auth.settings;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error; 