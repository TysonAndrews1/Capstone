import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

// Function to handle user login
export const handleLogin = async (email, password) => {
  try {

    // Attempt to sing in the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Fetch the user's data from Firestore
    const userRef = doc(db, "users", userCredential.user.uid); // Reference the user's document in FIrestore using UID
    const userSnapshot = await getDoc(userRef);

    // Check if the user data exists in Firestore
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData;
    } else {
      throw new Error("No user data found in Firestore.");
    }
  } catch (error) {
    console.error("Error logging in:", error.message);

    // Map Firebase Authentication error codes to custom error messages
    let errorMessage = "";
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "The user is not registered. Please check the email address.";
        break;
      case "auth/wrong-password":
        errorMessage = "The password is incorrect. Please try again.";
        break;
      case "auth/invalid-email":
        errorMessage = "The email format is invalid.";
        break;
      default:
        errorMessage = "An issue occurred during login. Please try again.";
    }
    throw new Error(errorMessage);
  }
};
