import React, { useState } from 'react';
import {ScrollView, Text, Pressable,TouchableOpacity,StyleSheet,View} from 'react-native'
import MainLayout from './layouts/MainLayout';
import MiniAnnouncment from './components/MiniAnnouncemnt'
import MiniSchedule from './components/MiniSchedule'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Home ({navigation}){
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  const showDatepicker = () => {
    setShow(true);
  };
return (
    <MainLayout>
    <ScrollView style = {styles.container}>
    <View>
          <Text>Here</Text>
          <Text>There</Text>

          {/* Button to show date picker */}
          <TouchableOpacity onPress={showDatepicker} style={styles.button}>
            <Text style={styles.buttonText}>Select Date</Text>
          </TouchableOpacity>

          {/* DateTimePicker only shows when `show` is true */}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display="default"  // Use 'default' for standard display
              onChange={onChange}
            />
          )}
        </View>
      <MiniAnnouncment/>
      <View>
        <Pressable></Pressable>
        <Pressable></Pressable>
        <Pressable></Pressable>
        <Pressable></Pressable>

      </View>
      <MiniSchedule/>
    </ScrollView>
    </MainLayout>
);


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:'column'

    },
  });