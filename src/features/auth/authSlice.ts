/**
 * @fileoverview Redux slice for authentication state management
 * @description Handles user authentication with Supabase and user settings state
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../utils/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * @description User settings interface
 */
export interface UserSettings {
  suggestion_aggressiveness: number;
  language: string;
  ai_features_enabled: boolean;
}

/**
 * @description User profile interface
 */
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  settings?: UserSettings;
  created_at?: string;
  updated_at?: string;
}

/**
 * @description Authentication state interface
 */
interface AuthState {
  user: User | null;
  profile: UserProfile | null;
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
  profile: null,
  settings: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * @description Async thunk to load user profile and settings
 * @param {string} userId - Supabase user ID
 */
export const loadUserProfile = createAsyncThunk(
  'auth/loadUserProfile',
  async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    return profile as UserProfile;
  }
);

/**
 * @description Async thunk to update user settings
 * @param {Object} payload - Settings update payload
 * @param {string} payload.userId - Supabase user ID
 * @param {Partial<UserSettings>} payload.updates - Settings to update
 */
export const updateSettingsThunk = createAsyncThunk(
  'auth/updateSettings',
  async ({ userId, updates }: { userId: string; updates: Partial<UserSettings> }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ settings: updates })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    
    return data.settings as UserSettings;
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
     * @description Sets the authenticated user
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    
    /**
     * @description Clears the authenticated user
     */
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.settings = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    /**
     * @description Clears authentication state on logout
     */
    logout: (state) => {
      state.user = null;
      state.profile = null;
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
      // Load user profile cases
      .addCase(loadUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.settings = action.payload.settings || null;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load user profile';
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

export const { setUser, clearUser, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

/**
 * @description Selectors for authentication state
 */
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserProfile = (state: { auth: AuthState }) => state.auth.profile;
export const selectUserSettings = (state: { auth: AuthState }) => state.auth.settings;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error; 