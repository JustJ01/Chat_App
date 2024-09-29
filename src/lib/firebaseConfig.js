import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-e0119.firebaseapp.com",
  projectId: "chatapp-e0119",
  storageBucket: "chatapp-e0119.appspot.com",
  messagingSenderId: "887345306682",
  appId: "1:887345306682:web:a6e0e1c3e4ba9944fe6903",
  measurementId: "G-8B3QR80K34"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
