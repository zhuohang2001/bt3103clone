import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCJLRf5tfz3xRMCxc_TX0nYCKa6fYKOVSE",
    authDomain: "wanderer-s-marketplace.firebaseapp.com",
    projectId: "wanderer-s-marketplace",
    storageBucket: "wanderer-s-marketplace.appspot.com",
    messagingSenderId: "294434751530",
    appId: "1:294434751530:web:c9b1140d19e38545866f53"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export default app;