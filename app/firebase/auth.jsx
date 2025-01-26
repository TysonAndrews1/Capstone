import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Function to handle user login
export const handleLogin = async (email, password) => {
  try {
    // Attempt to sign in the user using Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // If login is successful, return the user object from Firebase
    return userCredential.user;
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
