import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('dashboard-title')).toBeVisible();
  });

  test('Dashboard should not have any automatically detectable accessibility issues', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Album View should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Wait for any album card to be visible to ensure list is rendered
    await expect(page.locator('[data-testid^="album-card-"]').first()).toBeVisible();
    
    // Try clicking the first one found, whatever it is
    await page.locator('[data-testid^="album-card-"]').first().click();
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
