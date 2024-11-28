import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useRoute to get the current route
import Icon from 'react-native-vector-icons/AntDesign'; // Using AntDesign icons
import More from 'react-native-vector-icons/Feather'; // Using Feather icons

export default function Footer() {
  const navigation = useNavigation();  // Access the navigation object using the hook
  const route = useRoute();  // Access the current route
  
  // Function to handle page navigation
  const onPress = (pageName) => {
    navigation.navigate(pageName);  // Navigate to the specified page
  };

  // Function to determine the active button's color
  const getButtonColor = (pageName) => {
    return route.name === pageName ? '#000000' : '#fff';  // Highlight active page
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
      <TouchableOpacity onPress={() => onPress("Shifts")} style = {styles.navButton}>
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
