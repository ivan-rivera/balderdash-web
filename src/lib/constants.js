/**
 * @typedef {import("$lib/types").Session} Session
 * @typedef {import("$lib/types").Round} Round
 * @typedef {import("$lib/types").SessionState} SessionState
 * @typedef {import("$lib/types").RoundState} RoundState
 * @typedef {import("$lib/types").PlayerState} PlayerState
 * @typedef {import("$lib/types").Category} Category
 * @typedef {import("$lib/types").Guess} Guess
 */

import { config } from '$lib/config';

export const DB = 'sessions';
export const DB_MANAGER = 'dbManager';
export const SESSION_MANAGER = 'sessionManager';
export const STATE = 'state';
export const UNKNOWN = 'unknown';
export const SCOREBOARD = 'scoreboard';
export const ROUNDS = 'rounds';

/** @type {Object.<string, SessionState>} */
export const SESSION_STATES = {
	INITIATED: 'INITIATED',
	STARTED: 'STARTED',
	FINISHED: 'FINISHED',
	LOADING: 'LOADING',
	UNKNOWN: 'UNKNOWN',
};

/** @type {Object.<string, RoundState>} */
export const ROUND_STATES = {
	SELECTING: 'SELECTING',
	GUESSING: 'GUESSING',
	MARKING: 'MARKING',
	VOTING: 'VOTING',
	REVEALING: 'REVEALING',
	TALLYING: 'TALLYING',
	UNKNOWN: 'UNKNOWN',
	LOADING: 'LOADING',
};

/** @type {Object.<string, PlayerState>} */
export const PLAYER_STATES = {
	KICKED: 'KICKED',
	OUTSIDER: 'OUTSIDER',
	READY: 'READY',
	UNKNOWN: 'UNKNOWN',
	LOADING: 'LOADING',
};

/** @type {SessionState} */ export const DEFAULT_SESSION_STATE = SESSION_STATES.LOADING;
/** @type {RoundState} */ export const DEFAULT_ROUND_STATE = ROUND_STATES.LOADING;
/** @type {Object.<string, number>} */ export const DEFAULT_SCOREBOARD = {};
/** @type {Object.<string, string>} */ export const DEFAULT_KICKED = {};
/** @type {Category[]} */ export const DEFAULT_CATEGORIES = [];
/** @type {Category} */ export const DEFAULT_CATEGORY = 'Rare words';
/** @type {Guess[]} */ export const DEFAULT_GUESSES = [];
/** @type {string[]} */ export const DEFAULT_PLAYER_LIST = [];
/** @type {string} */ export const DEFAULT_CREATOR = UNKNOWN;
/** @type {string} */ export const DEFAULT_PROMPT = UNKNOWN;
/** @type {string} */ export const DEFAULT_RESPONSE = UNKNOWN;
/** @type {string} */ export const DEFAULT_DASHER = UNKNOWN;
/** @type {string} */ export const DEFAULT_SESSION_ID = UNKNOWN;
/** @type {number} */ export const DEFAULT_ROUND_NUMBER = 0;
/** @type {number} */ export const DEFAULT_SCORE = 0;
/** @type {boolean} */ export const DEFAULT_CUSTOM_PROMPT = false;

/** @type {Round} */
export const INITIAL_ROUND_STATE = {
	dasher: DEFAULT_DASHER,
	prompt: DEFAULT_PROMPT,
	response: DEFAULT_RESPONSE,
	custom: DEFAULT_CUSTOM_PROMPT,
	timer: config.timer.default,
	state: DEFAULT_ROUND_STATE,
	category: DEFAULT_CATEGORY,
	guesses: DEFAULT_GUESSES,
};

/** @type {Session} */
export const INITIAL_SESSION_STATE = {
	state: DEFAULT_SESSION_STATE,
	creator: DEFAULT_CREATOR,
	limit: config.rounds.default,
	current: DEFAULT_ROUND_NUMBER,
	ais: config.ais.default,
	categories: DEFAULT_CATEGORIES,
	scoreboard: DEFAULT_SCOREBOARD,
	rounds: { [DEFAULT_ROUND_NUMBER]: INITIAL_ROUND_STATE },
	kicked: DEFAULT_KICKED,
};
