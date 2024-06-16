import { describe, it, expect } from 'vitest';
import { getRoundScores } from '$lib/score';

const initialScoreboard = { P1: 1, P2: 0, P3: 0 };
const dasher = 'P1';

describe('score calculation', () => {
	it('Should output the same players as given by the scoreboard', () => {
		const result = getRoundScores(dasher, {}, {}, [], initialScoreboard);
		expect(Object.keys(result)).toEqual(Object.keys(initialScoreboard));
	});
	it('Should accumulate scores', () => {
		// TODO
	});
	it('Should award points to the dasher if no one guesses the response', () => {
		// TODO
	});
	it('Should award points to the correct guessers but not the dasher', () => {
		// TODO
	});
	it('Should award points for correct votes', () => {
		// TODO
	});
	it('Should award points to users with upvotes', () => {
		// TODO
	});
	it('Should award double points for upvoted double bluffs', () => {
		// TODO
	});
	it('Should subtract points for unvoted double bluffs', () => {
		// TODO
	});
	it('Should stack points for correct guess and receiving votes', () => {
		// TODO
	});
	it('Should balance points for correct guess and not receiving double-bluffed votes', () => {
		// TODO
	});
});
