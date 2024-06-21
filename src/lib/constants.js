/**
 * @typedef {import("$lib/types").Session} Session
 * @typedef {import("$lib/types").Round} Round
 * @typedef {import("$lib/types").SessionState} SessionState
 * @typedef {import("$lib/types").RoundState} RoundState
 * @typedef {import("$lib/types").PlayerState} PlayerState
 * @typedef {import("$lib/types").Category} Category
 * @typedef {import("$lib/types").Guess} Guess
 * @typedef {import("$lib/types").Scoreboard} Scoreboard
 * @typedef {import("$lib/types").Ref} Ref
 */

import config from '$lib/config';

export const CATEGORY = 'category';
export const CORRECT = 'correct';
export const CONTACT_DB = 'contact';
export const DASHER = 'dasher';
export const DB = 'sessions';
export const DOUBLE_BLUFF = 'double-bluff';
export const ENQUIRY = 'enquiry';
export const ENQUIRIES = 'enquiries';
export const FEEDBACK = 'feedback';
export const FIREBASE = 'firebase';
export const GROUP = 'group';
export const GUESSES = 'guesses';
export const GUESS = 'guess';
export const IDENTITY = 'identity';
export const INTERRUPTION = 'interruption';
export const KICKED = 'kicked';
export const KICKER = 'kicker';
export const NPC = 'NPC';
export const PROMPT = 'prompt';
export const RESPONSE = 'response';
export const ROUNDS = 'rounds';
export const SCOREBOARD = 'scoreboard';
export const SELECTED_GROUP = 'selected-group';
export const SESSION = 'session';
export const SESSION_ID = 'sessionId';
export const STATE = 'state';
export const TIMER = 'timer';
export const TOKEN = 'token';
export const TRUE_RESPONSE = 'True Response';
export const UID = 'uid';
export const UNKNOWN = 'unknown';
export const USERNAME = 'username';
export const VOTES = 'votes';

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
	SELECT: 'SELECT',
	GUESS: 'GUESS',
	MARK: 'MARK',
	GROUP: 'GROUP',
	VOTE: 'VOTE',
	TALLY: 'TALLY',
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

/** @type {Object.<string, Ref>} */
export const REFS = {
	SESSION: 'session',
	ROUND: 'round',
	FEEDBACK: 'feedback',
	ENQUIRIES: 'enquiries',
};

/** @type {SessionState} */ export const DEFAULT_SESSION_STATE = SESSION_STATES.LOADING;
/** @type {RoundState} */ export const DEFAULT_ROUND_STATE = ROUND_STATES.LOADING;
/** @type {Scoreboard} */ export const DEFAULT_SCOREBOARD = {};
/** @type {Object.<string, boolean>} */ export const DEFAULT_UIDS = {};
/** @type {Object.<string, string>} */ export const DEFAULT_KICKED = {};
/** @type {Category[]} */ export const DEFAULT_CATEGORIES = [];
/** @type {Category} */ export const DEFAULT_CATEGORY = 'Rare words';
/** @type {Object.<string, Guess>} */ export const DEFAULT_GUESSES = {};
/** @type {Object.<string, string>} */ export const DEFAULT_VOTES = {};
/** @type {string} */ export const DEFAULT_CREATOR = UNKNOWN;
/** @type {string} */ export const DEFAULT_PROMPT = UNKNOWN;
/** @type {string} */ export const DEFAULT_RESPONSE = UNKNOWN;
/** @type {string} */ export const DEFAULT_DASHER = UNKNOWN;
/** @type {number} */ export const DEFAULT_ROUND_NUMBER = 0;
/** @type {number} */ export const DEFAULT_SCORE = 0;
/** @type {boolean} */ export const DEFAULT_CUSTOM_PROMPT = false;
/** @type {boolean} */ export const DEFAULT_DOUBLE_BLUFF = false;
/** @type {boolean} */ export const DEFAULT_DOUBLE_CORRECT = false;
/** @type {boolean} */ export const DEFAULT_DOUBLE_AUTOMATIC = false;
/** @type {string} */ export const DEFAULT_INTERRUPTED = '';
/** @type {string} */ export const DEFAULT_GROUP = 'Group 0';

/** @type {Guess} */
export const DEFAULT_GUESS = {
	response: DEFAULT_RESPONSE,
	double: DEFAULT_DOUBLE_BLUFF,
	correct: DEFAULT_DOUBLE_CORRECT,
	group: DEFAULT_GROUP,
	automatic: DEFAULT_DOUBLE_AUTOMATIC,
};

/** @type {Round} */
export const INITIAL_ROUND_STATE = {
	dasher: DEFAULT_DASHER,
	prompt: DEFAULT_PROMPT,
	response: DEFAULT_RESPONSE,
	custom: DEFAULT_CUSTOM_PROMPT,
	time: config.timer.default,
	interruption: DEFAULT_INTERRUPTED,
	state: DEFAULT_ROUND_STATE,
	category: DEFAULT_CATEGORY,
	guesses: DEFAULT_GUESSES,
	votes: DEFAULT_VOTES,
};

/** @type {Session} */
export const INITIAL_SESSION_STATE = {
	state: DEFAULT_SESSION_STATE,
	creator: DEFAULT_CREATOR,
	limit: config.rounds.default,
	current: DEFAULT_ROUND_NUMBER,
	ais: config.ais.default,
	uids: DEFAULT_UIDS,
	categories: DEFAULT_CATEGORIES,
	scoreboard: DEFAULT_SCOREBOARD,
	rounds: { [DEFAULT_ROUND_NUMBER]: INITIAL_ROUND_STATE },
	kicked: DEFAULT_KICKED,
};
