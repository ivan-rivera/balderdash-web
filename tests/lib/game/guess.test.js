import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { refreshVocabs } from '$lib/vocab.js';
import {
	DEFAULT_GUESS,
	DOUBLE_BLUFF,
	GUESS,
	GUESSES,
	INTERRUPTION,
	REFS,
	ROUND_STATES,
	SCOREBOARD,
	STATE,
} from '$lib/constants.js';
import { proceed, submit } from '$lib/game/guess.js';
import { dummySessionManager } from '../../support/data.js';

beforeAll(async () => {
	createParseSessionRequestMock();
	await refreshVocabs();
});

describe('guessing', () => {
	it('should assign guess to a player', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ [GUESS]: 'Something', [DOUBLE_BLUFF]: 'true' },
			REFS.ROUND,
		);
		await submit(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			[`${GUESSES}/P1`]: { ...DEFAULT_GUESS, response: 'Something', double: true },
		});
	});
	it('should continue to the next stage', async () => {
		dummySessionManager.round.guesses = { P2: 'Something', P3: 'Other' };
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			[`${dummySessionManager.roundPath.current}/${STATE}`]: ROUND_STATES.MARK,
		});
	});
	it('should interrupt the game if most guessed correctly', async () => {
		dummySessionManager.round.guesses = {};
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			[`${SCOREBOARD}`]: expect.anything(),
			[`${dummySessionManager.roundPath.current}/${STATE}`]: ROUND_STATES.TALLY,
			[`${dummySessionManager.roundPath.current}/${INTERRUPTION}`]: 'No guesses were submitted',
		});
	});
});
