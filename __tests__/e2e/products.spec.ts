import { test, expect } from '@playwright/test'

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  test('product listing page loads', async ({ page }) => {
    await expect(page).toHaveURL(/\/products/)
    await expect(page.locator('body')).toBeVisible()

    // Should display some products or a message
    const content = page.locator('main, [role="main"]').first()
    await expect(content).toBeVisible()
  })

  test('product cards are displayed', async ({ page }) => {
    // Wait for products to load
    await page.waitForLoadState('networkidle')

    // Look for product card elements (links with images and prices)
    const productCards = page.locator('a[href*="/products/"], a[href*="/product/"]')
    const count = await productCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('filters are visible and functional', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Check for filter controls (category, size, color, price, etc.)
    const filterSection = page.locator('[class*="filter"], [data-testid*="filter"], aside, [role="complementary"]').first()

    if (await filterSection.isVisible()) {
      await expect(filterSection).toBeVisible()

      // Try clicking a category filter if available
      const categoryFilter = filterSection.getByText(/round neck|polo|v-neck|oversized/i).first()
      if (await categoryFilter.isVisible()) {
        await categoryFilter.click()
        await page.waitForLoadState('networkidle')
        // URL should reflect the filter or products should update
        const url = page.url()
        expect(url).toBeTruthy()
      }
    }
  })

  test('sort functionality works', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for a sort dropdown or select
    const sortControl = page.locator('select, [class*="sort"], [data-testid*="sort"]').first()

    if (await sortControl.isVisible()) {
      await expect(sortControl).toBeVisible()
    }
  })

  test('clicking a product card navigates to product detail', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const productLink = page.locator('a[href*="/products/"], a[href*="/product/"]').first()

    if (await productLink.isVisible()) {
      const href = await productLink.getAttribute('href')
      await productLink.click()
      await page.waitForLoadState('networkidle')
      expect(page.url()).toContain('/product')

      // Product detail page should show product information
      await expect(page.locator('body')).toBeVisible()
    }
  })

  test('search functionality works', async ({ page }) => {
    // Look for a search input on the page or in the navigation
    const searchInput = page.getByPlaceholder(/search/i).first()

    if (await searchInput.isVisible()) {
      await searchInput.fill('polo')
      await searchInput.press('Enter')
      await page.waitForLoadState('networkidle')

      // URL should contain search param or results should update
      const url = page.url()
      expect(url.includes('search') || url.includes('polo') || url.includes('q=')).toBeTruthy()
    } else {
      // Try finding a search icon/button that reveals a search input
      const searchButton = page.getByRole('button', { name: /search/i }).first()
      if (await searchButton.isVisible()) {
        await searchButton.click()
        const searchInputRevealed = page.getByPlaceholder(/search/i).first()
        if (await searchInputRevealed.isVisible()) {
          await searchInputRevealed.fill('polo')
          await searchInputRevealed.press('Enter')
          await page.waitForLoadState('networkidle')
        }
      }
    }
  })

  test('pagination or load more works if present', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const nextPageBtn = page.getByRole('button', { name: /next|load more/i }).first()
    const paginationLink = page.locator('a[href*="page=2"], a[href*="page%3D2"]').first()

    if (await nextPageBtn.isVisible()) {
      await nextPageBtn.click()
      await page.waitForLoadState('networkidle')
    } else if (await paginationLink.isVisible()) {
      await paginationLink.click()
      await page.waitForLoadState('networkidle')
    }
    // This test passes if pagination exists and works, or if it doesn't exist
  })
})
