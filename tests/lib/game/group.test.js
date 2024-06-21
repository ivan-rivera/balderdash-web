import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { refreshVocabs } from '$lib/vocab.js';
import { REFS, ROUND_STATES } from '$lib/constants.js';
import { proceed } from '$lib/game/group';
import { dummySessionManager } from '../../support/data.js';

beforeAll(async () => {
	createParseSessionRequestMock();
	await refreshVocabs();
});

describe('grouping responses', () => {
	it('should assign responses to groups', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: 'Group 1', P3: 'Group 2' },
			REFS.ROUND,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			'guesses/P2/group': 'Group 1',
			'guesses/P3/group': 'Group 2',
			state: ROUND_STATES.VOTE,
			interruption: '',
		});
	});
	it('should interrupt the session if there is only 1 distinct group and not AIs', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: 'Group 1', P3: 'Group 1' },
			REFS.ROUND,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			'guesses/P2/group': 'Group 1',
			'guesses/P3/group': 'Group 1',
			state: ROUND_STATES.TALLY,
			interruption: 'There was only 1 distinct incorrect guess!',
		});
	});
	it('should not interrupt the session if there is only 1 distinct group but there are AIs', async () => {
		dummySessionManager.session.ais = 1;
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ P2: 'Group 1', P3: 'Group 1' },
			REFS.ROUND,
		);
		await proceed(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			'guesses/NPC-1': 'NPC 1',
			'guesses/P2/group': 'Group 1',
			'guesses/P3/group': 'Group 1',
			state: ROUND_STATES.VOTE,
			interruption: '',
		});
	});
});
