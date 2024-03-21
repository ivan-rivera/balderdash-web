/**
 * @typedef {import("./types.js").Session} Session
 * @typedef {import("./types.js").Category} Category
 */

// TODO: write unit tests
// TODO: see if you can mock Firebase DB somehow
// TODO: use these in /new and /join routes
import { generateSessionId } from './random.js';
import {
	DatabaseError,
	GenericError,
	ROUND_STATES,
	SessionDoesNotExistError,
	SessionHasStartedError,
	UsernameExistsError
} from './types.js';
import { SESSION_STATES, SessionJoinOutcome } from './types.js';
import { db } from './firebase.js';
import { ref, set, child, get, onValue, update, increment } from 'firebase/database';
import { config } from './config.js';
import { goto } from '$app/navigation';

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
 * Retrieve session data
 * @param {string} id - session ID
 * @returns {Promise<Session>} - session data
 */
export async function getSessionState(id) {
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
		categories
	};
	return set(child(sessions, sessionId), initialState)
		.then(() => joinSession(sessionId, creator))
		.catch(
			(errorMessage) =>
				new SessionJoinOutcome(null, new GenericError(`server error: ${errorMessage}`))
		);
}

/**
 * Join session
 * @param {string} id
 * @param {string} username
 * @returns {Promise<SessionJoinOutcome>} - session outcome
 * @throws {GenericError}
 */
export async function joinSession(id, username) {
	const session = await fetchSessionDetails(id);
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
				new SessionJoinOutcome(null, new GenericError(`server error: ${errorMessage}`))
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
	set(child(ref, 'state'), SESSION_STATES.STARTED)
		.then(() => startNewRound(id))
		.catch((errorMessage) => new DatabaseError(errorMessage));
}

/**
 * Begin a new round
 * @param {string} id - session ID
 * @returns {Promise<void>}
 * @throws {DatabaseError}
 */
export async function startNewRound(id) {
	try {
		const content = await getSessionState(id);
		const players = Object.keys(content.scoreboard);
		const nextRound = Object.keys(content.rounds || {}).length + 1;
		const nextCategory = content.categories[nextRound % content.categories.length];
		const encodedCategory = encodeURIComponent(nextCategory);
		const response = await fetch(`/prompt?category=${encodedCategory}`);
		const data = await response.json();
		update(child(sessions, id), { currentRound: increment(1) })
		set(child(sessions, `${id}/rounds/${nextRound}`), {
			dasher: players[nextRound % players.length],
			prompt: data.prompt,
			response: data.response,
			category: nextCategory,
			state: ROUND_STATES.SELECTING
		});
	} catch (error) {
		throw new DatabaseError(`Failed to start a new round: ${error}`);
	}
}

/**
 * Retrieve session details
 * @param {string} id - session ID
 * @returns {Promise<Session>} - session details
 */
async function fetchSessionDetails(id) {
	return (await get(child(sessions, id))).val();
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
 * @param {import("@skeletonlabs/skeleton").ToastStore} store - toast store
 * @param {string} username - username of the player
 */
export function handleSessionJoinOutcome(outcome, username, store) {
	if (outcome.error != null) {
		store.trigger({
			message: outcome.error.message,
			timeout: config.errorTimeout,
			background: 'variant-filled-error'
		});
	} else if (outcome.sessionId != null) {
		localStorage.setItem('username', username);
		localStorage.setItem('sessionId', outcome.sessionId);
		goto(`/${outcome.sessionId}`);
	}
}
