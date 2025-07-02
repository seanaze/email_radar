/**
 * @fileoverview
 * E2E tests for the editor page functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Email Editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
  });

  test('should display editor interface correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Email Radar/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Email Analyzer');
    
    // Check editor is present
    const editor = page.locator('.ProseMirror');
    await expect(editor).toBeVisible();
    
    // Check word counter shows 0
    await expect(page.locator('text=0 Words')).toBeVisible();
    await expect(page.locator('text=0 Characters')).toBeVisible();
    
    // Check analyze button is disabled initially
    const analyzeButton = page.locator('button:has-text("Analyze Text")');
    await expect(analyzeButton).toBeDisabled();
  });

  test('should enable analyze button when text is entered', async ({ page }) => {
    // Type text in editor
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.type('Hello, this is a test email.');
    
    // Check word counter updates
    await expect(page.locator('text=6 Words')).toBeVisible();
    
    // Check analyze button is enabled
    const analyzeButton = page.locator('button:has-text("Analyze Text")');
    await expect(analyzeButton).toBeEnabled();
  });

  test('should show sample templates', async ({ page }) => {
    // Check sample template buttons exist
    await expect(page.locator('button:has-text("Business Email")')).toBeVisible();
    await expect(page.locator('button:has-text("Cover Letter")')).toBeVisible();
    await expect(page.locator('button:has-text("Thank You Note")')).toBeVisible();
    
    // Click business email template
    await page.locator('button:has-text("Business Email")').click();
    
    // Wait for editor to update
    await page.waitForTimeout(500);
    
    // Check that text was added to editor
    const editorText = await page.locator('.ProseMirror').textContent();
    expect(editorText).toContain('Dear');
    expect(editorText).toContain('Best regards');
  });

  test('should show receiver modal on analyze click', async ({ page }) => {
    // Type text in editor
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await editor.type('Please review the attached document.');
    
    // Click analyze button
    await page.locator('button:has-text("Analyze Text")').click();
    
    // Check modal appears
    await expect(page.locator('text="Who\'s receiving this email?"')).toBeVisible();
    
    // Check all questions are present
    await expect(page.locator('text="1. Relationship with recipient:"')).toBeVisible();
    await expect(page.locator('text="2. Their likely attitude:"')).toBeVisible();
    await expect(page.locator('text="3. Expected formality:"')).toBeVisible();
    
    // Check default selections
    await expect(page.locator('button:has-text("Doesn\'t know me").border-primary-500')).toBeVisible();
    await expect(page.locator('button:has-text("Neutral").border-primary-500')).toBeVisible();
    await expect(page.locator('button:has-text("Formal").border-primary-500')).toBeVisible();
  });

  test('should show keyboard shortcuts help', async ({ page }) => {
    // Check keyboard shortcuts button is visible
    const shortcutsButton = page.locator('button[title="Keyboard shortcuts"]');
    await expect(shortcutsButton).toBeVisible();
    
    // Click to open shortcuts
    await shortcutsButton.click();
    
    // Check modal appears
    await expect(page.locator('text="Keyboard Shortcuts"')).toBeVisible();
    
    // Check shortcuts are listed
    await expect(page.locator('text="Analyze text"')).toBeVisible();
    await expect(page.locator('text="Undo"')).toBeVisible();
    await expect(page.locator('text="Redo"')).toBeVisible();
    
    // Close modal
    await page.keyboard.press('Escape');
    await expect(page.locator('text="Keyboard Shortcuts"')).not.toBeVisible();
  });
}); 