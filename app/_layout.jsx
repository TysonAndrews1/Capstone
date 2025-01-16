
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
      <Stack.Screen name="screens/manager/managerMore" options={{ title: 'Manager Tools'}} />
      <Stack.Screen name="screens/manager/ManagerSchedule" options={{ title: 'Manage Schedule'}} />
      <Stack.Screen name="screens/manager/ManageEvents" options={{ title: 'Manage Events' }} />
      <Stack.Screen name="screens/manager/EventEdit" options={{ title: 'Event Edit'}} />
      <Stack.Screen name="screens/manager/EventList" options={{ title: 'Event List'}} />
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