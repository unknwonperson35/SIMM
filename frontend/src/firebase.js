import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDXLv38Lp4zIiDQNTpnktHHTaQwQqQEp58",
  authDomain: "subconscious-influence-mapper.firebaseapp.com",
  projectId: "subconscious-influence-mapper",
  storageBucket: "subconscious-influence-mapper.firebasestorage.app",
  messagingSenderId: "349738690451",
  appId: "1:349738690451:web:43f5d8078c5ef59ee4aa66",
  measurementId: "G-6L5V6KB84V",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
