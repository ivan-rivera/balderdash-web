import { json } from '@sveltejs/kit';
import { refreshVocabs } from '$lib/vocab.js';

/**
 * Refresh the vocabulary
 * @returns {Promise<Response>} - acknowledgement of the vocabulary refresh
 * @throws {Error} - failure to refresh the vocabulary
 */
export async function POST() {
	refreshVocabs();
	return json({ status: 200, body: { message: 'Vocabs refreshed' } });
}
