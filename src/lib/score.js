/**
 * @typedef {import('$lib/types').Scoreboard} Scoreboard
 */
// TODO: write unit tests for score calculator

import { TRUE_RESPONSE } from '$lib/constants';

const SCORE = {
	DASHER: {
		GUESSED: 0,
		UNGUESSED: 3,
	},
	CORRECT_GUESS: 3,
	CORRECT_VOTE: 2,
	VOTE_RECEIVED: 1,
	DB: {
		POSITIVE: 2,
		NEGATIVE: -3,
	},
};

/**
 * Calculate round scores
 * @param {string} dasher - round dasher
 * @param {Object.<string, string>} votes - a mapping between user and the group they voted for
 * @param {Object.<string, {group: string, double: boolean}>} guesses - a mapping between user and their guess (group and double status)
 * @param {string[]} correct - correct guessers
 * @param {Scoreboard} scoreboard - current scoreboard
 */
export function getRoundScores(dasher, votes, guesses, correct, scoreboard) {
	const groupCounts = Object.values(
		Object.fromEntries(Object.entries(votes).filter(([_, group]) => group !== TRUE_RESPONSE)),
	).reduce((acc, group) => {
		acc[group] = (acc[group] || 0) + 1;
		return acc;
	}, /** @type {Object.<string, number>} */ ({}));

	const dasherScore = {
		[dasher]: correct.length === 0 ? SCORE.DASHER.UNGUESSED : SCORE.DASHER.GUESSED,
	};
	const correctGuessScore = correct.reduce(
		(acc, user) => ({ ...acc, [user]: SCORE.CORRECT_GUESS }),
		{},
	);
	const correctVoteScore = Object.entries(votes)
		.filter(([_, group]) => group === TRUE_RESPONSE)
		.map(([user]) => user)
		.reduce((acc, user) => ({ ...acc, [user]: SCORE.CORRECT_VOTE }), {});

	const voteScore = Object.keys(guesses)
		.filter((user) => !correct.includes(user))
		.reduce((acc, user) => {
			const { group, double } = guesses[user];
			const score = groupCounts[group] ?? 0;
			acc[user] = double ? (score > 0 ? score * SCORE.DB.POSITIVE : SCORE.DB.NEGATIVE) : score;
			return acc;
		}, /** @type {Object.<string, number>} */ ({}));

	const scores = [dasherScore, correctGuessScore, correctVoteScore, voteScore];
	const combinedScore = scores.reduce((acc, obj) => {
		Object.keys(obj).forEach((key) => {
			// @ts-ignore
			acc[key] = (acc[key] || 0) + obj[key];
		});
		return acc;
	}, /** @type {Object.<String, number>} */ ({}));

	const incrementedScoreboard = Object.fromEntries(
		Object.entries(scoreboard).map(([key, value]) => [
			key,
			(value || 0) + (combinedScore[key] || 0),
		]),
	);

	return incrementedScoreboard;
}
