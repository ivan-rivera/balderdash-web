/**
 * Check the basic aspects of the home page and
 * make sure that the header text shows up and that
 * the button show up
 */

// TODO: add resume button

import { test, expect } from '@playwright/test';
import config from '../../playwright.config' 

// @ts-ignore
const baseUrl = `http://localhost:${config.webServer.port}`;


test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await page.waitForLoadState('networkidle');
});

test('Home page has header', async ({ page }) => {
    const heading = page.locator("h2")
    await expect(heading).toHaveText("Balderdash • /ˈbɔːldədaʃ/");
});

test('should contain the button "Start Game" which navigates to /new', async ({ page }) => {
    const selector = 'text=Start Game'
    await page.waitForSelector(selector, { state: 'visible' });
    await page.locator(selector).click();
    await expect(page).toHaveURL('/new');
})

test('should contain the button "Join Game" which navigates to /join', async ({ page }) => {
    const selector = 'text=Join Game'
    await page.waitForSelector(selector, { state: 'visible' });
    await page.locator(selector).click();
    await expect(page).toHaveURL('/join');
})

