// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCic6Wh4KfYMtIwJ7Vti6C47aZKCdccTho",
  authDomain: "collegeprojectdb.firebaseapp.com",
  projectId: "collegeprojectdb",
  storageBucket: "collegeprojectdb.firebasestorage.app",
  messagingSenderId: "172945601563",
  appId: "1:172945601563:web:9ea50044ad501985d534be",
  measurementId: "G-ZYQC6T2VT3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app) 