// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0AP7_gXqZwJIvUExgj88j-z7YJL37X9E",
  authDomain: "cs110-project-715b3.firebaseapp.com",
  projectId: "cs110-project-715b3",
  storageBucket: "cs110-project-715b3.appspot.com",
  messagingSenderId: "453988137190",
  appId: "1:453988137190:web:8e5a96bb017bee268e6327",
  measurementId: "G-SKV46435PW"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);