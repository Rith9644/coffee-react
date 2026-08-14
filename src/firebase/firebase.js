// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLR4RE1F_hm3IxIaJZSO_cOo1dzFiHL6E",
  authDomain: "coffee-react-f45d6.firebaseapp.com",
  projectId: "coffee-react-f45d6",
  storageBucket: "coffee-react-f45d6.firebasestorage.app",
  messagingSenderId: "111973695210",
  appId: "1:111973695210:web:47376e33904dc94522e193",
  measurementId: "G-R7GVRT5NSC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);