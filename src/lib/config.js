// TODO: Add SDKs for Firebase products that you want to use
// TODO: Add prod config
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDokc3omMEIQyGkUEXiqyAxn-bQwa5Xijc',
	authDomain: 'balderdash2-dev.firebaseapp.com',
	projectId: 'balderdash2-dev',
	storageBucket: 'balderdash2-dev.appspot.com',
	messagingSenderId: '808206264038',
	appId: '1:808206264038:web:234eef3539d2126e4bbd27',
	measurementId: 'G-S9XQGWRE7F',
	databaseURL: 'https://balderdash2-dev-default-rtdb.europe-west1.firebasedatabase.app/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// export const analytics = getAnalytics(app);

export const config = {
	devPort: 4173,
    url: 'https://www.balderdash.app',
	appVersion: '2.0.0',
	toastTimeout: 5000,
	maxUsernameLength: 12,
	minPlayersRequired: 3,
	customPrompt: {
		minPromptLength: 2,
		maxPromptLength: 64,
		minResponseLength: 4,
		maxResponseLength: 300,
	},
	timer: {
		default: 60,
		increment: 10,
		min: 30,
		max: 120,
	},
	sessionId: {
		numCharacters: 5,
		numIntegers: 3,
	},
	rounds: {
		min: 4,
		max: 15,
	},
	aiGuesses: {
		min: 0,
		max: 3,
	},
	categories: [
		{
			name: 'Rare words',
			description: 'Guess the definition',
			source: 'https://raw.githubusercontent.com/balderdash-app/balderdash-web/main/static/dev/words.json',
			enabled: true,
			promptName: 'word',
			responseName: 'definition',
		},
		{
			name: 'Scientific names',
			description: 'Guess the common name',
			source: 'https://raw.githubusercontent.com/balderdash-app/balderdash-web/main/static/dev/latin.json',
			enabled: true,
			promptName: 'Latin name',
			responseName: 'common name',
		},
		{
			name: 'Film taglines',
			description: 'Guess the tagline',
			source: 'https://raw.githubusercontent.com/balderdash-app/balderdash-web/main/static/dev/taglines.json',
			enabled: true,
			promptName: 'film title',
			responseName: 'tagline',
		},
		{
			name: 'Famous people',
			description: 'Guess why they are famous',
			source: 'https://raw.githubusercontent.com/balderdash-app/balderdash-web/main/static/dev/people.json',
			enabled: true,
			promptName: 'person',
			responseName: 'claim to fame',
		},
	],
};
