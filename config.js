// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5QsM27zf1Q1sTsrqKTwLC597KOG2bAdE",
  authDomain: "fir-app-f9dfd.firebaseapp.com",
  projectId: "fir-app-f9dfd",
  storageBucket: "fir-app-f9dfd.firebasestorage.app",
  messagingSenderId: "308793128137",
  appId: "1:308793128137:web:27c815a3f3e988fe6f0918"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);