import fs from 'fs';
import path from 'path';
import { config } from './config.js';

/**
 * Load vocabulary for a given category
 * @param {string} source - source of the category
 * @returns {Object.<string, string>} - a prompt and its response
 */
function loadVocab(source) {
	const filePath = path.resolve('static/dev', source);
	const content = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(content);
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

export function loadVocabs() {
	return config.categories.map((category) => {
		return {
			category: category.name,
			vocab: loadVocab(category.source)
		};
	});
}

/**
 * Category names and their vocabularies
 */
export let vocabs = loadVocabs();

export function refreshVocabs() {
	vocabs = loadVocabs();
}
