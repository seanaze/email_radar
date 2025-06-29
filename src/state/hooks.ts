/**
 * @fileoverview Typed Redux hooks for Email Radar
 * @description Pre-typed versions of useDispatch and useSelector hooks for type safety
 */

import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * @description Typed version of useDispatch hook
 * @returns {AppDispatch} Typed dispatch function
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * @description Typed version of useSelector hook
 * @returns {TypedUseSelectorHook<RootState>} Typed selector hook
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 