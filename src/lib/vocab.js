/**
 * @typedef {import("$lib/types").Category} Category
 */

import config from '$lib/config';

let cache = {};

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
 * @returns {{prompt: string, response: string}} - a random prompt-response pair
 */
export function getRandomPair(vocab) {
	const keys = Object.keys(vocab);
	const index = Math.floor(Math.random() * keys.length);
	const key = keys[index];
	const value = vocab[key];
	return {
		prompt: capitalizeFirstLetter(key),
		response: capitalizeFirstLetter(value),
	};
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
	if (cache.vocabs) return cache.vocabs;
	cache.vocabs = (async () => {
		const vocabPromises = config.categories.map(async (category) => {
			return {
				category: category.name,
				vocab: await loadVocab(category.source),
			};
		});
		return await Promise.all(vocabPromises);
	})();
	return cache.vocabs;
}

/**
 * Capitalise first letter
 * @param string
 * @returns {string}
 */
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
