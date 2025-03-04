// References:
// For installation and configuring Android - https://medium.com/@diliplohar204/nfc-integration-made-easy-exploring-react-native-nfc-manager-for-seamless-mobile-communication-65bf56f31398
// ChatGPT NFC Attendance System - Prompt: How can I integrate NFC reading functionality in a React Native app using react-native-nfc-manager to create an employee clock-in/clock-out system using Javascript and React Native? I am also using Expo to run the application.
// ChatGPT NFC unmounting - Prompt: How do I properly unmount the NFC Manager to stop running in the background?
// Digital clock: https://www.geeksforgeeks.org/how-to-design-digital-clock-using-javascript/

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURLConfig from '../../config/BaseURLConfig';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from 'expo-router';

const ClockInClockOut = () => {
  const [status, setStatus] = useState('You are currently CLOCKED OUT.');
  const [instruction, setInstruction] = useState('');
  const [awaitingTap, setAwaitingTap] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [currentTime, setCurrentTime] = useState('');
  const BASE_URL = BaseURLConfig();
  const router = useRouter();

  useEffect(() => {
    const updateClock = () => {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12 || 12; // Convert 0 to 12 (midnight case)
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
    };

    const interval = setInterval(updateClock, 1000); // Update the clock every second
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchAccountId = async () => { // Fetch the stored Account ID from AsyncStorage to use for clock-in/clock-out
      try {
        const storedAccountId = await AsyncStorage.getItem('selectedAccountId');
        console.log("Stored Account ID:", storedAccountId);
  
        if (storedAccountId) {
          setAccountId(storedAccountId);
          checkClockInStatus(storedAccountId); // This ensures the correct status is displayed even after a reload or exiting the screen
        } else {
          console.error('No Account ID found in storage');
          Alert.alert('Error', 'No Account ID found.');
        }
      } catch (error) {
        console.error('Error retrieving Account ID:', error);
      }
    };
  
    fetchAccountId();
    NfcManager.start().catch((error) => console.warn('NFC Manager start error:', error)); // Initialize NFC Manager on component mount with error handling
  
    return () => {
      NfcManager.close().catch((error) => console.warn('NFC Manager close error:', error)); // Close NFC Manager on component unmount with error handling
    };
  }, []);


  const handleNfcScan = async () => {
    try {
        await NfcManager.requestTechnology(NfcTech.Ndef); // Request NFC technology for NDEF tags
        const tag = await NfcManager.getTag();
        console.log('Tag Discovered:', tag);

        if (tag && tag.id) { // If a valid NFC tag is found, return the tag ID
            return tag.id;
        }
        Alert.alert('Error', 'No valid NFC tag found.');
        return null;
    } catch (error) {
        console.warn('NFC reading error:', error);
        Alert.alert('Error', 'NFC scan failed.');
        return null;
    } finally {
        NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
  };

  const handleStartShift = async () => { // This function will be called when the user taps the 'Start Shift' button
    if (!accountId) {
        Alert.alert('Error', 'No Account ID found.');
        return;
    }

    setInstruction('Please tap your phone on the NFC reader to start your shift.');
    setAwaitingTap(true); // Set the state to indicate that the app is waiting for an NFC tap

    const scannedNfc = await handleNfcScan(); // This function will handle the NFC scan and return the scanned NFC tag ID
    if (!scannedNfc) {
        setAwaitingTap(false); // If no NFC tag is scanned, reset the state
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/attendance/clockin`, { // Send a POST request to the server to record the clock-in
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_id: accountId }),
        });

        const data = await response.json();
        console.log("Clock-In Response:", data);

        if (response.ok) { // If the response is successful, update the clock-in time and status
            setClockInTime(data.clock_in_time);
            setStatus('You are currently CLOCKED IN.');
            Alert.alert('Success', 'Clock-in recorded successfully.');
        } else {
            Alert.alert('Error', data.message || 'Failed to clock in.');
        }
    } catch (error) {
        console.warn('Clock-in error:', error);
        Alert.alert('Error', 'Could not record clock-in.');
    } finally {
        setInstruction('');
        setAwaitingTap(false); // Reset the NFC tap state
    }
  };

  const handleEndShift = async () => { // This function will be called when the user taps the 'End Shift' button
    if (!accountId) {
        Alert.alert('Error', 'No Account ID found.');
        return;
    }

    setInstruction('Please tap your phone on the NFC reader to end your shift.');
    setAwaitingTap(true);

    const scannedNfc = await handleNfcScan(); // This function will handle the NFC scan and return the scanned NFC tag ID
    if (!scannedNfc) {
        setAwaitingTap(false); // If no NFC tag is scanned, reset the state
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/attendance/clockout`, { // Send a PUT request to the server to record the clock-out
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_id: accountId }),
        });

        const data = await response.json();
        console.log("Clock-Out Response:", data);

        if (response.ok) {
            setClockOutTime(data.clock_out_time);
            setStatus('You are currently CLOCKED OUT.');
            Alert.alert('Success', 'Clock-out recorded successfully.');
        } else {
            Alert.alert('Error', data.message || 'Failed to clock out.');
        }
    } catch (error) {
        console.warn('Clock-out error:', error);
        Alert.alert('Error', 'Could not record clock-out.');
    } finally {
        setInstruction('');
        setAwaitingTap(false);
    }
  };

  const checkClockInStatus = async (accountId) => { // This function will check the clock-in status of the user
    try {
        const response = await fetch(`${BASE_URL}/attendance/status?account_id=${accountId}`); // Send a GET request to the server to check the clock-in status
        const data = await response.json();
        console.log("Clock-In Status:", data);

        if (response.ok && data.status === "CLOCKED_IN") {
            setStatus('You are currently CLOCKED IN.'); // If the user is clocked in, update the status and clock-in time
            setClockInTime(data.clock_in_time);
        } else {
            setStatus('You are currently CLOCKED OUT.'); // If the user is clocked out, update the status and clock-out time
            setClockOutTime(data.clock_out_time);
        }
    } catch (error) {
        console.warn('Error fetching clock-in status:', error);
    }
  };

  return (
    <MainLayout>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}</Text>
            <Text style={styles.digitalClock}>{currentTime}</Text>
          </View>

          <Text style={[styles.statusText, status.includes('CLOCKED IN') ? styles.clockedIn : styles.clockedOut]}>
              {status}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleStartShift}>
                <Text style={styles.buttonText}>Start Shift</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleEndShift}>
                <Text style={styles.buttonText}>End Shift</Text>
            </TouchableOpacity>
          </View>

          {instruction !== '' && (
            <View style={styles.instructionContainer}>
                <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.logsButton} onPress={() => router.push('screens/NFCFeature/AttendanceLog')}>
              <Text style={styles.logsButtonText}>View Attendance Logs</Text>
          </TouchableOpacity>

        </View>
    </MainLayout>
  );
};

export default ClockInClockOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#EEF2F3',
  },

  headerContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#3f6d89',
    alignItems: 'center',
    borderRadius: 20,
  },

  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  digitalClock: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    marginBottom: 20,
  },

  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },

  clockedIn: { 
    color: '#28A745',
  },

  clockedOut: { 
    color: '#DC3545',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 30,
  },

  button: {
    backgroundColor: '#3f6d89',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  instructionContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FFF8E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  instructionText: {
    fontSize: 16,
    color: '#FF9800',
    textAlign: 'center',
    fontWeight: '600',
  },

  logsButton: {
    backgroundColor: '#6f9460',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    position: 'absolute',
    bottom: 200,
},

  logsButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
