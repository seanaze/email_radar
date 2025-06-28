/**
 * @fileoverview E2E test for Email Radar landing page
 * @description Tests basic landing page functionality and accessibility
 */

import { test, expect } from '@playwright/test'

/**
 * @description Test suite for landing page functionality
 */
test.describe('Landing Page', () => {
  /**
   * @description Verifies landing page loads and displays correctly
   */
  test('should display landing page with correct title', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/Email Radar/)
    
    // Check main heading
    const heading = page.getByRole('heading', { name: 'Email Radar' })
    await expect(heading).toBeVisible()
    
    // Check sign-in button
    const signInButton = page.getByRole('button', { name: 'Sign in with Google' })
    await expect(signInButton).toBeVisible()
  })

  /**
   * @description Verifies accessibility compliance
   */
  test('should meet accessibility standards', async ({ page }) => {
    await page.goto('/')
    
    // Check for proper heading structure
    const mainHeading = page.getByRole('heading', { level: 1 })
    await expect(mainHeading).toBeVisible()
    
    // Check button accessibility
    const signInButton = page.getByRole('button', { name: 'Sign in with Google' })
    await expect(signInButton).toBeVisible()
    await expect(signInButton).toBeEnabled()
  })
}) 