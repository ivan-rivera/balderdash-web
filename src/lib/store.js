import { INITIAL_SESSION_STATE, ROUND_STATES } from '$lib/constants';
import { derived, writable } from 'svelte/store';
import { SessionManager } from '$lib/session';
import { firebaseApp } from '$lib/firebase/client';
import DatabaseManager from '$lib/database';
import { config } from '$lib/config';

const dbManager = new DatabaseManager(firebaseApp);
const sessionManager = new SessionManager(INITIAL_SESSION_STATE, '', dbManager);

export function getSessionManagerStore() {
	const { subscribe, set } = writable(sessionManager);
	return {
		subscribe,
		reset: () => set(sessionManager),
		/** @param {SessionManager} sm */
		set: (sm) => set(sm),
	};
}
export const sessionManagerStore = getSessionManagerStore();

export const session = {
	state: derived(sessionManagerStore, ($sm) => $sm.session.state),
	host: derived(sessionManagerStore, ($sm) => $sm.session.creator),
	players: derived(sessionManagerStore, ($sm) => $sm.players),
	limit: derived(sessionManagerStore, ($sm) => $sm.session.limit),
	categories: derived(sessionManagerStore, ($sm) => $sm.session.categories),
	ais: derived(sessionManagerStore, ($sm) => $sm.session.ais, config.ais.default),
	kicked: derived(sessionManagerStore, ($sm) => $sm.session.kicked),
};

export const round = {
	number: derived(sessionManagerStore, ($sm) => $sm.session.current),
	state: derived(sessionManagerStore, ($sm) => $sm.round.state),
	dasher: derived(sessionManagerStore, ($sm) => $sm.round.dasher),
	category: derived(sessionManagerStore, ($sm) => $sm.round.category),
	prompt: derived(sessionManagerStore, ($sm) => $sm.round.prompt),
	response: derived(sessionManagerStore, ($sm) => $sm.round.response),
};
