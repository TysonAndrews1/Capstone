import React, { useState } from 'react';
import {ScrollView, Text, Pressable,TouchableOpacity,StyleSheet,View} from 'react-native'
import MainLayout from '../layouts/MainLayout';
import MiniAnnouncment from '../components/MiniAnnouncemnt'
import MiniSchedule from '../components/MiniSchedule'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
export default function Home (){

  const router = useRouter(); // Initialize the router
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
  const toEvent = () =>{
    router.push(`/screens/Events`); // Navigate to screens using path

  }
return (
    <MainLayout>
    <ScrollView style = {styles.container}>
    <View>
          <Text>Here</Text>
          <Text>There</Text>
          
        </View>
      <MiniAnnouncment/>
      <View>
        <Pressable onPress={toEvent}><Text>To Event Create</Text></Pressable>
        <Pressable></Pressable>
        <Pressable></Pressable>
        <Pressable></Pressable>

      </View>
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