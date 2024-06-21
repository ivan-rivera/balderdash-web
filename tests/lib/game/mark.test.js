import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { refreshVocabs } from '$lib/vocab.js';
import { REFS, ROUND_STATES } from '$lib/constants.js';
import { proceed } from '$lib/game/mark';
import { dummySessionManager } from '../../support/data.js';

beforeAll(async () => {
	createParseSessionRequestMock();
	await refreshVocabs();
});

describe('mark responses', () => {
	it('should assign correct guesses to submitters', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: '1', P3: '0' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			'rounds/1/guesses/P2/correct': true,
			'rounds/1/state': ROUND_STATES.GROUP,
		});
	});
	it('should interrupt if there is a single submission', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P3: '0' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			scoreboard: expect.anything(),
			'rounds/1/interruption': '1 or fewer incorrect guesses were submitted',
			'rounds/1/state': ROUND_STATES.TALLY,
		});
	});
	it('should interrupt if there are fewer than 2 incorrect guesses', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: '1', P3: '1' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			scoreboard: expect.anything(),
			'rounds/1/guesses/P2/correct': true,
			'rounds/1/guesses/P3/correct': true,
			'rounds/1/interruption': '1 or fewer incorrect guesses were submitted',
			'rounds/1/state': ROUND_STATES.TALLY,
		});
	});
	it('should not interrupt AI count is greater than 0', async () => {
		dummySessionManager.session.ais = 1;
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: '1', P3: '1' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			'rounds/1/guesses/P2/correct': true,
			'rounds/1/guesses/P3/correct': true,
			'rounds/1/state': ROUND_STATES.GROUP,
		});
	});
});
