/**
 * @typedef {import("./types.js").Category} Category
 */

import { config } from './config.js';

/** @param {boolean} disabled */
export const getButtonVariant = (disabled) => (disabled ? 'variant-ghost' : 'variant-filled');

/**
 * Get appropriate prompt and response names for a given category
 * @param {Category} category 
 */
export function getCategoryWords(category) {
    let targetCategory = config.categories.find((cat) => cat.name === category);
    let prompt = targetCategory?.promptName || '';
    let response = targetCategory?.responseName || '';
    return { prompt, response };
}

/**
 * Convert snake_case to TitleCase
 * @param {string} str
 */
export function toTitleCase(str) {
    return str
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}