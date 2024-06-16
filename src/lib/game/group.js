/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 * @typedef {import('$lib/types').Guess} Guess
 */

import { GROUP, GUESSES, ROUND_STATES, SESSION } from '$lib/constants';
import { parseSessionRequest, generateAiGuesses } from '$lib/game/helpers';

/**
 * Proceed after grouping
 * @type {SessionAction}
 */
export async function proceed(cookies, params, request){
    const { form, sm } = await parseSessionRequest(cookies, params, request);
    const guesses = Object.entries(Object.fromEntries(form.entries())).filter(([key]) => key !== SESSION);
    const guessGroupPayload = Object.fromEntries(guesses.map(([key, value]) => [`${GUESSES}/${key}/${GROUP}`, value]));
    const uniqueGroupCount = new Set(Object.values(guessGroupPayload)).size;
    const aiGuesses = sm.session.ais > 0 ? generateAiGuesses(sm.session.ais, () => sm.phonyResponse) : {};
    const state = sm.session.ais === 0 && uniqueGroupCount === 1 ? ROUND_STATES.TALLY : ROUND_STATES.VOTE;
    const interruption = sm.session.ais === 0 && uniqueGroupCount === 1 ? 'There was only 1 distinct incorrect guess!' : '';
    const payload = { ...guessGroupPayload, ...aiGuesses, state, interruption };
	sm.roundRef.update(payload);
}

