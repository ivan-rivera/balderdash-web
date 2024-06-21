import { describe, it, expect } from 'vitest';
import { getRoundScores, SCORE } from '$lib/score';
import { TRUE_RESPONSE } from '$lib/constants.js';

const initialScoreboard = { P1: 1, P2: 0, P3: 0, P4: 0 };

describe('score calculation', () => {
	it('Should output the same players as given by the scoreboard', () => {
		const result = getRoundScores('P1', {}, {}, [], initialScoreboard);
		expect(Object.keys(result)).toEqual(Object.keys(initialScoreboard));
	});
	it('Should accumulate scores', () => {
		const result = getRoundScores('P2', {}, {}, ['P1'], initialScoreboard);
		expect(result.P1).toBe(initialScoreboard.P1 + SCORE.CORRECT_GUESS);
		expect(result.P2).toBe(0);
	});
	it('Should award points to the dasher if no one guesses the response', () => {
		const result = getRoundScores('P1', {}, {}, [], initialScoreboard);
		expect(result.P1).toBe(initialScoreboard.P1 + SCORE.DASHER.UNGUESSED);
	});
	it('Should award points for correct votes', () => {
		const result = getRoundScores('P1', { P2: TRUE_RESPONSE }, {}, [], initialScoreboard);
		expect(result.P2).toBe(SCORE.CORRECT_VOTE);
	});
	it('Should award points to users with up-votes', () => {
		const result = getRoundScores(
			'P1',
			{ P2: 'Group 1', P3: 'Group 2' },
			{ P4: { group: 'Group 1', double: false } },
			[],
			initialScoreboard,
		);
		expect(result.P4).toBe(SCORE.VOTE_RECEIVED);
	});
	it('Should award double points for up-voted double bluffs', () => {
		const result = getRoundScores(
			'P1',
			{ P2: 'Group 1', P3: 'Group 2' },
			{ P4: { group: 'Group 1', double: true } },
			[],
			initialScoreboard,
		);
		expect(result.P4).toBe(SCORE.VOTE_RECEIVED * SCORE.DB.POSITIVE);
	});
	it('Should subtract points for un-voted double bluffs', () => {
		const result = getRoundScores(
			'P1',
			{ P2: 'Group 2', P3: 'Group 2' },
			{ P4: { group: 'Group 1', double: true } },
			[],
			initialScoreboard,
		);
		expect(result.P4).toBe(SCORE.DB.NEGATIVE);
	});
});
