/**
 * @typedef {import("firebase-admin").ServiceAccount} ServiceAccount
 */

import { dev } from '$app/environment';
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
} from '$env/static/private';
import { PUBLIC_DEV_FB_DATABASE_URL, PUBLIC_PROD_FB_DATABASE_URL } from '$env/static/public';
import admin from 'firebase-admin';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';

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

export const firebaseApp =
	getApps().length > 0
		? getApp()
		: initializeApp({
				credential: admin.credential.cert(/** @type {ServiceAccount} */ (serviceAccount)),
				databaseURL: dev ? PUBLIC_DEV_FB_DATABASE_URL : PUBLIC_PROD_FB_DATABASE_URL,
			});
