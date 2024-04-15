/**
 * @typedef {import("$lib/types").Session} Session
 * @typedef {import("$lib/types").Round} Round
 * @typedef {import("$lib/types").SessionState} SessionState
 * @typedef {import("$lib/types").RoundState} RoundState
 * @typedef {import("$lib/types").Category} Category
 * @typedef {import("@skeletonlabs/skeleton").ToastStore} ToastStore
 * @typedef {import("firebase/database").DatabaseReference} DatabaseReference
 */

import { config } from '$lib/config';
import {
	DEFAULT_CUSTOM_PROMPT,
	ROUND_STATES,
	ROUNDS,
	SCOREBOARD,
	SESSION_STATES,
} from '$lib/constants';
import DatabaseManager from '$lib/database';
import { DatabaseError } from '$lib/errors';
import { child, increment, onValue, update } from 'firebase/database';

/**
 * Session management class
 */
export class SessionManager {
	/** @type {Session} */ session;
	/** @type {string} */ id;
	/** @type {DatabaseManager} */ #db;

	/**
	 * @param {Session} session - session data
	 * @param {string} id - session ID
	 * @param {DatabaseManager} db - database manager
	 */
	constructor(session, id, db) {
		this.#db = db;
		this.id = id;
		this.session = session;
	}

	/**
	 * Sync session across users
	 * @param {function(SessionManager): void} setter - session setter function
	 * @returns {Promise<void>}
	 */
	async sync(setter) {
		onValue(this.ref, (snapshot) => setter(new SessionManager(snapshot.val(), this.id, this.#db)));
	}

	/**
	 * Launch a new round
	 * @returns {Promise<void>}
	 */
	async launch() {
		const randomCategory = this.randomCategory;
		const payload = await this.#getNextRoundPayload();
		const nextRound = `${ROUNDS}/${this.session.current + 1}`;
		await update(this.ref, {
			state: SESSION_STATES.STARTED,
			current: increment(1),
			[nextRound]: payload,
		});
	}

	/**
	 * Update round timer
	 * @param {number} time - time in seconds
	 */
	async updateTimer(time) {
		await update(this.#roundRef, { timer: time });
	}

	/**
	 * Update round state
	 * @param {RoundState} state - new round state
	 */
	async updateState(state) {
		await update(this.#roundRef, { state });
	}

	/**
	 * Set prompt and response to new random values
	 */
	async setRandomPrompt() {
		const randomCategory = this.randomCategory;
		const response = await fetch(`/prompt?category=${encodeURIComponent(randomCategory)}`);
		const data = await response.json();
		await update(this.#roundRef, {
			prompt: data.prompt,
			response: data.response,
			category: randomCategory,
			custom: false,
		});
	}

	/**
	 * Set a custom prompt
	 * @param {string} prompt - prompt
	 * @param {string} response - response to the prompt
	 * @param {Category} category - category
	 */
	async setCustomPrompt(prompt, response, category) {
		await update(this.#roundRef, { prompt, response, category, custom: true });
	}

	/**
	 * Remove a player from the session
	 * @param {string} kicker - player who is performing the action
	 * @param {string} kicked - player who is getting removed
	 */
	async kick(kicker, kicked) {
		if (!this.players.includes(kicked)) throw new DatabaseError('Player to be kicked not found');
		if (!this.players.includes(kicker)) throw new DatabaseError('Kicker not found');
		const payload = await this.#getNextRoundPayload();
		await update(this.ref, {
			kicked: { [kicked]: kicker },
			[`${SCOREBOARD}/${kicked}`]: null,
			[`${ROUNDS}/${this.session.current}`]: { ...payload, dasher: this.#getDasher([kicked]) },
		});
	}

	/** @returns {string[]} - players in the session */
	get players() {
		return Object.keys(this.session.scoreboard) ?? [];
	}

	/** @returns {DatabaseReference} - session reference */
	get ref() {
		return this.#db.getSessionRef(this.id);
	}

	/** @returns {SessionState} - session state */
	get state() {
		return this.session.state;
	}

	/** @returns {Round} - current round state */
	get round() {
		return this.session.rounds[this.session.current];
	}

	/** @returns {Category} */
	get randomCategory() {
		return this.session.categories[Math.floor(Math.random() * this.session.categories.length)];
	}

	/** @returns {DatabaseReference} - round reference */
	get #roundRef() {
		return child(this.ref, `${ROUNDS}/${this.session.current}`);
	}

	/**
	 * Get next dasher
	 * @param {string[]} excluded - an array of excluded users (optional)
	 * @returns {string} - dasher username
	 */
	#getDasher(excluded = []) {
		const subset = this.players.filter((player) => !excluded.includes(player));
		return subset[this.session.current % subset.length];
	}

	/**
	 * Get a round payload
	 * @returns {Promise<Round>}
	 */
	async #getNextRoundPayload() {
		const randomCategory = this.randomCategory;
		const response = await fetch(`/prompt?category=${encodeURIComponent(randomCategory)}`);
		const data = await response.json();
		return {
			dasher: this.#getDasher(),
			prompt: data.prompt,
			response: data.response,
			category: randomCategory,
			custom: DEFAULT_CUSTOM_PROMPT,
			state: ROUND_STATES.SELECTING,
			timer: config.timer.default,
			guesses: [],
		};
	}
}
