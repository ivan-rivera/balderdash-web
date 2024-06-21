/**
 * @typedef {import('$lib/types').Scoreboard} Scoreboard
 */

import { TRUE_RESPONSE } from '$lib/constants';

export const SCORE = {
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
	const groupCounts = calculateGroupCounts(votes);
	const dasherScore = calculateDasherScore(dasher, correct);
	const correctGuessScore = calculateCorrectGuessScore(correct);
	const correctVoteScore = calculateCorrectVoteScore(votes);
	const voteScore = calculateVoteScore(guesses, correct, groupCounts);
	const combinedScore = combineScores(dasherScore, correctGuessScore, correctVoteScore, voteScore);
	return incrementScoreboard(scoreboard, combinedScore);
}

function calculateDasherScore(dasher, correct) {
	return {
		[dasher]: correct.length === 0 ? SCORE.DASHER.UNGUESSED : SCORE.DASHER.GUESSED,
	};
}

function calculateCorrectGuessScore(correct) {
	return correct.reduce((acc, user) => ({ ...acc, [user]: SCORE.CORRECT_GUESS }), {});
}

function calculateCorrectVoteScore(votes) {
	return Object.entries(votes)
		.filter(([_, group]) => group === TRUE_RESPONSE)
		.map(([user]) => user)
		.reduce((acc, user) => ({ ...acc, [user]: SCORE.CORRECT_VOTE }), {});
}

function calculateVoteScore(guesses, correct, groupCounts) {
	return Object.keys(guesses)
		.filter((user) => !correct.includes(user))
		.reduce((acc, user) => {
			const { group, double } = guesses[user];
			const score = groupCounts[group] ?? 0;
			acc[user] = double ? (score > 0 ? score * SCORE.DB.POSITIVE : SCORE.DB.NEGATIVE) : score;
			return acc;
		}, {});
}

function calculateGroupCounts(votes) {
	return Object.values(
		Object.fromEntries(Object.entries(votes).filter(([_, group]) => group !== TRUE_RESPONSE)),
	).reduce((acc, group) => {
		acc[group] = (acc[group] || 0) + 1;
		return acc;
	}, {});
}

function combineScores(dasherScore, correctGuessScore, correctVoteScore, voteScore) {
	const scores = [dasherScore, correctGuessScore, correctVoteScore, voteScore];
	return scores.reduce((acc, obj) => {
		Object.keys(obj).forEach((key) => {
			acc[key] = (acc[key] || 0) + obj[key];
		});
		return acc;
	}, {});
}

function incrementScoreboard(scoreboard, combinedScore) {
	return Object.fromEntries(
		Object.entries(scoreboard).map(([key, value]) => [
			key,
			(value || 0) + (combinedScore[key] || 0),
		]),
	);
}
