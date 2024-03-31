/**
 * @typedef {import("./types.js").Category} Category
 */

import { config } from './config.js';

/**
 * Load vocabulary for a given category
 * @param {string} source - source of the category
 * @returns {Promise<Object.<string, string>>} - a prompt and its response
 */
async function loadVocab(source) {
	return await (await fetch(source)).json();
}

/**
 * Get a random prompt-response pair from a vocabulary
 * @param {Object.<string, string>} vocab - a dictionary of prompt-response pairs
 * @returns {Object.<string, string>} - a random prompt-response pair
 */
export function getRandomPair(vocab) {
	const keys = Object.keys(vocab);
	const index = Math.floor(Math.random() * keys.length);
	const key = keys[index];
	return { prompt: key, response: vocab[key] };
}

/**
 * Get a phony response to a prompt
 * @param {Object.<string, string>} vocab - a dictionary of prompt-response pairs
 * @param {string} truePrompt - true prompt
 * @returns {string} - a phony response to a prompt
 */
export function getPhonyResponse(vocab, truePrompt) {
	const { prompt, response } = getRandomPair(vocab);
	return prompt === truePrompt ? getPhonyResponse(vocab, response) : response;
}

/**
 * Get vocabularies for each category
 * @returns {Promise<Object.<Category, Object.<string, string>>[]>}
 */
export async function loadVocabs() {
	const vocabPromises = config.categories.map(async (category) => {
		return {
			category: category.name,
			vocab: await loadVocab(category.source),
		};
	});
	return Promise.all(vocabPromises);
}

/**
 * Category names and their vocabularies
 */
export let vocabs = await loadVocabs();

export async function refreshVocabs() {
	vocabs = await loadVocabs();
}
