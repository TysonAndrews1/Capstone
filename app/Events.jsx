import React, { useState,useEffect } from 'react';
import {ScrollView, Text, Pressable,StyleSheet, View, TextInput} from 'react-native'
import MainLayout from './layouts/MainLayout';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Events({ navigation, route }) {
  const [date, setDate] = useState(new Date());
return (
    <MainLayout>
      <View style = {styles.form}>
        <Text style = {styles.label}>Event Title</Text>
        <TextInput style = {styles.inputField}></TextInput>

        <Text style = {styles.label}>Start Time</Text>
        <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"  // Use 'default' for standard display
              is24Hour={True}
            />
        <Text style = {styles.label}>End Time</Text>
        <Text style = {styles.label}>Location</Text>
        <TextInput style = {styles.inputField}></TextInput>
        <Text style = {styles.label}>Event Manager</Text>
        <TextInput style = {styles.inputField}></TextInput>
        <Text style = {styles.label}>Special Requirements</Text>
        <TextInput style = {styles.inputField}></TextInput>
        
      </View> 
    </MainLayout>
  
)}

const styles = StyleSheet.create({
  form:{


  },
  label:{

  },
  inputField:{

  }
});