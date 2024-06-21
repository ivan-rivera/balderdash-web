/**
 * @typedef {import("$lib/types").Category} Category
 */

import config from '$lib/config';
import {
	DEFAULT_SCORE,
	INITIAL_SESSION_STATE,
	SESSION_ID,
	SESSION_STATES,
	UID,
	USERNAME,
} from '$lib/constants';
import { createNewSessionId, dbRef, validateToken } from '$lib/firebase/server';
import { fail, redirect } from '@sveltejs/kit';
import { enquire } from '$lib/contact.js';
import { client } from '$lib/analytics.js';

/** @type {import('./$types').Actions} */
export const actions = {
	enquire: async ({ cookies, request }) => enquire(cookies, request),
	enter: async ({ cookies, request }) => {
		validateToken(cookies);
		const data = await request.formData();
		const uid = String(cookies.get(UID));
		const creator = String(data.get(USERNAME));
		const limit = Number(data.get('round-slider'));
		const ais = Number(data.get('ai-slider'));
		const categories = config.categories
			.filter((category) => {
				const converted = 'slider-' + category.name.toLowerCase().replace(/ /g, '-');
				return data.get(converted) === 'on';
			})
			.map((category) => /** @type {Category} */ (category.name));
		if (categories.length === 0) {
			return fail(400, { success: false, message: 'Please select at least one category' });
		}
		const newSessionState = {
			...INITIAL_SESSION_STATE,
			state: SESSION_STATES.INITIATED,
			scoreboard: { [creator]: DEFAULT_SCORE },
			uids: { [uid]: true },
			creator,
			limit,
			ais,
			categories,
		};
		const sessionId = await createNewSessionId();
		client.capture({
			event: 'game_created',
		});
		await dbRef.child(sessionId).set(newSessionState);
		cookies.set(USERNAME, creator, { path: '/' });
		cookies.set(SESSION_ID, sessionId, { path: '/' });
		throw redirect(303, `/${sessionId}`);
	},
};
