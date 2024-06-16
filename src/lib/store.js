import { INITIAL_SESSION_STATE } from '$lib/constants';
import { derived, writable } from 'svelte/store';

export const sessionData = writable(INITIAL_SESSION_STATE);
const currentRound = derived(sessionData, ($data) => $data.rounds[$data.current]);

export const session = {
	state: derived(sessionData, ($data) => $data.state),
	host: derived(sessionData, ($data) => $data.creator),
	players: derived(sessionData, ($data) => Object.keys($data.scoreboard)),
	scoreboard: derived(sessionData, ($data) => $data.scoreboard),
	limit: derived(sessionData, ($data) => $data.limit),
	categories: derived(sessionData, ($data) => $data.categories),
	ais: derived(sessionData, ($data) => $data.ais),
	kicked: derived(sessionData, ($data) => $data.kicked),
};

export const round = {
	number: derived(sessionData, ($data) => $data.current),
	state: derived(currentRound, ($round) => $round.state),
	dasher: derived(currentRound, ($round) => $round.dasher),
	category: derived(currentRound, ($round) => $round.category),
	prompt: derived(currentRound, ($round) => $round.prompt),
	response: derived(currentRound, ($round) => $round.response),
	custom: derived(currentRound, ($round) => $round.custom),
	guesses: derived(currentRound, ($round) => $round?.guesses ?? {}),
	votes: derived(currentRound, ($round) => $round?.votes ?? {}),
	time: derived(currentRound, ($round) => $round.time),
	interruption: derived(currentRound, ($round) => $round.interruption ?? ''),
};
