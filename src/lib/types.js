/**
 * @typedef {import("firebase/database").DatabaseReference} DatabaseReference
 *
 * Possible session states
 * @typedef {'INITIATED'|'STARTED'|'FINISHED'|'LOADING'|'UNKNOWN'} SessionState
 *
 * Possible round states
 * @typedef {'SELECTING'|'GUESSING'|'MARKING'|'VOTING'|'REVEALING'|'TALLYING'|'LOADING'|'UNKNOWN'} RoundState
 *
 * Inactive player states
 * @typedef {'KICKED'|'OUTSIDER'|'READY'|'LOADING'|'UNKNOWN'} PlayerState
 *
 * Available categories
 * @typedef {'Rare words'|'Scientific names'|'Film taglines'|'Famous people'} Category
 *
 * Session data structure
 * @typedef {Object} Session
 * @property {SessionState} state - Current state of the session
 * @property {string} creator - Username of session creator
 * @property {number} limit - Round limit
 * @property {number} current - Current round
 * @property {number} ais - Number of AI guesses
 * @property {Category[]} categories - Categories included
 * @property {Scoreboard} scoreboard - A mapping between players and their most recent scores
 * @property {Object.<number, Round>} rounds - Round data
 * @property {Object.<string, string>} kicked - Kicked players: kicked as key and kicker as value
 *
 * Round data structure
 * @typedef {Object} Round
 * @property {string} dasher - Username of the dasher for that round
 * @property {string} prompt - prompt
 * @property {string} response - response to the prompt
 * @property {boolean} custom - whether the prompt is custom
 * @property {number} timer - timer in seconds to guess the prompt
 * @property {RoundState} state - Current state of the round
 * @property {Category} category - category for the round
 * @property {Array<Guess>} guesses - guesses made by players
 *
 * Guess data structure
 * @typedef {Object} Guess
 * @property {string} username - Username who submitted the guess
 * @property {string} response - Response to the prompt
 * @property {boolean} correct - Whether the guess was correct
 * @property {boolean} double - double bluff enabled
 * @property {Array<string>} votes - Usernames who votes for this definition
 *
 * A mapping between players and their latest aggregate scores
 * @typedef {Object.<string, number>} Scoreboard
 */
export {};
