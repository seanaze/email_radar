/**
 * @fileoverview
 * Storage helper functions for uploading and managing files in Supabase Storage
 */

import { supabase } from './supabase';

/**
 * @description Upload an analysis result as a text file
 * @param {string} userId - User's ID for folder organization
 * @param {string} fileContent - Content to save
 * @param {string} filename - Optional custom filename
 * @returns {Promise<{data: any, error: any}>} Upload result
 */
export async function uploadAnalysis(
  userId: string, 
  fileContent: string, 
  filename?: string
): Promise<{data: any, error: any}> {
  const fileName = filename || `analysis-${Date.now()}.txt`;
  
  const { data, error } = await supabase.storage
    .from('analysis-exports')
    .upload(`${userId}/${fileName}`, fileContent, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'text/plain;charset=UTF-8'
    });

  return { data, error };
}

/**
 * @description Upload an email template
 * @param {string} userId - User's ID for folder organization
 * @param {object} template - Template data to save
 * @param {string} templateName - Name of the template
 * @returns {Promise<{data: any, error: any}>} Upload result
 */
export async function uploadTemplate(
  userId: string,
  template: object,
  templateName: string
): Promise<{data: any, error: any}> {
  const fileName = `${templateName}.json`;
  const fileContent = JSON.stringify(template, null, 2);
  
  const { data, error } = await supabase.storage
    .from('email-templates')
    .upload(`${userId}/${fileName}`, fileContent, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'application/json'
    });

  return { data, error };
}

/**
 * @description List user's analysis files
 * @param {string} userId - User's ID
 * @returns {Promise<{data: any, error: any}>} List of files
 */
export async function listAnalysisFiles(userId: string): Promise<{data: any, error: any}> {
  const { data, error } = await supabase.storage
    .from('analysis-exports')
    .list(userId, {
      limit: 100,
      offset: 0,
    });

  return { data, error };
}

/**
 * @description Download an analysis file
 * @param {string} userId - User's ID  
 * @param {string} fileName - File name to download
 * @returns {Promise<{data: any, error: any}>} File data
 */
export async function downloadAnalysisFile(
  userId: string, 
  fileName: string
): Promise<{data: any, error: any}> {
  const { data, error } = await supabase.storage
    .from('analysis-exports')
    .download(`${userId}/${fileName}`);

  return { data, error };
}

/**
 * @description Delete an analysis file
 * @param {string} userId - User's ID
 * @param {string} fileName - File name to delete
 * @returns {Promise<{data: any, error: any}>} Delete result
 */
export async function deleteAnalysisFile(
  userId: string,
  fileName: string  
): Promise<{data: any, error: any}> {
  const { data, error } = await supabase.storage
    .from('analysis-exports')
    .remove([`${userId}/${fileName}`]);

  return { data, error };
} 