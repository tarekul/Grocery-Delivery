const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  databaseURL: `https://${process.env.REACT_APP_PROJECT_ID}-default-rtdb.firebaseio.com/`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // Correctly initialize Firestore

export { app, db };
