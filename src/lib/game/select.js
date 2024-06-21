/**
 * @typedef {import('$lib/types').SessionAction} SessionAction
 */

import { CATEGORY, PROMPT, RESPONSE, ROUND_STATES, TIMER } from '$lib/constants';
import { parseSessionRequest } from '$lib/game/helpers';

export const prompt = {
	/**
	 * Customize the prompt
	 * @type {SessionAction}
	 */
	customize: async (cookies, params, request) => {
		const { form, sm } = await parseSessionRequest(cookies, params, request);
		await sm.roundRef.update({
			prompt: form.get(PROMPT),
			response: form.get(RESPONSE),
			category: form.get(CATEGORY),
			custom: true,
		});
	},
	/**
	 * Accept the prompt
	 * @type {SessionAction}
	 */
	accept: async (cookies, params, request) => {
		const { form, sm } = await parseSessionRequest(cookies, params, request);
		const timer = Number(form.get(TIMER));
		const time = new Date().getTime() + timer * 1000;
		await sm.roundRef.update({ time, state: ROUND_STATES.GUESS });
	},
	/**
	 * Generate a new prompt
	 * @type {SessionAction}
	 */
	randomize: async (cookies, params, request) => {
		const { sm } = await parseSessionRequest(cookies, params, request);
		const { category: randomCategory, pair: randomPair } = await sm.randomPair();
		await sm.roundRef.update({
			prompt: randomPair.prompt,
			response: randomPair.response,
			category: randomCategory,
			custom: false,
		});
	},
};
