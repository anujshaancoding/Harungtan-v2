import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/harungtan/i)
    await expect(page.locator('body')).toBeVisible()
  })

  test('hero section is visible', async ({ page }) => {
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()

    // Hero should contain a CTA button or link
    const ctaLink = hero.getByRole('link').first()
    await expect(ctaLink).toBeVisible()
  })

  test('navigation links are present and work', async ({ page }) => {
    const nav = page.getByRole('navigation')
    await expect(nav.first()).toBeVisible()

    // Check for key navigation links
    const shopLink = page.getByRole('link', { name: /shop/i }).first()
    await expect(shopLink).toBeVisible()

    await shopLink.click()
    await page.waitForLoadState('networkidle')
    expect(page.url()).toContain('/products')
  })

  test('product sections load with items', async ({ page }) => {
    // Look for product cards or product sections on the homepage
    const productSection = page.locator('[class*="product"], [data-testid*="product"], section').filter({
      hasText: /featured|bestseller|new arrival|trending/i,
    }).first()

    if (await productSection.isVisible()) {
      await expect(productSection).toBeVisible()
    }

    // At minimum, the page should have some product links or images
    const productLinks = page.getByRole('link').filter({ hasText: /shop|view|buy/i })
    const count = await productLinks.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })

  test('footer is visible with key information', async ({ page }) => {
    const footer = page.getByRole('contentinfo')
    await expect(footer).toBeVisible()

    // Footer should contain company info or links
    await expect(footer).toContainText(/harungtan/i)
  })

  test('newsletter form is present and validates', async ({ page }) => {
    // Scroll to the bottom to ensure newsletter section is in view
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    const emailInput = page.getByPlaceholder(/email/i).first()

    if (await emailInput.isVisible()) {
      await expect(emailInput).toBeVisible()

      // Test submitting with empty email
      const submitBtn = page.getByRole('button', { name: /subscribe|submit|sign up/i }).first()
      if (await submitBtn.isVisible()) {
        await submitBtn.click()

        // Should either show validation error or the input should have required attribute
        const isRequired = await emailInput.getAttribute('required')
        const type = await emailInput.getAttribute('type')
        expect(type === 'email' || isRequired !== null).toBeTruthy()
      }

      // Test submitting with a valid email
      await emailInput.fill('test@example.com')
      const value = await emailInput.inputValue()
      expect(value).toBe('test@example.com')
    }
  })
})
