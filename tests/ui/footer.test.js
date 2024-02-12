
import { test, expect } from '@playwright/test';
//import { pages } from '../../src/components/footer/content';
import config from '../../src/lib/config';

// test.describe("Test footer UI", () => {
//     test.beforeEach(async ({ page }) => {
//         await page.goto(config.devUrl);
//     });
//     // Object.keys(pages).forEach((button) => {
//     //     test(`Test ${button} opens and closes the drawer correctly`, async ({page}) => {
//     //         const modalHeader = await page.locator('h1', { hasText: button });
//     //         await expect(page.isVisible(`text=${button}`)).toBe(true);
//     //         await expect(modalHeader).not.toBeVisible();
//     //         await page.click(`text=${button}`);
//     //         await expect(modalHeader).toBeVisible();
//     //         await page.keyboard.press('Escape');
//     //         await expect(modalHeader).not.toBeVisible();
//     //     })
//     // })
// })

