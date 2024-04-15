/**
  * @typedef {import("@skeletonlabs/skeleton").ToastStore} ToastStore
 */

import { config } from '$lib/config';

export class ClientError extends Error {
	/**
	 * Error constructor
	 * @param {string} message
	 */
	constructor(message) {
		super(`Client-side operation failed with: ${message}`);
		this.name = 'ClientError';
		this.cause = message;
	}
}

export class DatabaseError extends Error {
	/** @param {string} message - reason for failure */
	constructor(message) {
		super(`Database operation failed with: ${message}`);
		this.name = 'DatabaseError';
		this.cause = message;
	}
}

export class SessionDoesNotExistError extends Error {
	constructor() {
		super('Session does not exist');
		this.name = 'SessionDoesNotExistError';
	}
}

export class SessionHasStartedError extends Error {
	constructor() {
		const reason = 'Session has already started'
		super(reason);
		this.cause = reason;
		this.name = 'SessionHasStartedError';
	}
}

export class UsernameExistsError extends Error {
	constructor() {
		const reason = 'Username already exists'
		super(reason);
		this.name = 'UsernameExistsError';
		this.cause = reason;
	}
}


/**
 * 
 * @param {ToastStore} store 
 * @param {Error} error
 * @throws {Error} - rethrows the error
 */
export function handleError(store, error) {
	store.trigger({
		message: error.message,
		timeout: config.toastTimeout,
		background: 'variant-filled-error',
	});
	throw error;
}
