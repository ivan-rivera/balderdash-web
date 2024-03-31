/**
 * @typedef {import("./types.js").Session} Session
 * @typedef {import("./types.js").RoundState} RoundState
 * @typedef {import("./types.js").Category} Category
 * @typedef {import("@skeletonlabs/skeleton").ToastStore} ToastStore
 */

// TODO: write unit tests
// TODO: see if you can mock Firebase DB somehow
import { generateSessionId } from './random.js';
import {
	DatabaseError,
	GenericError,
	ROUND_STATES,
	SessionDoesNotExistError,
	SessionHasStartedError,
	UsernameExistsError,
} from './types.js';
import { SESSION_STATES, SessionJoinOutcome } from './types.js';
import { db } from './firebase.js';
import { ref, set, child, get, onValue, update, increment, remove } from 'firebase/database';
import { get as getStore } from 'svelte/store';
import { config } from './config.js';
import { goto } from '$app/navigation';
import { sessionData } from './store.js';

const sessions = ref(db, 'sessions');

/**
 * Sync session data across all users
 * @param {string} id - session ID
 * @param {function(Session): void} setter - a setter function
 * @returns {Promise<void>}
 */
export async function syncSession(id, setter) {
	onValue(child(sessions, id), (snapshot) => setter(snapshot.val()));
}

/**
 * Retrieve session data from DB
 * @param {string} id - session ID
 * @returns {Promise<Session>} - session data
 */
export async function getSessionFromDb(id) {
	const ref = child(sessions, id);
	const snapshot = await get(ref);
	return snapshot.val();
}

/**
 * Create a new session ID and join the game
 * @param {string} creator - username of the creator
 * @param {number} rounds - round limit
 * @param {number} aiGuesses - number of AI guesses
 * @param {Array<Category>} categories - categories to include
 * @returns {Promise<SessionJoinOutcome>} - session outcome
 * @throws {GenericError}
 */
export async function createSession(creator, rounds, aiGuesses, categories) {
	const sessionId = await createNewSessionId();
	const initialState = {
		state: SESSION_STATES.INITIATED,
		creator,
		roundLimit: rounds,
		currentRound: 0,
		aiGuesses,
		categories,
	};
	return set(child(sessions, sessionId), initialState)
		.then(() => joinSession(sessionId, creator))
		.catch(
			(errorMessage) =>
				new SessionJoinOutcome(
					null,
					new GenericError(`failed to create session: ${JSON.stringify(errorMessage)}`),
				),
		);
}

/**
 * Join session
 * @param {string} id
 * @param {string} username
 * @returns {Promise<SessionJoinOutcome>} - session outcome
 * @throws {GenericError | GenericError}
 */
export async function joinSession(id, username) {
	const session = await getSessionFromDb(id);
	const players = (await session.hasOwnProperty('scoreboard'))
		? Object.keys(session.scoreboard)
		: [];
	if (!(await sessionIdExists(id)))
		return new SessionJoinOutcome(null, new SessionDoesNotExistError());
	if (players.includes(username)) return new SessionJoinOutcome(null, new UsernameExistsError());
	if (session.state != SESSION_STATES.INITIATED)
		return new SessionJoinOutcome(null, new SessionHasStartedError());
	const ref = child(sessions, id);
	return set(child(ref, `scoreboard/${username}`), 0)
		.then(() => new SessionJoinOutcome(id))
		.catch(
			(errorMessage) =>
				new SessionJoinOutcome(
					null,
					new GenericError(`failed to join a session: ${JSON.stringify(errorMessage)}`),
				),
		);
}

/**
 * Begin the game
 * @param {string} id - session ID
 * @returns {Promise<void>}
 * @throws {DatabaseError}
 */
export async function launchGame(id) {
	const ref = child(sessions, id);
	await set(child(ref, 'state'), SESSION_STATES.STARTED)
		.then(() => startNewRound(id))
		.catch((errorMessage) => new DatabaseError(errorMessage));
}

/**
 * Begin a new round
 * @param {string} id - session ID
 * @returns {Promise<void>}
 * @throws {DatabaseError | GenericError}
 */
export async function startNewRound(id) {
	try {
		const content = getStore(sessionData);
		if (!content) throw new GenericError('Session data not found');
		const players = Object.keys(content.scoreboard);
		const nextRound = Object.keys(content.rounds || {}).length + 1;
		const nextCategory = content.categories[Math.floor(Math.random() * content.categories.length)];
		const encodedCategory = encodeURIComponent(nextCategory);
		const response = await fetch(`/prompt?category=${encodedCategory}`);
		const data = await response.json();
		await update(child(sessions, id), { currentRound: increment(1) });
		await set(child(sessions, `${id}/rounds/${nextRound}`), {
			dasher: players[(nextRound % players.length) - 1],
			prompt: data.prompt,
			response: data.response,
			category: nextCategory,
			isCustomPrompt: false,
			state: ROUND_STATES.SELECTING,
			timer: config.timer.default,
		});
	} catch (error) {
		throw new DatabaseError(`Failed to start a new round: ${error}`);
	}
}

/**
 * Update prompt, response and category
 * @param {string} id - Session ID
 * @return {Promise<void>}
 * @throws {GenericError}
 */
export async function updateRoundPrompt(id) {
	const content = getStore(sessionData);
	if (!content) throw new GenericError('Session data not found');
	const nextCategory = content.categories[Math.floor(Math.random() * content.categories.length)];
	const encodedCategory = encodeURIComponent(nextCategory);
	const response = await fetch(`/prompt?category=${encodedCategory}`);
	const data = await response.json();
	await update(child(sessions, `${id}/rounds/${content.currentRound}`), {
		prompt: data.prompt,
		response: data.response,
		category: nextCategory,
		isCustomPrompt: false,
	});
}

/**
 * Set a custom prompt
 * @param {string} id - Session ID
 * @param {number} round - round number
 * @param {string} prompt - prompt
 * @param {string} response - response to the prompt
 * @param {Category} category - category of the prompt
 * @returns {Promise<void>}
 * @throws {DatabaseError}
 */
export async function setCustomRoundPrompt(id, round, prompt, response, category) {
	try {
		await update(child(sessions, `${id}/rounds/${round}`), {
			prompt,
			response,
			category,
			isCustomPrompt: true,
		});
	} catch (error) {
		throw new DatabaseError(`Failed to set custom prompt: ${error}`);
	}
}

/**
 * Update round timer
 * @param {string} id - Session ID
 * @param {number} round - round number
 * @param {number} time - time in seconds to complete the round
 * @returns {Promise<void>}
 * @throws {DatabaseError}
 */
export async function updateRoundTimer(id, round, time) {
	try {
		await update(child(sessions, `${id}/rounds/${round}`), { timer: time });
	} catch (error) {
		throw new DatabaseError(`Failed to update round timer: ${error}`);
	}
}

/**
 * initiate round state
 * @param {string} id - session ID
 * @param {number} round - round number
 * @param {RoundState} newState - new round state
 * @returns {Promise<void>}
 * @throws {DatabaseError}
 */
export async function initiateRoundState(id, round, newState) {
	try {
		await update(child(sessions, `${id}/rounds/${round}`), { state: newState });
	} catch (error) {
		throw new DatabaseError(`Failed to initiate state ${newState} due to error: ${error}`);
	}
}

/**
 * Remove a player from a session. This action restarts the current round
 * @param {string} id - Session ID
 * @param {string} kicker - username who removed the player
 * @param {string} kicked - username to remove
 * @returns {Promise<void>}
 * @throws {DatabaseError | GenericError}
 */
export async function removePlayer(id, kicker, kicked) {
	const content = getStore(sessionData);
	if (!content) throw new GenericError('Session data not found');
	const players = Object.keys(content.scoreboard);
	if (!players.includes(kicked)) throw new GenericError('Player not found');
	try {
		await remove(child(sessions, `${id}/scoreboard/${kicked}`));
		await remove(child(sessions, `${id}/rounds/${content.currentRound}`));
		await update(child(sessions, id), { kicked: { [kicked]: kicker } });
		await update(child(sessions, id), { currentRound: increment(-1) });
		sessionData.set(await getSessionFromDb(id))
		await startNewRound(id);
	} catch (error) {
		throw new DatabaseError(`Failed to remove player: ${error}`);
	}
}

/**
 * Create unique session ID
 * @returns {Promise<string>} - session ID
 */
async function createNewSessionId() {
	const id = generateSessionId();
	const sessionExists = await sessionIdExists(id);
	if (sessionExists) return createNewSessionId();
	else return id;
}

/**
 * Check whether a session ID exists
 * @param {string} id - session ID to verify
 * @returns {Promise<boolean>} - true if session ID exists
 * @throws {Error} - failure to check session ID
 */
async function sessionIdExists(id) {
	return get(child(sessions, id))
		.then((snapshot) => snapshot.exists())
		.catch((error) => {
			console.log(`session ID check failed with error: ${error}`);
			return false;
		});
}

/**
 * Process outcome of joining a session by either displaying an error or redirecting to the session
 * @param {SessionJoinOutcome} outcome - outcome of joining a session
 * @param {ToastStore} store - toast store
 * @param {string} username - username of the player
 * @returns {void}
 */
export function handleSessionJoinOutcome(outcome, username, store) {
	if (outcome.error != null) {
		store.trigger({
			message: outcome.error.message,
			timeout: config.errorTimeout,
			background: 'variant-filled-error',
		});
	} else if (outcome.sessionId != null) {
		localStorage.setItem('username', username);
		localStorage.setItem('sessionId', outcome.sessionId);
		goto(`/${outcome.sessionId}`);
	}
}
