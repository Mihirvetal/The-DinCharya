import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAQwuj0SQTVwCf5uieJgDoie0VTbRjXfhM",
  authDomain: "dincharya-6d0f6.firebaseapp.com",
  databaseURL: "https://dincharya-6d0f6-default-rtdb.firebaseio.com",
  projectId: "dincharya-6d0f6",
  storageBucket: "dincharya-6d0f6.firebasestorage.app",
  messagingSenderId: "396658377841",
  appId: "1:396658377841:web:4a7ac49794328c588d07d0",
  measurementId: "G-NBN9B5EJD9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

console.log('Firebase initialized successfully');

export { auth, db, analytics, database }; 