import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Importamos la autenticación

const firebaseConfig = {
  apiKey: "AIzaSyCI2ZEIHoPxhcncIz8hYk-Vna8ReQhJ_-4",
  authDomain: "dashboard-5f2a0.firebaseapp.com",
  projectId: "dashboard-5f2a0",
  storageBucket: "dashboard-5f2a0.firebasestorage.app",
  messagingSenderId: "1001704445490",
  appId: "1:1001704445490:web:fef255e9698c3160c08e2b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); // Exportamos `auth`
