import { getAuth, onAuthStateChanged } from 'firebase/auth';


const BASE_URL =  'http://localhost:8080/api'

export const getShifts = async() =>{
    try {
        const response = await fetch(`${BASE_URL}/shifts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data
        
         // Update the state with the fetched events
      } catch (err) {
        console.error('Error fetching Shifts:', err);
      //   setError('Failed to fetch events. Please try again later.');
      }
}
export const getAccounts = async() =>{
    try {
        const response = await fetch(`${BASE_URL}/accounts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data
        
         // Update the state with the fetched events
      } catch (err) {
        console.error('Error fetching Accounts:', err);
      //   setError('Failed to fetch events. Please try again later.');
      }
}

export const getCurrentUser = async() =>{
  
  
  let email =  auth.currentUser.email
  console.log(email);
  
  try{
  const response = await fetch (`${BASE_URL}/accounts/user?email=${email}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data

   // Update the state with the fetched events
} catch (err) {
  console.error('Error fetching Account:', err);
//   setError('Failed to fetch events. Please try again later.');
}}

export const getEvents = async () =>{

    try {
      const response = await fetch(`${BASE_URL}/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data
      
       // Update the state with the fetched events
    } catch (err) {
      console.error('Error fetching events:', err);
    //   setError('Failed to fetch events. Please try again later.');
    }
}


/**
 * Reference: OpenAI, "ChatGPT," Personal Communication, Jan. 30, 2025.
 * Prompt: "Update the function to ensure firebase authentication is performed before fetching the user data." 
 * 
 */
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email;
        console.log(email);

        try {
          const response = await fetch(`${BASE_URL}/accounts/user?email=${email}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          resolve(data);
        } catch (err) {
          console.error('Error fetching Account:', err);
          reject(err);
        }
      } else {
        reject(new Error('No user is currently logged in'));
      }
    });
  });
};

export const getNotifications = async () =>{

  try{
    const response = await fetch(`${BASE_URL}/notifications`);
    if(!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data
      
       // Update the state with the fetched events
    } catch (err) {
      console.error('Error fetching Notifications:', err);
    //   setError('Failed to fetch events. Please try again later.');
    }
  }
