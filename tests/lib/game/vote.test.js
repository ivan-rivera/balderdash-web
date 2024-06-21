import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { REFS, ROUND_STATES, SELECTED_GROUP, VOTES } from '$lib/constants.js';
import { proceed, cast } from '$lib/game/vote.js';

beforeAll(async () => {
	createParseSessionRequestMock();
});

describe('voting stage', () => {
	it('should cast a vote', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P2',
			{ [SELECTED_GROUP]: 'Group 1' },
			REFS.ROUND,
		);
		await cast(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			[`${VOTES}/P2`]: 'Group 1',
		});
	});
	it('continue to next stage', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			scoreboard: expect.anything(),
			'rounds/1/state': ROUND_STATES.TALLY,
		});
	});
});
