// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// TODO: Add prod config
// https://firebase.google.com/docs/web/setup#available-libraries

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
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
// export const analytics = getAnalytics(app);
