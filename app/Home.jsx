import React, { useState } from 'react';
import {ScrollView, Text, Pressable,TouchableOpacity,StyleSheet,View} from 'react-native'
import MainLayout from './layouts/MainLayout';
import MiniAnnouncment from './components/MiniAnnouncemnt'
import MiniSchedule from './components/MiniSchedule'



export default function Home ({navigation}){

return (
    <MainLayout>
    <ScrollView style = {styles.container}>
      <View>
        <Text></Text>
        <Text></Text>
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