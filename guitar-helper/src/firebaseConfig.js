// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Note: getAnalytics is not used in our app code, but it's fine to leave it.
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB_FF8VQOoMos0v5dB0XNDjJmUtVCLpjY",
  authDomain: "guitarr-5242c.firebaseapp.com",
  projectId: "guitarr-5242c",
  storageBucket: "guitarr-5242c.appspot.com", // Corrected the domain
  messagingSenderId: "641739915645",
  appId: "1:641739915645:web:8e97aee5a9c4aad3620c14",
  measurementId: "G-ZETY3Q0HZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export the services your app needs
export const auth = getAuth(app);
export const db = getFirestore(app);

// You can keep analytics if you plan to use it
const analytics = getAnalytics(app);