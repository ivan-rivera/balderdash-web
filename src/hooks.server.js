import { TOKEN } from '$lib/constants';
import { signToken, tokenIsValid } from '$lib/firebase/server';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (!tokenIsValid(event.cookies.get(TOKEN) || '')) {
		const payload = { user: 'anonymous', role: 'guest', iat: Date.now() / 1000 };
		event.cookies.set(TOKEN, signToken(payload), {
			httpOnly: true,
			secure: true,
			path: '/',
			sameSite: 'strict',
		});
	}
	return resolve(event);
}
