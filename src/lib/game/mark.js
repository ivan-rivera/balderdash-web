/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { CORRECT, GUESSES, INTERRUPTION, ROUND_STATES, SESSION, STATE } from '$lib/constants';
import { generateAiGuesses, parseSessionRequest } from '$lib/game/helpers';
import { getRoundScores } from '$lib/score';
import { client } from '$lib/analytics.js';

/**
 * Proceed after mark submission
 * @type {SessionAction}
 */
export async function proceed(cookies, params, request) {
	const { form, sm } = await parseSessionRequest(cookies, params, request);
	const activeGuesses = sm.players.length - 1;
	const submissions = Array.from(form.entries()).filter(([key]) => key !== SESSION);
	const correctUsers = submissions.filter(([_, value]) => value === '1').map(([key]) => key);
	const correctPayload = correctUsers.reduce(
		(acc, user) => ({ ...acc, [`${sm.roundPath.current}/${GUESSES}/${user}/${CORRECT}`]: true }),
		{},
	);
	const fewerThanTwoIncorrectGuesses = correctUsers.length >= activeGuesses - 1;
	const allGuessedCorrectly = correctUsers.length === activeGuesses;
	const incorrectCount = submissions.length - correctUsers.length;
	const singleSubmission = submissions.length === 1;
	const aisDisabled = sm.session.ais === 0;
	const terminate =
		allGuessedCorrectly || ((fewerThanTwoIncorrectGuesses || singleSubmission) && aisDisabled);
	const payload = terminate
		? getTerminationPayload(sm, correctUsers, correctPayload)
		: await getContinuationPayload(sm, correctPayload, incorrectCount);
	if (terminate)
		client.capture({
			event: 'interruption',
			properties: { stage: 'marking' },
		});
	await sm.sessionRef.update(payload);
}

/**
 * Get the termination payload
 * @param {SessionManager} sm - session manager
 * @param {string[]} correctUsers - list of correct users
 * @param {Object<string, any>} correctPayload - correct payload
 */
function getTerminationPayload(sm, correctUsers, correctPayload) {
	const interruptionReason = '1 or fewer incorrect guesses were submitted';
	const scores = getRoundScores(sm.round.dasher, {}, {}, correctUsers, sm.session.scoreboard);
	return {
		...correctPayload,
		scoreboard: scores,
		[`${sm.roundPath.current}/${STATE}`]: ROUND_STATES.TALLY,
		[`${sm.roundPath.current}/${INTERRUPTION}`]: interruptionReason,
	};
}

/**
 * Get continuation payload
 * @param {SessionManager} sm - session manager
 * @param {Object<string, any>} correctPayload - correct payload
 * @param {number} incorrectCount - number of incorrect guesses
 */
async function getContinuationPayload(sm, correctPayload, incorrectCount) {
	let aiGuesses = {};
	const nextState = incorrectCount === 1 ? ROUND_STATES.VOTE : ROUND_STATES.GROUP;
	if (nextState === ROUND_STATES.VOTE) {
		const phonyResponses = await generateAiGuesses(sm.session.ais, async () => sm.phonyResponse);
		aiGuesses = Object.entries(phonyResponses).reduce((acc, [key, value]) => {
			return {
				...acc,
				[`${sm.roundPath.current}/${key}`]: value,
			};
		}, {});
	}
	return {
		...correctPayload,
		...aiGuesses,
		[`${sm.roundPath.current}/${STATE}`]: nextState,
		[`${sm.roundPath.current}/${STATE}`]: nextState,
	};
}
