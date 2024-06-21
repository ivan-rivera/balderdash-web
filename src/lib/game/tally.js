/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { SESSION_STATES } from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';
import admin from 'firebase-admin';
import { client } from '$lib/analytics.js';

/**
 * Proceed after tallying
 * @type {SessionAction}
 */
export async function proceed(cookies, params, request) {
	const { sm } = await parseSessionRequest(cookies, params, request);
	if (sm.session.current === sm.session.limit) {
		client.capture({
			event: 'session_completed',
		});
	}
	const payload =
		sm.session.current === sm.session.limit
			? { state: SESSION_STATES.FINISHED }
			: {
					current: admin.database.ServerValue.increment(1),
					[sm.roundPath.next]: await sm.nextRoundPayload(),
				};
	await sm.sessionRef.update(payload);
}
