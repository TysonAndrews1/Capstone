import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar} from 'react-native';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <View style={styles.container}> 

    {/** Customize the Status Bar globally to cover  */}
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {children}
      </ScrollView>
      <Footer/> 
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
