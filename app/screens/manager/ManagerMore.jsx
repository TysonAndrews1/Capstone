import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useRouter } from "expo-router";


const ManagerMore = () => {

  // Hook for navigating to other screens
  const router = useRouter();

  return (
    <MainLayout>

      {/* Main Button Section */}
      <View style={styles.container}>

        {/* Button to manage employee schedules */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Manage Employee Schedule</Text>
        </TouchableOpacity>   

        {/* Button to view employee requests */}     
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/screens/manager/RequestList')}>
          <Text style={styles.text}>View Employee Request</Text>
        </TouchableOpacity>

        {/* Button to navigate to event management screen */}
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/screens/manager/ManageEvents')}>
          <Text style={styles.text}>Manage Events</Text>
        </TouchableOpacity>

        {/* Button to manage employee accounts */}
        <TouchableOpacity style={styles.button} onPress={()=> router.push('/screens/manager/EmployeeAccounts')}>
          <Text style={styles.text}>Manage Employee Accounts</Text>
        </TouchableOpacity>

        {/* Button to view employee reports */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Employee Report</Text>
        </TouchableOpacity>

        {/* Button to send schedule notifications */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Push Schedule Notification</Text>
        </TouchableOpacity>
      </View>
    </MainLayout>
  );
};

export default ManagerMore;

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
    backgroundColor: '#E6F2FA',
    width: '90%',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#000',
  },
  searchContainer: {
    marginTop: 15, 
    alignItems: 'center', 
  },
  searchBox: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E0E0E0', 
    borderRadius: 25, 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    width: '90%', 
  },
  searchText: {
    flex: 1, 
    fontSize: 16, 
    color: '#757575', 
  },
});
