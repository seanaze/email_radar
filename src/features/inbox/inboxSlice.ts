/**
 * @fileoverview Redux slice for inbox and email state management
 * @description Handles email list, current email editing, and email operations
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../utils/supabase';

/**
 * @description Email interface
 */
export interface Email {
  id: string;
  user_id: string;
  gmail_id: string;
  thread_id?: string;
  subject?: string;
  sender?: string;
  recipients?: string[];
  original_body: string;
  corrected_body?: string;
  suggestions?: any[];
  status: 'draft' | 'sent' | 'processing';
  created_at: string;
  updated_at: string;
}

/**
 * @description Inbox state interface
 */
interface InboxState {
  emails: Email[];
  currentEmail: Email | null;
  isLoading: boolean;
  isLoadingEmail: boolean;
  isSaving: boolean;
  error: string | null;
  filters: {
    status: 'all' | 'draft' | 'sent' | 'processing';
    searchQuery: string;
  };
}

/**
 * @description Initial inbox state
 */
const initialState: InboxState = {
  emails: [],
  currentEmail: null,
  isLoading: false,
  isLoadingEmail: false,
  isSaving: false,
  error: null,
  filters: {
    status: 'all',
    searchQuery: '',
  },
};

/**
 * @description Async thunk to load user's emails
 * @param {Object} payload - Load emails payload
 * @param {string} payload.userId - User's Supabase Auth UID
 * @param {number} payload.maxResults - Maximum number of emails to return
 */
export const loadEmailsThunk = createAsyncThunk(
  'inbox/loadEmails',
  async ({ userId, maxResults = 50 }: { userId: string; maxResults?: number }) => {
    const { data: emails, error } = await supabase
      .from('emails')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(maxResults);

    if (error) throw error;
    
    return emails as Email[];
  }
);

/**
 * @description Async thunk to load a specific email
 * @param {string} emailId - Email ID
 */
export const loadEmailThunk = createAsyncThunk(
  'inbox/loadEmail',
  async (emailId: string) => {
    const { data: email, error } = await supabase
      .from('emails')
      .select('*')
      .eq('id', emailId)
      .single();

    if (error) throw error;
    
    return email as Email;
  }
);

/**
 * @description Async thunk to create a new email
 * @param {Object} payload - Create email payload
 * @param {Omit<Email, 'id' | 'created_at' | 'updated_at'>} payload.emailData - Email data to store
 */
export const createEmailThunk = createAsyncThunk(
  'inbox/createEmail',
  async ({ emailData }: { emailData: Omit<Email, 'id' | 'created_at' | 'updated_at'> }) => {
    const { data: email, error } = await supabase
      .from('emails')
      .insert(emailData)
      .select()
      .single();

    if (error) throw error;
    
    return email as Email;
  }
);

/**
 * @description Async thunk to update an email
 * @param {Object} payload - Update email payload
 * @param {string} payload.emailId - Email ID
 * @param {Partial<Email>} payload.updates - Email fields to update
 */
export const updateEmailThunk = createAsyncThunk(
  'inbox/updateEmail',
  async ({ emailId, updates }: { emailId: string; updates: Partial<Email> }) => {
    const { data: email, error } = await supabase
      .from('emails')
      .update(updates)
      .eq('id', emailId)
      .select()
      .single();

    if (error) throw error;
    
    return email as Email;
  }
);

/**
 * @description Inbox Redux slice
 */
const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {
    /**
     * @description Sets the current email filter
     */
    setFilter: (state, action: PayloadAction<Partial<InboxState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    /**
     * @description Clears the current email
     */
    clearCurrentEmail: (state) => {
      state.currentEmail = null;
    },
    
    /**
     * @description Clears any inbox errors
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * @description Updates the current email's body locally (for real-time editing)
     */
    updateCurrentEmailBody: (state, action: PayloadAction<{ 
      field: 'original_body' | 'corrected_body';
      value: string;
    }>) => {
      if (state.currentEmail) {
        state.currentEmail[action.payload.field] = action.payload.value;
      }
    },

    /**
     * @description Sets the current email for editing
     */
    setCurrentEmail: (state, action: PayloadAction<Email>) => {
      state.currentEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load emails cases
      .addCase(loadEmailsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadEmailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emails = action.payload;
      })
      .addCase(loadEmailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load emails';
      })
      
      // Load email cases
      .addCase(loadEmailThunk.pending, (state) => {
        state.isLoadingEmail = true;
        state.error = null;
      })
      .addCase(loadEmailThunk.fulfilled, (state, action) => {
        state.isLoadingEmail = false;
        state.currentEmail = action.payload;
      })
      .addCase(loadEmailThunk.rejected, (state, action) => {
        state.isLoadingEmail = false;
        state.error = action.error.message || 'Failed to load email';
      })
      
      // Create email cases
      .addCase(createEmailThunk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createEmailThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        state.emails.unshift(action.payload);
        state.currentEmail = action.payload;
      })
      .addCase(createEmailThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to create email';
      })
      
      // Update email cases
      .addCase(updateEmailThunk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateEmailThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        
        // Update email in list
        const emailIndex = state.emails.findIndex(
          email => email.id === action.payload.id
        );
        if (emailIndex !== -1) {
          state.emails[emailIndex] = action.payload;
        }
        
        // Update current email if it matches
        if (state.currentEmail && state.currentEmail.id === action.payload.id) {
          state.currentEmail = action.payload;
        }
      })
      .addCase(updateEmailThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.error.message || 'Failed to update email';
      });
  },
});

export const {
  setFilter,
  clearCurrentEmail,
  clearError,
  updateCurrentEmailBody,
  setCurrentEmail,
} = inboxSlice.actions;

export default inboxSlice.reducer;

/**
 * @description Selectors for inbox state
 */
export const selectEmails = (state: { inbox: InboxState }) => state.inbox.emails;
export const selectCurrentEmail = (state: { inbox: InboxState }) => state.inbox.currentEmail;
export const selectInboxLoading = (state: { inbox: InboxState }) => state.inbox.isLoading;
export const selectEmailLoading = (state: { inbox: InboxState }) => state.inbox.isLoadingEmail;
export const selectInboxSaving = (state: { inbox: InboxState }) => state.inbox.isSaving;
export const selectInboxError = (state: { inbox: InboxState }) => state.inbox.error;
export const selectInboxFilters = (state: { inbox: InboxState }) => state.inbox.filters;

/**
 * @description Filtered emails selector
 */
export const selectFilteredEmails = (state: { inbox: InboxState }) => {
  const { emails, filters } = state.inbox;
  
  return emails.filter(email => {
    // Filter by status
    if (filters.status !== 'all' && email.status !== filters.status) {
      return false;
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        email.subject?.toLowerCase().includes(query) ||
        email.original_body.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
}; 