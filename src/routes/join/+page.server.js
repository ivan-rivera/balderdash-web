import { DEFAULT_SCORE, SCOREBOARD, SESSION_ID, SESSION_STATES, USERNAME } from '$lib/constants';
import { dbRef, getSession, sessionIdExists, validateToken } from '$lib/firebase/server';
import { fail, redirect } from '@sveltejs/kit';
import { enquire } from '$lib/contact.js';

/** @type {import('./$types').Actions} */
export const actions = {
	enquire: async ({ cookies, request }) => enquire(cookies, request),
	enter: async ({ cookies, request }) => {
		validateToken(cookies);
		const data = await request.formData();
		const username = String(data.get(USERNAME));
		const sessionId = String(data.get(SESSION_ID));
		const uid = String(cookies.get('uid'));
		if (!(await sessionIdExists(sessionId)))
			return fail(400, { success: false, message: 'Session does not exist' });
		const session = await getSession(sessionId);
		const players = Object.prototype.hasOwnProperty.call(session, SCOREBOARD)
			? Object.keys(session.scoreboard)
			: [];
		if (players.includes(username))
			return fail(400, { success: false, message: 'Username already exists' });
		if (session.state !== SESSION_STATES.INITIATED)
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
