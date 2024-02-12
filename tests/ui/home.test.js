/**
 * Check the basic aspects of the home page and
 * make sure that the header text shows up and that
 * the button show up
 */

// TODO: add resume button

import { test, expect } from '@playwright/test';
import config from '../../src/lib/config';

const baseUrl = `http://localhost:${config.devPort}`;


test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
});

test('Home page has header', async ({ page }) => {
    const heading = page.locator("h2")
    await expect(heading).toHaveText("Balderdash • /ˈbɔːldədaʃ/");
});

test('should contain the button "Start Game" which navigates to /new', async ({ page }) => {
    await page.waitForSelector('text=Start Game', { state: 'visible' });
    await page.click('text=Start Game');
    await expect(page).toHaveURL(`${baseUrl}/new`);
})

test('should contain the button "Join Game" which navigates to /join', async ({ page }) => {
    await page.waitForSelector('text=Join Game', { state: 'visible' });
    await page.click('text=Join Game');
    await expect(page).toHaveURL(`${baseUrl}/join`);
})

