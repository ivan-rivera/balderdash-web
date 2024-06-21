import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { REFS, ROUND_STATES, SESSION_STATES } from '$lib/constants.js';
import { launch } from '$lib/game/lobby.js';
import { dummySessionManager } from '../../support/data.js';

beforeAll(async () => {
	createParseSessionRequestMock();
});

describe('lobby', () => {
	it('should launch the game', async () => {
		dummySessionManager.session.current = 0;
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.SESSION,
		);
		await launch(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			state: SESSION_STATES.STARTED,
			current: { '.sv': { increment: 1 } },
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
});
