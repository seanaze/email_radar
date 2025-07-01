/**
 * @fileoverview Redux slice for authentication state management
 * @description Handles user authentication via Supabase and user settings state
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/utils/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * @description User profile interface
 */
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  updated_at?: string;
}

/**
 * @description User settings interface
 */
interface UserSettings {
  suggestion_aggressiveness: number;
  language: string;
  ai_features_enabled: boolean;
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
 * @description Async thunk to load user profile from Supabase
 */
export const loadUserProfile = createAsyncThunk(
  'auth/loadProfile',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as UserProfile;
  }
);

/**
 * @description Async thunk to create/update user profile
 */
export const saveUserProfile = createAsyncThunk(
  'auth/saveProfile',
  async ({ userId, profile }: { userId: string; profile: Partial<UserProfile> }) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profile })
      .select()
      .single();
    
    if (error) throw error;
    return data as UserProfile;
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
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (!action.payload) {
        state.profile = null;
        state.settings = null;
      }
    },
    
    /**
     * @description Clears authentication state
     */
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.settings = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    
    /**
     * @description Updates user settings
     */
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      if (state.settings) {
        state.settings = { ...state.settings, ...action.payload };
      }
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
      // Load profile cases
      .addCase(loadUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load profile';
      })
      
      // Save profile cases
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to save profile';
      });
  },
});

export const { setUser, clearUser, updateSettings, clearError } = authSlice.actions;
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