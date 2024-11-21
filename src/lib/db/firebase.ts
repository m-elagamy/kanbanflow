import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOgyzGtPNqZmQ1Zsk2MvfWG_BwfSO1pzk",
  authDomain: "kanban-app-59da2.firebaseapp.com",
  projectId: "kanban-app-59da2",
  storageBucket: "kanban-app-59da2.firebasestorage.app",
  messagingSenderId: "839563947077",
  appId: "1:839563947077:web:95384621656c96fe68072c",
  measurementId: "G-K3PX6HR22E",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
