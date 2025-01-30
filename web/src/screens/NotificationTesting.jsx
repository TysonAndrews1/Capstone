import React, { useEffect,useState } from 'react'
import { onAuthStateChanged,getAuth } from 'firebase/auth'
import { auth } from '../firebase/firebase'
//Source https://www.freecodecamp.org/news/how-to-add-post-notifications-to-your-react-applications/ 
const name = "bob"

// const notificationData={
//     senderDisplayName: name,
//     senderUserEmail: auth.currentUser.email,
//     senderUserId :"auth.currentUser.uid",
//     recipientsId:[],
//     type: "announcement",
//     threadID: "threadID",
//     threadData: "threadData",
//     timestamp: "moment().format()",
//     isRead: false,

// }

//   const BASE_URL = "http://localhost:8080/api"
// const fetchUserRole = async (email) => {
                
//     try {
//         const response = await fetch(`${BASE_URL}/accounts/user?email=${email}`);

//         if (!response.ok) {
//             throw new Error(`Failed to fetch user role: ${response.status}`);
//         }

//         const data = await response.json();
//         return data.role;
//     } catch (error) {
//         console.error("Error fetching user role:", error.message);
//         throw error;
//     }
// };
// fetchUserRole(notificationData.senderUserEmail)
// // let notificationCollection = collection(database, "notification");

export default function Notification(){
// const [user, setUser] = useState("")


//     async function getUser(){
//         const  you = getAuth().currentUser
//         return you;
//     }
// useEffect(()=>{
//     setUser(getUser())
// },[])
    

// useEffect(()=>{
//     console.log(user);
    
//     if (user) {
//         console.log("signed in");
        
//     }else{
//         console.log("Signed out");
        
//     }


// },[user])


    
    return(<p></p>)


}

