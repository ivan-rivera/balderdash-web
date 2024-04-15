// TODO: Add SDKs for Firebase products that you want to use
// TODO: Add prod config
// https://firebase.google.com/docs/web/setup#available-libraries
import { getApp, getApps, initializeApp } from 'firebase/app';
import { dev } from '$app/environment';
import {
	PUBLIC_DEV_FB_API_KEY,
	PUBLIC_PROD_FB_API_KEY,
	PUBLIC_DEV_FB_AUTH_DOMAIN,
	PUBLIC_PROD_FB_AUTH_DOMAIN,
	PUBLIC_DEV_FB_PROJECT_ID,
	PUBLIC_PROD_FB_PROJECT_ID,
	PUBLIC_DEV_FB_STORAGE_BUCKET,
	PUBLIC_PROD_FB_STORAGE_BUCKET,
	PUBLIC_DEV_FB_MESSAGING_SENDER_ID,
	PUBLIC_PROD_FB_MESSAGING_SENDER_ID,
	PUBLIC_DEV_FB_APP_ID,
	PUBLIC_PROD_FB_APP_ID,
	PUBLIC_DEV_FB_MEASUREMENT_ID,
	PUBLIC_PROD_FB_MEASUREMENT_ID,
	PUBLIC_DEV_FB_DATABASE_URL,
	PUBLIC_PROD_FB_DATABASE_URL,
} from '$env/static/public';

const fbConfig = {
	apiKey: dev ? PUBLIC_DEV_FB_API_KEY : PUBLIC_PROD_FB_API_KEY,
	authDomain: dev ? PUBLIC_DEV_FB_AUTH_DOMAIN : PUBLIC_PROD_FB_AUTH_DOMAIN,
	projectId: dev ? PUBLIC_DEV_FB_PROJECT_ID : PUBLIC_PROD_FB_PROJECT_ID,
	storageBucket: dev ? PUBLIC_DEV_FB_STORAGE_BUCKET : PUBLIC_PROD_FB_STORAGE_BUCKET,
	messagingSenderId: dev ? PUBLIC_DEV_FB_MESSAGING_SENDER_ID : PUBLIC_PROD_FB_MESSAGING_SENDER_ID,
	appId: dev ? PUBLIC_DEV_FB_APP_ID : PUBLIC_PROD_FB_APP_ID,
	measurementId: dev ? PUBLIC_DEV_FB_MEASUREMENT_ID : PUBLIC_PROD_FB_MEASUREMENT_ID,
	databaseURL: dev ? PUBLIC_DEV_FB_DATABASE_URL : PUBLIC_PROD_FB_DATABASE_URL,
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(fbConfig);
