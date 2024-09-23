// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Tkjop9y6c-UJk0LcmsTb_woxG5P-Tp8",
  authDomain: "put-me-on-418b7.firebaseapp.com",
  projectId: "put-me-on-418b7",
  storageBucket: "put-me-on-418b7.appspot.com",
  messagingSenderId: "320236600380",
  appId: "1:320236600380:web:9b66fcae15475719645739",
  measurementId: "G-6F6PH5S8GB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);