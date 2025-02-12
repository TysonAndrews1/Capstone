// app/components/Footer.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router's useRouter hook
import Icon from 'react-native-vector-icons/AntDesign';
import More from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigationState } from '@react-navigation/native';

export default function Footer() {
  const router = useRouter(); // Initialize the router

  // Function to navigate to the correct screen
  const onPress = (pageName) => {
    router.push(`/screens/manager/${pageName}`); // Navigate to screens using path
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
      <TouchableOpacity onPress={() => onPress("ManagerScreen")} style = {styles.navButton}>
        <Icon name="home" size={30} color={getButtonColor("ManagerScreen")} />
        <Text style={[styles.navText, { color: getButtonColor("ManagerScreen") }]}>Home</Text>
      </TouchableOpacity>

      {/* Chat Button */}
      <TouchableOpacity onPress={() => onPress("EventList")} style = {styles.navButton}>
        <MaterialIcon name="event" size={30} color={getButtonColor("EventList")} />
        <Text style={[styles.navText, { color: getButtonColor("EventsList") }]}>Events</Text>
      </TouchableOpacity>

      {/* Shifts Button */}
      <TouchableOpacity onPress={() => onPress("ManagerSchedule")} style = {styles.navButton}>
        <Icon name="calendar" size={30} color={getButtonColor("Schedule")} />
        <Text style={[styles.navText, { color: getButtonColor("Schedule") }]}>Schedule</Text>
      </TouchableOpacity>

      {/* More Button */}
      <TouchableOpacity onPress={() => onPress("ManagerMore")} style = {styles.navButton}>
        <More name="more-horizontal" size={30} color={getButtonColor("ManagerMore")} />
        <Text style={[styles.navText, { color: getButtonColor("ManagerMore") }]}>More</Text>
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
