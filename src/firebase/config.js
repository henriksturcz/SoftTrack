import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAK999T7dI1i_fc56E3zNrWsp63IZzgOo0",
  authDomain: "softtrack-a219e.firebaseapp.com",
  databaseURL: "https://softtrack-a219e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "softtrack-a219e",
  storageBucket: "softtrack-a219e.firebasestorage.app",
  messagingSenderId: "1077630719734",
  appId: "1:1077630719734:web:44a5f181c8a3279a457ed7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;