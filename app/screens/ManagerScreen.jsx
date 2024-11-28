import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { useRouter } from "expo-router";
import Firestore from '../firebase/firestore';

const ManagerScreen = () => {

  const router = useRouter();

  return (
    <MainLayout>
      <View style={styles.container}>
        <Firestore />
        <Pressable style={styles.button}
         onPress={() => router.push('/screens/Events')}>
          <Text style={styles.text}>ADD Event</Text>
        </Pressable>  
      </View>
    </MainLayout>
  );
};

export default ManagerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#3f6d89',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});