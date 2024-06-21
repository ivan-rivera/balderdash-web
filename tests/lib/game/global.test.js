/**
 * @typedef {import('$lib/types').Session} Session
 * @typedef {import('$lib/types').Round} Round
 */

import { KICKED, KICKER, ROUND_STATES } from '$lib/constants';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { describe, it, expect, beforeAll } from 'vitest';
import { feedback, kick } from '$lib/game/global';
import { REFS } from '$lib/constants';

beforeAll(async () => {
	createParseSessionRequestMock();
});

describe('globally available actions', () => {
	it('should remove a player from the scoreboard and add them to the kick register', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ [KICKED]: 'P2', [KICKER]: 'P1' },
			REFS.SESSION,
		);
		await kick(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			kicked: { P2: 'P1' },
			'scoreboard/P2': null,
			'rounds/1': {
				category: expect.anything(),
				custom: false,
				dasher: expect.anything(),
				guesses: [],
				prompt: expect.anything(),
				response: expect.anything(),
				state: ROUND_STATES.SELECT,
				timer: expect.anything(),
			},
		});
	});
	it('should submit feedback', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ feedback: 'hello!' },
			REFS.FEEDBACK,
		);
		await feedback(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			[mockParams.sessionId]: { uid: 'uid', feedback: 'hello!' },
		});
	});
});
