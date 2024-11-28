
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "./firebaseConfig";

// // 로그인 처리
// export const handleLogin = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     console.log("User logged in:", userCredential.user);
//     return userCredential.user;
//   } catch (error) {
//     console.error("Error logging in:", error.message);
//     throw new Error(error.message); // 오류 메시지를 전달
//   }
// };

// // 회원가입 처리
// export const handleSignUp = async (email, password) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     console.log("User signed up:", userCredential.user);
//     return userCredential.user;
//   } catch (error) {
//     console.error("Error signing up:", error.message);
//     throw new Error(error.message); // 오류 메시지를 전달
//   }
// }; 
