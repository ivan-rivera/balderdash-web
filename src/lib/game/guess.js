/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */
import {
	DEFAULT_GUESS,
	DOUBLE_BLUFF,
	GUESS,
	GUESSES,
	INTERRUPTION,
	STATE,
	ROUND_STATES,
	USERNAME,
} from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';
import { getRoundScores } from '$lib/score';
import { SessionManager } from '$lib/session';

/**
 * Submit a guess
 * @type {SessionAction}
 */
export async function submit(cookies, params, request) {
	const { form, sm } = await parseSessionRequest(cookies, params, request);
	const submission = String(form.get(GUESS));
	const doubleBluff = Boolean(form.get(DOUBLE_BLUFF));
	const user = String(cookies.get(USERNAME));
	const payload = { ...DEFAULT_GUESS, response: submission, double: doubleBluff };
	sm.roundRef.update({ [`${GUESSES}/${user}`]: payload });
}

/**
 * Proceed after guess submission
 * @type {SessionAction}
 */
export async function proceed(cookies, params, request) {
	const { sm } = await parseSessionRequest(cookies, params, request);
	const updates = guessesExist(sm) ? getContinuationPayload(sm) : getTerminatationPayload(sm);
	sm.sessionRef.update(updates);
}

/**
 * Check whether a guess exists
 * @param {SessionManager} sm - session manager
 * @returns {boolean} - whether guesses exist
 */
function guessesExist(sm) {
	return Object.keys(sm.round.guesses ?? {}).length > 0;
}

/**
 * Get the payload in case of an early termination
 * @param {SessionManager} sm - session manager
 * @returns {Object<string, any>} - payload
 */
function getTerminatationPayload(sm) {
	const roundPath = sm.roundPath.current;
	const scores = getRoundScores(sm.round.dasher, {}, {}, [], sm.session.scoreboard);
	const interruptionReason = 'No guesses were submitted';
	return {
		scoreboard: scores,
		[`${roundPath}/${STATE}`]: ROUND_STATES.TALLY,
		[`${roundPath}/${INTERRUPTION}`]: interruptionReason,
	};
}

/**
 * Get the payload for continuation
 * @param {SessionManager} sm - session manager
 * @returns {Object<string, any>} - payload
 */
function getContinuationPayload(sm) {
	return { [`${sm.roundPath.current}/${STATE}`]: ROUND_STATES.MARK };
}
