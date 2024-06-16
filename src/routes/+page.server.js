import { SESSION_ID, SESSION_STATES, USERNAME } from '$lib/constants';
import { getSession } from '$lib/firebase/server';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	/**
	 * We wish to check whether a user belongs to an active session,
	 * if they do then they will have the option to resume their session
	 */
	const joinableStates = [SESSION_STATES.INITIATED, SESSION_STATES.STARTED];
	const username = cookies.get(USERNAME) || '';
	const sessionId = cookies.get(SESSION_ID) || '';
	if (username == '' || sessionId == '') return { activeSessionId: '' };
	const session = await getSession(sessionId);
	if (!session) return { activeSessionId: '' };
	if (!joinableStates.includes(session.state)) return { activeSessionId: '' };
	if (!Object.keys(session.scoreboard ?? {}).includes(username)) return { activeSessionId: '' };
	return { activeSessionId: sessionId };
}
