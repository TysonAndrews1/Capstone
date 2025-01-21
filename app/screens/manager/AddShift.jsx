import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MainLayout from '../../layouts/MainLayout';
import { useGlobalSearchParams } from 'expo-router';
import { format } from 'date-fns';

const AddShift = () => {
  const params = useGlobalSearchParams();
  const selectedDate = params?.date;
  const monthAndDay = selectedDate.slice(5,10);
  return (
    <MainLayout>
      <Text style={styles.monthAndDayText}>{monthAndDay} </Text>
    </MainLayout>
  );
};

export default AddShift;

const styles = StyleSheet.create({
  monthAndDayText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  }

})
