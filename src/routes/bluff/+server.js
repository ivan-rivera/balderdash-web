import { json, error } from '@sveltejs/kit';
import { vocabs, getPhonyResponse } from '$lib/vocab.js';

/**
 * Retrieve a phony response to a prompt
 * @param {Object} params - request parameters
 * @param {URL} params.url - request URL
 * @returns {Promise<Response>} - a phony response
 * @throws {Error} - failure to retrieve a phony response
 */
export async function GET({ url }) {
	const category = decodeURIComponent(url.searchParams.get('category') || '');
	const prompt = decodeURIComponent(url.searchParams.get('prompt') || '');
	const vocab = vocabs.find((vocab) => vocab.category === category)?.vocab;
	if (!vocab) error(404, `Category not found: ${category}`);
	if (!prompt) error(400, `Invalid prompt: ${prompt}`);
	return json(getPhonyResponse(vocab, prompt));
}
