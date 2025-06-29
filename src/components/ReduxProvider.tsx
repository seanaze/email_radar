/**
 * @fileoverview Redux Provider component for Email Radar
 * @description Wraps the app with Redux Provider for state management
 */

'use client';

import { Provider } from 'react-redux';
import { store } from '../state/store';

/**
 * @description Redux Provider wrapper component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider-wrapped children
 */
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
} 