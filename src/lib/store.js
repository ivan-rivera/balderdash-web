/**
 * @typedef {import("./types.js").Session} Session
 * @typedef {import("./types.js").Round} Round
 * @typedef {import('svelte/store').Writable<Session|undefined>} WritableSession
 */
import { derived, writable } from 'svelte/store';
import { ROUND_STATES, SESSION_STATES } from '$lib/types';

/** @type {WritableSession} */
export const sessionData = writable(undefined);

// Session details
export const roundLimit = derived(sessionData, ($data) => ($data ? $data.roundLimit : 0));

export const sessionState = derived(sessionData, ($data) =>
	$data === undefined || $data === null
		? SESSION_STATES.LOADING
		: $data.state
			? $data.state
			: SESSION_STATES.UNKNOWN,
);
export const sessionHost = derived(sessionData, ($data) => ($data ? $data.creator : ''));
export const sessionAiGuesses = derived(sessionData, ($data) => ($data ? $data.aiGuesses : 0));
export const sessionPlayers = derived(sessionData, ($data) =>
	$data ? Object.keys($data.scoreboard) : [],
);
export const sessionCategories = derived(sessionData, ($data) => ($data ? $data.categories : []));

export const kickedRegistry = derived(sessionData, ($data) => ($data ? $data.kicked : {}));

// Round details
export const currentRound = derived(sessionData, ($data) => ($data ? $data.currentRound : 0));
export const currentRoundData = derived(
	[sessionData, currentRound],
	([$data, $round]) => $data?.rounds?.[$round] ?? undefined,
);
export const currentRoundState = derived(currentRoundData, ($round) => {
	return $round ? /** @type {Round} */ ($round).state : ROUND_STATES.UNKNOWN;
});

export const currentRoundPrompt = derived(currentRoundData, ($round) => {
	return $round ? /** @type {Round} */ ($round).prompt : '';
});

export const currentRoundResponse = derived(currentRoundData, ($round) => {
	return $round ? /** @type {Round} */ ($round).response : '';
});

export const currentRoundCategory = derived(currentRoundData, ($round) => {
	return $round ? /** @type {Round} */ ($round).category : '';
});

export const currentRoundDasher = derived(currentRoundData, ($round) => {
	return $round ? /** @type {Round} */ ($round).dasher : '';
});

/**
 * Check if a user is a dasher
 * @param {string} username
 */
export function isDasher(username) {
	return derived(currentRoundData, ($round) =>
		$round ? /** @type {Round} */ ($round).dasher === username : false,
	);
}
