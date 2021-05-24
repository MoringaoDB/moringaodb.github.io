
if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /init.js');

const firebaseConfig = {
    apiKey: "AIzaSyAzjHVWl0M-0O7z9EYJqvprSBILsv-AZuk",
    authDomain: "moringaodb.firebaseapp.com",
    projectId: "moringaodb",
    databaseURL: "https://moringaodb.firebaseio.com",
    storageBucket: "moringaodb.appspot.com",
    messagingSenderId: "926960248992",
    appId: "1:926960248992:web:60d617a0d47141d09241c5",
    measurementId: "G-FFBL1E2Q03"
};

firebase.initializeApp(firebaseConfig);