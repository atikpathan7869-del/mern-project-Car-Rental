// Firebase core
import { initializeApp } from "firebase/app";

// Firebase Auth
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// (Optional) Analytics
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgoF9KZA01n80tZQIg3e99hPqfhCi8fbE",
  authDomain: "car-rental-5e01f.firebaseapp.com",
  projectId: "car-rental-5e01f",
  storageBucket: "car-rental-5e01f.appspot.com",
  messagingSenderId: "498508145062",
  appId: "1:498508145062:web:64afee841a0caa8f91af67",
  measurementId: "G-2SEY0K06G7",
};

// Initialize Firebase (ONLY ONCE)
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Optional analytics
export const analytics = getAnalytics(app);
