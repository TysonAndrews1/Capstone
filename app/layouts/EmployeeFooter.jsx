// app/components/Footer.tsx -- Code taken mostly from Footer.jsx

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router's useRouter hook
import Icon from 'react-native-vector-icons/AntDesign';
import More from 'react-native-vector-icons/Feather'
import Chat from 'react-native-vector-icons/Entypo'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigationState } from '@react-navigation/native';

export default function EmployeeFooter() {
    const router = useRouter(); // Initialize the router
  
    // Function to navigate to the correct screen
    const onPress = (pageName) => {
      router.push(`/screens/employee/${pageName}`); // Navigate to screens using path
    };
  
   // Function to determine the active button's color
   const getButtonColor = (pageName) => {
    const route = useNavigationState((state) => state.routes[state.index]); // Get current route
    const currentPath = route.name; // Current route name
    return currentPath.includes(pageName) ? '#000000' : '#fff'; // Highlight button if it's the current page
  };
  
    return (
      <View style={styles.container}>
        
        {/* Home Button */}
        <TouchableOpacity onPress={() => onPress("EmployeeScreen")} style = {styles.navButton}>
          <Icon name="home" size={30} color={getButtonColor("EmployeeScreen")} />
          <Text style={[styles.navText, { color: getButtonColor("EmployeeScreen") }]}>Home</Text>
        </TouchableOpacity>
  
        {/* Chat Button */}
        <TouchableOpacity onPress={() => onPress("Chat")} style = {styles.navButton}>
          <MaterialIcon name="chat" size={30} color={getButtonColor("Chat")} />
          <Text style={[styles.navText, { color: getButtonColor("Chat") }]}>Chat</Text>
        </TouchableOpacity>
  
        {/* Shifts Button */}
        <TouchableOpacity onPress={() => onPress("EmployeeSchedule")} style = {styles.navButton}>
          <Icon name="calendar" size={30} color={getButtonColor("Schedule")} />
          <Text style={[styles.navText, { color: getButtonColor("Schedule") }]}>Schedule</Text>
        </TouchableOpacity>
  
        {/* More Button */}
        <TouchableOpacity onPress={() => onPress("EmployeeMore")} style = {styles.navButton}>
          <More name="more-horizontal" size={30} color={getButtonColor("EmployeeMore")} />
          <Text style={[styles.navText, { color: getButtonColor("EmployeeMore") }]}>More</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#3f6d89",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 5,
      paddingVertical: 5,
      flexDirection: "row",
      justifyContent: 'space-around',
      position: 'absolute',  // Ensure footer stays at the bottom
      borderTopLeftRadius:10,
      borderTopRightRadius:10,
    },
    navText: {
      color: "#fff", // Default color for text
      textAlign: 'center',
    },
    navButton:{
      paddingVertical:5,
      alignItems:'center'
    }
  });