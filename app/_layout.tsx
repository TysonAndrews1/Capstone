import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3F6D89',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name='index' options={{ headerShown: false}} /> {/* remove a header on the login screen */}
      <Stack.Screen name="screens/Home"  options={{ title: 'Home' }}/> {/* Navigate to screens/Home */}
      <Stack.Screen name="screens/EventList" options={{ title: 'Manage Events' }} /> {/* Navigate to screens/Events */}
      <Stack.Screen name="screens/calenderTest"  options={{ title: 'Test' }}/> {/* Navigate to screens/CalendarTest */}
      <Stack.Screen name="screens/EventEdit"  options={{ title: 'Edit Events' }}/> {/* Navigate to screens/CalendarTest */}
      <Stack.Screen name="screens/forgotPassword"  options={{ title: 'Forgot Password', headerShown: false }}/> {/* Navigate to screens/CalendarTest */}
      <Stack.Screen name="screens/ManagerScreen"  options={{ title: 'Manager Options' }}/> {/* Navigate to screens/CalendarTest */}
      <Stack.Screen name='screens/Login' options={{ headerShown: false}} /> {/* remove a header on the login screen */}
    </Stack>
  );
}
