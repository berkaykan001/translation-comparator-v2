// Firebase Configuration for Translation Comparator App
// Project: translationComparatorApp
// Account: berkay_k94_@hotmail.com

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Get these values from Firebase Console
// Go to: Project Settings → General → Your apps → Web app
// Click "Add app" if you haven't created a web app yet
// Copy the firebaseConfig object
const firebaseConfig = {
  apiKey: "AIzaSyCWwbdiJN_tKMR3l1oAWF-HuLMTJ4OpEUc",
  authDomain: "translationcomparatorapp.firebaseapp.com",
  projectId: "translationcomparatorapp",
  storageBucket: "translationcomparatorapp.firebasestorage.app",
  messagingSenderId: "1040355774453",
  appId: "1:1040355774453:web:2121e8c09069d09fd39abc", // ← Update this from Firebase Console
  // measurementId: "G-XXXXXXXXXX", // Optional: if you enable Google Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
