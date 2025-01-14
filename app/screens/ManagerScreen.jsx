import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useRouter } from "expo-router";
import Firestore from '../firebase/firestore';

const ManagerScreen = () => {

  const router = useRouter();

  return (
    <MainLayout>
      <View style={styles.container}>
        <Text>Manager Tools</Text>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Mae's Branch Indicator</Text>
        </Pressable> 
        <Pressable style={styles.button}>
          <Text style={styles.text}>Manage Employee Schedule</Text>
        </Pressable>        
        <Pressable style={styles.button}>
          <Text style={styles.text}>View Employee Request</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={()=> router.push('/screens/EventList')}>
          <Text style={styles.text}>Manage Events</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={()=> router.push('/screens/EmployeeAccounts')}>
          <Text style={styles.text}>Manage Employee Accounts</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Employee Report</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Push Schedule Notification</Text>
        </Pressable>
        <Firestore />

      </View>
    </MainLayout>
  );
};

export default ManagerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#3f6d89',
    width: '90%',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});