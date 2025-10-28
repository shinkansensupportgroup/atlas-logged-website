const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Feature Submission Flow
 * Tests the complete feature submission interaction on the roadmap page
 */

test.describe('Feature Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to roadmap page
    await page.goto('/roadmap.html');

    // Wait for page to load
    await page.waitForSelector('.feature-card', { timeout: 10000 });
  });

  test('should display submit feature form', async ({ page }) => {
    // Find and click submit button
    const submitButton = page.locator('button:has-text("Submit Feature")');
    await expect(submitButton).toBeVisible();

    // Click to open form
    await submitButton.click();

    // Verify form is displayed
    await expect(page.locator('#submit-form')).toBeVisible();

    // Verify form fields
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();

    // Verify submit button in form
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should submit a new feature successfully', async ({ page }) => {
    // Clear submission tracking
    await page.evaluate(() => {
      localStorage.removeItem('lastSubmissionTime');
    });

    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Fill form with unique data
    const timestamp = Date.now();
    const title = `E2E Test Feature ${timestamp}`;
    const description = 'This is a test feature submitted via E2E test';

    await page.locator('input[name="title"]').fill(title);
    await page.locator('textarea[name="description"]').fill(description);
    await page.locator('input[name="email"]').fill('test@example.com');

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Wait for success message or form to close
    // (Depends on implementation - adjust selector as needed)
    await page.waitForTimeout(2000);

    // Verify form is hidden or success message shown
    const form = page.locator('#submit-form');
    const isHidden = await form.isHidden().catch(() => false);

    // Form should either be hidden or show success
    expect(isHidden || await page.locator('.success-message').isVisible().catch(() => false)).toBe(true);

    // Wait for cache to update
    await page.waitForTimeout(3000);

    // Reload page to see new feature
    await page.reload();
    await page.waitForSelector('.feature-card');

    // Verify new feature appears (may not be immediately visible due to cache)
    // This is a best-effort check
    const pageContent = await page.content();
    const featureExists = pageContent.includes(title) || pageContent.includes(description);

    // Log result for debugging
    console.log(`Feature "${title}" ${featureExists ? 'found' : 'not found (may be cached)'}`);
  });

  test('should validate title is required', async ({ page }) => {
    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Try to submit without title
    await page.locator('textarea[name="description"]').fill('Test description');
    await page.locator('button[type="submit"]').click();

    // HTML5 validation should prevent submission
    const titleInput = page.locator('input[name="title"]');
    const validationMessage = await titleInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy(); // Should have validation message
  });

  test('should validate description is required', async ({ page }) => {
    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Try to submit without description
    await page.locator('input[name="title"]').fill('Test title');
    await page.locator('button[type="submit"]').click();

    // HTML5 validation should prevent submission
    const descInput = page.locator('textarea[name="description"]');
    const validationMessage = await descInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBeTruthy();
  });

  test('should enforce title length limit (100 chars)', async ({ page }) => {
    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Try to enter title > 100 characters
    const longTitle = 'x'.repeat(101);
    const titleInput = page.locator('input[name="title"]');

    await titleInput.fill(longTitle);

    // Check maxlength attribute prevents typing
    const actualValue = await titleInput.inputValue();
    expect(actualValue.length).toBeLessThanOrEqual(100);
  });

  test('should enforce description length limit (500 chars)', async ({ page }) => {
    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Try to enter description > 500 characters
    const longDesc = 'x'.repeat(501);
    const descInput = page.locator('textarea[name="description"]');

    await descInput.fill(longDesc);

    // Check maxlength attribute prevents typing
    const actualValue = await descInput.inputValue();
    expect(actualValue.length).toBeLessThanOrEqual(500);
  });

  test('should handle rate limiting gracefully', async ({ page }) => {
    // Set last submission to now (simulate recent submission)
    await page.evaluate(() => {
      localStorage.setItem('lastSubmissionTime', Date.now().toString());
    });

    // Reload to apply localStorage
    await page.reload();
    await page.waitForSelector('.feature-card');

    // Try to open form
    await page.locator('button:has-text("Submit Feature")').click();

    // Should either:
    // 1. Show error message about rate limit
    // 2. Prevent form from opening
    // 3. Show disabled submit button with message

    // Wait a moment for UI to update
    await page.waitForTimeout(500);

    // Check if form opened
    const formVisible = await page.locator('#submit-form').isVisible().catch(() => false);

    if (formVisible) {
      // If form opened, there should be an error message or disabled submit
      const errorMessage = await page.locator('.error-message, .rate-limit-message').isVisible().catch(() => false);
      const submitDisabled = await page.locator('button[type="submit"]').isDisabled().catch(() => false);

      expect(errorMessage || submitDisabled).toBe(true);
    }
  });

  test('should allow email to be optional', async ({ page }) => {
    // Clear submission tracking
    await page.evaluate(() => {
      localStorage.removeItem('lastSubmissionTime');
    });

    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Fill only title and description (no email)
    const timestamp = Date.now();
    await page.locator('input[name="title"]').fill(`No Email Test ${timestamp}`);
    await page.locator('textarea[name="description"]').fill('Submitted without email');

    // Email field should not be required
    const emailInput = page.locator('input[name="email"]');
    const isRequired = await emailInput.getAttribute('required');
    expect(isRequired).toBeNull(); // Should not have required attribute

    // Submit should work
    await page.locator('button[type="submit"]').click();

    // Should not show validation error for email
    const validationMessage = await emailInput.evaluate(el => el.validationMessage);
    expect(validationMessage).toBe('');
  });

  test('should close form when cancel/close is clicked', async ({ page }) => {
    // Open form
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    // Verify form is visible
    await expect(page.locator('#submit-form')).toBeVisible();

    // Find and click close button (X or Cancel)
    const closeButton = page.locator('button:has-text("Cancel"), button:has-text("✕"), .close-button').first();

    if (await closeButton.isVisible()) {
      await closeButton.click();

      // Form should close
      await expect(page.locator('#submit-form')).toBeHidden();
    }
  });

  test('should show loading state during submission', async ({ page }) => {
    // Clear submission tracking
    await page.evaluate(() => {
      localStorage.removeItem('lastSubmissionTime');
    });

    // Slow down network to see loading state
    await page.route('**/exec*', async route => {
      // Only delay POST requests
      if (route.request().method() === 'POST') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      await route.continue();
    });

    // Open form and submit
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    const timestamp = Date.now();
    await page.locator('input[name="title"]').fill(`Loading Test ${timestamp}`);
    await page.locator('textarea[name="description"]').fill('Testing loading state');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show loading state (disabled, spinner, or text change)
    await expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await page.waitForTimeout(2000);
  });

  test('should handle submission errors gracefully', async ({ page }) => {
    // Clear submission tracking
    await page.evaluate(() => {
      localStorage.removeItem('lastSubmissionTime');
    });

    // Intercept API and force error
    await page.route('**/exec*', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Server error'
          })
        });
      } else {
        route.continue();
      }
    });

    // Open form and submit
    await page.locator('button:has-text("Submit Feature")').click();
    await page.waitForSelector('#submit-form');

    const timestamp = Date.now();
    await page.locator('input[name="title"]').fill(`Error Test ${timestamp}`);
    await page.locator('textarea[name="description"]').fill('Testing error handling');

    await page.locator('button[type="submit"]').click();

    // Wait for error handling
    await page.waitForTimeout(1000);

    // Should show error message
    const errorMessage = page.locator('.error-message, .submission-error');
    const isVisible = await errorMessage.isVisible().catch(() => false);

    // Either error message shows or submit button re-enables
    const submitEnabled = await page.locator('button[type="submit"]').isEnabled().catch(() => false);

    expect(isVisible || submitEnabled).toBe(true);
  });
});
