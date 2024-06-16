/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { SESSION_STATES } from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';
import admin from 'firebase-admin';

/**
 * Proceed after tallying
 * @type {SessionAction}
 */
export async function proceed(cookies, params, request) {
	const { sm } = await parseSessionRequest(cookies, params, request);
	const payload =
		sm.session.current === sm.session.limit
			? { state: SESSION_STATES.FINISHED }
			: {
					current: admin.database.ServerValue.increment(1),
					[sm.roundPath.next]: sm.nextRoundPayload,
				};
	sm.sessionRef.update(payload);
}
