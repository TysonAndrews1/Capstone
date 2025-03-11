
import { Stack } from 'expo-router';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import React from 'react';


export default function RootLayout() {
  return (
      <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3F6D89',
          height: 80,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false}} /> {/* remove a header on the login screen */}
      <Stack.Screen name='screens/Login' options={{ headerShown: false}} /> {/* remove a header on the login screen */}
      <Stack.Screen name="screens/forgotPassword"  options={{ title: 'Forgot Password', headerShown: false }}/> {/* Navigate to screens/CalendarTest */}
      {/* Navigate to ManagerScreen and remove a back arrow and add two buttons*/}
      <Stack.Screen name="screens/manager/ManagerScreen"  options={{ title: '', headerBackVisible: false, 
      headerRight: () => (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => alert('Icon 1 pressed')}>
            {/* tintColor can change a image(png or svg) color */}
            <Image source={require('../assets/images/account.png')} style={ styles.icon } />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Icon 1 pressed')}>
           <Image source={require('../assets/images/notifications.png')} style={ styles.icon } />
          </TouchableOpacity>
        </View>
      ), headerStyle: { backgroundColor: '#3F6D89' },
      headerTitleAlign: 'center',
      }}/> 
      <Stack.Screen name="screens/employee/EmployeeScreen"  options={{ title: '', headerBackVisible: false, 
      headerRight: () => (
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => alert('Icon 1 pressed')}>
            {/* tintColor can change a image(png or svg) color */}
            <Image source={require('../assets/images/account.png')} style={ styles.icon } />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Icon 1 pressed')}>
           <Image source={require('../assets/images/notifications.png')} style={ styles.icon } />
          </TouchableOpacity>
        </View>
      ), headerStyle: { backgroundColor: '#3F6D89' },
      headerTitleAlign: 'center',
      }}/> 
      <Stack.Screen name="screens/manager/ManagerMore" options={{ title: 'Manager Tools'}} />
      <Stack.Screen name="screens/manager/ManagerSchedule" options={{ title: 'Manage Schedule'}} />

      <Stack.Screen name="screens/manager/ManageEvents" options={{ title: 'Manage Events' }} />
      <Stack.Screen name="screens/manager/CreateEvent" options={{ title: 'Create Event'}} />
      <Stack.Screen name="screens/manager/EventList" options={{ title: 'Event List'}} />
      <Stack.Screen name="screens/manager/EditEvent" options={{ title: 'Edit Event'}} />

      <Stack.Screen name="screens/manager/AddShift" options={{ title: 'Add Shift'}} />
      <Stack.Screen name="screens/manager/EmployeeAccounts" options={{ title: 'Manage Employee Accounts' }}/>
      <Stack.Screen name="screens/manager/EmpAccountDetails" options={{ title: 'Employee Details' }}/>
      <Stack.Screen name="screens/manager/EditEmpAccount" options={{ title: 'Edit Employee Details' }}/>
      <Stack.Screen name="screens/manager/CreateEmpAccount" options={{ title: 'Create Employee Account' }}/>
      <Stack.Screen name="screens/manager/RequestList" options={{ title: 'Employee Requests' }}/>

      <Stack.Screen name="screens/employee/EmployeeMore" options={{ title: 'More Options' }}/>

      <Stack.Screen name="screens/NFCFeature/ClockInClockOut" options={{ title: 'Clock In / Clock Out'}}/>
      <Stack.Screen name="screens/NFCFeature/AttendanceLog" options={{ title: 'Attendance Log'}}/>
      <Stack.Screen name="screens/chatFeature/Chat" options={{ title: 'Chat'}}/>

    </Stack>
  );
}

const styles = StyleSheet.create({

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 10,
    paddingBottom: 10,
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 15,
    tintColor: 'white',
  },
});