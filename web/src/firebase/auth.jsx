
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Login
export const handleLogin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error.message);
    
    // Error Message Mapping
    let errorMessage =  "";
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

// Sign Up
export const handleSignUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw new Error(error.message); // Send an error message
}
};
