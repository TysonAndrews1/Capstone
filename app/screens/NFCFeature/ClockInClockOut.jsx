// References:
// For installation and configuring Android - https://medium.com/@diliplohar204/nfc-integration-made-easy-exploring-react-native-nfc-manager-for-seamless-mobile-communication-65bf56f31398
// ChatGPT NFC Attendance System - Prompt: How can I integrate NFC reading functionality in a React Native app using react-native-nfc-manager to create an employee clock-in/clock-out system using Javascript and React Native? I am also using Expo to run the application.
// ChatGPT NFC unmounting - Prompt: How do I properly unmount the NFC Manager to stop running in the background?

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import MainLayout from '../../layouts/MainLayout';

const ClockInClockOut = () => {
  const [status, setStatus] = useState('You are currently CLOCKED OUT.');
  const [instruction, setInstruction] = useState('');
  const [awaitingTap, setAwaitingTap] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);

  // Initialize NFC Manager on component mount
  useEffect(() => {
    NfcManager.start() // Initialize NFC Manager
      .then(() => console.log('NFC Manager started'))
      .catch((error) => console.warn('NFC Manager start error:', error));

    return () => {
      // Cleanup function to unmount NFCManager correctly
      NfcManager.close() // Close NFC Manager properly, will not work in the background
        .then(() => console.log('NFC Manager closed'))
        .catch((error) => console.warn('NFC Manager close error:', error));
    };
  }, []);

  const handleStartShift = async () => { // This function will be called when the user taps the 'Start Shift' button
    setInstruction('Please tap your phone on the attendance reader to start your shift.');
    setAwaitingTap(true);

    try {
      // Enable NFC reading
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag(); // Get NFC tag data
      console.log('Tag Discovered', tag);
      setStatus('You are currently CLOCKED IN');
    } catch (error) {
      console.warn('NFC reading error:', error);
    } finally {
      setInstruction('');
      setAwaitingTap(false);
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
  };

  const handleEndShift = async () => { // This function will be called when the user taps the 'End Shift' button
    setInstruction('Please tap your phone on the attendance reader to end your shift.');
    setAwaitingTap(true);

    try {
      // Enable NFC reading
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag(); // Get NFC tag data
      console.log('Tag Discovered', tag);
      setStatus('You are currently CLOCKED OUT');
    } catch (error) {
      console.warn('NFC reading error:', error);
    } finally {
      setInstruction('');
      setAwaitingTap(false);
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        <Text style={[styles.statusText, status.includes('CLOCKED IN') ? styles.clockedIn : styles.clockedOut]}>
          {status}
        </Text>

        {clockInTime && <Text style={styles.timeText}>Clock In Time: {clockInTime}</Text>}
        {clockOutTime && <Text style={styles.timeText}>Clock Out Time: {clockOutTime}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleStartShift}
            disabled={awaitingTap}
          >
            <Text style={styles.buttonText}>Start Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleEndShift}
            disabled={awaitingTap}
          >
            <Text style={styles.buttonText}>End Shift</Text>
          </TouchableOpacity>
        </View>

        {instruction !== '' && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>{instruction}</Text>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

export default ClockInClockOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },

  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
    width: '80%',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#3F6D89',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },

  instructionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  instructionText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
    textAlign: 'center',
  },
});
