import React, { useState,useEffect } from 'react';
import {ScrollView, Text, Pressable,StyleSheet, View} from 'react-native'
import MainLayout from '../layouts/MainLayout';
import AntDesign from 'react-native-vector-icons/AntDesign'; // For back arrow icon

export default function Events({ navigation, route }) {
return (
    <MainLayout>
      {/* <ScrollView style={styles.container}>
      <View style ={styles.TitleContainer}>
        <Text style={[styles.title,styling]}>Transaction Details</Text>
        </View>
        <Text style={[styles.text]}>Title: {transaction.title}</Text>
        <Text style={styles.text}>Description: {transaction.desc}</Text>
        <Text style={styles.text}>Amount: {transaction.amount}</Text>
      </ScrollView> */}
    </MainLayout>
  
)}

const styles = StyleSheet.create({
    Leisure: {
        backgroundColor:"#FFCFB3"
},
Other: {
        backgroundColor:"#CAF4FF"
},
Essential:{
        backgroundColor:"#C9E9D2"
},
  
    container: {

    flex:1,
    borderWidth:3,
    borderColor:'white',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center',
    paddingVertical:20,
  },
  text: {
    fontSize: 18,
    margin:5,
    color:'#fff',
    textAlign:'center',
  },
  Hcontainer: {
    flexDirection:'row',
    justifyContent:'center'
  },
});