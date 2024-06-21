/**
 * @typedef {import("@firebase/app").FirebaseApp} FirebaseApp
 */

import { getAuth, signInAnonymously } from 'firebase/auth';

/**
 * Sign in user anonymously
 * @param {FirebaseApp} app
 * @returns {Promise<string>} - User ID
 */
export async function signIn(app) {
	const auth = getAuth(app);
	if (!auth.currentUser) await signInAnonymously(auth);
	return auth.currentUser?.uid || '';
}
