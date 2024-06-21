/**
 * @typedef {import("$lib/types").Category} Category
 * @typedef {import("@skeletonlabs/skeleton").ToastStore} ToastStore
 */

import { goto } from '$app/navigation';
import config from '$lib/config';

/** @param {boolean} disabled */
export const getButtonVariant = (disabled) => (disabled ? 'variant-ghost' : 'variant-filled');

/**
 * Get appropriate prompt and response names for a given category
 * @param {Category} category
 */
export function getCategoryWords(category) {
	let targetCategory = config.categories.find((cat) => cat.name === category);
	let prompt = targetCategory?.promptName || '';
	let response = targetCategory?.responseName || '';
	return { prompt, response };
}

/**
 * Convert snake_case to TitleCase
 * @param {string} str
 */
export function toTitleCase(str) {
	return str
		.toLowerCase()
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

/** @param array {any[]} */
export function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

/**
 * Handle error
 * @param {ToastStore} store
 * @param {Error} error
 * @throws {Error} - rethrows the error
 */
export function handleError(store, error) {
	store.trigger({
		message: error.message,
		timeout: config.toastTimeout,
		background: 'variant-filled-error',
	});
}

/**
 * Handle info
 * @param {ToastStore} store
 * @param {string} message
 */
export function handleInfo(store, message) {
	store.trigger({
		message,
		timeout: config.toastTimeout,
		background: 'variant-filled-success',
	});
}

/**
 * Return back home and reset cookies
 * @param {string} username - username
 * @param {string} sessionId - session ID
 */
export function returnHome(username, sessionId) {
	document.cookie = `${username}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'`;
	document.cookie = `${sessionId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'`;
	localStorage.clear();
	goto('/');
}
