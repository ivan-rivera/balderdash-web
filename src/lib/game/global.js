/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { FEEDBACK, KICKED, ROUNDS, SCOREBOARD, UID, USERNAME } from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';
import { contactRef } from '$lib/firebase/server.js';

/**
 * Kick player from session
 * @type {SessionAction}
 */
export async function kick(cookies, params, request) {
	const { form, sm } = await parseSessionRequest(cookies, params, request);
	const kicker = String(cookies.get(USERNAME));
	const kicked = String(form.get(KICKED));
	const kickPayload = {
		kicked: { [kicked]: kicker },
		[`${SCOREBOARD}/${kicked}`]: null,
		[`${ROUNDS}/${sm.session.current}`]: {
			...sm.nextRoundPayload,
			dasher: sm.getNextDasher([kicked]),
		},
	};
	await sm.sessionRef.update(kickPayload);
}

/**
 * Submit feedback
 * @type {SessionAction}
 */
export async function feedback(cookies, params, request) {
	const { form } = await parseSessionRequest(cookies, params, request);
	const uid = String(cookies.get(UID));
	const feedback = form.get(FEEDBACK);
	await contactRef.child(FEEDBACK).update({ [params.sessionId]: { uid, feedback } });
}
