import React, { useEffect,useState } from 'react'
import { onAuthStateChanged,getAuth } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import {getCurrentUser} from '../components/FetchData'

//Source https://www.freecodecamp.org/news/how-to-add-post-notifications-to-your-react-applications/ 
const name = "bob"

const notificationData={
    senderDisplayName: name,
    senderUserEmail: "auth.currentUser.email",
    senderUserId :"auth.currentUser.uid",
    recipientsId:[],
    type: "announcement",
    notificationID: "ID",
    notficationData: "Data",
    timestamp: "moment().format()",
    isRead: false,
}

  const BASE_URL = "http://localhost:8080/api"

// let notificationCollection = collection(database, "notification");

export default function Notification(){
const [user, setUser] = useState("")


    async function getUser(){
        const  you = getAuth().currentUser
        return you;
    }
useEffect(()=>{
    getCurrentUser().then(user => setUser(user)) // Gets the resolved data)
},[])
    

useEffect(()=>{
    console.log(user);
    
    if (user) {
        console.log("signed in");
        
    }else{
        console.log("Signed out");
        
    }


},[user])


    
    return(<p></p>)


}

