import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { refreshVocabs } from '$lib/vocab.js';
import { REFS, ROUND_STATES } from '$lib/constants.js';
import { proceed } from '$lib/game/mark';
import { dummySessionManager } from '../../support/data.js';
import { SCORE } from '$lib/score.js';

beforeAll(async () => {
	createParseSessionRequestMock();
	await refreshVocabs();
});

describe('mark responses', () => {
	it('should assign correct guesses to submitters', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: '1', P3: '0', P4: '0' },
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
	it('should interrupt if there is a single submission but assign points for correct answers', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P3: '1' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			scoreboard: {
				P1: expect.anything(),
				P2: expect.anything(),
				P3: SCORE.CORRECT_GUESS,
				P4: expect.anything(),
			},
			'rounds/1/guesses/P3/correct': true,
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
	it('should not interrupt AI count is greater than 0 but move to voting with one incorrect guess', async () => {
		dummySessionManager.session.ais = 1;
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: '1', P3: '1', P4: '0' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			'rounds/1/state': ROUND_STATES.VOTE,
			'rounds/1/guesses/P2/correct': true,
			'rounds/1/guesses/P3/correct': true,
			'rounds/1/guesses/NPC-0': {
				response: 'NPC 0',
				correct: false,
				double: false,
				group: `NPC 0`,
				automatic: true,
			},
		});
	});
	it('should interrupt if AI count is greater than 0 but all guesses are correct', async () => {
		dummySessionManager.session.ais = 1;
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: '1', P3: '1', P4: '1' },
			REFS.SESSION,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			scoreboard: expect.anything(),
			'rounds/1/guesses/P2/correct': true,
			'rounds/1/guesses/P3/correct': true,
			'rounds/1/guesses/P4/correct': true,
			'rounds/1/state': ROUND_STATES.TALLY,
			'rounds/1/interruption': '1 or fewer incorrect guesses were submitted',
		});
	});
});
