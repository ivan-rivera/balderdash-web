import { describe, it, expect, beforeAll } from 'vitest';
import { createParseSessionRequestMock, setupMocks } from '../../support/mocks.js';
import { REFS, ROUND_STATES } from '$lib/constants';
import { prompt } from '$lib/game/select';

beforeAll(async () => {
	createParseSessionRequestMock();
});

describe('selecting stage', () => {
	it('should set a custom prompt', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{ prompt: 'prompt', response: 'response', category: 'Rare words' },
			REFS.ROUND,
		);
		await prompt.customize(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			prompt: 'prompt',
			response: 'response',
			category: 'Rare words',
			custom: true,
		});
	});
	it('should pick a random prompt', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.ROUND,
		);
		await prompt.randomize(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			prompt: expect.any(String),
			response: expect.any(String),
			category: expect.any(String),
			custom: false,
		});
	});
	it('continue to the next stage', async () => {
		const { mockCookies, mockRequest, mockParams, mockUpdate } = await setupMocks(
			'P1',
			{},
			REFS.ROUND,
		);
		await prompt.accept(mockCookies, mockParams, mockRequest);
		expect(mockUpdate).toHaveBeenCalledWith({
			state: ROUND_STATES.GUESS,
			time: expect.anything(),
		});
	});
});
