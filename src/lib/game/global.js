/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { KICKED, ROUNDS, SCOREBOARD, USERNAME } from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';

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
	sm.sessionRef.update(kickPayload);
}
