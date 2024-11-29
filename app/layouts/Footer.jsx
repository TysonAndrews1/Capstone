// app/components/Footer.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // expo-router's useRouter hook
import Icon from 'react-native-vector-icons/AntDesign';
import More from 'react-native-vector-icons/Feather'
import { useRoute } from '@react-navigation/native';

export default function Footer() {
  const router = useRouter(); // Initialize the router

  // Function to navigate to the correct screen
  const onPress = (pageName) => {
    router.push(`/screens/${pageName}`); // Navigate to screens using path
  };

  // Function to determine the active button's color
  const getButtonColor = (pageName) => {

    
    const route = useRoute();  // Access the current route
    // Compare the route name with pageName and highlight accordingly
    return route.name == `/screens${pageName}` ? '#000000' : '#fff'; 
  };
  return (
    <View style={styles.container}>
      
      {/* Home Button */}
      <TouchableOpacity onPress={() => onPress("Home")} style = {styles.navButton}>
        <Icon name="home" size={30} color={getButtonColor("Home")} />
        <Text style={[styles.navText, { color: getButtonColor("Home") }]}>Home</Text>
      </TouchableOpacity>

      {/* Chat Button */}
      <TouchableOpacity onPress={() => onPress("Events")} style = {styles.navButton}>
        <Icon name="message1" size={30} color={getButtonColor("Events")} />
        <Text style={[styles.navText, { color: getButtonColor("Events") }]}>Chat</Text>
      </TouchableOpacity>

      {/* Shifts Button */}
      <TouchableOpacity onPress={() => onPress("calenderTest")} style = {styles.navButton}>
        <Icon name="calendar" size={30} color={getButtonColor("Shifts")} />
        <Text style={[styles.navText, { color: getButtonColor("Shifts") }]}>Shifts</Text>
      </TouchableOpacity>

      {/* More Button */}
      <TouchableOpacity onPress={() => onPress("More")} style = {styles.navButton}>
        <More name="more-horizontal" size={30} color={getButtonColor("More")} />
        <Text style={[styles.navText, { color: getButtonColor("More") }]}>More</Text>
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
