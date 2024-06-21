/**
 * @typedef {import("$lib/types").Session} Session
 * @typedef {import("$lib/types").Category} Category
 * @typedef {import("$lib/types").Guess} Guess
 * @typedef {import('$lib/types').RoundState} RoundState
 * @typedef {import('$lib/types').Round} Round
 * @typedef {import("firebase-admin").database.Reference} DatabaseReference
 * @typedef {import('@sveltejs/kit').Cookies} Cookies
 */

import { DEFAULT_CUSTOM_PROMPT, ROUNDS, ROUND_STATES, SESSION_STATES } from '$lib/constants';
import config from '$lib/config';
import { getRandomPair, getPhonyResponse, loadVocabs } from '$lib/vocab';
import { dbRef, getSession } from '$lib/firebase/server';
import admin from 'firebase-admin';

export class SessionManager {
	/**
	 * Session manager constructor
	 * @param {Session} session - session data
	 * @param {string} id - session ID
	 */
	constructor(session, id) {
		this.session = session;
		this.sessionRef = dbRef.child(id);
	}

	/**
	 * Create a session manager instance from session ID
	 * @param {string} id - session ID
	 * @returns
	 */
	static async fromId(id) {
		return new SessionManager(await getSession(id), id);
	}

	async launch() {
		await this.sessionRef.update({
			state: SESSION_STATES.STARTED,
			current: admin.database.ServerValue.increment(1),
			[this.roundPath.next]: await this.nextRoundPayload(),
		});
	}

	/** @returns {string[]} - players in the session */
	get players() {
		return Object.keys(this.session.scoreboard) ?? [];
	}

	/** @returns {Category} */
	get randomCategory() {
		return this.session.categories[Math.floor(Math.random() * this.session.categories.length)];
	}

	async nextRoundPayload() {
		const { category: randomCategory, pair: randomPair } = await this.randomPair();
		return {
			dasher: this.getNextDasher(),
			prompt: randomPair.prompt,
			response: randomPair.response,
			category: randomCategory,
			custom: DEFAULT_CUSTOM_PROMPT,
			state: ROUND_STATES.SELECT,
			timer: config.timer.default,
			guesses: [],
		};
	}

	/** @returns {Round} - dasher username */
	get round() {
		return this.session.rounds[this.session.current];
	}

	/** @returns {DatabaseReference} - round reference */
	get roundRef() {
		return this.sessionRef.child(`${ROUNDS}/${this.session.current}`);
	}

	/** @returns {{current: string, next: string}} - round path */
	get roundPath() {
		return {
			current: `${ROUNDS}/${this.session.current}`,
			next: `${ROUNDS}/${this.session.current + 1}`,
		};
	}

	/** @returns {Promise<{category: Category, pair: {prompt: string, response: string}}>} - a random prompt-response pair */
	async randomPair() {
		const vocabs = await loadVocabs();
		const randomCategory = this.randomCategory;
		const vocab = vocabs.find((vocab) => vocab.category === randomCategory)?.vocab;
		return { category: randomCategory, pair: getRandomPair(vocab) };
	}

	/**
	 * Get a phony response to the current prompt
	 * @returns {Promise<string>} - a phony response to the prompt
	 */
	async phonyResponse() {
		const vocabs = await loadVocabs();
		const vocab = vocabs.find((vocab) => vocab.category === this.round.category)?.vocab;
		return getPhonyResponse(vocab, this.round.prompt);
	}

	/**
	 * Get next dasher
	 * @param {string[]} excluded - an array of excluded users (optional)
	 * @returns {string} - dasher username
	 */
	getNextDasher(excluded = []) {
		const subset = this.players.filter((player) => !excluded.includes(player));
		return subset[this.session.current % subset.length];
	}
}
