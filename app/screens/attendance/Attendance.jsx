import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import MainLayout from '../../layouts/MainLayout';

const Attendance = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState('You are currently not clocked in.');
  const [instruction, setInstruction] = useState('');
  const [awaitingTap, setAwaitingTap] = useState(false);

  // Initialize NFC Manager on component mount
  useEffect(() => {
    // Initialize NFC Manager
    NfcManager.start()
      .then(() => console.log('NFC Manager started'))
      .catch((error) => console.warn('NFC Manager start error:', error));

    return () => {
      // Stop NFC Manager when component unmounts
      NfcManager.stop()
        .then(() => console.log('NFC Manager stopped'))
        .catch((error) => console.warn('NFC Manager stop error:', error));
    };
  }, []);

  const handleStartShift = async () => {
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

  const handleEndShift = async () => {
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
      <View style={styles.header}>
        <Text style={styles.digitalClock}>{currentTime.toLocaleTimeString()}</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.statusText}>{status}</Text>

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

export default Attendance;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#3F6D89',
    paddingVertical: 20,
    alignItems: 'center',
  },

  digitalClock: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },

  statusText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
