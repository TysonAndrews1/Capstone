import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { Text, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";

const Firestore = () => {
  // State to store user data fetched from Firestore
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Function to fetch user data from Firestore
    const fetchUserData = async (uid) => {
      try {
        const userRef = doc(db, "users", uid); // Reference to the user's document in Firestore
        const userSnapshot = await getDoc(userRef);

        // CHeck if the document exists in FIrestore
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data());
        } else {
          console.error("No user data found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid); 
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default Firestore;
