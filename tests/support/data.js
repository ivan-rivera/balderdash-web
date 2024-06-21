/**
 * @typedef {import('$lib/types').Session} Session
 * @typedef {import('$lib/types').Round} Round
 */

import { ROUND_STATES, SESSION_STATES } from '$lib/constants';
import { SessionManager } from '$lib/session';

export const SESSION_ID = 'ABCD123';
const CATEGORY = 'Rare words';

/** @type {Session} */
const dummySession = {
	state: SESSION_STATES.INITIATED,
	creator: 'P1',
	limit: 4,
	current: 1,
	ais: 0,
	uids: {},
	categories: [CATEGORY],
	scoreboard: {
		P1: 0,
		P2: 0,
		P3: 0,
		P4: 0,
	},
	rounds: {
		1: /** @type {Round} */ {
			dasher: 'P1',
			prompt: 'Prompt',
			response: 'Response',
			custom: false,
			time: 0,
			interruption: '',
			state: ROUND_STATES.SELECT,
			category: CATEGORY,
			guesses: {
				P2: {
					response: 'Something',
					correct: false,
					double: false,
					group: 'Group 0',
					automatic: false,
				},
				P3: {
					response: 'Other',
					correct: false,
					double: false,
					group: 'Group 1',
					automatic: false,
				},
				P4: {
					response: 'More',
					correct: false,
					double: false,
					group: 'Group 2',
					automatic: false,
				},
			},
			votes: {
				P2: 'Group 0',
				P3: 'True Response',
				P4: 'Group 1',
			},
		},
	},
	kicked: {
		P5: 'P1',
	},
};
export const dummySessionManager = new SessionManager(dummySession, SESSION_ID);
