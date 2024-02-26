import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB0cY47H_EKQ1LmAKRWWYaeXZfaj1kNs2g",
  authDomain: "nwitter-reloaded-6d6a6.firebaseapp.com",
  projectId: "nwitter-reloaded-6d6a6",
  storageBucket: "nwitter-reloaded-6d6a6.appspot.com",
  messagingSenderId: "262821786255",
  appId: "1:262821786255:web:d8e2f9adc2ccf76ec9f6fa"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);