/**
 * @fileoverview
 * Auth callback route to handle Supabase OAuth redirects
 */

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    // Redirect to home with error message
    return NextResponse.redirect(
      `${requestUrl.origin}/?auth_error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      if (sessionError) {
        console.error('Error exchanging code for session:', sessionError);
        return NextResponse.redirect(
          `${requestUrl.origin}/?auth_error=${encodeURIComponent(sessionError.message)}`
        );
      }
      
      // Successful authentication - redirect to editor
      return NextResponse.redirect(requestUrl.origin + '/editor');
    } catch (err) {
      console.error('Unexpected error in auth callback:', err);
      return NextResponse.redirect(
        `${requestUrl.origin}/?auth_error=${encodeURIComponent('Authentication failed')}`
      );
    }
  }

  // No code provided - redirect to home
  return NextResponse.redirect(requestUrl.origin);
} 