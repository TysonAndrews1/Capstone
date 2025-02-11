import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth} from "firebase/auth";


// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCzF5NV9nkv5KoLguzkuiUP8EiftOHWtm8',
  authDomain: 'shiftsolutions-b5929.firebaseapp.com',
  projectId: 'shiftsolutions-b5929',
  storageBucket: 'shiftsolutions-b5929.firebasestorage.app',
  messagingSenderId: '183712180300',
  appId: '1:183712180300:web:59063e51d0575fa1aaece9',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

// Firestore instance
export const db = getFirestore(app);
export const auth = getAuth(app);