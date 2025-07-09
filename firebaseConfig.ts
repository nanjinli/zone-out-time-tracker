import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

console.log('Firebase config loaded');

const firebaseConfig = {
  apiKey: "AIzaSyClcpRUYQI3LnwdKdwTfxUOnJnR80rwDsk",
  authDomain: "zoneouttracker.firebaseapp.com",
  projectId: "zoneouttracker",
  storageBucket: "zoneouttracker.firebasestorage.app",
  messagingSenderId: "668873207005",
  appId: "1:668873207005:web:b0f7bedb97dbd4b1793f34"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
