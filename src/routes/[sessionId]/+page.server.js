/**
 * @typedef {import("$lib/types").Session} Session
 */

import { getDatabase } from 'firebase-admin/database';
import { firebaseApp } from '$lib/firebase/server';
import { DB } from '$lib/constants';


/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const rtdb = getDatabase(firebaseApp);
	const snapshot = await rtdb.ref(`${DB}/${params.sessionId}`).get();
	const session = /** @type {Session} */ (snapshot.val());
	return { session };
}
