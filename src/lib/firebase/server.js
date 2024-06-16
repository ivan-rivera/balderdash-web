/**
 * @typedef {import("firebase-admin").ServiceAccount} ServiceAccount
 * @typedef {import("$lib/types").Session} Session
 * @typedef {import('@sveltejs/kit').Cookies} Cookies
 */

import jwt from 'jsonwebtoken';
import config from '$lib/config';
import { DB, TOKEN } from '$lib/constants';
import { getDatabase } from 'firebase-admin/database';
import { dev } from '$app/environment';
import admin from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import {
	PRIVATE_DEV_FB_CLIENT_EMAIL,
	PRIVATE_DEV_FB_CLIENT_ID,
	PRIVATE_DEV_FB_CLIENT_X509_CERT_URL,
	PRIVATE_DEV_FB_KEY_B64,
	PRIVATE_DEV_FB_KEY_ID,
	PRIVATE_PROD_FB_CLIENT_EMAIL,
	PRIVATE_PROD_FB_CLIENT_ID,
	PRIVATE_PROD_FB_CLIENT_X509_CERT_URL,
	PRIVATE_PROD_FB_KEY_B64,
	PRIVATE_PROD_FB_KEY_ID,
	PRIVATE_SECRET_TOKEN,
} from '$env/static/private';
import { PUBLIC_DEV_FB_DATABASE_URL, PUBLIC_PROD_FB_DATABASE_URL } from '$env/static/public';

const letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();

const serviceAccount = {
	type: 'service_account',
	project_id: dev ? 'balderdash2-dev' : 'balderdash2-prod',
	private_key_id: dev ? PRIVATE_DEV_FB_KEY_ID : PRIVATE_PROD_FB_KEY_ID,
	private_key: atob(dev ? PRIVATE_DEV_FB_KEY_B64 : PRIVATE_PROD_FB_KEY_B64).replace(/\\n/g, '\n'),
	client_email: dev ? PRIVATE_DEV_FB_CLIENT_EMAIL : PRIVATE_PROD_FB_CLIENT_EMAIL,
	client_id: dev ? PRIVATE_DEV_FB_CLIENT_ID : PRIVATE_PROD_FB_CLIENT_ID,
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url: dev
		? PRIVATE_DEV_FB_CLIENT_X509_CERT_URL
		: PRIVATE_PROD_FB_CLIENT_X509_CERT_URL,
	universe_domain: 'googleapis.com',
};

const firebaseApp =
	getApps().length > 0
		? getApp()
		: initializeApp({
				credential: admin.credential.cert(/** @type {ServiceAccount} */ (serviceAccount)),
				databaseURL: dev ? PUBLIC_DEV_FB_DATABASE_URL : PUBLIC_PROD_FB_DATABASE_URL,
			});

const rtdb = getDatabase(firebaseApp);
export const dbRef = rtdb.ref(DB);

/**
 * Get session from ID
 * @param {string} id - session ID
 * @returns {Promise<Session>} - session data
 */
export async function getSession(id) {
	const snapshot = await dbRef.child(id).get();
	return /** @type {Session} */ (snapshot.val());
}

/**
 * Retrieve a random character from a string of characters
 * @param {string} array - an array of strings
 * @returns {string} - a random string from the array
 */
function generateRandomIndex(array = letters) {
	const index = Math.floor(Math.random() * array.length);
	return array[index];
}

/**
 * Create a random string of characters
 * @param {number} len - length of string to generate
 * @param {string} root - root string
 * @returns {string} - a random string
 */
function generateRandomString(len, root = '') {
	if (len === 0) return root;
	const newRoot = root + generateRandomIndex();
	return generateRandomString(len - 1, newRoot);
}

/**
 * Generate a random number as a string
 * @param {number} len - length of number to generate
 * @returns {string} - a random number formatted as a string
 */
function generateRandomNumber(len) {
	const max = Math.pow(10, len) - 1;
	const num = Math.floor(Math.random() * max);
	return String(num).padStart(len, '0');
}

/**
 * Generate a session ID consisting out of letters and integers
 * @param {number} characters - number of characters that must appear in the ID
 * @param {number} integers - number of integers that must appear in the ID
 * @returns {string} - session ID
 */
export function generateSessionId(
	characters = config.sessionId.numCharacters,
	integers = config.sessionId.numIntegers,
) {
	return generateRandomString(characters) + generateRandomNumber(integers);
}

/**
 * Create a new session ID
 * @returns {Promise<string>} session ID
 */
export async function createNewSessionId() {
	const id = generateSessionId();
	if (await sessionIdExists(id)) return createNewSessionId();
	else return id;
}

/**
 * Check if a session ID exists
 * @param {string} id - session ID
 * @returns {Promise<boolean>} - whether the session ID exists
 */
export async function sessionIdExists(id) {
	const snapshot = await dbRef.child(id).get();
	return snapshot.exists();
}

/**
 * Sign a token
 * @param {Object} payload - the payload to sign
 * @returns signed JWT token
 */
export function signToken(payload) {
	return jwt.sign(payload, PRIVATE_SECRET_TOKEN, { expiresIn: config.jwtTokenExpiration });
}

/**
 * Check whether the token is valid or not
 * @param {string} token - JWT token
 * @returns {boolean} - whether the token is valid
 */
export function tokenIsValid(token) {
	try {
		jwt.verify(token, PRIVATE_SECRET_TOKEN);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Validate JWT token
 * @param {Cookies} cookies
 * @throws {Error} - if the token is invalid
 * @returns {void}
 */
export function validateToken(cookies) {
	if (!tokenIsValid(cookies.get(TOKEN) || '')) throw new Error('Invalid JWT token');
}
