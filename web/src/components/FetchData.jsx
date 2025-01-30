import React from "react";


const BASE_URL =  'http://localhost:8080/api'

export const getShifts = async() =>{}
export const getAccounts = async() =>{}
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
