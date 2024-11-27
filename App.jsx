
import React, { useState } from 'react';
import Home from './screens/Home';
import Events from './screens/Events'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator(); 
export default function Capstone({navigation}) {


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={
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
        <Stack.Screen name="index" component={Index} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}