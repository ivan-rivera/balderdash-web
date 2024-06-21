import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { REFS, ROUND_STATES, SESSION_STATES } from '$lib/constants.js';
import { proceed } from '$lib/game/tally';
import { dummySessionManager } from '../../support/data.js';

beforeAll(async () => {
	createParseSessionRequestMock();
});

describe('tally stage', () => {
	it('should continue to the next round', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			current: { '.sv': { increment: 1 } },
			'rounds/2': {
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
	it('should end the game', async () => {
		dummySessionManager.session.current = dummySessionManager.session.limit;
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			state: SESSION_STATES.FINISHED,
		});
	});
});
