/**
 * @typedef {import('$lib/types').Guess} Guess
 * @typedef {import('@sveltejs/kit').Cookies} Cookies
 * @typedef {import('../../routes/[sessionId]/$types').RouteParams} Params
 */

import { GUESSES, NPC } from '$lib/constants';
import { validateToken } from '$lib/firebase/server';
import { SessionManager } from '$lib/session';

/**
 * Action request parsing helper
 * @param {Cookies} cookies
 * @param {Params} params
 * @param {Request} request
 * @returns {Promise<{ form: FormData, sm: SessionManager }>}
 */
export async function parseSessionRequest(cookies, params, request) {
	validateToken(cookies);
	const form = await request.formData();
	const session = JSON.parse(String(form.get('session')) || '{}');
	const sm = new SessionManager(session, params.sessionId);
	return { form, sm };
}

/**
 * Generate incorrect NPC guesses
 * @param {number} count - number of guesses to generate
 * @param {function(): string} generator - guess generator function
 * @returns {Object.<string, Guess>} - generated guesses
 */
export function generateAiGuesses(count, generator) {
	const responses = new Set();
	/** @type {Object.<string, Guess>}*/ const guesses = {};
	for (let i = 0; i < count; i++) {
		let value;
		do {
			value = generator();
		} while (responses.has(value));
		responses.add(value);
		guesses[`${GUESSES}/${NPC}-${i}`] = {
			response: value,
			correct: false,
			double: false,
			group: `NPC ${i}`,
			automatic: true,
		};
	}
	return guesses;
}
