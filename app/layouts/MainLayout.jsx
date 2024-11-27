import React from 'react';
import { View, StyleSheet, ScrollView,} from 'react-native';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <View style={styles.container}> 
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
