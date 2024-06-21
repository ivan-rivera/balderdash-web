/**
 * This is an integration test that is designed to test the game flow as a whole. As such it needs
 * to have access to both Firebase and Posthog, so effectively this is treated as a real set of interactions
 *
 * THIS IS AN INCOMPLETE TEST
 */

import { test, firefox } from '@playwright/test';
import { baseUrl } from './utils';

test('Game flow without NPCs', async () => {
	const browser = await firefox.launch({ headless: true });

	// Create 4 browser contexts
	const userP1Context = await browser.newContext();
	const userP2Context = await browser.newContext();
	const userP3Context = await browser.newContext();
	// const userP4Context = await browser.newContext();

	// create a page for each user
	const userP1Page = await userP1Context.newPage();
	const userP2Page = await userP2Context.newPage();
	const userP3Page = await userP3Context.newPage();
	// const userP4Page = await userP4Context.newPage();

	// User A goes to the main page, clicks on "New Game", enters their username and starts the game
	await userP1Page.goto(baseUrl);
	await userP1Page.click('text=Start Game');
	await userP1Page.fill('input[name=username]', 'P1');
	await userP1Page.click('button[type=submit]');
	await userP1Page.waitForTimeout(500);

	// Extract the session ID from the URL
	const userP1Url = new URL(userP1Page.url());
	const sessionId = userP1Url.pathname.split('/')[1];

	// User B goes to the main page, joins the newly created game
	await userP2Page.goto(`${baseUrl}/join?id=${sessionId}`);
	await userP2Page.fill('input[name=username]', 'P2');
	await userP2Page.click('button[type=submit]');
	await userP2Page.waitForTimeout(500);

	await userP3Page.goto(`${baseUrl}/join?id=${sessionId}`);
	await userP3Page.fill('input[name=username]', 'P3');
	await userP3Page.click('button[type=submit]');
	await userP3Page.waitForTimeout(500);

	await browser.close();
});

test('Game flow with NPCs', async ({ browser }) => {});
