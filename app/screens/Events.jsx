import React, { useState,useEffect } from 'react';
import {ScrollView, Text, Pressable,StyleSheet, View, TextInput} from 'react-native'
import MainLayout from '../layouts/MainLayout';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Events() {
  const [date, setDate] = useState(new Date());
  // const True = true;
return (
  <MainLayout>
    <View style={styles.form}>
      {/* Event Title */}
      <View style={styles.row}>
        <Text style={styles.label}>Event Title</Text>
        <TextInput style={styles.inputField} />
      </View>

      {/* Start Time */}
      <View style={styles.row}>
        <Text style={styles.label}>Start Time</Text>
        <TextInput style={styles.inputField} />
      </View>

      {/* End Time */}
      <View style={styles.row}>
        <Text style={styles.label}>End Time</Text>
        <TextInput style={styles.inputField} />
      </View>

      {/* Location */}
      <View style={styles.row}>
        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.inputField} />
      </View>

      {/* Event Manager */}
      <View style={styles.row}>
        <Text style={styles.label}>Event Manager</Text>
        <TextInput style={styles.inputField} />
      </View>

      {/* Special Requirements */}
      <View style={styles.row}>
        <Text style={styles.label}>Special Requirements</Text>
        <TextInput style={styles.inputField} />
      </View>
    </View>
  </MainLayout>
  
)}

const styles = StyleSheet.create({
  form: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1, // Adjusts label width
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputField: {
    flex: 2, // Adjusts input width
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
  }
});