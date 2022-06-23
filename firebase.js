// Import the functions you need from the SDKs you need
import firebase from "firebase";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsYiRx4tl2AkvX7B-C3HopfTNhaPGafVM",
  authDomain: "edenfracfront.firebaseapp.com",
  projectId: "edenfracfront",
  storageBucket: "edenfracfront.appspot.com",
  messagingSenderId: "820757376798",
  appId: "1:820757376798:web:fe2597de389de461db630f",
  measurementId: "G-7RGSZLT8GC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebase;
