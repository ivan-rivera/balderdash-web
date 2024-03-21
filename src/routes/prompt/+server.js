import { json, error } from '@sveltejs/kit';
import { vocabs, getRandomPair } from '$lib/vocab.js';

/**
 * Retrieve a random prompt-response pair
 * @param {Object} params - request parameters
 * @param {URL} params.url - request URL
 * @returns {Promise<Response>} - a random pair of prompt and response
 * @throws {Error} - failure to retrieve a random pair
 */
export async function GET({ url }) {
	const category = decodeURIComponent(url.searchParams.get('category') || '');
	const vocab = vocabs.find((vocab) => vocab.category === category)?.vocab;
	if (!vocab) error(404, `Category not found: ${category}`);
	return json(getRandomPair(vocab));
}
