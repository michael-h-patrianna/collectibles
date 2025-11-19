import { test, expect } from '@playwright/test';

test.describe('User Journey: Collectibles Application Flow', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the base URL (Dashboard)
    await page.goto('/');
    // Expect the dashboard title to be visible
    await expect(page.getByTestId('dashboard-title')).toBeVisible();
    await expect(page.getByTestId('navbar-title')).toHaveText('GEMINICOLLECTIBLES');
  });

  test('Journey 1: Navigate from Dashboard to Album and Back', async ({ page }) => {
    // 1. Verify Dashboard elements
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
    await expect(page.getByTestId('dashboard-title')).toHaveText('My Collections');
    
    // Click the first available album card
    const albumCard = page.locator('[data-testid^="album-card-"]').first();
    await expect(albumCard).toBeVisible();
    
    // 2. Click an album card to go to Album View
    await albumCard.click();
    
    // 3. Verify Album View loads correctly
    await expect(page.getByTestId('album-view')).toBeVisible();
    await expect(page.getByTestId('album-header-title')).toHaveText('Realm of Aethelgard');
    await expect(page.getByTestId('album-header-description')).toHaveText('Discover the heroes, beasts, and relics of the shattered kingdom.');
    await expect(page.getByTestId('album-header-completion-percentage')).toBeVisible();
    await expect(page.getByTestId('album-grid')).toBeVisible();
    await expect(page.getByTestId('filter-button-all')).toBeVisible();
    await expect(page.getByTestId('back-to-dashboard-button')).toBeVisible();

    // 4. Navigate back to Dashboard
    await page.getByTestId('back-to-dashboard-button').click();
    
    // 5. Verify Dashboard is visible again
    await expect(page.getByTestId('dashboard-view')).toBeVisible();
    await expect(page.getByTestId('dashboard-title')).toHaveText('My Collections');
    await expect(page.getByTestId('back-to-dashboard-button')).not.toBeVisible(); // Back button should be gone
  });

  test('Journey 2: Open a Pack, Acquire a Card, and Verify Album Update', async ({ page }) => {
    // 1. Go to Album View
    await page.locator('[data-testid^="album-card-"]').first().click();
    await expect(page.getByTestId('album-view')).toBeVisible();

    // Store initial progress
    const initialCompletionText = await page.getByTestId('album-header-completion-percentage').textContent();
    const initialSlotsFilledText = await page.getByTestId('album-header-collected-count').textContent();

    // Assuming initial progress is not 100%
    await expect(page.getByTestId('open-pack-button')).toBeEnabled();

    // Count initial locked cards
    const initialLockedCards = await page.getByTestId('collectible-card-locked').count();

    // 2. Click "OPEN PACK" button
    await page.getByTestId('open-pack-button').click();
    
    // 3. Verify Pack Opener overlay appears
    const packOpenerOverlay = page.getByTestId('pack-opener-overlay');
    await expect(packOpenerOverlay).toBeVisible();
    await expect(packOpenerOverlay.getByTestId('pack-visual')).toBeVisible();
    await expect(packOpenerOverlay.getByText('Tap to Open')).toBeVisible();

    // 4. Click the pack visual to open
    await packOpenerOverlay.getByTestId('pack-visual').click();
    
    // 5. Verify card reveal animation and "New Acquisitions!" text
    await expect(packOpenerOverlay.getByText('New Acquisitions!')).toBeVisible({ timeout: 10000 });
    
    const revealedCardsContainer = packOpenerOverlay.getByTestId('revealed-cards-container');
    await expect(revealedCardsContainer).toBeVisible();
    
    // The mock data and App.tsx are configured to always grant the first missing card (card_dragon initially because index 0 is owned, wait...)
    // Mock Data: ownedCollectibles: ['card_dragon', 'card_sword', 'card_golem', 'card_shield', 'card_scroll']
    // Missing: card_king, card_lich, card_ranger.
    // First missing is card_king.
    // We check that the card name is visible within the overlay
    await expect(packOpenerOverlay.getByText('High King Alaric')).toBeVisible();
    
    // 6. Click "Collect & Continue" button
    await packOpenerOverlay.getByTestId('pack-opener-collect-button').click();
    
    // 7. Verify Pack Opener closes
    await expect(packOpenerOverlay).not.toBeVisible();
    
    // 8. Verify Album View is visible again and progress has updated
    await expect(page.getByTestId('album-view')).toBeVisible();
    
    // Verify completion percentage and collected count have increased
    const updatedCompletionText = await page.getByTestId('album-header-completion-percentage').textContent();
    const updatedSlotsFilledText = await page.getByTestId('album-header-collected-count').textContent();

    expect(updatedCompletionText).not.toEqual(initialCompletionText);
    expect(updatedSlotsFilledText).not.toEqual(initialSlotsFilledText);

    // Verify one less locked card
    const updatedLockedCards = await page.getByTestId('collectible-card-locked').count();
    expect(updatedLockedCards).toBeLessThan(initialLockedCards);
  });

  test('Journey 3: View Collectible Details Modal and Close', async ({ page }) => {
    // 1. Go to Album View
    await page.locator('[data-testid^="album-card-"]').first().click();
    await expect(page.getByTestId('album-view')).toBeVisible();

    // 2. Click on an owned collectible card (e.g., Ignis)
    const dragonCard = page.getByTestId('collectible-card-card_dragon');
    await expect(dragonCard).toBeVisible();
    await expect(dragonCard.getByTestId('collectible-card-name')).toHaveText('Ignis, the World Burner');
    await dragonCard.click();
    
    // 3. Verify Collectible Modal opens and displays correct information
    const collectibleModal = page.getByTestId('collectible-modal-overlay');
    await expect(collectibleModal).toBeVisible();
    await expect(collectibleModal.getByTestId('modal-collectible-name')).toHaveText('Ignis, the World Burner');
    await expect(collectibleModal.getByTestId('modal-collectible-description')).toBeVisible();
    await expect(collectibleModal.getByTestId('modal-collectible-rarity')).toHaveText('legendary');
    
    // 4. Click the backdrop to close the modal
    await page.getByTestId('collectible-modal-backdrop').click({ position: { x: 10, y: 10 } });
    
    // 5. Verify modal is closed
    await expect(collectibleModal).not.toBeVisible();
    await expect(page.getByTestId('album-view')).toBeVisible(); // Ensure we are back on album view
  });
});
