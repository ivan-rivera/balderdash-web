/**
 * @typedef {import('firebase/app').FirebaseApp} FirebaseApp
 * @typedef {import("firebase/database").DatabaseReference} DatabaseReference
 * @typedef {import("$lib/types").Session} Session
 * @typedef {import("$lib/types").Category} Category
 */

import { DB, DEFAULT_SCORE, INITIAL_SESSION_STATE, SCOREBOARD, SESSION_STATES } from '$lib/constants';
import { child, get, set, ref, getDatabase } from 'firebase/database';
import { generateSessionId } from '$lib/utils';
import { SessionDoesNotExistError, SessionHasStartedError, UsernameExistsError } from '$lib/errors';

/**
 * Database manager responsible for handling the "sessions" database
 * these responsibilities include checking for existing sessions,
 * creating and joining new sessions, retrieving session data, etc
 */
export default class DatabaseManager {
	/** @type {DatabaseReference} */ #ref;

	/**
	 * Database manager constructor
	 * @param {FirebaseApp} app - Firebase app
	 */
	constructor(app) {
		this.#ref = DatabaseManager.#getRef(app);
	}

	/**
	 * Create a new session
	 * @param {string} creator - username of the creator
	 * @param {number} limit - round limit
	 * @param {number} ais - number of AI guesses
	 * @param {Array<Category>} categories - categories to include
	 * @returns {Promise<string>} - session ID
	 */
	async create(creator, limit, ais, categories) {
		const newSessionState = {
			...INITIAL_SESSION_STATE,
			state: SESSION_STATES.INITIATED,
			scoreboard: {[creator]: DEFAULT_SCORE},
			creator,
			limit,
			ais,
			categories
		};
		const id = await this.#createNewSessionId();
		const ref = child(this.#ref, id);
		await set(ref, newSessionState);
		return id;
	}

	/**
	 * Join a session
	 * @param {string} user - username
	 * @param {string} id - session ID
	 */
	async join(user, id) {
		const session = await this.getSession(id);
		const players = session.hasOwnProperty('scoreboard') ? Object.keys(session.scoreboard) : [];
		if (!(await this.#sessionIdExists(id))) throw new SessionDoesNotExistError();
		if (players.includes(user)) throw new UsernameExistsError();
		if (session.state != SESSION_STATES.INITIATED) throw new SessionHasStartedError();
		await set(child(this.#ref, `${id}/${SCOREBOARD}/${user}`), DEFAULT_SCORE)
	}

	/**
	 * Check if an actiev session exists
	 * @param {string} username - username that must exist in the game
	 * @param {string} id - session ID
	 */
	async activeSessionExists(username, id) {
		if (username == '' || id == '') return false;
		if (!(await this.#sessionIdExists(id))) return false;
		const session = await this.getSession(id);
		if (![SESSION_STATES.INITIATED, SESSION_STATES.STARTED].includes(session.state)) return false;
		return Object.keys(session.scoreboard ?? {}).includes(username);
	}

	/**
	 * Get a session reference
	 * @param {string} id - session ID
	 * @returns {DatabaseReference}
	 */
	getSessionRef(id) {
		return child(this.#ref, id);
	}

	/**
	 * Check if a session ID exists
	 * @param {string} id - session ID
	 * @returns {Promise<boolean>} - whether the session ID exists
	 */
	async #sessionIdExists(id) {
		return get(child(this.#ref, id))
			.then((snapshot) => snapshot.exists())
			.catch(() => false);
	}

	/**
	 * Retrieve session data from DB
	 * @param {string} id - session ID
	 * @returns {Promise<Session>} - session data
	 */
	async getSession(id) {
		const session = child(this.#ref, id);
		const snapshot = await get(session);
		return snapshot.val();
	}

	/**
	 * Create a new session ID
	 * @returns {Promise<string>} session ID
	 */
	async #createNewSessionId() {
		const id = generateSessionId();
		if (await this.#sessionIdExists(id)) return this.#createNewSessionId();
		else return id;
	}

	/**
	 * Get a DB reference from a Firebase app
	 * @param {FirebaseApp} app
	 * @returns {DatabaseReference}
	 */
	static #getRef(app) {
		return ref(getDatabase(app), DB);
	}
}
