const { test, expect } = require('@playwright/test');

/**
 * E2E Tests for Voting Flow
 * Tests the complete voting interaction on the roadmap page
 */

test.describe('Voting Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to roadmap page
    await page.goto('/roadmap.html');

    // Wait for features to load
    await page.waitForSelector('.feature-card', { timeout: 10000 });
  });

  test('should display feature cards with vote buttons', async ({ page }) => {
    // Verify features are displayed
    const featureCards = await page.locator('.feature-card').count();
    expect(featureCards).toBeGreaterThan(0);

    // Verify first feature has vote button
    const firstCard = page.locator('.feature-card').first();
    const voteButton = firstCard.locator('button:has-text("Vote")');
    await expect(voteButton).toBeVisible();
  });

  test('should vote for a feature successfully', async ({ page }) => {
    // Clear localStorage to ensure clean state
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.feature-card');

    // Find first unvoted feature
    const voteButton = page.locator('button:has-text("Vote")').first();

    // Get initial vote count
    const featureCard = page.locator('.feature-card').first();
    const initialVotesText = await featureCard.locator('.vote-count').textContent();
    const initialVotes = parseInt(initialVotesText);

    // Click vote button
    await voteButton.click();

    // Wait for button to change to "Voted" state
    await expect(voteButton).toHaveClass(/voted/);
    await expect(voteButton).toContainText('✅ Voted');

    // Verify vote count increased
    const newVotesText = await featureCard.locator('.vote-count').textContent();
    const newVotes = parseInt(newVotesText);
    expect(newVotes).toBe(initialVotes + 1);

    // Verify button is disabled (can't vote again)
    await expect(voteButton).toBeDisabled();
  });

  test('should prevent duplicate votes on same feature', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.feature-card');

    const voteButton = page.locator('button:has-text("Vote")').first();

    // First vote
    await voteButton.click();
    await expect(voteButton).toHaveClass(/voted/);

    // Try to vote again (button should be disabled)
    await expect(voteButton).toBeDisabled();

    // Reload page and verify vote persists
    await page.reload();
    await page.waitForSelector('.feature-card');

    // Button should still show voted state
    const reloadedButton = page.locator('.feature-card').first().locator('button');
    await expect(reloadedButton).toHaveClass(/voted/);
    await expect(reloadedButton).toContainText('✅ Voted');
  });

  test('should unvote successfully', async ({ page }) => {
    // Clear localStorage and vote first
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.feature-card');

    const firstCard = page.locator('.feature-card').first();
    const voteButton = firstCard.locator('button').first();

    // Vote
    if (await voteButton.textContent() === 'Vote') {
      await voteButton.click();
      await expect(voteButton).toHaveClass(/voted/);
    }

    // Get vote count after voting
    const votedCountText = await firstCard.locator('.vote-count').textContent();
    const votedCount = parseInt(votedCountText);

    // Unvote
    await voteButton.click();

    // Wait for button to return to normal state
    await expect(voteButton).not.toHaveClass(/voted/);
    await expect(voteButton).toContainText('Vote');
    await expect(voteButton).not.toBeDisabled();

    // Verify vote count decreased
    const finalCountText = await firstCard.locator('.vote-count').textContent();
    const finalCount = parseInt(finalCountText);
    expect(finalCount).toBe(votedCount - 1);
  });

  test('should handle vote errors gracefully', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.feature-card');

    // Intercept vote API call and make it fail
    await page.route('**/exec?action=vote*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Server error'
        })
      });
    });

    const voteButton = page.locator('button:has-text("Vote")').first();
    const featureCard = page.locator('.feature-card').first();

    // Get initial vote count
    const initialVotesText = await featureCard.locator('.vote-count').textContent();
    const initialVotes = parseInt(initialVotesText);

    // Try to vote (should fail)
    await voteButton.click();

    // Wait a moment for error handling
    await page.waitForTimeout(500);

    // Button should return to normal state (not voted)
    await expect(voteButton).not.toHaveClass(/voted/);
    await expect(voteButton).toContainText('Vote');

    // Vote count should be rolled back to initial
    const finalVotesText = await featureCard.locator('.vote-count').textContent();
    const finalVotes = parseInt(finalVotesText);
    expect(finalVotes).toBe(initialVotes);

    // Error message should be displayed
    const errorMessage = featureCard.locator('.vote-error-message');
    await expect(errorMessage).toBeVisible();
  });

  test('should show loading state while voting', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.feature-card');

    // Slow down network to see loading state
    await page.route('**/exec?action=vote*', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });

    const voteButton = page.locator('button:has-text("Vote")').first();

    // Click vote
    await voteButton.click();

    // Should show loading state
    await expect(voteButton).toHaveClass(/loading/);

    // Wait for vote to complete
    await expect(voteButton).toHaveClass(/voted/, { timeout: 5000 });
  });

  test('should maintain vote state across page navigation', async ({ page }) => {
    // Clear localStorage and vote
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('.feature-card');

    const firstCard = page.locator('.feature-card').first();
    const featureTitle = await firstCard.locator('h3').textContent();
    const voteButton = firstCard.locator('button').first();

    // Vote if not already voted
    if (await voteButton.textContent() === 'Vote') {
      await voteButton.click();
      await expect(voteButton).toHaveClass(/voted/);
    }

    // Navigate away and back
    await page.goto('/index.html');
    await page.goto('/roadmap.html');
    await page.waitForSelector('.feature-card');

    // Find same feature and verify vote state persists
    const cards = page.locator('.feature-card');
    const cardCount = await cards.count();

    let foundVoted = false;
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const title = await card.locator('h3').textContent();
      if (title === featureTitle) {
        const button = card.locator('button').first();
        await expect(button).toHaveClass(/voted/);
        foundVoted = true;
        break;
      }
    }

    expect(foundVoted).toBe(true);
  });
});
