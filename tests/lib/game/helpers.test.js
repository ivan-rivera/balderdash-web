import { describe, it, expect, beforeAll } from 'vitest';
import { refreshVocabs } from '$lib/vocab.js';
import { generateAiGuesses } from '$lib/game/helpers.js';
import { dummySessionManager } from '../../support/data.js';

beforeAll(async () => {
	await refreshVocabs();
});

describe('helper functions', () => {
	it('should generate distinct and incorrect AI guesses', () => {
		const N = 2;
		const guesses = generateAiGuesses(N, () => dummySessionManager.phonyResponse);
		expect(new Set(Object.values(guesses)).size).toBe(N);
	});
});
