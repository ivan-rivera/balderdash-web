import { test, expect } from '@playwright/test';
import config from '../../playwright.config'

// @ts-ignore
const baseUrl = `http://localhost:${config.webServer.port}`;
const footerPages = ['About', 'Contact', 'Legal', 'Rules']


test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
});

footerPages.forEach((button) => {
    test(`Test ${button} opens and closes the drawer correctly`, async ({page}) => {
        const selector = `text=${button}`
        await page.waitForSelector(selector, { state: 'visible' });
        await expect(page.locator('h1', { hasText: button })).toHaveCount(0);  // footer modal is closed
        await page.locator(selector).click();
        await expect(page.locator('h1', { hasText: button })).toHaveCount(1); // footer modal is now open
        await page.keyboard.press('Escape');
        await expect(page.locator('h1', { hasText: button })).toHaveCount(0);  // footer modal is closed again
    })
})
