import { test } from '@playwright/test';
import { baseUrl } from './utils';

test('Send a message through the Contact form', async ({ page }) => {
	// Go to the main page of your application
	await page.goto(baseUrl);

	// Click on the "Contact" link in the footer
	await page.click('text=Contact');

	// Fill out the email and message fields
	await page.fill('input[name=identity]', 'test@example.com');
	await page.fill('textarea[name=enquiry]', 'Test message');

	// Click the submit button
	await page.click('button[type=submit]');

	// Check that a toast with the text "Message sent!" appears
	await page.waitForSelector('text=Message sent!');
});
