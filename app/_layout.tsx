import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={
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
            <Stack.Screen name="index" options={{ title: 'index' }} />
            <Stack.Screen name="Home" options={{ title: 'Home' }} />
            <Stack.Screen name="Events" options={{ title: 'Events' }} />
            <Stack.Screen name="calenderTest" options={{ title: 'Testing' }} />
    </Stack>
  );
}
