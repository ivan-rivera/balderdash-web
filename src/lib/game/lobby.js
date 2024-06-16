/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { parseSessionRequest } from '$lib/game/helpers';

/**
 * Launch the game
 * @type {SessionAction}
 */
export async function launch(cookies, params, request) {
	const { sm } = await parseSessionRequest(cookies, params, request);
	await sm.launch();
}
