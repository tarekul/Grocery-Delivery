import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
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

// ✅ Exports
const realtimeDB = getDatabase(app);
const firestoreDB = getFirestore(app);
const auth = getAuth(app);

export { app, auth, firestoreDB, realtimeDB };
