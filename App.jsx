
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from './app/index'
import Home from './app/screens/Home';
import Events from './app/screens/Events';
import Footer from './app/layouts/Footer';

const Stack = createNativeStackNavigator(); 
export default function Capstone({navigation}) {


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions= {
        {
          headerStyle:{
            backgroundColor:'#3F6D89',
 
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      }>
        <Stack.Screen name="Index" component={Index} />
        
      </Stack.Navigator>
      <Footer/>
    </NavigationContainer>
  );
}