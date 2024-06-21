/**
 * In order to refresh you need to run curl -i -X POST https://localhost:5173/refresh?password=yourpassword
 */

import { REFRESH_PASSWORD } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { refreshVocabs } from '$lib/vocab.js';

/**
 * Refresh the vocabulary
 * @returns {Promise<Response>} - acknowledgement of the vocabulary refresh
 * @throws {Error} - failure to refresh the vocabulary
 */
export async function POST({ url }) {
	if ((url.searchParams.get('password') || '') !== REFRESH_PASSWORD)
		return json({ status: 401, body: { message: 'Unauthorized' } });
	await refreshVocabs();
	return json({ status: 200, body: { message: 'Vocabs refreshed' } });
}
