import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import Footer from './Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MainLayout({ children }) {
  const [role, setRole] = useState(null); // State to store the user's role

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('userRole'); // Retrieve role from AsyncStorage
      setRole(storedRole); // Set the role to state
    };

    fetchRole();
  }, []);

  return (
    <View style={styles.container}> 

    {/** Customize the Status Bar globally to cover  */}
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {children}
      </ScrollView>
      {role && <Footer role={role} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor:"#fff"
  },

  scrollContainer: {
    padding: 5,
    flexGrow: 1
  },
});
