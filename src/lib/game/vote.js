/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { CORRECT, DASHER, GUESSES, ROUND_STATES, SCOREBOARD, SELECTED_GROUP, STATE, USERNAME, VOTES } from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';
import { getRoundScores } from '$lib/score';

/**
 * Cast a vote
 * @type {SessionAction}
 */
export async function cast(cookies, params, request) {
    const { form, sm } = await parseSessionRequest(cookies, params, request);
	const group = String(form.get(SELECTED_GROUP));
	const user = String(cookies.get(USERNAME));
	sm.roundRef.update({ [`${VOTES}/${user}`]: group });
}

/**
 * Proceed after voting
 * @type {SessionAction}
 */
export async function proceed(cookies, params, request) {
    const { form, sm } = await parseSessionRequest(cookies, params, request);
	const votes = JSON.parse(String(form.get(VOTES)) || '{}');
	const guesses = JSON.parse(String(form.get(GUESSES)) || '{}');
	const scoreboard = JSON.parse(String(form.get(SCOREBOARD)) || '{}');
	const correct = JSON.parse(String(form.get(CORRECT)) || '[]');
	const dasher = String(form.get(DASHER));
	const scores = getRoundScores(dasher, votes, guesses, correct, scoreboard);
	sm.sessionRef.update({
		[`${SCOREBOARD}`]: scores,
		[`${sm.roundPath.current}/${STATE}`]: ROUND_STATES.TALLY,
	});
}
