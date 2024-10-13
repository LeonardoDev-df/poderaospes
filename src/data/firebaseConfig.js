// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUjXx7FRpSRt6_yQcqL6l4ykEMHkpZkGo",
  authDomain: "aplicativo-306f4.firebaseapp.com",
  projectId: "aplicativo-306f4",
  storageBucket: "aplicativo-306f4.appspot.com",
  messagingSenderId: "52766198476",
  appId: "1:52766198476:web:7e54e984480e38a3ba5069",
  measurementId: "G-JY3GE8C2MY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
