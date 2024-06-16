import { DEFAULT_SCORE, SESSION_ID, SESSION_STATES, USERNAME } from '$lib/constants';
import { dbRef, getSession, sessionIdExists, validateToken } from '$lib/firebase/server';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		validateToken(cookies);
		const data = await request.formData();
		const username = String(data.get(USERNAME));
		const sessionId = String(data.get(SESSION_ID));
		const uid = String(cookies.get('uid'));
		const session = await getSession(sessionId);
		const players = session.hasOwnProperty('scoreboard') ? Object.keys(session.scoreboard) : [];
		if (!(await sessionIdExists(sessionId)))
			return fail(400, { success: false, message: 'Session does not exist' });
		if (players.includes(username))
			return fail(400, { success: false, message: 'Username already exists' });
		if (session.state != SESSION_STATES.INITIATED)
			return fail(400, { success: false, message: 'Session has already started' });
		await dbRef.child(sessionId).update({
			[`scoreboard/${username}`]: DEFAULT_SCORE,
			[`uids/${uid}`]: true,
		});
		cookies.set(USERNAME, username, { path: '/' });
		cookies.set(SESSION_ID, sessionId, { path: '/' });
		throw redirect(303, `/${sessionId}`);
	},
};
