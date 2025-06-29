/**
 * @fileoverview Example usage of Redux state management
 * @description Demonstrates how to use auth and inbox slices in components
 */

'use client';

import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  loadUserThunk,
  logout,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
} from '../features/auth/authSlice';
import {
  loadEmailsThunk,
  setFilter,
  selectEmails,
  selectFilteredEmails,
  selectInboxLoading,
} from '../features/inbox/inboxSlice';

/**
 * @description Example component using Redux state management
 * @returns {JSX.Element} Example component
 */
export default function ReduxExample() {
  const dispatch = useAppDispatch();
  
  // Auth selectors
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);
  
  // Inbox selectors
  const emails = useAppSelector(selectEmails);
  const filteredEmails = useAppSelector(selectFilteredEmails);
  const inboxLoading = useAppSelector(selectInboxLoading);

  /**
   * @description Handle user login
   */
  const handleLogin = () => {
    // In real app, this would be called after Firebase Auth success
    dispatch(loadUserThunk('user_uid_from_firebase'));
  };

  /**
   * @description Handle user logout
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  /**
   * @description Load user's emails
   */
  const handleLoadEmails = () => {
    if (user) {
      dispatch(loadEmailsThunk({ userId: user.google_id }));
    }
  };

  /**
   * @description Filter emails by status
   */
  const handleFilterEmails = (status: 'all' | 'draft' | 'sent') => {
    dispatch(setFilter({ status }));
  };

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Not Authenticated</h2>
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {user?.email}</h2>
      
      <div>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleLoadEmails}>Load Emails</button>
      </div>

      <div>
        <h3>Filter Emails:</h3>
        <button onClick={() => handleFilterEmails('all')}>All</button>
        <button onClick={() => handleFilterEmails('draft')}>Drafts</button>
        <button onClick={() => handleFilterEmails('sent')}>Sent</button>
      </div>

      {inboxLoading ? (
        <div>Loading emails...</div>
      ) : (
        <div>
          <h3>Emails ({filteredEmails.length})</h3>
          {filteredEmails.map((email) => (
            <div key={email.gmail_id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h4>{email.subject || 'No Subject'}</h4>
              <p>Status: {email.status}</p>
              <p>{email.original_body.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 