import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseURLConfig from '../../config/BaseURLConfig';
import MainLayout from '../../layouts/MainLayout';

const ClockInClockOut = () => {
  const [status, setStatus] = useState('You are currently CLOCKED OUT.');
  const [instruction, setInstruction] = useState('');
  const [awaitingTap, setAwaitingTap] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const BASE_URL = BaseURLConfig();

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem('selectedAccountId');
        console.log("Stored Account ID:", storedAccountId);
  
        if (storedAccountId) {
          setAccountId(storedAccountId);
        } else {
          console.error('No Account ID found in storage');
          Alert.alert('Error', 'No Account ID found.');
        }
      } catch (error) {
        console.error('Error retrieving Account ID:', error);
      }
    };
  
    fetchAccountId();
    NfcManager.start().catch((error) => console.warn('NFC Manager start error:', error));
  
    return () => {
      NfcManager.close().catch((error) => console.warn('NFC Manager close error:', error));
    };
  }, []);


  const handleNfcScan = async () => {
    try {
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();
        console.log('Tag Discovered:', tag);

        if (tag && tag.id) {
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

  const handleStartShift = async () => {
    if (!accountId) {
        Alert.alert('Error', 'No Account ID found.');
        return;
    }

    setInstruction('Please tap your phone on the NFC reader to start your shift.');
    setAwaitingTap(true);

    const scannedNfc = await handleNfcScan();
    if (!scannedNfc) {
        setAwaitingTap(false);
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/attendance/clockin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account_id: accountId }),
        });

        const data = await response.json();
        console.log("Clock-In Response:", data);

        if (response.ok) {
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
        setAwaitingTap(false);
    }
  };

  const handleEndShift = async () => {
    if (!accountId) {
        Alert.alert('Error', 'No Account ID found.');
        return;
    }

    setInstruction('Please tap your phone on the NFC reader to end your shift.');
    setAwaitingTap(true);

    const scannedNfc = await handleNfcScan();
    if (!scannedNfc) {
        setAwaitingTap(false);
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/attendance/clockout`, {
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

  return (
    <MainLayout>
      <View style={styles.container}>
        <Text style={[styles.statusText, status.includes('CLOCKED IN') ? styles.clockedIn : styles.clockedOut]}>
          {status}
        </Text>

        {clockInTime && <Text style={styles.timeText}>Clock In Time: {clockInTime}</Text>}
        {clockOutTime && <Text style={styles.timeText}>Clock Out Time: {clockOutTime}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleStartShift} disabled={awaitingTap}>
            <Text style={styles.buttonText}>Start Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleEndShift} disabled={awaitingTap}>
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
    color: '#28A745' },

  clockedOut: { 
    color: '#DC3545' },

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
