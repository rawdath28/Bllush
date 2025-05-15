// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
// Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5GY4tOXq4wcdpcbo7QDBu9vu9VPiy6CY",
    authDomain: "buddyapp-456e8.firebaseapp.com",
    projectId: "buddyapp-456e8",
    storageBucket: "buddyapp-456e8.firebasestorage.app",
    messagingSenderId: "67442204711",
    appId: "1:67442204711:web:66314dc79beb5b4854ee02",
    measurementId: "G-Z4QEF7QBNG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export { db, storage, functions };
export default app; 