import { USERNAME } from '$lib/constants';
import { getSession } from '$lib/firebase/server';
import { feedback, kick as globalKick } from '$lib/game/global';
import { launch as lobbyLaunch } from '$lib/game/lobby';
import { prompt as selectPrompt } from '$lib/game/select';
import { submit as guessSubmit, proceed as guessProceed } from '$lib/game/guess';
import { proceed as markProceed } from '$lib/game/mark';
import { proceed as groupProceed } from '$lib/game/group';
import { cast as voteCast, proceed as voteProceed } from '$lib/game/vote';
import { proceed as tallyProceed } from '$lib/game/tally';
import { enquire } from '$lib/contact';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies, params }) {
	return {
		session: await getSession(params.sessionId),
		username: cookies.get(USERNAME) || '',
	};
}

const actionMap = {
	'global.kick': globalKick,
	'lobby.launch': lobbyLaunch,
	'select.prompt.accept': selectPrompt.accept,
	'select.prompt.randomize': selectPrompt.randomize,
	'select.prompt.customize': selectPrompt.customize,
	'guess.submit': guessSubmit,
	'guess.continue': guessProceed,
	'mark.continue': markProceed,
	'group.continue': groupProceed,
	'vote.cast': voteCast,
	'vote.continue': voteProceed,
	'tally.continue': tallyProceed,
};

const mainActions = Object.fromEntries(
	Object.entries(actionMap).map(([key, f]) => [
		key,
		async ({ cookies, params, request }) => f(cookies, params, request),
	]),
);

const extraActions = {
	enquire: async ({ cookies, request }) => enquire(cookies, request),
	feedback: async ({ cookies, params, request }) => feedback(cookies, params, request),
};

/** @type {import('./$types').Actions} */
export const actions = Object.assign({}, mainActions, extraActions);
