/**
 * @typedef {import('@sveltejs/kit').Cookies} Cookies
 */

import { IDENTITY, ENQUIRY, ENQUIRIES, UID } from '$lib/constants';
import { contactRef } from '$lib/firebase/server';

/**
 * Submit an enquiry
 * @param {Cookies} cookies
 * @param {Request} request
 * @return {Promise<void>}
 */
export async function enquire(cookies, request) {
	const form = await request.formData();
	const uid = String(cookies.get(UID));
	const identity = String(form.get(IDENTITY));
	const enquiry = String(form.get(ENQUIRY));
	await contactRef.child(ENQUIRIES).update({ [uid]: { identity, enquiry } });
}
