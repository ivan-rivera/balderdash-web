/**
 * Possible session states
 * @typedef {'INITIATED'|'STARTED'|'FINISHED'|'LOADING'|'UNKNOWN'} SessionState
 *
 * Possible round states
 * @typedef {'SELECTING'|'GUESSING'|'MARKING'|'VOTING'|'REVEALING'|'TALLYING'|'UNKNOWN'} RoundState
 *
 * Available categories
 * @typedef {'Rare words'|'Scientific names'|'Film taglines'|'Famous people'} Category
 *
 * Session data structure
 * @typedef {Object} Session
 * @property {SessionState} state - Current state of the session
 * @property {string} creator - Username of session creator
 * @property {number} roundLimit - Round limit
 * @property {number} currentRound - Current round
 * @property {number} aiGuesses - Number of AI guesses
 * @property {Category[]} categories - Categories included
 * @property {Scoreboard} scoreboard - A mapping between players and their most recent scores
 * @property {Object.<number, Round>} rounds - Round data
 * @property {Object.<string, string>} kicked - Kicked players: kicked as key and kicker as value
 *
 * Round data structure
 * @typedef {Object} Round
 * @property {string} dasher - Username of the dasher for that round
 * @property {string} prompt - prompt
 * @property {string} response - response to the prompt
 * @property {boolean} isCustomPrompt - whether the prompt is custom
 * @property {number} timer - timer in seconds to guess the prompt
 * @property {RoundState} state - Current state of the round
 * @property {Category} category - category for the round
 * @property {Array<Guess>} guesses - guesses made by players
 *
 * Guess data structure
 * @typedef {Object} Guess
 * @property {string} username - Username who submitted the guess
 * @property {string} response - Response to the prompt
 * @property {boolean} correct - Whether the guess was correct
 * @property {boolean} doubleBluff - double bluff enabled
 * @property {Array<string>} votes - Usernames who votes for this definition
 *
 * A mapping between players and their latest aggregate scores
 * @typedef {Object.<string, number>} Scoreboard
 */

/**
 * @type {Object.<string, SessionState>}
 */
export const SESSION_STATES = {
	INITIATED: 'INITIATED',
	STARTED: 'STARTED',
	FINISHED: 'FINISHED',
	LOADING: 'LOADING',
	UNKNOWN: 'UNKNOWN'
};

/**
 * @type {Object.<string, RoundState>}
 */
export const ROUND_STATES = {
	SELECTING: 'SELECTING',
	GUESSING: 'GUESSING',
	MARKING: 'MARKING',
	VOTING: 'VOTING',
	REVEALING: 'REVEALING',
	TALLYING: 'TALLYING',
	UNKNOWN: 'UNKNOWN'
};

export class SessionJoinOutcome {
	/**
	 * Session outcome parameters
	 * @param {string|null} sessionId - unique session identifier
	 * @param {GenericError|null} error - possible error
	 */
	constructor(sessionId, error = null) {
		this.sessionId = sessionId;
		this.error = error;
	}
}

export class GenericError {
	/**
	 * Error constructor
	 * @param {string} message
	 */
	constructor(message) {
		this.message = message;
	}
}

export class DatabaseError extends GenericError {
	/** @param {string} reason - reason for failure */
	constructor(reason) {
		super(`Database operation failed with: ${reason}`);
	}
}

export class SessionDoesNotExistError extends GenericError {
	constructor() {
		super('Session does not exist');
	}
}

export class SessionHasStartedError extends GenericError {
	constructor() {
		super('Session has already started');
	}
}

export class UsernameExistsError extends GenericError {
	constructor() {
		super('Username already exists');
	}
}
