/**
 * @typedef {import("./types.js").Session} Session
 * @typedef {import('svelte/store').Writable<Session|undefined>} WritableSession
 */
import { derived, writable } from 'svelte/store';
import { ROUND_STATES, SESSION_STATES } from '$lib/types';

/** @type {WritableSession} */
export const sessionData = writable(undefined);

// Session details
export const roundLimit = derived(sessionData, $data => $data ? $data.roundLimit : 0);
export const sessionState = derived(sessionData, $data => $data ? $data.state : SESSION_STATES.UNKNOWN);
export const sessionHost = derived(sessionData, $data => $data ? $data.creator : '');
export const sessionAiGuesses = derived(sessionData, $data => $data ? $data.aiGuesses : 0);
export const sessionPlayers = derived(sessionData, $data => $data ? Object.keys($data.scoreboard) : []);
export const sessionCategories = derived(sessionData, $data => $data ? $data.categories : []);

// Round details
export const currentRound = derived(sessionData, $data => $data ? $data.currentRound : 0);
export const currentRoundData = derived([sessionData, currentRound], ([$data, $round]) => $data?.rounds[$round]);
export const currentRoundState = derived(currentRoundData, $round => $round?.state || ROUND_STATES.UNKNOWN);

/**
 * Check if a user is a dasher
 * @param {string} username
 */
export function isDasher(username) {
    return derived(currentRoundData, $round => $round?.dasher === username);
}

