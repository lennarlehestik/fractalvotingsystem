// Import the functions you need from the SDKs you need
import firebase from "firebase";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdGoZcC3UL2vU110PR8aZA1XzV9B4Jv0Q",
  authDomain: "spanishfractal.firebaseapp.com",
  projectId: "spanishfractal",
  storageBucket: "spanishfractal.appspot.com",
  messagingSenderId: "581958750248",
  appId: "1:581958750248:web:a70f5633e51af181ce651d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebase;
